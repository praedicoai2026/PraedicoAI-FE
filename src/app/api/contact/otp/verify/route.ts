import { NextResponse, type NextRequest } from "next/server";
import {
  getContactEmailOtpSettings,
  verifyContactEmailOtp,
} from "@/lib/server/contact-email-otp";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const rateLimitWindow = 15 * 60 * 1000;
const rateLimitMaximum = 20;
const requestsByClient = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(clientId: string, now: number) {
  for (const [key, entry] of requestsByClient) {
    if (entry.resetAt <= now) requestsByClient.delete(key);
  }
  const entry = requestsByClient.get(clientId);
  if (!entry || entry.resetAt <= now) {
    requestsByClient.set(clientId, {
      count: 1,
      resetAt: now + rateLimitWindow,
    });
    return false;
  }
  entry.count += 1;
  return entry.count > rateLimitMaximum;
}

export async function POST(request: NextRequest) {
  if (!request.headers.get("content-type")?.startsWith("application/json")) {
    return NextResponse.json(
      { error: "This request must use JSON. Please refresh and try again." },
      { status: 415 },
    );
  }

  const origin = request.headers.get("origin");
  let originMatches = false;
  try {
    originMatches = Boolean(
      origin && new URL(origin).origin === request.nextUrl.origin,
    );
  } catch {
    originMatches = false;
  }
  if (!originMatches) {
    return NextResponse.json(
      {
        error:
          "This request could not be verified. Please refresh and try again.",
      },
      { status: 403 },
    );
  }

  const contentLength = request.headers.get("content-length");
  if (
    contentLength &&
    (!/^\d+$/.test(contentLength) || Number(contentLength) > 2_048)
  ) {
    return NextResponse.json(
      { error: "The verification details are invalid. Please try again." },
      { status: 413 },
    );
  }

  const clientId =
    request.headers.get("x-real-ip")?.trim() ||
    request.headers.get("x-forwarded-for")?.split(",").at(-1)?.trim() ||
    "unknown";
  if (isRateLimited(clientId, Date.now())) {
    return NextResponse.json(
      { error: "Too many verification attempts. Please wait and try again." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        error: "The verification details could not be read. Please try again.",
      },
      { status: 400 },
    );
  }
  if (
    typeof body !== "object" ||
    body === null ||
    !("challengeId" in body) ||
    !("code" in body) ||
    typeof body.challengeId !== "string" ||
    !/^[a-f0-9]{64}$/.test(body.challengeId) ||
    typeof body.code !== "string" ||
    !/^\d{6}$/.test(body.code)
  ) {
    return NextResponse.json(
      { error: "Enter the six-digit code from your email." },
      { status: 400 },
    );
  }

  let otpSettings;
  try {
    otpSettings = getContactEmailOtpSettings();
  } catch (error) {
    console.error(
      "Contact email verification configuration is invalid:",
      error instanceof Error ? error.message : "Unknown configuration error",
    );
    return NextResponse.json(
      {
        error:
          "Email verification is temporarily unavailable. Please try again later.",
      },
      { status: 503 },
    );
  }

  if (!verifyContactEmailOtp(body.challengeId, body.code, otpSettings)) {
    return NextResponse.json(
      {
        error:
          "That code is invalid or expired. Request a new code and try again.",
      },
      { status: 400 },
    );
  }

  return NextResponse.json({
    verified: true,
    message: "Your email address has been verified.",
  });
}
