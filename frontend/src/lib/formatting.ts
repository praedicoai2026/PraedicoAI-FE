import type { ContentSection } from "@/types/content";
export const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
export function calculateReadingTime(sections: ContentSection[]): number {
  const text = sections
    .map((section) =>
      [
        section.title,
        ...section.paragraphs,
        ...(section.bullets ?? []),
        section.code ?? "",
      ].join(" "),
    )
    .join(" ");
  return Math.max(1, Math.ceil(text.split(/\s+/).length / 200));
}
export const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
export async function copyToClipboard(text: string): Promise<void> {
  if (!navigator.clipboard?.writeText)
    throw new Error(
      "Clipboard unavailable. Select and copy the visible text manually.",
    );
  await navigator.clipboard.writeText(text);
}
