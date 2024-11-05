import {
  pgTable,
  text,
  serial,
  timestamp,
  boolean,
  integer,
} from "drizzle-orm/pg-core";

export const userTable = pgTable("user", {
  id: text("id").unique().primaryKey(),
  email: text("email").unique(),
  verify: boolean("verify").notNull().default(false),
});

export const passwordTable = pgTable("password", {
  id: serial("id").primaryKey(),
  hashedPassword: text("hashed_password"),
  userId: text("user_id").references(userTable.id),
});

export const sessionTable = pgTable("session", {
  id: text("id").unique().primaryKey(),
  userId: text("user_id").references(userTable.id),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});

export const tokenTable = pgTable("token", {
  id: serial("id").primaryKey(),
  token: text("token").unique(),
  userId: text("user_id").references(userTable.id),
});

export const userProfileTable = pgTable("user_profile", {
  id: serial("id").primaryKey(),
  userId: text("user_id").references(userTable.id),
  displayName: text("display_name"),
  rank: integer("rank").notNull().default(0),
});

export const emailVerificationTable = pgTable("email_verification", {
  id: serial("id").primaryKey(),
  code: text("code").notNull(),
  userId: text("user_id")
    .notNull()
    .unique()
    .references(() => userTable.id),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});

export const taskTable = pgTable("task", {
  id: text("id").primaryKey(),
  title: text("title").notNull(), // title of the task
  objective: text("objective"), // objective of the task
  tags: text("tags").array().notNull(), // array of tags
  content: text("content").notNull(), // markdown content
  author: text("author").notNull(),
  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "date",
  })
    .notNull()
    .defaultNow(), // add creation timestamp
  updatedAt: timestamp("updated_at", {
    withTimezone: true,
    mode: "date",
  })
    .notNull()
    .defaultNow(), // last update timestamp
});

export const taskTestTable = pgTable("task_test", {
  id: serial("id").primaryKey(),
  taskId: text("task_id").references(taskTable.id),
  tests: text("tests").notNull(), // JSON string
});

export const taskSubmissionTable = pgTable("task_submission", {
  id: serial("id").primaryKey(),
  userId: text("user_id").references(userTable.id),
  taskId: text("task_id").references(taskTable.id),
  status: text("status").notNull(), // status of the submission
  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "date",
  })
    .notNull()
    .defaultNow(), // submission timestamp
  updatedAt: timestamp("updated_at", {
    withTimezone: true,
    mode: "date",
  })
    .notNull()
    .defaultNow(), // last update timestamp
});
