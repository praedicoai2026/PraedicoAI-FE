import { notFound } from "next/navigation";
import { LearningAudienceDetail } from "@/components/sections/learning-audience-pages";
import {
  getLearningAudience,
  learningAudiences,
} from "@/data/learning-audiences";
import { pageMetadata } from "@/lib/metadata";

export const dynamicParams = false;

export const generateStaticParams = () =>
  learningAudiences.map(({ slug }) => ({ slug }));

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const audience = getLearningAudience((await params).slug);
  return audience
    ? pageMetadata(
        audience.title,
        audience.description,
        `/learning/${audience.slug}`,
      )
    : {};
}

export default async function LearningAudiencePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const audience = getLearningAudience((await params).slug);
  if (!audience) notFound();

  return <LearningAudienceDetail audience={audience} />;
}
