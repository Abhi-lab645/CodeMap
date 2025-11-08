import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { insertUserSchema, loginSchema, aiTutorMessageSchema } from "@shared/schema";
import type { Request, Response, NextFunction } from "express";

const JWT_SECRET = process.env.SESSION_SECRET || "codemap-secret-key-change-in-production";

// Middleware to verify JWT token
function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    const user = jwt.verify(token, JWT_SECRET) as { userId: string };
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
}

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: { userId: string };
    }
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // ==================== Authentication Routes ====================
  
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);

      const existingUser = await storage.getUserByEmail(validatedData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(validatedData.password, 10);
      const user = await storage.createUser({
        ...validatedData,
        password: hashedPassword,
      });

      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });

      const { password, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword, token });
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Signup failed" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const validatedData = loginSchema.parse(req.body);

      const user = await storage.getUserByEmail(validatedData.email);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const validPassword = await bcrypt.compare(validatedData.password, user.password);
      if (!validPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });

      const { password, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword, token });
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Login failed" });
    }
  });

  // ==================== Big Project Routes ====================

  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await storage.getAllBigProjects();
      res.json(projects);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to fetch projects" });
    }
  });

  app.get("/api/projects/:id", async (req, res) => {
    try {
      const project = await storage.getBigProject(req.params.id);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to fetch project" });
    }
  });

  // ==================== Mini Project Routes ====================

  app.get("/api/projects/:projectId/mini-projects", async (req, res) => {
    try {
      const miniProjects = await storage.getMiniProjectsByBigProjectId(req.params.projectId);
      res.json(miniProjects);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to fetch mini projects" });
    }
  });

  app.get("/api/mini-projects/:id", async (req, res) => {
    try {
      const miniProject = await storage.getMiniProject(req.params.id);
      if (!miniProject) {
        return res.status(404).json({ message: "Mini project not found" });
      }
      res.json(miniProject);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to fetch mini project" });
    }
  });

  // ==================== Progress Routes ====================

  app.get("/api/progress", authenticateToken, async (req, res) => {
    try {
      const userId = req.user!.userId;
      const progress = await storage.getAllUserProgress(userId);
      res.json(progress);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to fetch progress" });
    }
  });

  app.get("/api/progress/:projectId", authenticateToken, async (req, res) => {
    try {
      const userId = req.user!.userId;
      const projectId = req.params.projectId;
      const progress = await storage.getUserProgress(userId, projectId);
      
      if (!progress) {
        return res.status(404).json({ message: "Progress not found" });
      }
      
      res.json(progress);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to fetch progress" });
    }
  });

  app.post("/api/progress/start", authenticateToken, async (req, res) => {
    try {
      const userId = req.user!.userId;
      const { bigProjectId } = req.body;

      if (!bigProjectId) {
        return res.status(400).json({ message: "bigProjectId is required" });
      }

      const existingProgress = await storage.getUserProgress(userId, bigProjectId);
      if (existingProgress) {
        return res.json(existingProgress);
      }

      const progress = await storage.createUserProgress({
        userId,
        bigProjectId,
        completedMiniIds: [],
        currentMiniId: 1,
      });

      res.json(progress);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to start project" });
    }
  });

  app.post("/api/progress/complete", authenticateToken, async (req, res) => {
    try {
      const userId = req.user!.userId;
      const { bigProjectId, miniProjectId } = req.body;

      if (!bigProjectId || !miniProjectId) {
        return res.status(400).json({ message: "bigProjectId and miniProjectId are required" });
      }

      const progress = await storage.getUserProgress(userId, bigProjectId);
      if (!progress) {
        return res.status(404).json({ message: "Progress not found. Start the project first." });
      }

      const miniProject = await storage.getMiniProject(miniProjectId);
      if (!miniProject) {
        return res.status(404).json({ message: "Mini project not found" });
      }

      if (!progress.completedMiniIds.includes(miniProjectId)) {
        const updatedProgress = await storage.updateUserProgress(progress.id, {
          completedMiniIds: [...progress.completedMiniIds, miniProjectId],
          currentMiniId: miniProject.miniId + 1,
        });

        // Check for badge unlocks
        const completedCount = updatedProgress!.completedMiniIds.length;
        const project = await storage.getBigProject(bigProjectId);
        const totalMiniProjects = project?.totalMiniProjects || 1;
        const completionPercentage = (completedCount / totalMiniProjects) * 100;

        const allBadges = await storage.getAllBadges();
        const userBadges = await storage.getUserBadges(userId);
        const earnedBadgeIds = new Set(userBadges.map(ub => ub.badgeId));

        for (const badge of allBadges) {
          if (!earnedBadgeIds.has(badge.id) && completionPercentage >= badge.requirement) {
            await storage.createUserBadge({
              userId,
              badgeId: badge.id,
            });
          }
        }

        return res.json(updatedProgress);
      }

      res.json(progress);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to complete mini project" });
    }
  });

  // ==================== Badge Routes ====================

  app.get("/api/badges", async (req, res) => {
    try {
      const badges = await storage.getAllBadges();
      res.json(badges);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to fetch badges" });
    }
  });

  app.get("/api/user-badges", authenticateToken, async (req, res) => {
    try {
      const userId = req.user!.userId;
      const userBadges = await storage.getUserBadges(userId);
      res.json(userBadges);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to fetch user badges" });
    }
  });

  // ==================== AI Tutor Routes ====================

  app.post("/api/tutor", async (req, res) => {
    try {
      const validatedData = aiTutorMessageSchema.parse(req.body);
      
      const responses = [
        "Great question! Let me help you understand this concept better. Start by breaking down the problem into smaller steps.",
        "That's a common challenge! Try reviewing the examples in the theory section - they contain patterns you can apply here.",
        "Good thinking! Remember to consider edge cases and test your code thoroughly.",
        "Excellent progress! If you're stuck, try console.log (or print) to debug your values step by step.",
        "Keep going! This concept builds on what you learned in the previous mini projects.",
      ];

      const randomResponse = responses[Math.floor(Math.random() * responses.length)];

      res.json({ reply: randomResponse });
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Failed to get tutor response" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
