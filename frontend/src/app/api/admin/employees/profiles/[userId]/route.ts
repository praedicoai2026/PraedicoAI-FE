import type { NextRequest } from "next/server";
import { forwardAdminRequest } from "@/lib/server/admin-backend";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ userId: string }> },
) {
  const { userId } = await context.params;
  return forwardAdminRequest(
    request,
    `/employees/profiles/${encodeURIComponent(userId)}`,
    "PATCH",
  );
}
