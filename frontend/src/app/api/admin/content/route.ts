import type { NextRequest } from "next/server";
import { forwardAdminRequest } from "@/lib/server/admin-backend";

export function GET(request: NextRequest) {
  return forwardAdminRequest(request, "/content/admin", "GET");
}

export function POST(request: NextRequest) {
  return forwardAdminRequest(request, "/content/admin", "POST");
}
