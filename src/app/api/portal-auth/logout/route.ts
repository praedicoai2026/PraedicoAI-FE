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

  const response = NextResponse.json({ authenticated: false });
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
