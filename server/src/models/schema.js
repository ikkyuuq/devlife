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
