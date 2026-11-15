import { notFound } from "next/navigation";
import { IndustryDetailContent } from "@/components/sections/industry-pages";
import {
  getIndustry,
  getIndustryPageName,
  industries,
} from "@/data/industries";
import { pageMetadata } from "@/lib/metadata";

export const dynamicParams = false;
export const generateStaticParams = () =>
  industries.map(({ slug }) => ({ slug }));

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const industry = getIndustry((await params).slug);
  return industry
    ? pageMetadata(
        `AI for ${getIndustryPageName(industry.slug)}`,
        industry.summary,
        `/industries/${industry.slug}`,
      )
    : {};
}

export default async function IndustryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const industry = getIndustry((await params).slug);
  if (!industry) notFound();
  return <IndustryDetailContent industry={industry} />;
}
