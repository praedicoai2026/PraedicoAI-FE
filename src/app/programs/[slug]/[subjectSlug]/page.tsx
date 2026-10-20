import { notFound } from "next/navigation";
import { SectorSubjectContent } from "@/components/sections/program-sector-pages";
import { getSectorProgram, sectorPrograms } from "@/data/sectors";
import { pageMetadata } from "@/lib/metadata";

export const dynamicParams = false;

export const generateStaticParams = () =>
  sectorPrograms.map(({ sector, subject }) => ({
    slug: sector.slug,
    subjectSlug: subject.slug,
  }));

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; subjectSlug: string }>;
}) {
  const { slug, subjectSlug } = await params;
  const item = getSectorProgram(slug, subjectSlug);
  return item
    ? pageMetadata(item.subject.title, item.subject.summary, item.href)
    : {};
}

export default async function SectorSubjectPage({
  params,
}: {
  params: Promise<{ slug: string; subjectSlug: string }>;
}) {
  const { slug, subjectSlug } = await params;
  const item = getSectorProgram(slug, subjectSlug);
  if (!item) notFound();
  return <SectorSubjectContent item={item} />;
}
