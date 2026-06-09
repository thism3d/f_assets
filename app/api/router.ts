import { authRouter } from "./auth-router";
import { localAuthRouter } from "./local-auth-router";
import { ticketsRouter } from "./tickets-router";
import { transactionsRouter } from "./transactions-router";
import { adminRouter } from "./admin-router";
import { createRouter, publicQuery } from "./middleware";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  localAuth: localAuthRouter,
  tickets: ticketsRouter,
  transactions: transactionsRouter,
  admin: adminRouter,
});

export type AppRouter = typeof appRouter;
