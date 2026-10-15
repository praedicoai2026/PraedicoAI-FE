import Link from "next/link";
import { blogPosts, blogCategories } from "@/data/blogPosts";
import { CatalogPage, optionsFor } from "@/components/sections/catalog-page";
import { Section, SectionHeader } from "@/components/ui/primitives";
import { slugify } from "@/lib/formatting";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "AI & Technology Insights",
  "Practical articles on applied AI, workflow design, responsible adoption, software architecture, and learning.",
  "/blog",
);
export default function BlogPage() {
  return (
    <>
      <CatalogPage
        title="Think clearly about what AI should do."
        description="Practical perspectives on applied AI, workflow design, evaluation, software architecture, and helping people adapt to new capabilities."
        eyebrow="The journal"
        basePath="/blog"
        items={blogPosts}
        featured
        filters={[
          { key: "category", label: "Categories", options: blogCategories },
          { key: "tag", label: "Tags", options: optionsFor(blogPosts, "tag") },
        ]}
      />
      <Section>
        <SectionHeader title="Browse by topic" />
        <nav className="subnav" aria-label="Blog categories">
          {blogCategories.map((category) => (
            <Link key={category} href={`/blog/category/${slugify(category)}`}>
              {category}
            </Link>
          ))}
        </nav>
      </Section>
    </>
  );
}
