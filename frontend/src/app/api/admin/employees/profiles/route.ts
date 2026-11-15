import type { NextRequest } from "next/server";
import { forwardAdminRequest } from "@/lib/server/admin-backend";

export function POST(request: NextRequest) {
  return forwardAdminRequest(request, "/employees/profiles", "POST");
}
