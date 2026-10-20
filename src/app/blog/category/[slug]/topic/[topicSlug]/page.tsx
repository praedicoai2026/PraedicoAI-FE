import { notFound } from "next/navigation";
import { BlogExplorer } from "@/components/sections/blog-explorer";
import { PageHero } from "@/components/sections/shared";
import { blogCategories, blogPosts } from "@/data/blogPosts";
import { slugify } from "@/lib/formatting";
import { pageMetadata } from "@/lib/metadata";

export const dynamicParams = false;

const blogTopics = blogCategories.flatMap((category) =>
  [
    ...new Set(
      blogPosts
        .filter((post) => post.category === category)
        .flatMap((post) => post.tags),
    ),
  ].map((topic) => ({
    slug: slugify(category),
    topicSlug: slugify(topic),
  })),
);

export const generateStaticParams = () => blogTopics;

async function getBlogTopic({
  slug,
  topicSlug,
}: {
  slug: string;
  topicSlug: string;
}) {
  const category = blogCategories.find((item) => slugify(item) === slug);
  if (!category) return null;
  const topic = [
    ...new Set(
      blogPosts
        .filter((post) => post.category === category)
        .flatMap((post) => post.tags),
    ),
  ].find((item) => slugify(item) === topicSlug);
  return topic ? { category, topic } : null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; topicSlug: string }>;
}) {
  const resolved = await getBlogTopic(await params);
  return resolved
    ? pageMetadata(
        `${resolved.topic} Articles`,
        `Articles about ${resolved.topic} in ${resolved.category}.`,
        `/blog/category/${slugify(resolved.category)}/topic/${slugify(resolved.topic)}`,
      )
    : {};
}

export default async function BlogTopicPage({
  params,
}: {
  params: Promise<{ slug: string; topicSlug: string }>;
}) {
  const resolved = await getBlogTopic(await params);
  if (!resolved) notFound();

  return (
    <>
      <PageHero
        title={resolved.topic}
        description={`Browse ${resolved.topic} articles in ${resolved.category}.`}
        eyebrow={`${resolved.category} topic`}
        path={`/blog/category/${slugify(resolved.category)}/topic/${slugify(resolved.topic)}`}
        breadcrumbs={[
          { label: "Blog", href: "/blog" },
          {
            label: resolved.category,
            href: `/blog/category/${slugify(resolved.category)}`,
          },
          { label: "Topic" },
          { label: resolved.topic },
        ]}
      />
      <BlogExplorer
        posts={blogPosts}
        categories={blogCategories}
        initialCategory={resolved.category}
        initialTag={resolved.topic}
        heading={`Explore ${resolved.topic}`}
        description={`Articles tagged ${resolved.topic} within ${resolved.category}.`}
      />
    </>
  );
}
