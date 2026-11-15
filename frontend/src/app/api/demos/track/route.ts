import { NextResponse, type NextRequest } from "next/server";
import { forwardDemoRequest, getDemoRateLimitKey } from "@/lib/server/demo-api";
import { getDemo } from "@/data/demos";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isSameOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  try {
    return Boolean(origin && new URL(origin).origin === request.nextUrl.origin);
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  if (!request.headers.get("content-type")?.startsWith("application/json")) {
    return NextResponse.json(
      { error: "This request must use JSON." },
      { status: 415 },
    );
  }
  if (!isSameOrigin(request)) {
    return NextResponse.json(
      { error: "This request could not be verified." },
      { status: 403 },
    );
  }
  let body: unknown;
  try {
    const rawBody = await request.text();
    if (new TextEncoder().encode(rawBody).byteLength > 1024) {
      return NextResponse.json(
        { error: "The tracking request is too large." },
        { status: 413 },
      );
    }
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (
    typeof body !== "object" ||
    body === null ||
    !("slug" in body) ||
    typeof body.slug !== "string"
  ) {
    return NextResponse.json({ error: "Invalid demo." }, { status: 400 });
  }
  const demo = getDemo(body.slug);
  const secret = process.env.AUTH_INTERNAL_SECRET?.trim();
  if (!demo || !secret) {
    return NextResponse.json(
      { error: "The demo view could not be recorded." },
      { status: 503 },
    );
  }
  try {
    const response = await forwardDemoRequest("/track", {
      method: "POST",
      secret,
      body: {
        slug: demo.slug,
        category: demo.category,
        eventType: "view",
        rateLimitKey: getDemoRateLimitKey(request, secret),
      },
    });
    return NextResponse.json(
      { recorded: response.ok },
      { status: response.ok ? 202 : response.status },
    );
  } catch (error) {
    console.error(
      "Demo view tracking failed:",
      error instanceof Error ? error.message : "Unknown backend error",
    );
    return NextResponse.json(
      { error: "The demo view could not be recorded." },
      { status: 503 },
    );
  }
}
