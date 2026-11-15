import { NextResponse, type NextRequest } from "next/server";
import {
  forwardDemoRequest,
  getDemoCountryCode,
  getDemoRateLimitKey,
  isGeminiFreeTierRestricted,
} from "@/lib/server/demo-api";

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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
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
  const countryCode = getDemoCountryCode(request);
  if (!countryCode) {
    return NextResponse.json(
      { error: "Demo access requires verified region information." },
      { status: 403 },
    );
  }
  if (isGeminiFreeTierRestricted(countryCode)) {
    return NextResponse.json(
      {
        error:
          "The free Gemini demo is not available in your region. Please request a custom demo.",
      },
      { status: 403 },
    );
  }

  const contentLength = request.headers.get("content-length");
  if (
    contentLength &&
    (!/^\d+$/.test(contentLength) || Number(contentLength) > 8192)
  ) {
    return NextResponse.json(
      { error: "The demo input is too large." },
      { status: 413 },
    );
  }

  let body: unknown;
  try {
    const rawBody = await request.text();
    if (new TextEncoder().encode(rawBody).byteLength > 8192) {
      return NextResponse.json(
        { error: "The demo input is too large." },
        { status: 413 },
      );
    }
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (
    !isRecord(body) ||
    typeof body.slug !== "string" ||
    typeof body.category !== "string" ||
    typeof body.input !== "string" ||
    body.ageConfirmed !== true ||
    body.dataPolicyAccepted !== true
  ) {
    return NextResponse.json(
      {
        error: "Confirm the age and data-use notices and check the demo input.",
      },
      { status: 400 },
    );
  }

  const secret = process.env.AUTH_INTERNAL_SECRET?.trim();
  if (!secret) {
    console.error(
      "Demo execution is unavailable: AUTH_INTERNAL_SECRET is missing.",
    );
    return NextResponse.json(
      { error: "Interactive demos are temporarily unavailable." },
      { status: 503 },
    );
  }
  try {
    const response = await forwardDemoRequest("/execute", {
      method: "POST",
      countryCode,
      secret,
      body: {
        slug: body.slug,
        category: body.category,
        input: body.input,
        ageConfirmed: true,
        dataPolicyAccepted: true,
        countryCode,
        rateLimitKey: getDemoRateLimitKey(request, secret),
      },
    });
    const result: unknown = await response.json();
    if (!response.ok) {
      const message =
        isRecord(result) &&
        isRecord(result.error) &&
        typeof result.error.message === "string"
          ? result.error.message
          : "The AI demo could not be completed.";
      return NextResponse.json({ error: message }, { status: response.status });
    }
    return NextResponse.json(result, { status: response.status });
  } catch (error) {
    console.error(
      "Demo execution request failed:",
      error instanceof Error ? error.message : "Unknown backend error",
    );
    return NextResponse.json(
      {
        error:
          "The AI demo is temporarily unavailable. Please try again later.",
      },
      { status: 503 },
    );
  }
}
