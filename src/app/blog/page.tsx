import { blogPosts, blogCategories } from "@/data/blogPosts";
import { BlogExplorer } from "@/components/sections/blog-explorer";
import { PageHero } from "@/components/sections/shared";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "AI & Technology Insights",
  "Practical articles on applied AI, workflow design, responsible adoption, software architecture, and learning.",
  "/blog",
);
export default function BlogPage() {
  return (
    <>
      <PageHero
        title="Think clearly about what AI should do."
        description="Practical perspectives on applied AI, workflow design, evaluation, software architecture, and helping people adapt to new capabilities."
        eyebrow="The journal"
        path="/blog"
      />
      <BlogExplorer posts={blogPosts} categories={blogCategories} />
    </>
  );
}
