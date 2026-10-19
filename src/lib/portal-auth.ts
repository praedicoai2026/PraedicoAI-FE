import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

export type PortalKind = "admin" | "demo";

const sessionLifetimeSeconds = 60 * 60 * 8;

export function isPortalKind(value: unknown): value is PortalKind {
  return value === "admin" || value === "demo";
}

export function portalCookieName(portal: PortalKind) {
  return `praedicoai_${portal}_session`;
}

export function portalCredentials(portal: PortalKind) {
  return portal === "admin"
    ? {
        email: process.env.ADMIN_PORTAL_EMAIL,
        password: process.env.ADMIN_PORTAL_PASSWORD,
      }
    : {
        email: process.env.DEMO_PORTAL_EMAIL,
        password: process.env.DEMO_PORTAL_PASSWORD,
      };
}

export function portalSessionSecret() {
  return process.env.PORTAL_SESSION_SECRET;
}

export function secureValueEquals(value: string, expected: string) {
  const valueBuffer = Buffer.from(value);
  const expectedBuffer = Buffer.from(expected);
  return (
    valueBuffer.length === expectedBuffer.length &&
    timingSafeEqual(valueBuffer, expectedBuffer)
  );
}

export function createPortalSession(portal: PortalKind) {
  const secret = portalSessionSecret();
  if (!secret) throw new Error("PORTAL_SESSION_SECRET is not configured.");

  const payload = Buffer.from(
    JSON.stringify({
      portal,
      expiresAt: Math.floor(Date.now() / 1000) + sessionLifetimeSeconds,
    }),
  ).toString("base64url");
  const signature = createHmac("sha256", secret)
    .update(payload)
    .digest("base64url");

  return `${payload}.${signature}`;
}

export function verifyPortalSession(
  token: string | undefined,
  portal: PortalKind,
) {
  const secret = portalSessionSecret();
  if (!token || !secret) return false;

  const [payload, signature, extra] = token.split(".");
  if (!payload || !signature || extra) return false;

  const expectedSignature = createHmac("sha256", secret)
    .update(payload)
    .digest();
  const providedSignature = Buffer.from(signature, "base64url");
  if (
    providedSignature.length !== expectedSignature.length ||
    !timingSafeEqual(providedSignature, expectedSignature)
  ) {
    return false;
  }

  try {
    const data: unknown = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8"),
    );
    if (
      typeof data !== "object" ||
      data === null ||
      !("portal" in data) ||
      !("expiresAt" in data) ||
      data.portal !== portal ||
      typeof data.expiresAt !== "number"
    ) {
      return false;
    }
    return data.expiresAt > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

export const portalSessionMaxAge = sessionLifetimeSeconds;
