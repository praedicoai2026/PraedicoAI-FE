import { NextResponse, type NextRequest } from "next/server";
import nodemailer from "nodemailer";
import { site } from "@/data/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const requestsByClient = new Map<string, { count: number; resetAt: number }>();
const rateLimitWindow = 15 * 60 * 1000;
const rateLimitMaximum = 5;

function escapeHtml(value: string) {
  return value.replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[character]!,
  );
}

function isEmail(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.length <= 254 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
  );
}

export async function POST(request: NextRequest) {
  const now = Date.now();
  for (const [ip, limit] of requestsByClient) {
    if (limit.resetAt <= now) requestsByClient.delete(ip);
  }
  const clientIp =
    request.headers.get("x-real-ip")?.trim() ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown";
  const existingLimit = requestsByClient.get(clientIp);
  if (existingLimit && existingLimit.resetAt > now) {
    if (existingLimit.count >= rateLimitMaximum) {
      return NextResponse.json(
        {
          error: {
            message: "Too many reset requests. Please try again later.",
          },
        },
        { status: 429 },
      );
    }
    existingLimit.count += 1;
  } else {
    requestsByClient.set(clientIp, {
      count: 1,
      resetAt: now + rateLimitWindow,
    });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { error: { message: "Enter a valid email address." } },
      { status: 400 },
    );
  }

  if (
    typeof payload !== "object" ||
    payload === null ||
    !("email" in payload) ||
    !isEmail(payload.email)
  ) {
    return NextResponse.json(
      { error: { message: "Enter a valid email address." } },
      { status: 400 },
    );
  }

  const backendUrl = process.env.BACKEND_API_URL?.trim();
  const internalSecret = process.env.AUTH_INTERNAL_SECRET?.trim();
  if (!backendUrl || !internalSecret) {
    console.error("Password reset is not configured on the website server.");
    return NextResponse.json(
      { error: { message: "Password reset is temporarily unavailable." } },
      { status: 503 },
    );
  }

  try {
    const backendResponse = await fetch(
      `${backendUrl.replace(/\/$/, "")}/api/v1/auth/password-reset/request`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-internal-secret": internalSecret,
        },
        body: JSON.stringify({ email: payload.email.trim() }),
        cache: "no-store",
        signal: AbortSignal.timeout(10_000),
      },
    );

    if (!backendResponse.ok) {
      console.error(
        "Password reset request failed at the authentication service.",
        { status: backendResponse.status },
      );
      return NextResponse.json(
        { error: { message: "Password reset is temporarily unavailable." } },
        { status: 503 },
      );
    }

    const responsePayload: unknown = await backendResponse.json();
    const token =
      typeof responsePayload === "object" &&
      responsePayload !== null &&
      "data" in responsePayload &&
      typeof responsePayload.data === "object" &&
      responsePayload.data !== null &&
      "token" in responsePayload.data &&
      typeof responsePayload.data.token === "string"
        ? responsePayload.data.token
        : null;

    const host = process.env.SMTP_HOST?.trim();
    const port = Number(process.env.SMTP_PORT);
    const secure = process.env.SMTP_SECURE?.trim().toLowerCase() === "true";
    const user = process.env.SMTP_USER?.trim();
    const password = process.env.SMTP_PASSWORD?.replace(/\s/g, "");
    const from = process.env.MAIL_FROM?.trim();
    if (!host || !Number.isInteger(port) || !user || !password || !from) {
      console.error("Password reset email is not configured.");
      return NextResponse.json(
        {
          error: {
            message: "Password reset email is temporarily unavailable.",
          },
        },
        { status: 503 },
      );
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass: password },
    });
    const resetUrl = token ? new URL("/register", site.url) : null;
    if (resetUrl && token) resetUrl.searchParams.set("token", token);
    const resetLinkText = resetUrl
      ? `Use this link to reset your password. It expires in 30 minutes:\n\n${resetUrl.toString()}\n\n`
      : "";
    const resetLinkHtml = resetUrl
      ? `<p><a href="${escapeHtml(resetUrl.toString())}">Reset your password</a></p><p>This link expires in 30 minutes.</p>`
      : "";

    try {
      await transporter.sendMail({
        from,
        to: payload.email.trim(),
        subject: "PraedicoAI password reset request",
        text: `We received a password reset request for this email address.\n\n${resetLinkText}If you did not request this, you can ignore this email.`,
        html: `<p>We received a password reset request for this email address.</p>${resetLinkHtml}<p>If you did not request this, you can ignore this email.</p>`,
      });
    } catch (error) {
      console.error("Password reset email delivery failed.", error);
      return NextResponse.json(
        {
          error: {
            message:
              "Password reset email could not be sent. Please try again later.",
          },
        },
        { status: 503 },
      );
    } finally {
      transporter.close();
    }

    return NextResponse.json({
      data: {
        message:
          "If an account exists for that email, a password reset link will be sent.",
      },
    });
  } catch (error) {
    console.error("Password reset service request failed.", error);
    return NextResponse.json(
      { error: { message: "Password reset is temporarily unavailable." } },
      { status: 503 },
    );
  }
}
