import { portfolioProjects, portfolioCategories } from "@/data/portfolio";
import { CatalogPage, optionsFor } from "@/components/sections/catalog-page";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "Portfolio",
  "Explore clearly labeled software, AI, workflow, and learning concept projects.",
  "/portfolio",
);
export default function PortfolioPage() {
  return (
    <CatalogPage
      title="Ideas made tangible."
      description="Concept projects, learning explorations, and interface prototypes. A transparent look at possible approaches, not claims of completed client work."
      eyebrow="Portfolio"
      basePath="/portfolio"
      items={portfolioProjects}
      featured
      filters={[
        { key: "category", label: "Categories", options: portfolioCategories },
        {
          key: "technology",
          label: "Technologies",
          options: optionsFor(portfolioProjects, "technology"),
        },
      ]}
    />
  );
}
