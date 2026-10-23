import { caseStudies } from "@/data/caseStudies";
import { CatalogPage, optionsFor } from "@/components/sections/catalog-page";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "Case Studies",
  "Illustrative AI, workflow, and software scenarios showing how a challenge can be framed and evaluated without claiming client work.",
  "/case-studies",
);
export default function CaseStudiesPage() {
  return (
    <CatalogPage
      title="Explore the reasoning, not invented results."
      description="Illustrative scenarios show how a problem could be framed, what a responsible solution might include, and what would need validation in a real project. They are not anonymized client engagements."
      eyebrow="Case studies"
      basePath="/case-studies"
      items={caseStudies}
      filters={[
        { key: "service", label: "Services" },
        { key: "industry", label: "Industries" },
        { key: "technology", label: "Technologies" },
        { key: "challenge", label: "Challenges" },
        { key: "projectType", label: "Project types" },
      ].map((filter) => ({
        ...filter,
        options: optionsFor(caseStudies, filter.key),
      }))}
    />
  );
}
