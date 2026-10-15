import { notFound } from "next/navigation";
import { caseStudies, getCaseStudyBySlug } from "@/data/caseStudies";
import { ProjectDetailLayout } from "@/components/sections/detail-layouts";
import { pageMetadata } from "@/lib/metadata";
export const dynamicParams = false;
export const generateStaticParams = () =>
  caseStudies.map(({ slug }) => ({ slug }));
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const item = getCaseStudyBySlug((await params).slug);
  return item
    ? pageMetadata(
        item.title,
        item.summary,
        `/case-studies/${item.slug}`,
        item.image,
      )
    : {};
}
export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const item = getCaseStudyBySlug((await params).slug);
  if (!item) notFound();
  return (
    <ProjectDetailLayout
      item={item}
      basePath="/case-studies"
      related={caseStudies}
      relatedServices={item.relatedServices}
    />
  );
}
