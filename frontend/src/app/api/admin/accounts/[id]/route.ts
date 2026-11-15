import type { NextRequest } from "next/server";
import { forwardAdminRequest } from "@/lib/server/admin-backend";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  if (!/^[a-f\d]{24}$/i.test(id)) {
    return Response.json(
      {
        error: {
          code: "ACCOUNT_NOT_FOUND",
          message: "This account was not found.",
        },
      },
      { status: 404 },
    );
  }
  return forwardAdminRequest(request, `/admin/accounts/${id}`, "PATCH");
}
