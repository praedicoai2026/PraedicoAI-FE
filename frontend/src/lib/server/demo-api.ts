import "server-only";
import { createHmac } from "node:crypto";
import type { NextRequest } from "next/server";

const freeTierRestrictedCountries = new Set([
  "AT",
  "BE",
  "BG",
  "HR",
  "CY",
  "CZ",
  "DK",
  "EE",
  "FI",
  "FR",
  "DE",
  "GR",
  "HU",
  "IE",
  "IT",
  "LV",
  "LT",
  "LU",
  "MT",
  "NL",
  "PL",
  "PT",
  "RO",
  "SK",
  "SI",
  "ES",
  "SE",
  "IS",
  "LI",
  "NO",
  "CH",
  "GB",
]);

export function getDemoCountryCode(request: NextRequest) {
  const country = request.headers.get("x-vercel-ip-country")?.toUpperCase();
  if (country && /^[A-Z]{2}$/.test(country)) return country;
  return process.env.NODE_ENV === "production" ? null : "US";
}

export function isGeminiFreeTierRestricted(countryCode: string) {
  return freeTierRestrictedCountries.has(countryCode);
}

export function getDemoRateLimitKey(request: NextRequest, secret: string) {
  const forwardedIp =
    request.headers.get("x-real-ip")?.trim() ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown";
  return createHmac("sha256", secret).update(forwardedIp).digest("hex");
}

export async function forwardDemoRequest(
  path: string,
  options: {
    method: "GET" | "POST";
    countryCode?: string;
    secret: string;
    body?: Record<string, unknown>;
  },
) {
  const baseUrl = process.env.BACKEND_API_URL?.trim().replace(/\/+$/, "");
  if (!baseUrl) throw new Error("BACKEND_API_URL is not configured.");

  return fetch(`${baseUrl}/api/v1/demos${path}`, {
    method: options.method,
    headers: {
      "Content-Type": "application/json",
      "X-Auth-Internal-Secret": options.secret,
      ...(options.countryCode
        ? { "X-Vercel-IP-Country": options.countryCode }
        : {}),
    },
    ...(options.body ? { body: JSON.stringify(options.body) } : {}),
    cache: "no-store",
    signal: AbortSignal.timeout(30_000),
  });
}
