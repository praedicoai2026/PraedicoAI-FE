import { NextResponse, type NextRequest } from "next/server";
import {
  isPortalKind,
  portalCookieName,
  verifyPortalSession,
} from "@/lib/portal-auth";
import {
  getAdminSession,
  hasAdminPortalAccess,
} from "@/lib/server/admin-session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const portal = request.nextUrl.searchParams.get("portal");
  if (!isPortalKind(portal)) {
    return NextResponse.json({ error: "Invalid portal." }, { status: 400 });
  }

  if (portal === "admin") {
    try {
      const token = request.cookies.get(portalCookieName(portal))?.value;
      const session = await getAdminSession(token);
      return NextResponse.json({
        authenticated: hasAdminPortalAccess(session),
        permissions: session?.permissions ?? [],
      });
    } catch {
      return NextResponse.json(
        { error: "The admin service is temporarily unavailable." },
        { status: 503 },
      );
    }
  }

  const authenticated = verifyPortalSession(
    request.cookies.get(portalCookieName(portal))?.value,
    portal,
  );
  return NextResponse.json({ authenticated });
}
