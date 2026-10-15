import { notFound } from "next/navigation";
import { blogPosts, getBlogPostBySlug } from "@/data/blogPosts";
import { BlogDetailLayout } from "@/components/sections/detail-layouts";
import { pageMetadata } from "@/lib/metadata";
export const dynamicParams = false;
export const generateStaticParams = () =>
  blogPosts.map(({ slug }) => ({ slug }));
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const item = getBlogPostBySlug((await params).slug);
  return item
    ? {
        ...pageMetadata(
          item.title,
          item.summary,
          `/blog/${item.slug}`,
          item.image,
        ),
        openGraph: {
          type: "article" as const,
          title: item.title,
          description: item.summary,
          publishedTime: item.published,
          modifiedTime: item.updated,
          authors: [item.author],
          images: [item.image],
        },
      }
    : {};
}
export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const post = getBlogPostBySlug((await params).slug);
  if (!post) notFound();
  return <BlogDetailLayout post={post} />;
}
