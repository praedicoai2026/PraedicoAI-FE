import "server-only";

type ContactOtpAction =
  | { action: "request"; email: string }
  | { action: "verify"; challengeId: string; code: string }
  | { action: "claim"; challengeId: string; email: string }
  | { action: "release"; challengeId: string; email: string }
  | { action: "consume"; challengeId: string; email: string }
  | { action: "discard"; challengeId: string };

type ContactOtpBackendData =
  | { challengeId: string; code: string; expiryMinutes: number }
  | { verified: boolean }
  | { claimed: boolean }
  | Record<string, never>;

export class ContactOtpBackendError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly retryAfterSeconds?: number,
  ) {
    super(message);
    this.name = "ContactOtpBackendError";
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function callContactOtpBackend(action: {
  action: "request";
  email: string;
}): Promise<{ challengeId: string; code: string; expiryMinutes: number }>;
export function callContactOtpBackend(action: {
  action: "verify";
  challengeId: string;
  code: string;
}): Promise<{ verified: boolean }>;
export function callContactOtpBackend(action: {
  action: "claim";
  challengeId: string;
  email: string;
}): Promise<{ claimed: boolean }>;
export function callContactOtpBackend(
  action:
    | { action: "release"; challengeId: string; email: string }
    | { action: "consume"; challengeId: string; email: string }
    | { action: "discard"; challengeId: string },
): Promise<Record<string, never>>;
export async function callContactOtpBackend(
  action: ContactOtpAction,
): Promise<ContactOtpBackendData> {
  const backendUrl = process.env.BACKEND_API_URL?.trim().replace(/\/+$/, "");
  const internalSecret = process.env.AUTH_INTERNAL_SECRET?.trim();
  if (!backendUrl || !internalSecret) {
    const missingVariables: string[] = [];
    if (!backendUrl) missingVariables.push("BACKEND_API_URL");
    if (!internalSecret) missingVariables.push("AUTH_INTERNAL_SECRET");
    throw new Error(
      `Contact OTP backend configuration is incomplete: ${missingVariables.join(", ")} is missing or empty.`,
    );
  }

  let url: URL;
  try {
    url = new URL(`${backendUrl}/api/v1/contact-otp`);
  } catch {
    throw new Error("BACKEND_API_URL is invalid for contact OTP requests.");
  }
  if (
    process.env.NODE_ENV === "production" &&
    ["localhost", "127.0.0.1", "::1"].includes(url.hostname)
  ) {
    throw new Error("Production contact OTP cannot use a localhost backend.");
  }

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Auth-Internal-Secret": internalSecret,
    },
    body: JSON.stringify(action),
    cache: "no-store",
    signal: AbortSignal.timeout(10_000),
  });

  let result: unknown;
  try {
    result = await response.json();
  } catch {
    throw new Error("Contact OTP backend returned an invalid response.");
  }

  if (!response.ok) {
    const error =
      isRecord(result) && isRecord(result.error) ? result.error : {};
    throw new ContactOtpBackendError(
      typeof error.message === "string"
        ? error.message
        : "Contact OTP backend request failed.",
      response.status,
      typeof error.retryAfterSeconds === "number"
        ? error.retryAfterSeconds
        : undefined,
    );
  }

  if (!isRecord(result) || !isRecord(result.data)) {
    throw new Error("Contact OTP backend returned an invalid response.");
  }

  const data = result.data;
  switch (action.action) {
    case "request":
      if (
        typeof data.challengeId !== "string" ||
        !/^[a-f0-9]{64}$/.test(data.challengeId) ||
        typeof data.code !== "string" ||
        !/^\d{6}$/.test(data.code) ||
        typeof data.expiryMinutes !== "number"
      ) {
        throw new Error("Contact OTP backend returned an invalid challenge.");
      }
      return {
        challengeId: data.challengeId,
        code: data.code,
        expiryMinutes: data.expiryMinutes,
      };
    case "verify":
      if (typeof data.verified !== "boolean") {
        throw new Error(
          "Contact OTP backend returned an invalid verification.",
        );
      }
      return { verified: data.verified };
    case "claim":
      if (typeof data.claimed !== "boolean") {
        throw new Error("Contact OTP backend returned an invalid claim.");
      }
      return { claimed: data.claimed };
    case "release":
    case "consume":
    case "discard":
      return {};
  }
}

export async function settleContactOtp(
  action:
    | { action: "release"; challengeId: string; email: string }
    | { action: "consume"; challengeId: string; email: string }
    | { action: "discard"; challengeId: string },
  logMessage: string,
) {
  try {
    await callContactOtpBackend(action);
  } catch (error) {
    console.error(
      logMessage,
      error instanceof Error ? error.message : "Unknown backend error",
    );
  }
}
