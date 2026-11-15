import type { NextRequest } from "next/server";
import { forwardAdminRequest } from "@/lib/server/admin-backend";

export function GET(request: NextRequest) {
  return forwardAdminRequest(request, "/employees/reports", "GET");
}
