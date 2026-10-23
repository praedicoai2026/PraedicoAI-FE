"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { X } from "lucide-react";
import { sectors } from "@/data/sectors";

type AuthView = "login" | "register" | "forgot" | "reset";
type AuthUser = {
  fullName: string;
  email: string;
};

const courseCategories = sectors.map((sector) => ({
  name: sector.name,
  courses: sector.subjects.map((subject) => subject.title),
}));

function getErrorMessage(payload: unknown, fallback: string) {
  if (
    typeof payload === "object" &&
    payload !== null &&
    "error" in payload &&
    typeof payload.error === "object" &&
    payload.error !== null &&
    "message" in payload.error &&
    typeof payload.error.message === "string"
  ) {
    return payload.error.message;
  }
  return fallback;
}

async function readResponse(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    throw new Error("The service returned an invalid response.");
  }
}

export function AuthModal({
  open,
  initialView,
  resetToken,
  onClose,
}: {
  open: boolean;
  initialView: AuthView;
  resetToken?: string;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [view, setView] = useState<AuthView>(initialView);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [passwordReset, setPasswordReset] = useState(false);
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [courseCategory, setCourseCategory] = useState("");
  const [accountType, setAccountType] = useState<"individual" | "business">(
    "individual",
  );

  useEffect(() => {
    const currentDialog = dialog.current;
    if (open && currentDialog && !currentDialog.open) {
      currentDialog.showModal();
      currentDialog
        .querySelector<HTMLInputElement>("input:not([type=hidden])")
        ?.focus();
    } else if (!open && currentDialog?.open) {
      currentDialog.close();
    }
  }, [open]);

  function changeView(nextView: AuthView) {
    setView(nextView);
    setError("");
    setNotice("");
  }

  async function submitLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/backend/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.get("email"),
          password: form.get("password"),
        }),
      });
      const payload = await readResponse(response);
      if (!response.ok) {
        setError(getErrorMessage(payload, "We could not sign you in."));
        return;
      }
      const user =
        typeof payload === "object" &&
        payload !== null &&
        "data" in payload &&
        typeof payload.data === "object" &&
        payload.data !== null &&
        "user" in payload.data &&
        typeof payload.data.user === "object" &&
        payload.data.user !== null &&
        "fullName" in payload.data.user &&
        typeof payload.data.user.fullName === "string" &&
        "email" in payload.data.user &&
        typeof payload.data.user.email === "string"
          ? {
              fullName: payload.data.user.fullName,
              email: payload.data.user.email,
            }
          : null;
      if (!user) {
        setError("The sign-in service returned an invalid response.");
        return;
      }
      setAuthUser(user);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "The sign-in service is unavailable. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function submitRegistration(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const payload = {
      ...Object.fromEntries(form.entries()),
      termsAccepted: form.get("termsAccepted") === "true",
    };
    try {
      const response = await fetch("/api/backend/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await readResponse(response);
      if (!response.ok) {
        setError(getErrorMessage(result, "We could not create your account."));
        return;
      }
      changeView("login");
      setNotice("Your account has been created. Sign in to continue.");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "The registration service is unavailable. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function submitForgotPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/auth/password-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.get("email") }),
      });
      const payload = await readResponse(response);
      if (!response.ok) {
        setError(
          getErrorMessage(payload, "We could not send the reset email."),
        );
        return;
      }
      setNotice(
        "If an account exists for that email, a password reset link will be sent.",
      );
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Password reset is unavailable. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function submitPasswordReset(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const password = String(form.get("password") ?? "");
    if (password !== form.get("confirmPassword")) {
      setError("Passwords do not match.");
      setSubmitting(false);
      return;
    }
    try {
      const response = await fetch("/api/backend/auth/password-reset/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: resetToken, password }),
      });
      const payload = await readResponse(response);
      if (!response.ok) {
        setError(getErrorMessage(payload, "We could not reset your password."));
        return;
      }
      changeView("login");
      setPasswordReset(true);
      setNotice("Your password has been reset. You can now sign in.");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Password reset is unavailable. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function signOut() {
    try {
      const response = await fetch("/api/backend/auth/logout", {
        method: "POST",
      });
      if (!response.ok) {
        const payload = await readResponse(response);
        setError(getErrorMessage(payload, "We could not sign you out."));
        return;
      }
      setAuthUser(null);
      setNotice("You have signed out.");
    } catch {
      setError("The sign-out service is unavailable. Please try again.");
    }
  }

  function closeDialog() {
    if (dialog.current?.open) dialog.current.close();
    onClose();
  }

  const selectedCategory = courseCategories.find(
    (category) => category.name === courseCategory,
  );

  return (
    <dialog
      ref={dialog}
      className="auth-dialog"
      aria-labelledby="auth-dialog-title"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) closeDialog();
      }}
    >
      <div className="auth-dialog-panel">
        <button
          className="icon-button auth-dialog-close"
          type="button"
          aria-label="Close account dialog"
          onClick={closeDialog}
        >
          <X size={20} aria-hidden="true" />
        </button>
        <div className="auth-dialog-heading">
          <p className="eyebrow">PraedicoAI account</p>
          <h2 id="auth-dialog-title">
            {authUser
              ? "You’re signed in"
              : view === "register"
                ? "Create your account"
                : view === "forgot"
                  ? "Reset your password"
                  : view === "reset"
                    ? "Choose a new password"
                    : "Welcome back"}
          </h2>
          <p>
            {authUser
              ? `Signed in as ${authUser.email}`
              : view === "register"
                ? "Create an account to explore our learning programs."
                : view === "forgot"
                  ? "We’ll email you a secure link if an account matches."
                  : view === "reset"
                    ? "Choose a new password to secure your account."
                    : "Sign in to your PraedicoAI account."}
          </p>
        </div>

        {authUser ? (
          <div className="auth-form">
            <p className="registration-status success" role="status">
              Welcome, {authUser.fullName}.
            </p>
            {error && (
              <p className="registration-status" role="alert">
                {error}
              </p>
            )}
            <button
              className="button button-primary"
              type="button"
              onClick={signOut}
            >
              Sign out
            </button>
          </div>
        ) : view === "register" ? (
          <form className="auth-form" onSubmit={submitRegistration}>
            <fieldset className="auth-form-section">
              <legend>1. Your details</legend>
              <div className="auth-form-grid">
                <div className="form-field">
                  <label htmlFor="registration-full-name">Full name</label>
                  <input
                    id="registration-full-name"
                    name="fullName"
                    autoComplete="name"
                    minLength={2}
                    maxLength={100}
                    required
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="registration-email">Email address</label>
                  <input
                    id="registration-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    maxLength={254}
                    required
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="registration-phone">Phone number</label>
                  <input
                    id="registration-phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    minLength={7}
                    maxLength={30}
                    required
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="registration-course-category">
                    Course category
                  </label>
                  <select
                    id="registration-course-category"
                    name="courseCategory"
                    value={courseCategory}
                    onChange={(event) => {
                      setCourseCategory(event.target.value);
                      const courseSelect = document.getElementById(
                        "registration-course",
                      ) as HTMLSelectElement | null;
                      if (courseSelect) courseSelect.value = "";
                    }}
                    required
                  >
                    <option value="">Choose a category</option>
                    {courseCategories.map((category) => (
                      <option key={category.name} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-field auth-form-full">
                  <label htmlFor="registration-course">Course name</label>
                  <select
                    id="registration-course"
                    name="courseName"
                    required
                    disabled={!selectedCategory}
                  >
                    <option value="">
                      {selectedCategory
                        ? "Choose a course"
                        : "Choose a course category first"}
                    </option>
                    {selectedCategory?.courses.map((course) => (
                      <option key={course} value={course}>
                        {course}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-field">
                  <label htmlFor="registration-account-type">
                    Account type
                  </label>
                  <select
                    id="registration-account-type"
                    name="accountType"
                    value={accountType}
                    onChange={(event) =>
                      setAccountType(
                        event.target.value as "individual" | "business",
                      )
                    }
                  >
                    <option value="individual">Individual</option>
                    <option value="business">Business</option>
                  </select>
                </div>
                {accountType === "business" && (
                  <>
                    <div className="form-field">
                      <label htmlFor="registration-company">Company name</label>
                      <input
                        id="registration-company"
                        name="companyName"
                        autoComplete="organization"
                        maxLength={150}
                        required
                      />
                    </div>
                    <div className="form-field">
                      <label htmlFor="registration-website">
                        Company website <span>(optional)</span>
                      </label>
                      <input
                        id="registration-website"
                        name="companyWebsite"
                        type="url"
                        autoComplete="url"
                        maxLength={2048}
                        placeholder="https://example.com"
                      />
                    </div>
                    <div className="form-field auth-form-full">
                      <label htmlFor="registration-company-description">
                        Tell us about your organization
                      </label>
                      <textarea
                        id="registration-company-description"
                        name="companyDescription"
                        rows={3}
                        maxLength={2000}
                        required
                      />
                    </div>
                  </>
                )}
              </div>
            </fieldset>

            <fieldset className="auth-form-section">
              <legend>2. Account security</legend>
              <div className="auth-form-grid">
                <div className="form-field">
                  <label htmlFor="registration-password">Password</label>
                  <input
                    id="registration-password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    minLength={12}
                    maxLength={72}
                    aria-describedby="registration-password-guidance"
                    required
                  />
                  <p id="registration-password-guidance" className="field-hint">
                    Use at least 12 characters.
                  </p>
                </div>
                <div className="form-field">
                  <label htmlFor="registration-confirm-password">
                    Confirm password
                  </label>
                  <input
                    id="registration-confirm-password"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    minLength={12}
                    maxLength={72}
                    aria-describedby="registration-confirm-password-guidance"
                    required
                  />
                  <p
                    id="registration-confirm-password-guidance"
                    className="field-hint"
                  >
                    Re-enter the same password.
                  </p>
                </div>
                <div className="form-field auth-form-full">
                  <label htmlFor="registration-other-information">
                    Anything else you&apos;d like us to know?{" "}
                    <span>(optional)</span>
                  </label>
                  <textarea
                    id="registration-other-information"
                    name="otherInformation"
                    rows={2}
                    maxLength={2000}
                  />
                </div>
                <label className="auth-consent auth-form-full">
                  <input
                    type="checkbox"
                    name="termsAccepted"
                    value="true"
                    required
                  />
                  <span>
                    I agree to the{" "}
                    <a href="/terms" target="_blank" rel="noreferrer">
                      Terms
                    </a>{" "}
                    and{" "}
                    <a href="/privacy" target="_blank" rel="noreferrer">
                      Privacy Policy
                    </a>
                    .
                  </span>
                </label>
              </div>
            </fieldset>
            {error && (
              <p className="registration-status" role="alert">
                {error}
              </p>
            )}
            <button
              className="button button-primary auth-submit"
              type="submit"
              disabled={submitting}
            >
              {submitting ? "Creating account..." : "Create account"}
            </button>
            <p className="auth-switch">
              Already have an account?{" "}
              <button type="button" onClick={() => changeView("login")}>
                Sign in
              </button>
            </p>
          </form>
        ) : view === "login" ? (
          <form className="auth-form" onSubmit={submitLogin}>
            {notice && (
              <p className="registration-status success" role="status">
                {notice}
              </p>
            )}
            <div className="form-field">
              <label htmlFor="login-email">Email address</label>
              <input
                id="login-email"
                name="email"
                type="email"
                autoComplete="email"
                maxLength={254}
                required
              />
            </div>
            <div className="form-field">
              <label htmlFor="login-password">Password</label>
              <input
                id="login-password"
                name="password"
                type="password"
                autoComplete="current-password"
                maxLength={72}
                required
              />
            </div>
            <button
              className="auth-text-link auth-forgot"
              type="button"
              onClick={() => changeView("forgot")}
            >
              Forgot password?
            </button>
            {error && (
              <p className="registration-status" role="alert">
                {error}
              </p>
            )}
            <button
              className="button button-primary auth-submit"
              type="submit"
              disabled={submitting}
            >
              {submitting ? "Signing in..." : "Sign in"}
            </button>
            <p className="auth-switch">
              New to PraedicoAI?{" "}
              <button type="button" onClick={() => changeView("register")}>
                Create an account
              </button>
            </p>
          </form>
        ) : view === "forgot" ? (
          <form className="auth-form" onSubmit={submitForgotPassword}>
            {notice && (
              <p className="registration-status success" role="status">
                {notice}
              </p>
            )}
            <div className="form-field">
              <label htmlFor="forgot-email">Email address</label>
              <input
                id="forgot-email"
                name="email"
                type="email"
                autoComplete="email"
                maxLength={254}
                required
              />
            </div>
            {error && (
              <p className="registration-status" role="alert">
                {error}
              </p>
            )}
            <button
              className="button button-primary auth-submit"
              type="submit"
              disabled={submitting}
            >
              {submitting ? "Sending..." : "Send reset link"}
            </button>
            <p className="auth-switch">
              Remembered your password?{" "}
              <button type="button" onClick={() => changeView("login")}>
                Sign in
              </button>
            </p>
          </form>
        ) : (
          <form className="auth-form" onSubmit={submitPasswordReset}>
            {notice && (
              <p className="registration-status success" role="status">
                {notice}
              </p>
            )}
            {passwordReset ? null : (
              <>
                <div className="form-field">
                  <label htmlFor="reset-password">New password</label>
                  <input
                    id="reset-password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    minLength={12}
                    maxLength={72}
                    required
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="reset-confirm-password">
                    Confirm new password
                  </label>
                  <input
                    id="reset-confirm-password"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    minLength={12}
                    maxLength={72}
                    required
                  />
                </div>
                {error && (
                  <p className="registration-status" role="alert">
                    {error}
                  </p>
                )}
                <button
                  className="button button-primary auth-submit"
                  type="submit"
                  disabled={submitting || !resetToken}
                >
                  {submitting ? "Updating..." : "Update password"}
                </button>
              </>
            )}
            {!resetToken && (
              <p className="registration-status" role="alert">
                This password reset link is missing or invalid. Request a new
                link to continue.
              </p>
            )}
            <p className="auth-switch">
              <button type="button" onClick={() => changeView("login")}>
                Back to sign in
              </button>
            </p>
          </form>
        )}
      </div>
    </dialog>
  );
}
