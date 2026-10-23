import { NextResponse, type NextRequest } from "next/server";
import {
  createPortalSession,
  isPortalKind,
  portalCookieName,
  portalCredentials,
  portalSessionMaxAge,
  portalSessionSecret,
  secureValueEquals,
} from "@/lib/portal-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (
    !isRecord(body) ||
    !isPortalKind(body.portal) ||
    typeof body.email !== "string" ||
    typeof body.password !== "string" ||
    body.email.length > 254 ||
    body.password.length > 1024
  ) {
    return NextResponse.json(
      { error: "Enter a valid email and password." },
      { status: 400 },
    );
  }

  const credentials = portalCredentials(body.portal);
  if (!credentials.email || !credentials.password || !portalSessionSecret()) {
    return NextResponse.json(
      { error: "Portal sign-in is not configured on this server." },
      { status: 503 },
    );
  }

  if (
    !secureValueEquals(
      body.email.trim().toLowerCase(),
      credentials.email.trim().toLowerCase(),
    ) ||
    !secureValueEquals(body.password, credentials.password)
  ) {
    return NextResponse.json(
      { error: "The email or password is incorrect." },
      { status: 401 },
    );
  }

  const response = NextResponse.json({ authenticated: true });
  response.cookies.set({
    name: portalCookieName(body.portal),
    value: createPortalSession(body.portal),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: portalSessionMaxAge,
  });
  return response;
}
