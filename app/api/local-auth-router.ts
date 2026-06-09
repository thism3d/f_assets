import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { localUsers, type LocalUser } from "@db/schema";
import { eq } from "drizzle-orm";
import * as jose from "jose";
import { env } from "./lib/env";
import * as cookie from "cookie";
import { getSessionCookieOptions } from "./lib/cookies";
import { TRPCError } from "@trpc/server";
import { Session } from "@contracts/constants";

const JWT_ALG = "HS256";

function getLocalAuthSecret(): Uint8Array {
  if (!env.appSecret) {
    throw new Error("APP_SECRET is required for local authentication.");
  }
  return new TextEncoder().encode(env.appSecret);
}

async function signLocalToken(payload: { userId: number; email: string }): Promise<string> {
  const secret = getLocalAuthSecret();
  return new jose.SignJWT(payload as unknown as jose.JWTPayload)
    .setProtectedHeader({ alg: JWT_ALG })
    .setIssuedAt()
    .setExpirationTime("1 year")
    .sign(secret);
}

export async function verifyLocalToken(token: string): Promise<{ userId: number; email: string } | null> {
  if (!token) return null;
  try {
    const secret = getLocalAuthSecret();
    const { payload } = await jose.jwtVerify(token, secret, {
      algorithms: [JWT_ALG],
      clockTolerance: 60,
    });
    if (!payload.userId || !payload.email) return null;
    return { userId: payload.userId as number, email: payload.email as string };
  } catch {
    return null;
  }
}

// Simple hash function using Web Crypto API
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + env.appSecret);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export const localAuthRouter = createRouter({
  register: publicQuery
    .input(
      z.object({
        email: z.string().min(3),
        password: z.string().min(6),
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        phone: z.string().optional(),
        country: z.string().optional(),
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
      });

      return { success: true, userId: Number(result[0].insertId) };
    }),

  login: publicQuery
    .input(
      z.object({
        email: z.string().min(3),
        password: z.string().min(1),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = getDb();
      const users = await db
        .select()
        .from(localUsers)
        .where(eq(localUsers.email, input.email))
        .limit(1);

      if (users.length === 0) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid email or password",
        });
      }

      const user = users[0];
      const hashedPassword = await hashPassword(input.password);

      if (user.password !== hashedPassword) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid email or password",
        });
      }

      const token = await signLocalToken({ userId: user.id, email: user.email });

      const opts = getSessionCookieOptions(ctx.req.headers);
      ctx.resHeaders.append(
        "set-cookie",
        cookie.serialize(Session.cookieName, token, {
          httpOnly: opts.httpOnly,
          path: opts.path,
          sameSite: opts.sameSite?.toLowerCase() as "lax" | "none",
          secure: opts.secure,
          maxAge: 365 * 24 * 60 * 60,
        })
      );

      return {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email,
          role: user.role,
        },
      };
    }),

  me: publicQuery.query(async ({ ctx }) => {
    const cookies = cookie.parse(ctx.req.headers.get("cookie") || "");
    const token = cookies[Session.cookieName];
    if (!token) return null;

    const claim = await verifyLocalToken(token);
    if (!claim) return null;

    const db = getDb();
    const users = await db
      .select()
      .from(localUsers)
      .where(eq(localUsers.id, claim.userId))
      .limit(1);

    if (users.length === 0) return null;

    const user = users[0];
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email,
      phone: user.phone,
      country: user.country,
      language: user.language,
      role: user.role,
    };
  }),

  logout: publicQuery.mutation(async ({ ctx }) => {
    const opts = getSessionCookieOptions(ctx.req.headers);
    ctx.resHeaders.append(
      "set-cookie",
      cookie.serialize(Session.cookieName, "", {
        httpOnly: opts.httpOnly,
        path: opts.path,
        sameSite: opts.sameSite?.toLowerCase() as "lax" | "none",
        secure: opts.secure,
        maxAge: 0,
      })
    );
    return { success: true };
  }),
});

export async function authenticateLocalRequest(
  headers: Headers,
): Promise<(LocalUser & { name: string }) | null> {
  const cookies = cookie.parse(headers.get("cookie") || "");
  const token = cookies[Session.cookieName];
  if (!token) return null;

  const claim = await verifyLocalToken(token);
  if (!claim) return null;

  const db = getDb();
  const users = await db
    .select()
    .from(localUsers)
    .where(eq(localUsers.id, claim.userId))
    .limit(1);

  if (users.length === 0) return null;

  const user = users[0];
  return {
    ...user,
    name:
      `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email,
  };
}
