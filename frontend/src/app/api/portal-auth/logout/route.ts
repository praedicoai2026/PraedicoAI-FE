import { NextResponse, type NextRequest } from "next/server";
import { isPortalKind, portalCookieName } from "@/lib/portal-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (
    typeof body !== "object" ||
    body === null ||
    !("portal" in body) ||
    !isPortalKind(body.portal)
  ) {
    return NextResponse.json({ error: "Invalid portal." }, { status: 400 });
  }

  let logoutFailed = false;
  if (body.portal === "admin") {
    const token = request.cookies.get(portalCookieName("admin"))?.value;
    const backendUrl = process.env.BACKEND_API_URL?.trim().replace(/\/+$/, "");
    if (token && !backendUrl) {
      logoutFailed = true;
      console.error(
        "Admin backend sign-out failed: BACKEND_API_URL is not configured.",
      );
    }
    if (token && backendUrl) {
      try {
        const backendResponse = await fetch(
          `${backendUrl}/api/v1/auth/logout`,
          {
            method: "POST",
            headers: {
              Cookie: `praedicoai_session=${encodeURIComponent(token)}`,
            },
            cache: "no-store",
            signal: AbortSignal.timeout(10_000),
          },
        );
        logoutFailed = !backendResponse.ok;
      } catch (error) {
        logoutFailed = true;
        console.error(
          "Admin backend sign-out failed:",
          error instanceof Error
            ? error.message
            : "Unknown authentication error",
        );
      }
    }
  }

  const response = NextResponse.json(
    {
      authenticated: false,
      ...(logoutFailed
        ? {
            warning:
              "This browser was signed out; the backend session could not be revoked.",
          }
        : {}),
    },
    { status: logoutFailed ? 502 : 200 },
  );
  response.cookies.set({
    name: portalCookieName(body.portal),
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}
