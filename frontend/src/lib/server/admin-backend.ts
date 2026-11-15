import "server-only";
import { NextResponse, type NextRequest } from "next/server";
import { portalCookieName } from "@/lib/portal-auth";

function getBackendApiUrl() {
  const value = process.env.BACKEND_API_URL?.trim();
  if (!value) throw new Error("BACKEND_API_URL is not configured.");
  return value.replace(/\/+$/, "");
}

export function isSameOriginRequest(request: NextRequest) {
  const origin = request.headers.get("origin");
  try {
    return Boolean(origin && new URL(origin).origin === request.nextUrl.origin);
  } catch {
    return false;
  }
}

export async function forwardAdminRequest(
  request: NextRequest,
  path: string,
  method: "GET" | "POST" | "PATCH",
) {
  const token = request.cookies.get(portalCookieName("admin"))?.value;
  if (!token) {
    return NextResponse.json(
      { error: { code: "UNAUTHENTICATED", message: "Sign in to continue." } },
      { status: 401 },
    );
  }

  if (method !== "GET" && !isSameOriginRequest(request)) {
    return NextResponse.json(
      { error: { code: "FORBIDDEN", message: "This request is not allowed." } },
      { status: 403 },
    );
  }

  try {
    const body = method === "GET" ? undefined : await request.text();
    const response = await fetch(`${getBackendApiUrl()}/api/v1${path}`, {
      method,
      headers: {
        Accept:
          method === "GET" && path.endsWith(".csv")
            ? "text/csv"
            : "application/json",
        Cookie: `praedicoai_session=${encodeURIComponent(token)}`,
        ...(method !== "GET" ? { "Content-Type": "application/json" } : {}),
      },
      body,
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
    });
    const headers = new Headers({
      "Cache-Control": "no-store",
    });
    for (const headerName of [
      "content-type",
      "content-disposition",
      "x-export-truncated",
    ]) {
      const value = response.headers.get(headerName);
      if (value) headers.set(headerName, value);
    }

    return new NextResponse(await response.arrayBuffer(), {
      status: response.status,
      headers,
    });
  } catch (error) {
    console.error(
      "Admin API proxy failed:",
      error instanceof Error ? error.message : "Unknown backend error",
    );
    return NextResponse.json(
      {
        error: {
          code: "ADMIN_API_UNAVAILABLE",
          message: "The admin service is temporarily unavailable.",
        },
      },
      { status: 503 },
    );
  }
}
