import { notFound } from "next/navigation";
import { blogPosts, blogCategories } from "@/data/blogPosts";
import { BlogExplorer } from "@/components/sections/blog-explorer";
import { PageHero } from "@/components/sections/shared";
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
        `Articles and practical perspectives on ${category.toLowerCase()}.`,
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
  return (
    <>
      <PageHero
        title={category}
        description={`Perspectives and learning notes about ${category.toLowerCase()}.`}
        eyebrow="Journal topic"
        path={`/blog/category/${slug}`}
      />
      <BlogExplorer
        posts={blogPosts}
        categories={blogCategories}
        initialCategory={category}
        heading={`Explore ${category}`}
        description={`Browse ${category.toLowerCase()} articles, then narrow the list by topic or search term.`}
      />
    </>
  );
}
