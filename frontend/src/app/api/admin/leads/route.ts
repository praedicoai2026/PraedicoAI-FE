import type { NextRequest } from "next/server";
import { forwardAdminRequest } from "@/lib/server/admin-backend";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.toString();
  return forwardAdminRequest(
    request,
    `/leads/admin${query ? `?${query}` : ""}`,
    "GET",
  );
}
