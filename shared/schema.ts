import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull().default("student"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
}).extend({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Big Projects table
export const bigProjects = pgTable("big_projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  language: text("language").notNull(),
  difficulty: text("difficulty").notNull(),
  totalMiniProjects: integer("total_mini_projects").notNull(),
  icon: text("icon").notNull(),
});

export const insertBigProjectSchema = createInsertSchema(bigProjects).omit({
  id: true,
});

export type InsertBigProject = z.infer<typeof insertBigProjectSchema>;
export type BigProject = typeof bigProjects.$inferSelect;

// Mini Projects table
export const miniProjects = pgTable("mini_projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  bigProjectId: varchar("big_project_id").notNull(),
  miniId: integer("mini_id").notNull(),
  title: text("title").notNull(),
  concepts: text("concepts").array().notNull(),
  theory: text("theory").notNull(),
  examples: text("examples").array().notNull(),
  taskDescription: text("task_description").notNull(),
  hint: text("hint").notNull(),
  codeTemplate: text("code_template").notNull(),
  expectedOutput: text("expected_output"),
  dependencies: text("dependencies").array().notNull().default(sql`ARRAY[]::text[]`),
});

export const insertMiniProjectSchema = createInsertSchema(miniProjects).omit({
  id: true,
});

export type InsertMiniProject = z.infer<typeof insertMiniProjectSchema>;
export type MiniProject = typeof miniProjects.$inferSelect;

// User Progress table
export const userProgress = pgTable("user_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  bigProjectId: varchar("big_project_id").notNull(),
  completedMiniIds: text("completed_mini_ids").array().notNull().default(sql`ARRAY[]::text[]`),
  currentMiniId: integer("current_mini_id"),
  startedAt: timestamp("started_at").defaultNow(),
  lastActivityAt: timestamp("last_activity_at").defaultNow(),
});

export const insertUserProgressSchema = createInsertSchema(userProgress).omit({
  id: true,
  startedAt: true,
  lastActivityAt: true,
});

export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;
export type UserProgress = typeof userProgress.$inferSelect;

// Badges table
export const badges = pgTable("badges", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  requirement: integer("requirement").notNull(),
});

export const insertBadgeSchema = createInsertSchema(badges).omit({
  id: true,
});

export type InsertBadge = z.infer<typeof insertBadgeSchema>;
export type Badge = typeof badges.$inferSelect;

// User Badges table (join table)
export const userBadges = pgTable("user_badges", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  badgeId: varchar("badge_id").notNull(),
  earnedAt: timestamp("earned_at").defaultNow(),
});

export const insertUserBadgeSchema = createInsertSchema(userBadges).omit({
  id: true,
  earnedAt: true,
});

export type InsertUserBadge = z.infer<typeof insertUserBadgeSchema>;
export type UserBadge = typeof userBadges.$inferSelect;

// Login schema
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export type LoginData = z.infer<typeof loginSchema>;

// AI Tutor message schema
export const aiTutorMessageSchema = z.object({
  message: z.string().min(1),
  context: z.object({
    bigProjectId: z.string().optional(),
    miniProjectId: z.string().optional(),
  }).optional(),
});

export type AITutorMessage = z.infer<typeof aiTutorMessageSchema>;
