import { NextResponse, type NextRequest } from "next/server";
import nodemailer from "nodemailer";
import {
  createContactEmailOtp,
  discardContactEmailOtp,
  getContactEmailOtpSettings,
} from "@/lib/server/contact-email-otp";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const rateLimitWindow = 15 * 60 * 1000;
const rateLimitMaximum = 5;
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

function isValidEmail(email: unknown): email is string {
  return (
    typeof email === "string" &&
    email.length <= 254 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
  );
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
      { error: "The email address is invalid. Please check it and try again." },
      { status: 413 },
    );
  }

  const clientId =
    request.headers.get("x-real-ip")?.trim() ||
    request.headers.get("x-forwarded-for")?.split(",").at(-1)?.trim() ||
    "unknown";
  if (isRateLimited(clientId, Date.now())) {
    return NextResponse.json(
      { error: "Too many verification requests. Please wait and try again." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "The email address could not be read. Please try again." },
      { status: 400 },
    );
  }
  if (
    typeof body !== "object" ||
    body === null ||
    !("email" in body) ||
    !isValidEmail(body.email)
  ) {
    return NextResponse.json(
      { error: "Enter a valid email address to receive a verification code." },
      { status: 400 },
    );
  }

  const host = process.env.SMTP_HOST?.trim();
  const port = Number(process.env.SMTP_PORT);
  const secureValue = process.env.SMTP_SECURE?.trim().toLowerCase();
  const user = process.env.SMTP_USER?.trim();
  const password = process.env.SMTP_PASSWORD?.replace(/\s/g, "");
  const from = process.env.MAIL_FROM?.trim();

  if (
    !host ||
    !Number.isInteger(port) ||
    port < 1 ||
    port > 65535 ||
    !["true", "false"].includes(secureValue ?? "") ||
    !user ||
    !password ||
    !from
  ) {
    console.error(
      "Contact email verification is unavailable: SMTP configuration is incomplete.",
    );
    return NextResponse.json(
      {
        error:
          "Email verification is temporarily unavailable. Please try again later.",
      },
      { status: 503 },
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

  const otp = createContactEmailOtp(body.email.trim(), otpSettings);
  if ("retryAfterSeconds" in otp) {
    return NextResponse.json(
      {
        error: `Please wait ${otp.retryAfterSeconds} seconds before requesting another code.`,
      },
      { status: 429 },
    );
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: secureValue === "true",
    requireTLS: secureValue !== "true",
    auth: { user, pass: password },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 20_000,
  });

  try {
    await transporter.sendMail({
      from,
      to: body.email.trim(),
      subject: "Your PraedicoAI email verification code",
      text: `Your PraedicoAI contact-form verification code is ${otp.code}.\n\nIt expires in ${otpSettings.expiryMilliseconds / 60_000} minutes. If you did not request this code, you can ignore this email.`,
      html: `<!doctype html>
<html lang="en">
  <body style="margin:0;padding:24px 12px;background-color:#f8f9fc;font-family:Arial,Helvetica,sans-serif;color:#112039;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
      <tr><td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="width:100%;max-width:600px;border-collapse:separate;border-spacing:0;background-color:#ffffff;border:1px solid #e5eaf1;border-radius:12px;overflow:hidden;">
          <tr><td style="padding:26px 32px;background-color:#112039;border-bottom:4px solid #2563eb;">
            <p style="margin:0;color:#ffffff;font-size:21px;font-weight:700;">PraedicoAI</p>
            <p style="margin:6px 0 0;color:#cbd8eb;font-size:12px;">Applied AI. Powering Intelligent Solutions.</p>
          </td></tr>
          <tr><td style="padding:32px;">
            <p style="margin:0 0 10px;color:#2563eb;font-size:11px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;">Email verification</p>
            <h1 style="margin:0;color:#112039;font-size:25px;line-height:1.3;">Confirm your email address</h1>
            <p style="margin:14px 0;color:#4c6078;font-size:15px;line-height:1.7;">Enter this code on the contact form to verify your email before sending your inquiry.</p>
            <p style="margin:22px 0;padding:18px;background-color:#edf3fa;border-left:3px solid #2563eb;color:#112039;font-size:30px;font-weight:700;letter-spacing:8px;text-align:center;">${otp.code}</p>
            <p style="margin:0;color:#4c6078;font-size:13px;line-height:1.7;">This code expires in ${otpSettings.expiryMilliseconds / 60_000} minutes. If you did not request it, you can ignore this message.</p>
          </td></tr>
          <tr><td style="padding:16px 32px;background-color:#edf3fa;color:#4c6078;font-size:11px;">PraedicoAI Services Private Limited</td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`,
    });
    return NextResponse.json({
      challengeId: otp.challengeId,
      expiryMinutes: otpSettings.expiryMilliseconds / 60_000,
      message: "A verification code has been sent to your email address.",
    });
  } catch (error) {
    discardContactEmailOtp(otp.challengeId);
    console.error(
      "Contact email verification delivery failed:",
      error instanceof Error ? error.message : "Unknown SMTP error",
    );
    return NextResponse.json(
      {
        error:
          "We couldn't send the verification code. Please try again later.",
      },
      { status: 502 },
    );
  }
}
