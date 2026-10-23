"use client";
import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type FormEvent,
} from "react";
import Link from "next/link";
import { Copy, Mail, FileText } from "lucide-react";
import type { FormKind } from "@/types/contact";
import { formDefinitions } from "@/data/forms";
import { programTitles } from "@/data/program-options";
import { site } from "@/data/site";
import {
  createMailtoUrl,
  formatInquiry,
  readInquiryValues,
} from "@/lib/mailto";
import { copyToClipboard } from "@/lib/formatting";
import { FormField } from "./form-field";
import { Alert } from "@/components/ui/primitives";

const subscribe = () => () => {};
interface PreparedInquiry {
  url: string | null;
  summary: string;
}
interface ContactSubmissionResponse {
  message?: string;
  error?: string;
  challengeId?: string;
  expiryMinutes?: number;
  verified?: boolean;
}

function isContactApiResponse(
  value: unknown,
): value is ContactSubmissionResponse {
  if (typeof value !== "object" || value === null) return false;
  return (
    ("message" in value && typeof value.message === "string") ||
    ("error" in value && typeof value.error === "string") ||
    ("challengeId" in value && typeof value.challengeId === "string") ||
    ("verified" in value && typeof value.verified === "boolean")
  );
}

export function InquiryForm({ kind }: { kind: FormKind }) {
  const definition = formDefinitions[kind];
  const form = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState("");
  const [prepared, setPrepared] = useState<PreparedInquiry | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [emailAddress, setEmailAddress] = useState("");
  const [verifiedEmail, setVerifiedEmail] = useState("");
  const [otpChallengeId, setOtpChallengeId] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpExpiryMinutes, setOtpExpiryMinutes] = useState(10);
  const [otpBusy, setOtpBusy] = useState(false);
  const emailVerified =
    !!verifiedEmail && verifiedEmail === emailAddress.trim().toLowerCase();
  const hydrated = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  useEffect(() => {
    if (kind !== "contact") return;
    const searchParams = new URLSearchParams(window.location.search);
    const programSlug = searchParams.get("program");
    const requestedFormat = searchParams.get("format");
    const inquiryType = searchParams.get("inquiryType");
    const inquiryTypeField = form.current?.elements.namedItem("inquiryType");
    if (
      inquiryType &&
      inquiryTypeField instanceof HTMLSelectElement &&
      Array.from(inquiryTypeField.options).some(
        (option) => option.value === inquiryType,
      )
    ) {
      inquiryTypeField.value = inquiryType;
    }
    const programTitle = programSlug ? programTitles[programSlug] : undefined;
    if (!programTitle) return;
    const formatLabels = new Map([
      ["seminar", "Seminar · 2 hours"],
      ["webinar", "Webinar · 2 hours"],
      ["workshop", "Workshop · duration to discuss"],
      ["training", "7- or 15-day program"],
      ["corporate", "Customized group program"],
    ]);
    const formatLabel = requestedFormat
      ? formatLabels.get(requestedFormat)
      : undefined;
    if (
      inquiryTypeField instanceof HTMLSelectElement &&
      Array.from(inquiryTypeField.options).some(
        (option) => option.value === "Programs and learning",
      )
    )
      inquiryTypeField.value = "Programs and learning";
    const subjectField = form.current?.elements.namedItem("subject");
    if (subjectField instanceof HTMLInputElement) {
      subjectField.value = `Program enquiry: ${programTitle}`;
    }
    const messageField = form.current?.elements.namedItem("message");
    if (messageField instanceof HTMLTextAreaElement) {
      messageField.value = `I would like to enquire about ${programTitle}${formatLabel ? ` (${formatLabel})` : ""}. Please share availability and scope.`;
    }
  }, [kind]);

  function prepare(): PreparedInquiry | null {
    if (!form.current) return null;
    const nextErrors: Record<string, string> = {};
    for (const field of definition.fields) {
      const control = form.current.elements.namedItem(field.name) as
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null;
      if (!control) continue;
      if (field.required && !control.value.trim())
        nextErrors[field.name] = `Please enter ${field.label.toLowerCase()}.`;
      else if (!control.checkValidity())
        nextErrors[field.name] =
          control.validationMessage ||
          `Please check ${field.label.toLowerCase()}.`;
    }
    const privacy = form.current.elements.namedItem(
      "privacy",
    ) as HTMLInputElement;
    if (!privacy.checked)
      nextErrors.privacy =
        "Please acknowledge the privacy notice before preparing an inquiry.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      setPrepared(null);
      setStatus("Please review the highlighted fields. Nothing has been sent.");
      const first = form.current.elements.namedItem(
        Object.keys(nextErrors)[0],
      ) as HTMLElement | null;
      first?.closest("details")?.setAttribute("open", "");
      first?.focus();
      return null;
    }
    const values = readInquiryValues(form.current, kind);
    const formatted = formatInquiry(values);
    const result = {
      url: site.contactEmailConfigured ? createMailtoUrl(values) : null,
      summary: `${site.contactEmail ? `To: ${site.contactEmail}\r\n` : ""}Subject: ${formatted.subject}\r\n\r\n${formatted.body}`,
    };
    setPrepared(result);
    return result;
  }
  function openEmail(event?: FormEvent) {
    event?.preventDefault();
    if (kind === "contact" && !emailVerified) {
      setStatus(
        "Verify your email address before preparing the contact inquiry.",
      );
      return;
    }
    const result = prepare();
    if (!result) return;
    if (!result.url) {
      setStatus(
        "The contact email is not configured. Nothing has been sent. You can copy the inquiry details below, or try again after the site owner configures the verified contact address.",
      );
      return;
    }
    window.location.href = result.url;
    setStatus(
      `Your browser was asked to open your email application. Please review and send the message manually. If nothing opens, use the copy options below.${kind === "consultation" ? " Your requested date is not confirmed." : ""}`,
    );
  }

  async function sendVerificationCode() {
    const emailInput = form.current?.elements.namedItem(
      "email",
    ) as HTMLInputElement | null;
    if (!emailInput || !emailInput.checkValidity()) {
      emailInput?.reportValidity();
      return;
    }

    const requestedEmail = emailInput.value.trim();
    setEmailAddress(requestedEmail);
    setVerifiedEmail("");
    setOtpChallengeId("");
    setOtpCode("");
    setOtpExpiryMinutes(10);
    setOtpBusy(true);
    setStatus("Sending a verification code…");

    try {
      const response = await fetch("/api/contact/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: requestedEmail }),
      });
      let result: unknown;
      try {
        result = await response.json();
      } catch {
        result = null;
      }
      if (!isContactApiResponse(result)) {
        setStatus("We couldn't confirm the code was sent. Please try again.");
        return;
      }
      if (!response.ok || !result.challengeId) {
        setStatus(
          result.error ??
            "We couldn't send a verification code. Please try again later.",
        );
        return;
      }

      const currentEmail = (
        form.current?.elements.namedItem("email") as HTMLInputElement | null
      )?.value;
      if (currentEmail?.trim().toLowerCase() !== requestedEmail.toLowerCase()) {
        setStatus(
          "The email address changed. Request a code for the new address.",
        );
        return;
      }
      setOtpChallengeId(result.challengeId);
      if (typeof result.expiryMinutes === "number") {
        setOtpExpiryMinutes(result.expiryMinutes);
      }
      setStatus(
        result.message ?? "A verification code was sent to your email.",
      );
    } catch {
      setStatus(
        "We couldn't connect to the email service. Please try again later.",
      );
    } finally {
      setOtpBusy(false);
    }
  }

  async function verifyEmailCode() {
    if (!otpChallengeId || !/^\d{6}$/.test(otpCode)) {
      setStatus("Enter the six-digit code sent to your email address.");
      return;
    }
    const currentEmail = (
      form.current?.elements.namedItem("email") as HTMLInputElement | null
    )?.value;
    const requestedEmail = currentEmail?.trim().toLowerCase() ?? "";
    setEmailAddress(requestedEmail);
    setOtpBusy(true);
    setStatus("Verifying your email address…");

    try {
      const response = await fetch("/api/contact/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ challengeId: otpChallengeId, code: otpCode }),
      });
      let result: unknown;
      try {
        result = await response.json();
      } catch {
        result = null;
      }
      if (!isContactApiResponse(result)) {
        setStatus("We couldn't confirm verification. Please try again.");
        return;
      }
      if (!response.ok || result.verified !== true) {
        setStatus(
          result.error ?? "The code could not be verified. Please try again.",
        );
        return;
      }

      const verifiedAddress = (
        form.current?.elements.namedItem("email") as HTMLInputElement | null
      )?.value;
      if (verifiedAddress?.trim().toLowerCase() !== requestedEmail) {
        setOtpChallengeId("");
        setOtpCode("");
        setStatus(
          "The email address changed. Request a code for the new address.",
        );
        return;
      }
      setVerifiedEmail(requestedEmail);
      setStatus(result.message ?? "Your email address has been verified.");
    } catch {
      setStatus(
        "We couldn't connect to the verification service. Please try again.",
      );
    } finally {
      setOtpBusy(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (kind !== "contact") {
      openEmail();
      return;
    }

    if (!prepare() || !form.current) return;
    if (!emailVerified || !otpChallengeId) {
      setStatus("Verify your email address before sending your inquiry.");
      return;
    }
    setSubmitting(true);
    setStatus("Sending your inquiry…");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          values: readInquiryValues(form.current, kind),
          verificationId: otpChallengeId,
        }),
      });
      let result: unknown;
      try {
        result = await response.json();
      } catch {
        result = null;
      }
      if (!isContactApiResponse(result)) {
        setStatus("We couldn't confirm delivery. Please try again later.");
        return;
      }
      if (!response.ok || !result.message) {
        setStatus(
          result.error ??
            "We couldn't send your inquiry. Please try again later.",
        );
        return;
      }
      form.current.reset();
      setPrepared(null);
      setErrors({});
      setEmailAddress("");
      setVerifiedEmail("");
      setOtpChallengeId("");
      setOtpCode("");
      setOtpExpiryMinutes(10);
      setStatus(result.message);
    } catch {
      setStatus(
        "We couldn't connect to the email service. Please check your connection and try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }
  async function copyEmail() {
    try {
      await copyToClipboard(site.contactEmail);
      setStatus("Email address copied.");
    } catch {
      setStatus(
        "Clipboard unavailable. Select and copy the email address displayed below.",
      );
    }
  }
  async function copyInquiry() {
    if (kind === "contact" && !emailVerified) {
      setStatus(
        "Verify your email address before preparing the contact inquiry.",
      );
      return;
    }
    const result = prepare();
    if (!result) return;
    try {
      await copyToClipboard(result.summary);
      setStatus(
        "Inquiry details copied. Paste them into your email application and send manually.",
      );
    } catch {
      setStatus(
        "Clipboard unavailable. Select and copy the inquiry summary below manually.",
      );
    }
  }
  const required = definition.fields.filter((field) => field.required);
  const optional = definition.fields.filter((field) => !field.required);
  const emailFieldIndex = required.findIndex((field) => field.name === "email");
  return (
    <div>
      {kind === "contact" ? (
        <Alert>
          Verify your email address with a one-time code before sending your
          inquiry. Please do not include sensitive or confidential information.
        </Alert>
      ) : site.contactEmailConfigured ? (
        <Alert>No information is automatically sent or stored.</Alert>
      ) : (
        <Alert warning>
          A public email address is not configured for manual email-app
          fallback. You can still copy the inquiry details below. No information
          is automatically sent or stored by this form.
        </Alert>
      )}
      {kind === "consultation" && (
        <Alert>
          Preferred dates are requests only. This is not a booking, and no
          real-time availability is shown.
        </Alert>
      )}
      <form
        ref={form}
        onSubmit={handleSubmit}
        noValidate
        onChange={(event) => {
          if (prepared) setPrepared(null);
          if (status) setStatus("");
          if (
            event.target instanceof HTMLInputElement &&
            event.target.name === "email"
          ) {
            setEmailAddress(event.target.value);
            setVerifiedEmail("");
            setOtpChallengeId("");
            setOtpCode("");
          }
        }}
      >
        <p className="muted text-sm mb-6">
          Fields marked * are required. Please do not include sensitive or
          confidential information.
        </p>
        {Object.keys(errors).length > 0 && (
          <div className="error-summary" role="alert">
            Please review {Object.keys(errors).length} highlighted{" "}
            {Object.keys(errors).length === 1 ? "field" : "fields"} below.
          </div>
        )}
        <div className="form-grid">
          {kind === "contact" && emailFieldIndex >= 0 ? (
            <>
              {required.slice(0, emailFieldIndex + 1).map((field) => (
                <FormField
                  key={field.name}
                  field={field}
                  error={errors[field.name]}
                />
              ))}
              <div className="form-field full-width">
                <p className="field-hint">
                  Verify this address before the contact form can be sent.
                  {emailVerified ? " Email address verified." : ""}
                </p>
                <div className="button-row">
                  <button
                    className="button button-secondary"
                    type="button"
                    disabled={!hydrated || otpBusy || submitting}
                    onClick={sendVerificationCode}
                  >
                    {otpBusy && !otpChallengeId
                      ? "Sending code…"
                      : otpChallengeId
                        ? "Send a new code"
                        : "Send verification code"}
                  </button>
                </div>
                {otpChallengeId && !emailVerified && (
                  <>
                    <label htmlFor="contact-email-otp" className="mt-4">
                      Six-digit verification code
                    </label>
                    <input
                      id="contact-email-otp"
                      name="contactEmailOtp"
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      pattern="[0-9]{6}"
                      maxLength={6}
                      value={otpCode}
                      onChange={(event) =>
                        setOtpCode(event.currentTarget.value.replace(/\D/g, ""))
                      }
                      aria-describedby="contact-email-otp-hint"
                      disabled={otpBusy || submitting}
                    />
                    <p id="contact-email-otp-hint" className="field-hint">
                      The code expires after {otpExpiryMinutes} minutes.
                    </p>
                    <div className="button-row mt-4">
                      <button
                        className="button button-secondary"
                        type="button"
                        disabled={!hydrated || otpBusy || submitting}
                        onClick={verifyEmailCode}
                      >
                        {otpBusy ? "Verifying…" : "Verify email"}
                      </button>
                    </div>
                  </>
                )}
              </div>
              {required.slice(emailFieldIndex + 1).map((field) => (
                <FormField
                  key={field.name}
                  field={field}
                  error={errors[field.name]}
                />
              ))}
            </>
          ) : (
            required.map((field) => (
              <FormField
                key={field.name}
                field={field}
                error={errors[field.name]}
              />
            ))
          )}
        </div>
        <details className="optional-fields">
          <summary>Additional details (optional)</summary>
          <div className="form-grid">
            {optional.map((field) => (
              <FormField
                key={field.name}
                field={field}
                error={errors[field.name]}
              />
            ))}
          </div>
        </details>
        <label className="privacy-check" htmlFor="privacy">
          <input
            id="privacy"
            name="privacy"
            type="checkbox"
            required
            aria-invalid={!!errors.privacy}
            aria-describedby={errors.privacy ? "privacy-error" : undefined}
          />
          <span>
            I have read the <Link href="/privacy">privacy notice</Link> and
            {kind === "contact"
              ? " agree that my inquiry details will be sent by email. *"
              : " understand that I must send the prepared email manually. *"}
          </span>
        </label>
        {errors.privacy && (
          <p id="privacy-error" className="field-error">
            {errors.privacy}
          </p>
        )}
        <button
          className="button button-primary"
          type="submit"
          disabled={
            !hydrated || submitting || (kind === "contact" && !emailVerified)
          }
        >
          <Mail size={17} aria-hidden="true" />
          {submitting
            ? "Sending inquiry…"
            : kind === "contact"
              ? emailVerified
                ? "Send inquiry"
                : "Verify email to continue"
              : "Prepare email inquiry"}
        </button>
        <noscript>
          <p>Enable JavaScript to submit this form.</p>
        </noscript>
        <div className="fallback">
          <h3>Prefer to use your own email app?</h3>
          <p>
            A default email application must be configured for mailto links.
            Longer inquiries can exceed your application&apos;s link limit;
            copying avoids truncation.
          </p>
          <p className="break-anywhere">
            {site.contactEmailConfigured
              ? site.contactEmail
              : "Manual email address not configured"}
          </p>
          <div className="button-row">
            {site.contactEmailConfigured && (
              <button
                type="button"
                disabled={!hydrated}
                className="button button-secondary"
                onClick={copyEmail}
              >
                <Copy size={16} />
                Copy email address
              </button>
            )}
            <button
              type="button"
              disabled={!hydrated || (kind === "contact" && !emailVerified)}
              className="button button-secondary"
              onClick={copyInquiry}
            >
              <FileText size={16} />
              Copy inquiry details
            </button>
            {site.contactEmailConfigured && (
              <button
                type="button"
                disabled={!hydrated || (kind === "contact" && !emailVerified)}
                className="button button-secondary"
                onClick={() => openEmail()}
              >
                <Mail size={16} />
                Open email application
              </button>
            )}
          </div>
          {prepared && (
            <div className="mt-5">
              <label htmlFor="inquiry-summary" className="text-sm">
                Prepared inquiry summary
              </label>
              <textarea
                id="inquiry-summary"
                readOnly
                value={prepared.summary}
              />
              {site.contactEmailConfigured && (
                <a
                  href={`mailto:${encodeURIComponent(site.contactEmail)}`}
                  className="text-link"
                >
                  Open a blank email to paste the summary
                </a>
              )}
            </div>
          )}
        </div>
        <p
          className="form-status"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {status}
        </p>
      </form>
    </div>
  );
}
export function ContactForm() {
  return <InquiryForm kind="contact" />;
}
export function ProposalForm() {
  return <InquiryForm kind="proposal" />;
}
export function ConsultationForm() {
  return <InquiryForm kind="consultation" />;
}
