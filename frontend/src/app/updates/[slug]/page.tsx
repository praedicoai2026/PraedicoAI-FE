import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pageMetadata } from "@/lib/metadata";

export const dynamic = "force-dynamic";

type PublishedEntry = {
  type: string;
  slug: string;
  title: string;
  summary: string;
  body: string;
  seoTitle: string;
  seoDescription: string;
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
    typeof value.body === "string" &&
    typeof value.seoTitle === "string" &&
    typeof value.seoDescription === "string" &&
    (typeof value.publishedAt === "string" || value.publishedAt === null)
  );
}

async function getPublishedEntry(slug: string): Promise<PublishedEntry | null> {
  const backendUrl = process.env.BACKEND_API_URL?.trim().replace(/\/+$/, "");
  if (!backendUrl) throw new Error("BACKEND_API_URL is not configured.");
  const response = await fetch(
    `${backendUrl}/api/v1/content/public/${encodeURIComponent(slug)}`,
    { cache: "no-store", signal: AbortSignal.timeout(10_000) },
  );
  if (response.status === 404) return null;
  if (!response.ok) {
    throw new Error(`Published content could not be loaded (${response.status}).`);
  }
  const result: unknown = await response.json();
  if (
    !isRecord(result) ||
    !isRecord(result.data) ||
    !isPublishedEntry(result.data.entry)
  ) {
    throw new Error("The content service returned invalid published content.");
  }
  return result.data.entry;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = await getPublishedEntry(slug);
  if (!entry) return { title: "Content not found" };
  return pageMetadata(
    entry.seoTitle,
    entry.seoDescription,
    `/updates/${entry.slug}`,
  );
}

export default async function PublishedUpdatePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = await getPublishedEntry(slug);
  if (!entry) notFound();

  return (
    <article className="published-update-page">
      <header>
        <p className="portal-eyebrow">{entry.type}</p>
        <h1>{entry.title}</h1>
        <p>{entry.summary}</p>
      </header>
      <div className="published-update-body">{entry.body}</div>
    </article>
  );
}
