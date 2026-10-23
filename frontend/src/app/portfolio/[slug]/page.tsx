import { notFound } from "next/navigation";
import { portfolioProjects, getPortfolioProjectBySlug } from "@/data/portfolio";
import { ProjectDetailLayout } from "@/components/sections/detail-layouts";
import { pageMetadata } from "@/lib/metadata";
export const dynamicParams = false;
export const generateStaticParams = () =>
  portfolioProjects.map(({ slug }) => ({ slug }));
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const item = getPortfolioProjectBySlug((await params).slug);
  return item
    ? pageMetadata(
        item.title,
        item.summary,
        `/portfolio/${item.slug}`,
        item.image,
      )
    : {};
}
export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const item = getPortfolioProjectBySlug((await params).slug);
  if (!item) notFound();
  return (
    <ProjectDetailLayout
      item={item}
      basePath="/portfolio"
      related={portfolioProjects}
    />
  );
}
