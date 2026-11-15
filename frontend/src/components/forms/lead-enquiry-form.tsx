"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { industries } from "@/data/industries";
import type { LeadCategory, LeadFormKind } from "@/data/lead-categories";
import { whatsapp } from "@/data/whatsapp";

type FieldDefinition = {
  name: string;
  label: string;
  type?: "email" | "tel" | "textarea" | "select" | "text";
  required?: boolean;
  options?: string[];
  placeholder?: string;
  hint?: string;
};

const programs = [
  "AI Fundamentals",
  "Generative AI",
  "Prompt Engineering",
  "Python for AI",
  "Machine Learning",
  "AI Agents",
  "AI Automation",
  "Hands-on AI Projects",
  "Industry-Specific AI Program",
  "Corporate AI Training",
  "Generative AI Intern",
  "AI Automation Intern",
  "AI Agent Development Intern",
  "Python and Machine Learning Intern",
  "AI Application Development Intern",
  "Data Analytics Intern",
];

const contactMethods = [
  { value: "email", label: "Email" },
  { value: "phone", label: "Phone" },
  ...(whatsapp.configured ? [{ value: "whatsapp", label: "WhatsApp" }] : []),
];

const formFields: Record<LeadFormKind, FieldDefinition[]> = {
  business: [
    { name: "name", label: "Full name", required: true },
    { name: "company", label: "Company or organization", required: true },
    { name: "designation", label: "Designation", required: true },
    { name: "email", label: "Email address", type: "email", required: true },
    {
      name: "phone",
      label: "Phone with country code",
      type: "tel",
      required: true,
    },
    {
      name: "industry",
      label: "Industry",
      required: true,
      hint: "You can enter an industry not listed here.",
    },
    {
      name: "businessProblem",
      label: "Business problem or opportunity",
      type: "textarea",
      required: true,
    },
    {
      name: "requiredAISolution",
      label: "AI solution or support needed",
      type: "textarea",
      required: true,
    },
    {
      name: "budgetRange",
      label: "Budget range (optional)",
      placeholder: "Include currency or write “To discuss”",
    },
    {
      name: "preferredContactMethod",
      label: "Preferred contact method",
      type: "select",
      required: true,
      options: contactMethods.map(({ value, label }) => `${value}|${label}`),
    },
  ],
  student: [
    { name: "name", label: "Full name", required: true },
    { name: "college", label: "College or institution", required: true },
    { name: "courseDegree", label: "Course or degree", required: true },
    { name: "currentYear", label: "Current year of study", required: true },
    { name: "email", label: "Email address", type: "email", required: true },
    {
      name: "phone",
      label: "Phone with country code",
      type: "tel",
      required: true,
    },
    {
      name: "interestedAIProgram",
      label: "Interested AI program or internship track",
      options: programs,
      required: true,
    },
    {
      name: "internshipInterest",
      label: "Are you interested in internship opportunities?",
      type: "select",
      required: true,
      options: ["yes|Yes", "no|No", "exploring|I would like to learn more"],
    },
    {
      name: "learningObjectives",
      label: "Learning goals or areas you want to explore",
      type: "textarea",
      required: true,
    },
  ],
  professional: [
    { name: "name", label: "Full name", required: true },
    {
      name: "currentProfession",
      label: "Current profession",
      required: true,
    },
    { name: "industry", label: "Industry", required: true },
    { name: "experience", label: "Professional experience", required: true },
    { name: "email", label: "Email address", type: "email", required: true },
    {
      name: "phone",
      label: "Phone with country code",
      type: "tel",
      required: true,
    },
    {
      name: "interestedAIProgram",
      label: "AI tools or program you are interested in",
      options: programs,
      required: true,
    },
    {
      name: "learningObjectives",
      label: "Professional learning goals",
      type: "textarea",
      required: true,
    },
  ],
  institution: [
    { name: "name", label: "Full name", required: true },
    {
      name: "institution",
      label: "College or institution",
      required: true,
    },
    { name: "designation", label: "Designation or role", required: true },
    { name: "email", label: "Email address", type: "email", required: true },
    {
      name: "phone",
      label: "Phone with country code",
      type: "tel",
      required: true,
    },
    {
      name: "partnershipGoal",
      label: "Partnership or training goal",
      type: "textarea",
      required: true,
    },
    {
      name: "targetAudience",
      label: "Who would the program serve?",
      required: true,
      placeholder: "For example: students, faculty, or both",
    },
    {
      name: "estimatedParticipants",
      label: "Estimated number of participants (optional)",
    },
    {
      name: "learningObjectives",
      label: "Topics, outcomes, or internship interests",
      type: "textarea",
      required: true,
    },
    {
      name: "preferredContactMethod",
      label: "Preferred contact method",
      type: "select",
      required: true,
      options: contactMethods.map(({ value, label }) => `${value}|${label}`),
    },
  ],
  interest: [
    { name: "name", label: "Full name", required: true },
    {
      name: "company",
      label: "Organization (optional)",
      placeholder: "Company, college, or organization",
    },
    { name: "email", label: "Email address", type: "email", required: true },
    {
      name: "phone",
      label: "Phone with country code",
      type: "tel",
      required: true,
    },
    {
      name: "interestArea",
      label: "Product, community topic, or collaboration of interest",
      required: true,
    },
    {
      name: "learningObjectives",
      label: "What would you like to explore?",
      type: "textarea",
      required: true,
    },
  ],
};

type ApiResult = {
  error?: string;
  message?: string;
  challengeId?: string;
  retryAfterSeconds?: number;
};

function isApiResult(value: unknown): value is ApiResult {
  return typeof value === "object" && value !== null;
}

function parseOptions(options: string[]) {
  return options.map((option) => {
    const [value, label] = option.split("|");
    return { value: value ?? option, label: label ?? option };
  });
}

export function LeadEnquiryForm({
  category,
  formKind,
}: {
  category: LeadCategory;
  formKind: LeadFormKind;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [email, setEmail] = useState("");
  const [verificationId, setVerificationId] = useState("");
  const [code, setCode] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const form = formRef.current;
    if (!form) return;
    const query = new URLSearchParams(window.location.search);
    const values: Record<string, string | null> = {
      industry: query.get("industry"),
      interestedAIProgram: query.get("program"),
      interestArea: query.get("interestArea") ?? query.get("topic"),
      learningObjectives: query.get("objectives"),
      businessProblem: query.get("problem") ?? query.get("message"),
      requiredAISolution: query.get("solution") ?? query.get("subject"),
      partnershipGoal: query.get("goal"),
    };
    for (const [name, value] of Object.entries(values)) {
      if (!value) continue;
      const field = form.elements.namedItem(name);
      if (
        (field instanceof HTMLInputElement ||
          field instanceof HTMLTextAreaElement ||
          field instanceof HTMLSelectElement) &&
        !field.value
      ) {
        field.value = value;
      }
    }
  }, []);

  async function sendVerificationCode() {
    setError("");
    setStatus("");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Enter a valid email address before requesting a code.");
      return;
    }

    setBusy(true);
    try {
      const response = await fetch("/api/contact/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const result: unknown = await response.json();
      if (!response.ok || !isApiResult(result)) {
        setError(
          isApiResult(result) && typeof result.error === "string"
            ? result.error
            : "Unable to send a verification code. Please try again.",
        );
        return;
      }
      if (typeof result.challengeId === "string") {
        setVerificationId(result.challengeId);
        setEmailVerified(false);
        setCode("");
        setStatus("A six-digit verification code was sent to your email.");
      } else {
        setError(
          `Please wait ${result.retryAfterSeconds ?? 60} seconds before requesting another code.`,
        );
      }
    } catch {
      setError("Unable to send a verification code. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function verifyEmail() {
    setError("");
    setStatus("");
    if (!verificationId || !/^\d{6}$/.test(code)) {
      setError("Enter the six-digit code sent to your email.");
      return;
    }
    setBusy(true);
    try {
      const response = await fetch("/api/contact/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ challengeId: verificationId, code }),
      });
      const result: unknown = await response.json();
      if (!response.ok) {
        setError(
          isApiResult(result) && typeof result.error === "string"
            ? result.error
            : "That code could not be verified.",
        );
        return;
      }
      setEmailVerified(true);
      setStatus("Email verified. You can now submit your enquiry.");
    } catch {
      setError("Unable to verify your email. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setStatus("");
    if (!emailVerified || !verificationId) {
      setError("Verify your email address before submitting this enquiry.");
      return;
    }

    const formData = new FormData(event.currentTarget);
    const requestedSourcePath = new URLSearchParams(window.location.search).get(
      "sourcePath",
    );
    const sourcePath =
      requestedSourcePath &&
      /^\/demos(?:\/[a-z0-9-]+)?$/.test(requestedSourcePath)
        ? requestedSourcePath
        : window.location.pathname;
    const lead: Record<string, string | boolean> = {
      category,
      consent: formData.get("consent") === "on",
      sourcePath,
    };
    for (const field of formFields[formKind]) {
      const value = formData.get(field.name);
      lead[field.name] = typeof value === "string" ? value.trim() : "";
    }
    lead.email = email.trim().toLowerCase();
    const honeypot = formData.get("website");
    if (typeof honeypot === "string") lead.website = honeypot;

    setBusy(true);
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lead, verificationId }),
      });
      const result: unknown = await response.json();
      if (!response.ok) {
        setError(
          isApiResult(result) && typeof result.error === "string"
            ? result.error
            : "Your enquiry could not be submitted. Please try again.",
        );
        return;
      }
      const message =
        isApiResult(result) && typeof result.message === "string"
          ? result.message
          : "Your enquiry has been received.";
      setStatus(message);
      formRef.current?.reset();
      setEmail("");
      setVerificationId("");
      setCode("");
      setEmailVerified(false);
    } catch {
      setError("Your enquiry could not be submitted. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  const fields = formFields[formKind];
  return (
    <div className="lead-form-layout">
      <form className="lead-form-card" ref={formRef} onSubmit={submit}>
        <input
          className="lead-form-honeypot"
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
        />
        <div className="lead-form-fields">
          {fields.map((field) => (
            <label
              className={`lead-form-field ${field.type === "textarea" ? "wide" : ""}`}
              htmlFor={`lead-${field.name}`}
              key={field.name}
            >
              <span>
                {field.label}
                {field.required && <strong aria-hidden="true"> *</strong>}
              </span>
              {field.type === "textarea" ? (
                <textarea
                  id={`lead-${field.name}`}
                  name={field.name}
                  required={field.required}
                  rows={4}
                  maxLength={3000}
                  onChange={
                    field.name === "email"
                      ? (event) => {
                          setEmail(event.target.value);
                          setEmailVerified(false);
                          setVerificationId("");
                        }
                      : undefined
                  }
                />
              ) : field.type === "select" ? (
                <select
                  id={`lead-${field.name}`}
                  name={field.name}
                  required={field.required}
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select an option
                  </option>
                  {parseOptions(field.options ?? []).map(({ value, label }) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  id={`lead-${field.name}`}
                  name={field.name}
                  type={field.type ?? "text"}
                  required={field.required}
                  maxLength={field.name === "businessProblem" ? 3000 : 500}
                  autoComplete={
                    field.name === "name"
                      ? "name"
                      : field.name === "email"
                        ? "email"
                        : field.name === "phone"
                          ? "tel"
                          : undefined
                  }
                  placeholder={field.placeholder}
                  list={
                    field.name === "industry"
                      ? "lead-industries"
                      : field.name === "interestedAIProgram"
                        ? "lead-program-options"
                        : undefined
                  }
                  value={field.name === "email" ? email : undefined}
                  onChange={
                    field.name === "email"
                      ? (event) => {
                          setEmail(event.target.value);
                          setEmailVerified(false);
                          setVerificationId("");
                        }
                      : undefined
                  }
                />
              )}
              {field.name === "industry" && (
                <datalist id="lead-industries">
                  {industries.map(({ name }) => (
                    <option key={name} value={name} />
                  ))}
                </datalist>
              )}
              {field.name === "interestedAIProgram" && (
                <datalist id="lead-program-options">
                  {(field.options ?? []).map((option) => (
                    <option key={option} value={option} />
                  ))}
                </datalist>
              )}
              {field.hint && <small>{field.hint}</small>}
            </label>
          ))}
        </div>

        <div className="lead-email-verification">
          <div className="lead-email-verification-heading">
            <div>
              <h2>Verify your email</h2>
              <p>We use this to confirm your enquiry and send a reply.</p>
            </div>
            {emailVerified && <span className="lead-verified">Verified</span>}
          </div>
          {!emailVerified && (
            <div className="lead-otp-actions">
              {verificationId && (
                <label htmlFor="lead-otp-code">
                  <span>Six-digit code</span>
                  <input
                    id="lead-otp-code"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    pattern="[0-9]{6}"
                    value={code}
                    onChange={(event) =>
                      setCode(event.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    required
                  />
                </label>
              )}
              <div className="lead-otp-buttons">
                {!verificationId ? (
                  <button
                    className="button-secondary"
                    type="button"
                    disabled={busy}
                    onClick={sendVerificationCode}
                  >
                    {busy ? "Sending..." : "Send verification code"}
                  </button>
                ) : (
                  <>
                    <button
                      className="button-secondary"
                      type="button"
                      disabled={busy}
                      onClick={verifyEmail}
                    >
                      {busy ? "Checking..." : "Verify email"}
                    </button>
                    <button
                      className="lead-resend-button"
                      type="button"
                      disabled={busy}
                      onClick={sendVerificationCode}
                    >
                      Resend code
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        <label className="lead-consent" htmlFor="lead-consent">
          <input id="lead-consent" name="consent" type="checkbox" required />
          <span>
            I agree that PraedicoAI may use these details to respond to this
            enquiry. See the <Link href="/privacy">privacy notice</Link>.
          </span>
        </label>

        {error && (
          <p className="lead-form-message error" role="alert">
            {error}
          </p>
        )}
        {status && (
          <p className="lead-form-message success" role="status">
            {status}
          </p>
        )}
        <button
          className="button-primary lead-submit"
          type="submit"
          disabled={busy}
        >
          {busy ? "Submitting..." : "Submit enquiry"}
        </button>
        <p className="lead-form-footnote">
          Please do not include passwords, payment information, or other
          sensitive personal data.
        </p>
      </form>

      <aside className="lead-form-aside">
        <p className="eyebrow">Next steps</p>
        <h2>Tell us what you are exploring.</h2>
        <p>
          Your enquiry is saved for the PraedicoAI team to review. A submission
          is a request to start a conversation, not a confirmed engagement,
          program place, internship, or business outcome.
        </p>
        <Link href="/enquiry" className="text-link">
          View all enquiry types
        </Link>
      </aside>
    </div>
  );
}
