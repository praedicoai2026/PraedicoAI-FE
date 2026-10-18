import { NextResponse, type NextRequest } from "next/server";
import nodemailer from "nodemailer";
import { formDefinitions } from "@/data/forms";
import {
  claimContactEmailVerification,
  consumeContactEmailVerification,
  releaseContactEmailVerification,
} from "@/lib/server/contact-email-otp";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const formDefinition = formDefinitions.contact;
const rateLimitWindow = 15 * 60 * 1000;
const rateLimitMaximum = 5;
const requestsByClient = new Map<string, { count: number; resetAt: number }>();

interface EmailDetail {
  label: string;
  value: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
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

function renderBrandedEmail({
  preheader,
  title,
  intro,
  featuredDetails,
  details,
  footer,
}: {
  preheader: string;
  title: string;
  intro: string;
  featuredDetails?: EmailDetail[];
  details: EmailDetail[];
  footer: string;
}) {
  const featuredRows = [];
  for (let index = 0; index < (featuredDetails?.length ?? 0); index += 2) {
    const first = featuredDetails?.[index];
    const second = featuredDetails?.[index + 1];
    const isFullWidth = first?.label === "Message" || !second;
    featuredRows.push(`
      <tr>
        <td colspan="${isFullWidth ? 2 : 1}" style="width:${isFullWidth ? "100%" : "50%"};padding:7px;vertical-align:top;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;background-color:#edf3fa;border-left:3px solid #2563eb;border-radius:4px;">
            <tr><td style="padding:12px 14px 4px;color:#2563eb;font-size:10px;font-weight:700;letter-spacing:.8px;text-transform:uppercase;">${escapeHtml(first?.label ?? "")}</td></tr>
            <tr><td style="padding:3px 14px 13px;color:#112039;font-size:${first?.label === "Message" ? "15px" : "14px"};font-weight:${first?.label === "Subject" || first?.label === "Message" ? "700" : "600"};line-height:1.6;white-space:pre-wrap;word-break:break-word;">${escapeHtml(first?.value || "Not provided")}</td></tr>
          </table>
        </td>
        ${
          second && !isFullWidth
            ? `<td style="width:50%;padding:7px;vertical-align:top;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;background-color:#edf3fa;border-left:3px solid #2563eb;border-radius:4px;">
            <tr><td style="padding:12px 14px 4px;color:#2563eb;font-size:10px;font-weight:700;letter-spacing:.8px;text-transform:uppercase;">${escapeHtml(second.label)}</td></tr>
            <tr><td style="padding:3px 14px 13px;color:#112039;font-size:14px;font-weight:${second.label === "Subject" ? "700" : "600"};line-height:1.6;white-space:pre-wrap;word-break:break-word;">${escapeHtml(second.value || "Not provided")}</td></tr>
          </table>
        </td>`
            : ""
        }
      </tr>`);
    if (isFullWidth && second) index--;
  }

  const rows = details
    .map(
      ({ label, value }) => `
        <tr>
          <td style="padding:12px 14px;border-bottom:1px solid #e5eaf1;color:#4c6078;font-size:13px;font-weight:600;vertical-align:top;width:34%;">${escapeHtml(label)}</td>
          <td style="padding:12px 14px;border-bottom:1px solid #e5eaf1;color:#112039;font-size:14px;line-height:1.6;white-space:pre-wrap;word-break:break-word;">${escapeHtml(value || "Not provided")}</td>
        </tr>`,
    )
    .join("");

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>${escapeHtml(title)}</title>
  </head>
  <body style="margin:0;padding:24px 12px;background-color:#f8f9fc;font-family:Arial,Helvetica,sans-serif;color:#112039;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${escapeHtml(preheader)}</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="width:100%;max-width:600px;border-collapse:separate;border-spacing:0;background-color:#ffffff;border:1px solid #e5eaf1;border-radius:12px;overflow:hidden;">
            <tr>
              <td style="padding:26px 32px;background-color:#112039;border-bottom:4px solid #2563eb;">
                <p style="margin:0;color:#ffffff;font-size:21px;font-weight:700;letter-spacing:-.3px;">PraedicoAI</p>
                <p style="margin:6px 0 0;color:#cbd8eb;font-size:12px;line-height:1.5;">Applied AI. Powering Intelligent Solutions.</p>
              </td>
            </tr>
            <tr>
              <td style="padding:32px 32px 12px;">
                <p style="margin:0 0 10px;color:#2563eb;font-size:11px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;">${escapeHtml(preheader)}</p>
                <h1 style="margin:0;color:#112039;font-size:25px;line-height:1.3;font-weight:700;">${escapeHtml(title)}</h1>
                <p style="margin:14px 0 0;color:#4c6078;font-size:15px;line-height:1.7;">${escapeHtml(intro)}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 32px 30px;">
                ${
                  featuredRows.length
                    ? `<h2 style="margin:0 0 8px;color:#112039;font-size:14px;line-height:1.4;">Key details</h2>
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;margin:0 0 22px;">
                  ${featuredRows.join("")}
                </table>`
                    : ""
                }
                ${
                  details.length
                    ? `<h2 style="margin:0 0 8px;color:#112039;font-size:14px;line-height:1.4;">All submitted details</h2>
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid #e5eaf1;border-radius:8px;border-spacing:0;overflow:hidden;">
                  ${rows}
                </table>`
                    : ""
                }
                <p style="margin:22px 0 0;padding-top:18px;border-top:1px solid #e5eaf1;color:#4c6078;font-size:12px;line-height:1.7;">${escapeHtml(footer)}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 32px;background-color:#edf3fa;color:#4c6078;font-size:11px;line-height:1.6;">
                PraedicoAI Services Private Limited<br>
                This is an automatically generated message from the PraedicoAI website.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function validateContact(values: unknown) {
  if (!isRecord(values)) return null;

  const sanitized: Record<string, string> = {};
  for (const field of formDefinition.fields) {
    const value = values[field.name];
    if (typeof value !== "string") return null;

    const trimmed = value.trim();
    const maxLength =
      field.name === "message" ? 5000 : field.type === "email" ? 254 : 500;
    if (trimmed.length > maxLength) return null;
    if (field.required && !trimmed) return null;
    if (field.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed))
      return null;
    if (field.type === "select" && trimmed && !field.options?.includes(trimmed))
      return null;
    if (field.type === "url" && trimmed) {
      try {
        const url = new URL(trimmed);
        if (url.protocol !== "https:" && url.protocol !== "http:") return null;
      } catch {
        return null;
      }
    }
    sanitized[field.name] = trimmed;
  }

  if (values.privacy !== true) return null;
  return sanitized;
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
    (!/^\d+$/.test(contentLength) || Number(contentLength) > 16_384)
  ) {
    return NextResponse.json(
      {
        error:
          "This inquiry is too large. Please shorten your message and try again.",
      },
      { status: 413 },
    );
  }

  const clientId =
    request.headers.get("x-real-ip")?.trim() ||
    request.headers.get("x-forwarded-for")?.split(",").at(-1)?.trim() ||
    "unknown";
  if (isRateLimited(clientId, Date.now())) {
    return NextResponse.json(
      {
        error:
          "Too many inquiries were submitted. Please wait a little and try again.",
      },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        error:
          "The inquiry could not be read. Please review the form and try again.",
      },
      { status: 400 },
    );
  }

  if (!isRecord(body)) {
    return NextResponse.json(
      {
        error:
          "The inquiry details are invalid. Please review the form and try again.",
      },
      { status: 400 },
    );
  }
  const values = validateContact(body.values);
  if (!values) {
    return NextResponse.json(
      {
        error:
          "Some inquiry details are missing or invalid. Please review the form and try again.",
      },
      { status: 400 },
    );
  }
  if (
    typeof body.verificationId !== "string" ||
    !/^[a-f0-9]{64}$/.test(body.verificationId) ||
    !claimContactEmailVerification(body.verificationId, values.email)
  ) {
    return NextResponse.json(
      {
        error:
          "Verify your email address before sending your inquiry. Request a new code if needed.",
      },
      { status: 403 },
    );
  }
  const verificationId = body.verificationId;

  const host = process.env.SMTP_HOST?.trim();
  const port = Number(process.env.SMTP_PORT);
  const secureValue = process.env.SMTP_SECURE?.trim().toLowerCase();
  const user = process.env.SMTP_USER?.trim();
  const password = process.env.SMTP_PASSWORD?.replace(/\s/g, "");
  const from = process.env.MAIL_FROM?.trim();
  const to = process.env.MAIL_TO?.trim();

  if (
    !host ||
    !Number.isInteger(port) ||
    port < 1 ||
    port > 65535 ||
    !["true", "false"].includes(secureValue ?? "") ||
    !user ||
    !password ||
    !from ||
    !to
  ) {
    releaseContactEmailVerification(verificationId);
    console.error(
      "Contact email delivery is unavailable: SMTP configuration is incomplete.",
    );
    return NextResponse.json(
      {
        error:
          "Email delivery is temporarily unavailable. Please try again later.",
      },
      { status: 503 },
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

  const subject =
    `Website Inquiry - ${values.inquiryType} - ${values.subject} - ${values.firstName} ${values.lastName}`
      .replace(/[\r\n]+/g, " ")
      .slice(0, 200);
  const allDetails = formDefinition.fields.map((field) => ({
    label: field.label,
    value: values[field.name] || "Not provided",
  }));
  const mainFieldNames = new Set([
    "firstName",
    "lastName",
    "email",
    "inquiryType",
    "subject",
    "message",
  ]);
  const featuredDetails: EmailDetail[] = [
    {
      label: "Name",
      value: `${values.firstName} ${values.lastName}`.trim(),
    },
    { label: "Email", value: values.email },
    { label: "Inquiry type", value: values.inquiryType },
    { label: "Subject", value: values.subject },
    { label: "Message", value: values.message },
  ];
  const details = allDetails.filter(
    (_, index) => !mainFieldNames.has(formDefinition.fields[index].name),
  );
  const text = [
    "New contact inquiry submitted through the PraedicoAI website.",
    "",
    ...featuredDetails.map(({ label, value }) => `${label}: ${value}`),
    ...(details.length
      ? [
          "",
          "Additional details",
          "",
          ...details.map(({ label, value }) => `${label}: ${value}`),
        ]
      : []),
    "",
    "Privacy notice acknowledged by the sender.",
  ].join("\n");
  const confirmationText = [
    `Hello ${values.firstName},`,
    "",
    "Thank you for contacting PraedicoAI. We have received your inquiry and sent it to our team.",
    "",
    `Inquiry type: ${values.inquiryType}`,
    `Subject: ${values.subject}`,
    "",
    "This is an automatic confirmation that your message was received by our email system. No reply is needed to this confirmation.",
    "",
    "PraedicoAI",
  ].join("\n");
  const notificationHtml = renderBrandedEmail({
    preheader: "New website inquiry",
    title: "A new inquiry has arrived",
    intro: "A visitor submitted the contact form. Their details are below.",
    featuredDetails,
    details,
    footer:
      "Reply to this message to respond directly to the sender. Their address is set as the reply-to address.",
  });
  const confirmationHtml = renderBrandedEmail({
    preheader: "Inquiry received",
    title: `Thank you, ${values.firstName}`,
    intro: "We have received your inquiry and sent it to the PraedicoAI team.",
    featuredDetails: [
      { label: "Inquiry type", value: values.inquiryType },
      { label: "Subject", value: values.subject },
    ],
    details: [],
    footer:
      "This confirms that your inquiry was accepted by our email system. No reply is needed to this confirmation.",
  });

  try {
    await transporter.sendMail({
      from,
      to,
      replyTo: values.email,
      subject,
      text,
      html: notificationHtml,
    });
    consumeContactEmailVerification(verificationId);
  } catch (error) {
    releaseContactEmailVerification(verificationId);
    console.error(
      "Contact notification email delivery failed:",
      error instanceof Error ? error.message : "Unknown SMTP error",
    );
    return NextResponse.json(
      {
        error:
          "We couldn't send your inquiry right now. Please try again later.",
      },
      { status: 502 },
    );
  }

  try {
    await transporter.sendMail({
      from,
      to: values.email,
      subject: "We received your inquiry - PraedicoAI",
      text: confirmationText,
      html: confirmationHtml,
    });
    return NextResponse.json({
      message:
        "Your inquiry was sent to PraedicoAI, and a confirmation email was sent to your address.",
    });
  } catch (error) {
    console.error(
      "Contact confirmation email delivery failed:",
      error instanceof Error ? error.message : "Unknown SMTP error",
    );
    return NextResponse.json({
      message:
        "Your inquiry was sent to PraedicoAI, but the confirmation email could not be sent. Please check your email address.",
    });
  }
}
