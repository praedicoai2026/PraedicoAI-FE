import { notFound } from "next/navigation";
import { blogPosts, blogCategories } from "@/data/blogPosts";
import { PageHero } from "@/components/sections/shared";
import { Section, EmptyState, ButtonLink } from "@/components/ui/primitives";
import { Catalog } from "@/components/ui/catalog";
import { optionsFor } from "@/components/sections/catalog-page";
import { slugify } from "@/lib/formatting";
import { pageMetadata } from "@/lib/metadata";
export const dynamicParams = false;
export const generateStaticParams = () =>
  blogCategories.map((category) => ({ slug: slugify(category) }));
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = blogCategories.find((item) => slugify(item) === slug);
  return category
    ? pageMetadata(
        category,
        `Sample articles about ${category.toLowerCase()}.`,
        `/blog/category/${slug}`,
      )
    : {};
}
export default async function BlogCategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = blogCategories.find((item) => slugify(item) === slug);
  if (!category) notFound();
  const posts = blogPosts.filter((post) => post.category === category);
  return (
    <>
      <PageHero
        title={category}
        description={`Perspectives and learning notes about ${category.toLowerCase()}.`}
        eyebrow="Journal topic"
        path={`/blog/category/${slug}`}
      />
      <Section>
        {posts.length ? (
          <Catalog
            items={posts}
            basePath="/blog"
            filters={[
              { key: "tag", label: "Tags", options: optionsFor(posts, "tag") },
            ]}
          />
        ) : (
          <EmptyState
            title="More perspectives to come"
            description="No articles have been published in this sample category yet."
          >
            <ButtonLink href="/blog">Explore all articles</ButtonLink>
          </EmptyState>
        )}
      </Section>
    </>
  );
}
