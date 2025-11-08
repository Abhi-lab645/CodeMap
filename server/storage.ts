import {
  type User,
  type InsertUser,
  type BigProject,
  type InsertBigProject,
  type MiniProject,
  type InsertMiniProject,
  type UserProgress,
  type InsertUserProgress,
  type Badge,
  type InsertBadge,
  type UserBadge,
  type InsertUserBadge,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Big Project methods
  getAllBigProjects(): Promise<BigProject[]>;
  getBigProject(id: string): Promise<BigProject | undefined>;
  createBigProject(project: InsertBigProject): Promise<BigProject>;

  // Mini Project methods
  getMiniProjectsByBigProjectId(bigProjectId: string): Promise<MiniProject[]>;
  getMiniProject(id: string): Promise<MiniProject | undefined>;
  createMiniProject(miniProject: InsertMiniProject): Promise<MiniProject>;

  // User Progress methods
  getUserProgress(userId: string, bigProjectId: string): Promise<UserProgress | undefined>;
  getAllUserProgress(userId: string): Promise<UserProgress[]>;
  createUserProgress(progress: InsertUserProgress): Promise<UserProgress>;
  updateUserProgress(id: string, updates: Partial<UserProgress>): Promise<UserProgress | undefined>;

  // Badge methods
  getAllBadges(): Promise<Badge[]>;
  getBadge(id: string): Promise<Badge | undefined>;
  createBadge(badge: InsertBadge): Promise<Badge>;

  // User Badge methods
  getUserBadges(userId: string): Promise<UserBadge[]>;
  createUserBadge(userBadge: InsertUserBadge): Promise<UserBadge>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private bigProjects: Map<string, BigProject>;
  private miniProjects: Map<string, MiniProject>;
  private userProgress: Map<string, UserProgress>;
  private badges: Map<string, Badge>;
  private userBadges: Map<string, UserBadge>;

  constructor() {
    this.users = new Map();
    this.bigProjects = new Map();
    this.miniProjects = new Map();
    this.userProgress = new Map();
    this.badges = new Map();
    this.userBadges = new Map();
    this.seedData();
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find((user) => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  // Big Project methods
  async getAllBigProjects(): Promise<BigProject[]> {
    return Array.from(this.bigProjects.values());
  }

  async getBigProject(id: string): Promise<BigProject | undefined> {
    return this.bigProjects.get(id);
  }

  async createBigProject(insertProject: InsertBigProject): Promise<BigProject> {
    const id = randomUUID();
    const project: BigProject = { ...insertProject, id };
    this.bigProjects.set(id, project);
    return project;
  }

  // Mini Project methods
  async getMiniProjectsByBigProjectId(bigProjectId: string): Promise<MiniProject[]> {
    return Array.from(this.miniProjects.values())
      .filter((mp) => mp.bigProjectId === bigProjectId)
      .sort((a, b) => a.miniId - b.miniId);
  }

  async getMiniProject(id: string): Promise<MiniProject | undefined> {
    return this.miniProjects.get(id);
  }

  async createMiniProject(insertMiniProject: InsertMiniProject): Promise<MiniProject> {
    const id = randomUUID();
    const miniProject: MiniProject = { ...insertMiniProject, id };
    this.miniProjects.set(id, miniProject);
    return miniProject;
  }

  // User Progress methods
  async getUserProgress(userId: string, bigProjectId: string): Promise<UserProgress | undefined> {
    return Array.from(this.userProgress.values()).find(
      (progress) => progress.userId === userId && progress.bigProjectId === bigProjectId
    );
  }

  async getAllUserProgress(userId: string): Promise<UserProgress[]> {
    return Array.from(this.userProgress.values()).filter(
      (progress) => progress.userId === userId
    );
  }

  async createUserProgress(insertProgress: InsertUserProgress): Promise<UserProgress> {
    const id = randomUUID();
    const progress: UserProgress = {
      ...insertProgress,
      id,
      startedAt: new Date(),
      lastActivityAt: new Date(),
    };
    this.userProgress.set(id, progress);
    return progress;
  }

  async updateUserProgress(id: string, updates: Partial<UserProgress>): Promise<UserProgress | undefined> {
    const progress = this.userProgress.get(id);
    if (!progress) return undefined;

    const updated: UserProgress = {
      ...progress,
      ...updates,
      lastActivityAt: new Date(),
    };
    this.userProgress.set(id, updated);
    return updated;
  }

  // Badge methods
  async getAllBadges(): Promise<Badge[]> {
    return Array.from(this.badges.values());
  }

  async getBadge(id: string): Promise<Badge | undefined> {
    return this.badges.get(id);
  }

  async createBadge(insertBadge: InsertBadge): Promise<Badge> {
    const id = randomUUID();
    const badge: Badge = { ...insertBadge, id };
    this.badges.set(id, badge);
    return badge;
  }

  // User Badge methods
  async getUserBadges(userId: string): Promise<UserBadge[]> {
    return Array.from(this.userBadges.values()).filter(
      (userBadge) => userBadge.userId === userId
    );
  }

  async createUserBadge(insertUserBadge: InsertUserBadge): Promise<UserBadge> {
    const id = randomUUID();
    const userBadge: UserBadge = {
      ...insertUserBadge,
      id,
      earnedAt: new Date(),
    };
    this.userBadges.set(id, userBadge);
    return userBadge;
  }

  // Seed initial data
  private seedData() {
    // Create sample big projects
    const pythonProject = this.createBigProjectSync({
      title: "E-Commerce Platform",
      description: "Build a complete e-commerce website with product listings, shopping cart, and payment integration",
      language: "Python",
      difficulty: "Intermediate",
      totalMiniProjects: 50,
      icon: "ShoppingCart",
    });

    const jsProject = this.createBigProjectSync({
      title: "Social Media Dashboard",
      description: "Create a social media analytics dashboard with real-time data visualization",
      language: "JavaScript",
      difficulty: "Advanced",
      totalMiniProjects: 75,
      icon: "LineChart",
    });

    const reactProject = this.createBigProjectSync({
      title: "Task Management App",
      description: "Develop a modern task management application with drag-and-drop, notifications, and team collaboration",
      language: "React",
      difficulty: "Beginner",
      totalMiniProjects: 40,
      icon: "CheckSquare",
    });

    // Create mini projects for Python e-commerce
    for (let i = 1; i <= 5; i++) {
      this.createMiniProjectSync({
        bigProjectId: pythonProject.id,
        miniId: i,
        title: `Mini Project ${i}: ${this.getMiniProjectTitle(i)}`,
        concepts: this.getMiniProjectConcepts(i),
        theory: this.getMiniProjectTheory(i),
        examples: this.getMiniProjectExamples(i, "python"),
        taskDescription: this.getMiniProjectTask(i),
        hint: this.getMiniProjectHint(i),
        codeTemplate: this.getCodeTemplate(i, "python"),
        expectedOutput: "Success! Task completed.",
        dependencies: i > 1 ? [`${i - 1}`] : [],
      });
    }

    // Create mini projects for JavaScript dashboard
    for (let i = 1; i <= 5; i++) {
      this.createMiniProjectSync({
        bigProjectId: jsProject.id,
        miniId: i,
        title: `Mini Project ${i}: ${this.getMiniProjectTitle(i)}`,
        concepts: this.getMiniProjectConcepts(i),
        theory: this.getMiniProjectTheory(i),
        examples: this.getMiniProjectExamples(i, "javascript"),
        taskDescription: this.getMiniProjectTask(i),
        hint: this.getMiniProjectHint(i),
        codeTemplate: this.getCodeTemplate(i, "javascript"),
        expectedOutput: "Console output: Success!",
        dependencies: i > 1 ? [`${i - 1}`] : [],
      });
    }

    // Create mini projects for React task app
    for (let i = 1; i <= 5; i++) {
      this.createMiniProjectSync({
        bigProjectId: reactProject.id,
        miniId: i,
        title: `Mini Project ${i}: ${this.getMiniProjectTitle(i)}`,
        concepts: this.getMiniProjectConcepts(i),
        theory: this.getMiniProjectTheory(i),
        examples: this.getMiniProjectExamples(i, "javascript"),
        taskDescription: this.getMiniProjectTask(i),
        hint: this.getMiniProjectHint(i),
        codeTemplate: this.getCodeTemplate(i, "javascript"),
        expectedOutput: "Component rendered successfully!",
        dependencies: i > 1 ? [`${i - 1}`] : [],
      });
    }

    // Create badges
    this.createBadgeSync({
      name: "First Steps",
      description: "Complete your first mini project",
      icon: "Star",
      requirement: 1,
    });

    this.createBadgeSync({
      name: "Quarter Master",
      description: "Complete 25% of any project",
      icon: "Award",
      requirement: 25,
    });

    this.createBadgeSync({
      name: "Halfway Hero",
      description: "Complete 50% of any project",
      icon: "Trophy",
      requirement: 50,
    });

    this.createBadgeSync({
      name: "Project Complete",
      description: "Complete 100% of a project",
      icon: "Zap",
      requirement: 100,
    });
  }

  private createBigProjectSync(project: InsertBigProject): BigProject {
    const id = randomUUID();
    const bigProject: BigProject = { ...project, id };
    this.bigProjects.set(id, bigProject);
    return bigProject;
  }

  private createMiniProjectSync(miniProject: InsertMiniProject): MiniProject {
    const id = randomUUID();
    const mini: MiniProject = { ...miniProject, id };
    this.miniProjects.set(id, mini);
    return mini;
  }

  private createBadgeSync(badge: InsertBadge): Badge {
    const id = randomUUID();
    const b: Badge = { ...badge, id };
    this.badges.set(id, b);
    return b;
  }

  private getMiniProjectTitle(id: number): string {
    const titles = [
      "Setup & Variables",
      "Data Structures",
      "Control Flow",
      "Functions & Modules",
      "Error Handling",
    ];
    return titles[id - 1] || `Challenge ${id}`;
  }

  private getMiniProjectConcepts(id: number): string[] {
    const concepts = [
      ["Variables", "Data Types", "Input/Output"],
      ["Lists", "Dictionaries", "Arrays"],
      ["If/Else", "Loops", "Conditionals"],
      ["Functions", "Parameters", "Return Values"],
      ["Try/Catch", "Exceptions", "Debugging"],
    ];
    return concepts[id - 1] || ["Programming Basics"];
  }

  private getMiniProjectTheory(id: number): string {
    return `In this mini project, you'll learn about ${this.getMiniProjectConcepts(id)[0]}.\n\nThis is a fundamental concept in programming that allows you to ${
      id === 1
        ? "store and manipulate data"
        : id === 2
        ? "organize data efficiently"
        : id === 3
        ? "control program flow"
        : id === 4
        ? "write reusable code"
        : "handle errors gracefully"
    }.\n\nUnderstanding this concept is crucial for building robust applications.`;
  }

  private getMiniProjectExamples(id: number, language: string): string[] {
    if (language === "python") {
      return [
        `# Example ${id}.1\nx = 10\ny = 20\nprint(x + y)`,
        `# Example ${id}.2\ndef greet(name):\n    return f"Hello, {name}!"\n\nprint(greet("World"))`,
        `# Example ${id}.3\nfor i in range(5):\n    print(f"Count: {i}")`,
      ];
    }
    return [
      `// Example ${id}.1\nconst x = 10;\nconst y = 20;\nconsole.log(x + y);`,
      `// Example ${id}.2\nfunction greet(name) {\n  return \`Hello, \${name}!\`;\n}\nconsole.log(greet("World"));`,
      `// Example ${id}.3\nfor (let i = 0; i < 5; i++) {\n  console.log(\`Count: \${i}\`);\n}`,
    ];
  }

  private getMiniProjectTask(id: number): string {
    return `Complete the following task:\n\n1. Implement the required functionality\n2. Test your code thoroughly\n3. Ensure it handles edge cases\n4. Follow best practices for code organization\n\nYour solution should demonstrate understanding of the concepts covered in the theory section.`;
  }

  private getMiniProjectHint(id: number): string {
    return `Hint: Start by breaking down the problem into smaller steps. Remember the examples you saw in the theory section - they contain patterns you can use here!`;
  }

  private getCodeTemplate(id: number, language: string): string {
    if (language === "python") {
      return `# Your code here\n# Complete the task described above\n\ndef main():\n    # TODO: Implement your solution\n    pass\n\nif __name__ == "__main__":\n    main()`;
    }
    return `// Your code here\n// Complete the task described above\n\nfunction main() {\n  // TODO: Implement your solution\n}\n\nmain();`;
  }
}

export const storage = new MemStorage();
