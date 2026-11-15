import { NextResponse, type NextRequest } from "next/server";
import {
  createPortalSession,
  demoPortalCredentials,
  isPortalKind,
  portalCookieName,
  portalSessionMaxAge,
  portalSessionSecret,
  secureValueEquals,
} from "@/lib/portal-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function sameOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  try {
    return Boolean(origin && new URL(origin).origin === request.nextUrl.origin);
  } catch {
    return false;
  }
}

async function loginAdmin(email: string, password: string) {
  const backendUrl = process.env.BACKEND_API_URL?.trim().replace(/\/+$/, "");
  if (!backendUrl) {
    return NextResponse.json(
      { error: "Admin sign-in is temporarily unavailable." },
      { status: 503 },
    );
  }

  const backendResponse = await fetch(`${backendUrl}/api/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    cache: "no-store",
    signal: AbortSignal.timeout(10_000),
  });
  if (!backendResponse.ok) {
    const limited = backendResponse.status === 429;
    return NextResponse.json(
      {
        error: limited
          ? "Too many sign-in attempts. Please wait and try again."
          : backendResponse.status >= 500
            ? "Admin sign-in is temporarily unavailable."
            : "The email or password is incorrect, or this account is not an administrator.",
      },
      {
        status: limited ? 429 : backendResponse.status >= 500 ? 503 : 401,
      },
    );
  }

  const result: unknown = await backendResponse.json();
  const user =
    isRecord(result) && isRecord(result.data) && isRecord(result.data.user)
      ? result.data.user
      : null;
  const backendCookie = backendResponse.headers
    .get("set-cookie")
    ?.match(/(?:^|[,;]\s*)praedicoai_session=([^;,\s]+)/)?.[1];
  const permissions = Array.isArray(user?.permissions)
    ? user.permissions.filter(
        (permission): permission is string =>
          typeof permission === "string",
      )
    : [];
  const hasAdminAccess =
    user?.role === "super_admin" ||
    permissions.some((permission) =>
      [
        "leads:read",
        "demos:read",
        "admins:manage",
        "employees:read",
        "employees:manage",
        "employees:self:read",
        "projects:read",
        "projects:manage",
        "projects:self:read",
        "reports:read",
        "content:read",
        "content:manage",
      ].includes(permission),
    );
  if (!hasAdminAccess) {
    if (backendCookie) {
      await fetch(`${backendUrl}/api/v1/auth/logout`, {
        method: "POST",
        headers: { Cookie: `praedicoai_session=${backendCookie}` },
        cache: "no-store",
        signal: AbortSignal.timeout(10_000),
      });
    }
    return NextResponse.json(
      {
        error:
          "The email or password is incorrect, or this account is not an administrator.",
      },
      { status: 401 },
    );
  }
  if (!backendCookie) {
    throw new Error("The auth service did not return a session cookie.");
  }

  const response = NextResponse.json({ authenticated: true, permissions });
  response.cookies.set({
    name: portalCookieName("admin"),
    value: backendCookie,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  });
  return response;
}

export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) {
    return NextResponse.json(
      { error: "This request is not allowed." },
      { status: 403 },
    );
  }

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

  if (body.portal === "admin") {
    try {
      return await loginAdmin(body.email.trim().toLowerCase(), body.password);
    } catch (error) {
      console.error(
        "Admin portal sign-in failed:",
        error instanceof Error ? error.message : "Unknown authentication error",
      );
      return NextResponse.json(
        { error: "Admin sign-in is temporarily unavailable." },
        { status: 503 },
      );
    }
  }

  const credentials = demoPortalCredentials();
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
    name: portalCookieName("demo"),
    value: createPortalSession("demo"),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: portalSessionMaxAge,
  });
  return response;
}
