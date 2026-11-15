import type { NextRequest } from "next/server";
import { forwardAdminRequest } from "@/lib/server/admin-backend";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ projectId: string }> },
) {
  const { projectId } = await context.params;
  return forwardAdminRequest(
    request,
    `/projects/${encodeURIComponent(projectId)}`,
    "PATCH",
  );
}
