import type { NextRequest } from "next/server";
import { forwardAdminRequest } from "@/lib/server/admin-backend";

export function GET(request: NextRequest) {
  return forwardAdminRequest(request, "/projects", "GET");
}

export function POST(request: NextRequest) {
  return forwardAdminRequest(request, "/projects", "POST");
}
