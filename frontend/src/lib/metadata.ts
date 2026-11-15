import type { Metadata } from "next";
import { site } from "@/data/site";
import { isNoIndexPath, seoPageOverrides } from "@/data/seo-pages";

export function pageMetadata(
  title: string,
  description: string,
  path: string,
  image = "/images/og/cover.png",
): Metadata {
  const override = seoPageOverrides[path];
  const pageTitle = override?.title ?? title;
  const pageDescription = override?.description ?? description;
  const noIndex = isNoIndexPath(path);

  return {
    title: pageTitle,
    description: pageDescription,
    alternates: { canonical: path },
    openGraph: {
      title: `${pageTitle} | PraedicoAI`,
      description: pageDescription,
      url: path,
      siteName: "PraedicoAI",
      images: [
        {
          url: image,
          width: 1200,
          height: 720,
          alt: "Abstract layered shapes representing AI systems",
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${pageTitle} | PraedicoAI`,
      description: pageDescription,
      images: [image],
    },
    robots: {
      index: site.canonicalUrlConfigured && !noIndex,
      follow: true,
    },
  };
}
