import type { NextRequest } from "next/server";
import { forwardAdminRequest } from "@/lib/server/admin-backend";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  return forwardAdminRequest(
    request,
    `/content/admin/${encodeURIComponent(id)}`,
    "PATCH",
  );
}
