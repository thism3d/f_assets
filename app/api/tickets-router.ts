import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { tickets } from "@db/schema";
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

export const ticketsRouter = createRouter({
  list: publicQuery.query(async ({ ctx }) => {
    const user = await getLocalUserFromCtx(ctx);
    if (!user) return [];

    const db = getDb();
    return db
      .select()
      .from(tickets)
      .where(eq(tickets.userId, user.userId))
      .orderBy(desc(tickets.matchDate));
  }),

  listByUserId: publicQuery
    .input(z.object({ userId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      return db
        .select()
        .from(tickets)
        .where(eq(tickets.userId, input.userId))
        .orderBy(desc(tickets.matchDate));
    }),

  getById: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      const user = await getLocalUserFromCtx(ctx);
      if (!user) return null;

      const db = getDb();
      const result = await db
        .select()
        .from(tickets)
        .where(and(eq(tickets.id, input.id), eq(tickets.userId, user.userId)))
        .limit(1);

      return result[0] || null;
    }),

  create: publicQuery
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

  update: publicQuery
    .input(
      z.object({
        id: z.number(),
        data: z.object({
          eventName: z.string().optional(),
          venue: z.string().optional(),
          matchDate: z.string().optional(),
          matchTime: z.string().optional(),
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
          status: z.enum(["active", "used", "transferred", "resale_pending", "resold", "cancelled"]).optional(),
          ticketType: z.enum(["upcoming", "past"]).optional(),
        }),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      await db
        .update(tickets)
        .set(input.data)
        .where(eq(tickets.id, input.id));
      return { success: true };
    }),

  delete: publicQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(tickets).where(eq(tickets.id, input.id));
      return { success: true };
    }),
});
