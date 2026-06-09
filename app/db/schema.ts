import {
  mysqlTable,
  mysqlEnum,
  serial,
  varchar,
  text,
  timestamp,
  int,
  bigint,
} from "drizzle-orm/mysql-core";

// OAuth users (admin login)
export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  unionId: varchar("unionId", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }),
  avatar: text("avatar"),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  lastSignInAt: timestamp("lastSignInAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Local users (email/password login for the app)
export const localUsers = mysqlTable("local_users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  firstName: varchar("first_name", { length: 255 }),
  lastName: varchar("last_name", { length: 255 }),
  phone: varchar("phone", { length: 50 }),
  country: varchar("country", { length: 100 }),
  language: varchar("language", { length: 10 }).default("en"),
  dateOfBirth: varchar("date_of_birth", { length: 20 }),
  gender: mysqlEnum("gender", ["male", "female", "other"]),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type LocalUser = typeof localUsers.$inferSelect;
export type InsertLocalUser = typeof localUsers.$inferInsert;

// Tickets
export const tickets = mysqlTable("tickets", {
  id: serial("id").primaryKey(),
  userId: bigint("user_id", { mode: "number", unsigned: true }).notNull(),
  eventName: varchar("event_name", { length: 255 }).notNull(),
  venue: varchar("venue", { length: 255 }).notNull(),
  matchDate: varchar("match_date", { length: 50 }).notNull(),
  matchTime: varchar("match_time", { length: 50 }).notNull(),
  entrance: varchar("entrance", { length: 50 }),
  hospitalityArea: varchar("hospitality_area", { length: 100 }),
  gate: varchar("gate", { length: 50 }),
  suite: varchar("suite", { length: 50 }),
  row: varchar("row", { length: 50 }),
  seat: varchar("seat", { length: 50 }),
  ticketCategory: varchar("ticket_category", { length: 100 }),
  priceCategory: varchar("price_category", { length: 100 }),
  stadiumSection: varchar("stadium_section", { length: 100 }),
  qrCode: text("qr_code"),
  status: mysqlEnum("status", ["active", "used", "transferred", "resale_pending", "resold", "cancelled"]).default("active").notNull(),
  ticketType: mysqlEnum("ticket_type", ["upcoming", "past"]).default("upcoming").notNull(),
  isDisabledAccess: int("is_disabled_access").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type Ticket = typeof tickets.$inferSelect;
export type InsertTicket = typeof tickets.$inferInsert;

// Transactions
export const transactions = mysqlTable("transactions", {
  id: serial("id").primaryKey(),
  userId: bigint("user_id", { mode: "number", unsigned: true }).notNull(),
  ticketId: bigint("ticket_id", { mode: "number", unsigned: true }),
  type: mysqlEnum("type", ["send", "resale", "exchange", "receive"]).notNull(),
  status: mysqlEnum("status", ["pending", "completed", "cancelled"]).default("pending").notNull(),
  recipientEmail: varchar("recipient_email", { length: 320 }),
  recipientName: varchar("recipient_name", { length: 255 }),
  message: text("message"),
  language: varchar("language", { length: 10 }).default("en"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = typeof transactions.$inferInsert;

// Activity Logs
export const activityLogs = mysqlTable("activity_logs", {
  id: serial("id").primaryKey(),
  userId: bigint("user_id", { mode: "number", unsigned: true }),
  userEmail: varchar("user_email", { length: 320 }),
  action: varchar("action", { length: 100 }).notNull(),
  resource: varchar("resource", { length: 100 }),
  details: text("details"),
  ipAddress: varchar("ip_address", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type ActivityLog = typeof activityLogs.$inferSelect;
export type InsertActivityLog = typeof activityLogs.$inferInsert;
