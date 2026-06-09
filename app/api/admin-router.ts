import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { localUsers, tickets, activityLogs } from "@db/schema";
import { eq, desc } from "drizzle-orm";
import { env } from "./lib/env";
import { TRPCError } from "@trpc/server";

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + env.appSecret);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export const adminRouter = createRouter({
  // Users management
  listUsers: publicQuery.query(async () => {
    const db = getDb();
    return db
      .select()
      .from(localUsers)
      .orderBy(desc(localUsers.createdAt));
  }),

  getUser: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const result = await db
        .select()
        .from(localUsers)
        .where(eq(localUsers.id, input.id))
        .limit(1);
      return result[0] || null;
    }),

  createUser: publicQuery
    .input(
      z.object({
        email: z.string().min(3),
        password: z.string().min(6),
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        phone: z.string().optional(),
        country: z.string().optional(),
        role: z.enum(["user", "admin"]).default("user"),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const existing = await db
        .select()
        .from(localUsers)
        .where(eq(localUsers.email, input.email))
        .limit(1);

      if (existing.length > 0) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Email already registered",
        });
      }

      const hashedPassword = await hashPassword(input.password);
      const result = await db.insert(localUsers).values({
        email: input.email,
        password: hashedPassword,
        firstName: input.firstName || null,
        lastName: input.lastName || null,
        phone: input.phone || null,
        country: input.country || null,
        role: input.role,
      });

      return { success: true, id: Number(result[0].insertId) };
    }),

  updateUser: publicQuery
    .input(
      z.object({
        id: z.number(),
        data: z.object({
          email: z.string().min(3).optional(),
          firstName: z.string().optional(),
          lastName: z.string().optional(),
          phone: z.string().optional(),
          country: z.string().optional(),
          language: z.string().optional(),
          role: z.enum(["user", "admin"]).optional(),
        }),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      await db
        .update(localUsers)
        .set(input.data)
        .where(eq(localUsers.id, input.id));
      return { success: true };
    }),

  deleteUser: publicQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(localUsers).where(eq(localUsers.id, input.id));
      await db.delete(tickets).where(eq(tickets.userId, input.id));
      return { success: true };
    }),

  resetPassword: publicQuery
    .input(
      z.object({
        id: z.number(),
        newPassword: z.string().min(6),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const hashedPassword = await hashPassword(input.newPassword);
      await db
        .update(localUsers)
        .set({ password: hashedPassword })
        .where(eq(localUsers.id, input.id));
      return { success: true };
    }),

  // Tickets management
  listAllTickets: publicQuery.query(async () => {
    const db = getDb();
    return db
      .select()
      .from(tickets)
      .orderBy(desc(tickets.createdAt));
  }),

  getUserTickets: publicQuery
    .input(z.object({ userId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      return db
        .select()
        .from(tickets)
        .where(eq(tickets.userId, input.userId))
        .orderBy(desc(tickets.matchDate));
    }),

  adminCreateTicket: publicQuery
    .input(
      z.object({
        userId: z.number(),
        eventName: z.string(),
        venue: z.string(),
        matchDate: z.string(),
        matchTime: z.string(),
        entrance: z.string().optional(),
        hospitalityArea: z.string().optional(),
        gate: z.string().optional(),
        suite: z.string().optional(),
        row: z.string().optional(),
        seat: z.string().optional(),
        ticketCategory: z.string().optional(),
        priceCategory: z.string().optional(),
        stadiumSection: z.string().optional(),
        qrCode: z.string().optional(),
        ticketType: z.enum(["upcoming", "past"]).default("upcoming"),
        isDisabledAccess: z.number().default(0),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(tickets).values(input);
      return { success: true, id: Number(result[0].insertId) };
    }),

  adminDeleteTicket: publicQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(tickets).where(eq(tickets.id, input.id));
      return { success: true };
    }),

  // Dashboard stats
  getStats: publicQuery.query(async () => {
    const db = getDb();
    const allUsers = await db.select().from(localUsers);
    const allTickets = await db.select().from(tickets);
    const upcomingTickets = allTickets.filter((t) => t.ticketType === "upcoming");
    const pastTickets = allTickets.filter((t) => t.ticketType === "past");

    return {
      totalUsers: allUsers.length,
      totalTickets: allTickets.length,
      upcomingTickets: upcomingTickets.length,
      pastTickets: pastTickets.length,
    };
  }),

  // Logs
  listLogs: publicQuery.query(async () => {
    const db = getDb();
    return db
      .select()
      .from(activityLogs)
      .orderBy(desc(activityLogs.createdAt));
  }),

  createLog: publicQuery
    .input(
      z.object({
        userId: z.number().optional(),
        userEmail: z.string().optional(),
        action: z.string(),
        resource: z.string().optional(),
        details: z.string().optional(),
        ipAddress: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.insert(activityLogs).values(input);
      return { success: true };
    }),

  getUserLogs: publicQuery
    .input(z.object({ userId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      return db
        .select()
        .from(activityLogs)
        .where(eq(activityLogs.userId, input.userId))
        .orderBy(desc(activityLogs.createdAt));
    }),
});
