import type { MetadataRoute } from "next";
import { allRoutes } from "@/lib/routes";
import { site } from "@/data/site";
export default function sitemap(): MetadataRoute.Sitemap {
  if (!site.canonicalUrlConfigured) return [];

  return allRoutes.map((path) => ({
    url: `${site.url}${path}`,
    changeFrequency: "monthly",
    priority: path === "/" ? 1 : 0.6,
  }));
}
