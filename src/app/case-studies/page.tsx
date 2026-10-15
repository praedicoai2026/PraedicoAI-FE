import { caseStudies } from "@/data/caseStudies";
import { CatalogPage, optionsFor } from "@/components/sections/catalog-page";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "Case Studies",
  "Illustrative case studies exploring architecture and design decisions without confidential customer information.",
  "/case-studies",
);
export default function CaseStudiesPage() {
  return (
    <CatalogPage
      title="The thinking behind the interface."
      description="Anonymized demonstration scenarios. Explore the challenge, the proposed approach, and the questions still to be answered."
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
