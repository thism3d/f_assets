import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { transactions } from "@db/schema";
import { eq, and, desc } from "drizzle-orm";
import * as cookie from "cookie";
import { verifyLocalToken } from "./local-auth-router";

async function getLocalUserFromCtx(ctx: { req: Request }) {
  const cookies = cookie.parse(ctx.req.headers.get("cookie") || "");
  const token = cookies["local_sid"];
  if (!token) return null;
  const claim = await verifyLocalToken(token);
  if (!claim) return null;
  return claim;
}

export const transactionsRouter = createRouter({
  list: publicQuery.query(async ({ ctx }) => {
    const user = await getLocalUserFromCtx(ctx);
    if (!user) return [];

    const db = getDb();
    return db
      .select()
      .from(transactions)
      .where(eq(transactions.userId, user.userId))
      .orderBy(desc(transactions.createdAt));
  }),

  listByStatus: publicQuery
    .input(z.object({ status: z.enum(["pending", "completed", "cancelled"]) }))
    .query(async ({ input, ctx }) => {
      const user = await getLocalUserFromCtx(ctx);
      if (!user) return [];

      const db = getDb();
      return db
        .select()
        .from(transactions)
        .where(
          and(
            eq(transactions.userId, user.userId),
            eq(transactions.status, input.status)
          )
        )
        .orderBy(desc(transactions.createdAt));
    }),

  create: publicQuery
    .input(
      z.object({
        ticketId: z.number(),
        type: z.enum(["send", "resale", "exchange", "receive"]),
        recipientEmail: z.string().email().optional(),
        recipientName: z.string().optional(),
        message: z.string().optional(),
        language: z.string().default("en"),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const user = await getLocalUserFromCtx(ctx);
      if (!user) throw new Error("Not authenticated");

      const db = getDb();
      const result = await db.insert(transactions).values({
        userId: user.userId,
        ticketId: input.ticketId,
        type: input.type,
        recipientEmail: input.recipientEmail || null,
        recipientName: input.recipientName || null,
        message: input.message || null,
        language: input.language,
        status: "pending",
      });
      return { success: true, id: Number(result[0].insertId) };
    }),

  updateStatus: publicQuery
    .input(
      z.object({
        id: z.number(),
        status: z.enum(["pending", "completed", "cancelled"]),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      await db
        .update(transactions)
        .set({
          status: input.status,
          completedAt: input.status === "completed" ? new Date() : null,
        })
        .where(eq(transactions.id, input.id));
      return { success: true };
    }),

  listAll: publicQuery.query(async () => {
    const db = getDb();
    return db
      .select()
      .from(transactions)
      .orderBy(desc(transactions.createdAt));
  }),
});
