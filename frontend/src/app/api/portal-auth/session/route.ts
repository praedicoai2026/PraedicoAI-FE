import { NextResponse, type NextRequest } from "next/server";
import {
  isPortalKind,
  portalCookieName,
  verifyPortalSession,
} from "@/lib/portal-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET(request: NextRequest) {
  const portal = request.nextUrl.searchParams.get("portal");
  if (!isPortalKind(portal)) {
    return NextResponse.json({ error: "Invalid portal." }, { status: 400 });
  }

  const authenticated = verifyPortalSession(
    request.cookies.get(portalCookieName(portal))?.value,
    portal,
  );
  return NextResponse.json({ authenticated });
}
