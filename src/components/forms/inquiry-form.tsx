"use client";
import { useRef, useState, useSyncExternalStore, type FormEvent } from "react";
import Link from "next/link";
import { Copy, Mail, FileText } from "lucide-react";
import type { FormKind } from "@/types/contact";
import { formDefinitions } from "@/data/forms";
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
  url: string;
  summary: string;
}
export function InquiryForm({ kind }: { kind: FormKind }) {
  const definition = formDefinitions[kind];
  const form = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState("");
  const [prepared, setPrepared] = useState<PreparedInquiry | null>(null);
  const hydrated = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

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
      url: createMailtoUrl(values),
      summary: `To: ${site.contactEmail}\r\nSubject: ${formatted.subject}\r\n\r\n${formatted.body}`,
    };
    setPrepared(result);
    return result;
  }
  function openEmail(event?: FormEvent) {
    event?.preventDefault();
    const result = prepare();
    if (!result) return;
    window.location.href = result.url;
    setStatus(
      `Your browser was asked to open your email application. Please review and send the message manually. If nothing opens, use the copy options below.${kind === "consultation" ? " Your requested date is not confirmed." : ""}`,
    );
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
  return (
    <div>
      <Alert warning>
        {site.contactEmail.includes("REPLACE_WITH") &&
          "The contact email is not configured yet. A verified address must be added before real inquiries can be received. "}
        No information is automatically sent or stored.
      </Alert>
      {kind === "consultation" && (
        <Alert>
          Preferred dates are requests only. This is not a booking, and no
          real-time availability is shown.
        </Alert>
      )}
      <form
        ref={form}
        onSubmit={openEmail}
        noValidate
        onChange={() => {
          if (prepared) setPrepared(null);
          if (status) setStatus("");
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
          {required.map((field) => (
            <FormField
              key={field.name}
              field={field}
              error={errors[field.name]}
            />
          ))}
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
            understand that I must send the prepared email manually. *
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
          disabled={!hydrated}
        >
          <Mail size={17} aria-hidden="true" />
          Prepare email inquiry
        </button>
        <noscript>
          <p>
            Enable JavaScript to prepare an inquiry, or contact the configured
            address manually. This form does not submit to a server.
          </p>
        </noscript>
        <div className="fallback">
          <h3>Prefer to use your own email app?</h3>
          <p>
            A default email application must be configured for mailto links.
            Longer inquiries can exceed your application&apos;s link limit;
            copying avoids truncation.
          </p>
          <p className="break-anywhere">{site.contactEmail}</p>
          <div className="button-row">
            <button
              type="button"
              disabled={!hydrated}
              className="button button-secondary"
              onClick={copyEmail}
            >
              <Copy size={16} />
              Copy email address
            </button>
            <button
              type="button"
              disabled={!hydrated}
              className="button button-secondary"
              onClick={copyInquiry}
            >
              <FileText size={16} />
              Copy inquiry details
            </button>
            <button
              type="button"
              disabled={!hydrated}
              className="button button-secondary"
              onClick={() => openEmail()}
            >
              <Mail size={16} />
              Open email application
            </button>
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
              <a
                href={`mailto:${encodeURIComponent(site.contactEmail)}`}
                className="text-link"
              >
                Open a blank email to paste the summary
              </a>
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
export function TrainingRequestForm() {
  return <InquiryForm kind="training" />;
}
export function ConsultationForm() {
  return <InquiryForm kind="consultation" />;
}
