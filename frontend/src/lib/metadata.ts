import type { Metadata } from "next";
import { site } from "@/data/site";
export function pageMetadata(
  title: string,
  description: string,
  path: string,
  image = "/images/og/cover.png",
): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${title} | ${site.name}`,
      description,
      url: path,
      images: [{ url: image, width: 1200, height: 720, alt: title }],
      type: "website",
    },
  };
}
