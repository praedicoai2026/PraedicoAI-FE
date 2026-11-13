import { createHash, randomBytes } from "node:crypto";
import type { Request, Response } from "express";
import { Session } from "./session.model.js";
import { User } from "./user.model.js";

export const sessionCookieName = "praedicoai_session";
const sessionLifetimeSeconds = 7 * 24 * 60 * 60;

export async function createSession(userId: string, response: Response) {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + sessionLifetimeSeconds * 1000);

  await Session.create({
    userId,
    tokenHash: hashToken(token),
    expiresAt,
  });

  response.cookie(sessionCookieName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: sessionLifetimeSeconds * 1000,
  });
}

export async function getSessionUser(request: Request) {
  const token = readCookie(request, sessionCookieName);
  if (!token) return null;

  const session = await Session.findOne({
    tokenHash: hashToken(token),
    expiresAt: { $gt: new Date() },
  }).lean();
  if (!session) return null;

  const user = await User.findById(session.userId)
    .select("fullName email accountType")
    .lean();
  if (!user) return null;

  return {
    id: user._id.toString(),
    fullName: user.fullName,
    email: user.email,
    accountType: user.accountType,
  };
}

export async function destroySession(request: Request, response: Response) {
  const token = readCookie(request, sessionCookieName);
  if (token) {
    await Session.deleteOne({ tokenHash: hashToken(token) });
  }
  response.clearCookie(sessionCookieName, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
}

export function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function readCookie(request: Request, name: string) {
  const cookieHeader = request.headers.cookie;
  if (!cookieHeader) return null;

  for (const cookie of cookieHeader.split(";")) {
    const separator = cookie.indexOf("=");
    if (separator < 0 || cookie.slice(0, separator).trim() !== name) continue;
    const value = cookie.slice(separator + 1).trim();
    try {
      return decodeURIComponent(value);
    } catch {
      return null;
    }
  }

  return null;
}
