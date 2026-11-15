import { NextResponse, type NextRequest } from "next/server";
import nodemailer from "nodemailer";
import {
  callContactOtpBackend,
  settleContactOtp,
} from "@/lib/server/contact-otp-backend";
import { isContactEmailVerificationEnabled } from "@/lib/contact-email-verification";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const rateLimitWindow = 15 * 60 * 1000;
const rateLimitMaximum = 5;
const requestsByClient = new Map<string, { count: number; resetAt: number }>();

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

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
      })[character] ?? character,
  );
}

function getLeadDetails(lead: Record<string, unknown>) {
  return Object.entries(lead)
    .filter(([key]) => !["consent", "sourcePath", "website"].includes(key))
    .map(([key, value]) => ({
      label: key
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (character) => character.toUpperCase()),
      value:
        typeof value === "string" || typeof value === "number"
          ? String(value)
          : "",
    }));
}

function isSameOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  try {
    return Boolean(origin && new URL(origin).origin === request.nextUrl.origin);
  } catch {
    return false;
  }
}

async function sendLeadEmails(
  lead: Record<string, unknown>,
  details: ReturnType<typeof getLeadDetails>,
) {
  const host = process.env.SMTP_HOST?.trim();
  const port = Number(process.env.SMTP_PORT);
  const secure = process.env.SMTP_SECURE?.trim().toLowerCase();
  const user = process.env.SMTP_USER?.trim();
  const password = process.env.SMTP_PASSWORD?.replace(/\s/g, "");
  const from = process.env.MAIL_FROM?.trim();
  const to = process.env.MAIL_TO?.trim();
  const email = typeof lead.email === "string" ? lead.email : "";
  const category =
    typeof lead.category === "string" ? lead.category : "Enquiry";
  const name = typeof lead.name === "string" ? lead.name : "there";

  if (
    !host ||
    !Number.isInteger(port) ||
    port < 1 ||
    port > 65535 ||
    !["true", "false"].includes(secure ?? "") ||
    !user ||
    !password ||
    !from ||
    !to
  ) {
    console.error(
      "Lead email delivery is unavailable: SMTP configuration is incomplete.",
    );
    return {
      configured: false,
      teamEmailSent: false,
      confirmationSent: false,
    };
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: secure === "true",
    requireTLS: secure !== "true",
    auth: { user, pass: password },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 20_000,
  });
  const text = details
    .map(({ label, value }) => `${label}: ${value}`)
    .join("\n");
  const htmlRows = details
    .map(
      ({ label, value }) =>
        `<tr><th align="left" style="padding:8px;border-bottom:1px solid #e5eaf1">${escapeHtml(label)}</th><td style="padding:8px;border-bottom:1px solid #e5eaf1;white-space:pre-wrap">${escapeHtml(value)}</td></tr>`,
    )
    .join("");
  const subject = `New PraedicoAI enquiry — ${category}`;
  let teamEmailSent = false;
  let confirmationSent = false;

  try {
    await transporter.sendMail({
      from,
      to,
      replyTo: email,
      subject,
      text: `New website enquiry received.\n\n${text}`,
      html: `<h1>New PraedicoAI enquiry</h1><p>${escapeHtml(category)}</p><table>${htmlRows}</table>`,
    });
    teamEmailSent = true;
  } catch (error) {
    console.error(
      "Lead notification email delivery failed:",
      error instanceof Error ? error.message : "Unknown SMTP error",
    );
  }

  try {
    await transporter.sendMail({
      from,
      to: email,
      subject: "We received your enquiry — PraedicoAI",
      text: `Hello ${name},\n\nThank you for contacting PraedicoAI. We have received your ${category} enquiry. Our team will review it and get back to you.\n\nPraedicoAI`,
      html: `<p>Hello ${escapeHtml(name)},</p><p>Thank you for contacting PraedicoAI. We have received your <strong>${escapeHtml(category)}</strong> enquiry. Our team will review it and get back to you.</p><p>PraedicoAI</p>`,
    });
    confirmationSent = true;
  } catch (error) {
    console.error(
      "Lead confirmation email delivery failed:",
      error instanceof Error ? error.message : "Unknown SMTP error",
    );
  }

  return {
    configured: true,
    teamEmailSent,
    confirmationSent,
  };
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

  const contentLength = request.headers.get("content-length");
  if (
    contentLength &&
    (!/^\d+$/.test(contentLength) || Number(contentLength) > 16_384)
  ) {
    return NextResponse.json(
      { error: "The enquiry is too large. Please shorten it and try again." },
      { status: 413 },
    );
  }

  const clientId =
    request.headers.get("x-real-ip")?.trim() ||
    request.headers.get("x-forwarded-for")?.split(",").at(-1)?.trim() ||
    "unknown";
  if (isRateLimited(clientId, Date.now())) {
    return NextResponse.json(
      { error: "Too many enquiries. Please wait and try again." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (
    !isRecord(body) ||
    !isRecord(body.lead) ||
    typeof body.lead.email !== "string" ||
    typeof body.lead.category !== "string" ||
    body.lead.consent !== true
  ) {
    return NextResponse.json(
      { error: "Check the enquiry details and consent." },
      { status: 400 },
    );
  }

  const verificationId =
    isContactEmailVerificationEnabled &&
    typeof body.verificationId === "string" &&
    /^[a-f0-9]{64}$/.test(body.verificationId)
      ? body.verificationId
      : undefined;
  if (isContactEmailVerificationEnabled && !verificationId) {
    return NextResponse.json(
      { error: "Verify your email address before submitting this enquiry." },
      { status: 400 },
    );
  }

  const backendUrl = process.env.BACKEND_API_URL?.trim().replace(/\/+$/, "");
  const internalSecret = process.env.AUTH_INTERNAL_SECRET?.trim();
  if (!backendUrl || !internalSecret) {
    const missingVariables: string[] = [];
    if (!backendUrl) missingVariables.push("BACKEND_API_URL");
    if (!internalSecret) missingVariables.push("AUTH_INTERNAL_SECRET");
    console.error(
      `Lead submission is unavailable: missing or empty ${missingVariables.join(", ")}.`,
    );
    return NextResponse.json(
      { error: "Enquiry submission is temporarily unavailable." },
      { status: 503 },
    );
  }

  const email = body.lead.email;
  if (isContactEmailVerificationEnabled && verificationId) {
    let verificationClaim: { claimed: boolean };
    try {
      verificationClaim = await callContactOtpBackend({
        action: "claim",
        challengeId: verificationId,
        email,
      });
    } catch (error) {
      console.error(
        "Lead verification claim could not be checked:",
        error instanceof Error ? error.message : "Unknown backend error",
      );
      return NextResponse.json(
        { error: "Email verification is temporarily unavailable." },
        { status: 503 },
      );
    }
    if (!verificationClaim.claimed) {
      return NextResponse.json(
        {
          error:
            "Verify your email address before sending your enquiry. Request a new code if needed.",
        },
        { status: 403 },
      );
    }
  }

  let backendResponse: Response;
  try {
    backendResponse = await fetch(`${backendUrl}/api/v1/leads`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Auth-Internal-Secret": internalSecret,
      },
      body: JSON.stringify(body.lead),
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
    });
  } catch (error) {
    if (verificationId) {
      await settleContactOtp(
        { action: "release", challengeId: verificationId, email },
        "Lead verification claim could not be released after backend failure:",
      );
    }
    console.error(
      "Lead persistence request failed:",
      error instanceof Error ? error.message : "Unknown backend error",
    );
    return NextResponse.json(
      { error: "We couldn't save your enquiry. Please try again later." },
      { status: 503 },
    );
  }

  if (!backendResponse.ok) {
    if (verificationId) {
      await settleContactOtp(
        { action: "release", challengeId: verificationId, email },
        "Lead verification claim could not be released after rejected submission:",
      );
    }
    const result: unknown = await backendResponse.json().catch(() => null);
    const message =
      isRecord(result) &&
      isRecord(result.error) &&
      typeof result.error.message === "string"
        ? result.error.message
        : "Check the enquiry details and try again.";
    return NextResponse.json(
      { error: message },
      { status: backendResponse.status },
    );
  }

  if (verificationId) {
    await settleContactOtp(
      { action: "consume", challengeId: verificationId, email },
      "Lead verification could not be consumed after persistence:",
    );
  }
  const details = getLeadDetails(body.lead);
  const emailOutcome = await sendLeadEmails(body.lead, details);
  let message: string;
  if (!emailOutcome.configured) {
    message =
      "Your enquiry has been saved. Email notifications are temporarily unavailable, but our team can review your request.";
  } else if (emailOutcome.teamEmailSent && emailOutcome.confirmationSent) {
    message =
      "Your enquiry has been received. A confirmation email has been sent.";
  } else if (emailOutcome.teamEmailSent) {
    message =
      "Your enquiry has been received and the PraedicoAI team has been notified. We could not send the confirmation email.";
  } else if (emailOutcome.confirmationSent) {
    message =
      "Your enquiry has been saved and a confirmation email has been sent, but the team notification could not be delivered.";
  } else {
    message =
      "Your enquiry has been saved, but email notifications could not be delivered. Our team can review your request.";
  }
  return NextResponse.json({ message }, { status: 201 });
}
