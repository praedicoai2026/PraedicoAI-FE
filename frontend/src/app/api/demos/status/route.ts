import { NextResponse, type NextRequest } from "next/server";
import {
  forwardDemoRequest,
  getDemoCountryCode,
  isGeminiFreeTierRestricted,
} from "@/lib/server/demo-api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const countryCode = getDemoCountryCode(request);
  if (!countryCode) {
    return NextResponse.json({
      available: false,
      status: "Unavailable",
      reason: "region-unavailable",
      maximumInputCharacters: 2000,
    });
  }
  if (isGeminiFreeTierRestricted(countryCode)) {
    return NextResponse.json({
      available: false,
      status: "Unavailable",
      reason: "region-restricted",
      maximumInputCharacters: 2000,
    });
  }

  const secret = process.env.AUTH_INTERNAL_SECRET?.trim();
  if (!secret) {
    console.error(
      "Demo status is unavailable: AUTH_INTERNAL_SECRET is missing.",
    );
    return NextResponse.json(
      { error: "Demo status is temporarily unavailable." },
      { status: 503 },
    );
  }
  try {
    const response = await forwardDemoRequest("/status", {
      method: "GET",
      countryCode,
      secret,
    });
    const result: unknown = await response.json();
    if (!response.ok) {
      console.error("Demo status backend returned an error.", response.status);
      return NextResponse.json(
        { error: "Demo status is temporarily unavailable." },
        { status: response.status },
      );
    }
    if (
      typeof result !== "object" ||
      result === null ||
      !("data" in result) ||
      typeof result.data !== "object" ||
      result.data === null
    ) {
      console.error("Demo status backend returned an unexpected response.");
      return NextResponse.json(
        { error: "Demo status is temporarily unavailable." },
        { status: 502 },
      );
    }
    const data = result.data as {
      available?: unknown;
      status?: unknown;
      regionAllowed?: unknown;
      reason?: unknown;
      maximumInputCharacters?: unknown;
    };
    const reason =
      data.regionAllowed === false
        ? "region-restricted"
        : data.reason === "region-unknown"
          ? "region-unavailable"
          : undefined;
    return NextResponse.json({
      available: data.available === true,
      status:
        reason === "region-restricted" || reason === "region-unavailable"
          ? "Unavailable"
          : data.status === "Beta Demo" || data.status === "Live Demo"
            ? data.status
            : "Coming Soon",
      reason,
      maximumInputCharacters:
        typeof data.maximumInputCharacters === "number"
          ? data.maximumInputCharacters
          : 2000,
    });
  } catch (error) {
    console.error(
      "Demo status request failed:",
      error instanceof Error ? error.message : "Unknown backend error",
    );
    return NextResponse.json(
      { error: "Demo status is temporarily unavailable." },
      { status: 503 },
    );
  }
}
