import type { MetadataRoute } from "next";
import { sitemapRoutes } from "@/lib/routes";
import { seoPageOverrides } from "@/data/seo-pages";
import { site } from "@/data/site";

export const dynamic = "force-dynamic";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isSitemapEntry(
  value: unknown,
): value is { slug: string; updatedAt: string } {
  return (
    isRecord(value) &&
    typeof value.slug === "string" &&
    typeof value.updatedAt === "string"
  );
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!site.canonicalUrlConfigured) return [];

  const routes: MetadataRoute.Sitemap = sitemapRoutes.map((path) => ({
    url: `${site.url}${path}`,
    changeFrequency: "monthly",
    priority: path === "/" ? 1 : seoPageOverrides[path] ? 0.8 : 0.6,
  }));
  const backendUrl = process.env.BACKEND_API_URL?.trim().replace(/\/+$/, "");
  if (!backendUrl) return routes;

  const response = await fetch(`${backendUrl}/api/v1/content/public`, {
    cache: "no-store",
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) {
    throw new Error(`Published sitemap entries unavailable (${response.status}).`);
  }
  const result: unknown = await response.json();
  if (
    !isRecord(result) ||
    !isRecord(result.data) ||
    !Array.isArray(result.data.entries) ||
    !result.data.entries.every(isSitemapEntry)
  ) {
    throw new Error("The content service returned invalid sitemap entries.");
  }
  return [
    ...routes,
    ...result.data.entries.map((content) => {
      return {
        url: `${site.url}/updates/${content.slug}`,
        lastModified: new Date(content.updatedAt),
        changeFrequency: "monthly" as const,
        priority: 0.6,
      };
    }),
  ];
}
