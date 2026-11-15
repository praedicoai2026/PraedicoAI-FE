import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/metadata";

type PublishedEntry = {
  type: string;
  slug: string;
  title: string;
  summary: string;
  publishedAt: string | null;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isPublishedEntry(value: unknown): value is PublishedEntry {
  return (
    isRecord(value) &&
    typeof value.type === "string" &&
    typeof value.slug === "string" &&
    typeof value.title === "string" &&
    typeof value.summary === "string" &&
    (typeof value.publishedAt === "string" || value.publishedAt === null)
  );
}

async function getPublishedEntries(): Promise<PublishedEntry[]> {
  const backendUrl = process.env.BACKEND_API_URL?.trim().replace(/\/+$/, "");
  if (!backendUrl) throw new Error("BACKEND_API_URL is not configured.");
  const response = await fetch(`${backendUrl}/api/v1/content/public`, {
    cache: "no-store",
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) {
    throw new Error(`Published content could not be loaded (${response.status}).`);
  }
  const result: unknown = await response.json();
  if (
    !isRecord(result) ||
    !isRecord(result.data) ||
    !Array.isArray(result.data.entries) ||
    !result.data.entries.every(isPublishedEntry)
  ) {
    throw new Error("The content service returned invalid published entries.");
  }
  return result.data.entries;
}

export const metadata: Metadata = pageMetadata(
  "PraedicoAI Updates",
  "Published articles, resources, events, and updates about PraedicoAI's product concepts, research interests, and community.",
  "/updates",
);

export const dynamic = "force-dynamic";

export default async function UpdatesPage() {
  const entries = await getPublishedEntries();
  return (
    <main className="published-updates-index">
      <header>
        <p className="portal-eyebrow">PraedicoAI journal</p>
        <h1>Updates and resources</h1>
        <p>Published information from our content team.</p>
      </header>
      {entries.length === 0 ? (
        <p>No public updates have been published yet.</p>
      ) : (
        <div className="published-update-list">
          {entries.map((entry) => (
            <article key={entry.slug}>
              <span className="portal-eyebrow">{entry.type}</span>
              <h2><Link href={`/updates/${entry.slug}`}>{entry.title}</Link></h2>
              <p>{entry.summary}</p>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
