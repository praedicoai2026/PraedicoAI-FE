import type { MetadataRoute } from "next";
import { site } from "@/data/site";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: site.canonicalUrlConfigured
      ? { userAgent: "*", allow: "/" }
      : { userAgent: "*", disallow: "/" },
    sitemap: site.canonicalUrlConfigured
      ? `${site.url}/sitemap.xml`
      : undefined,
  };
}
