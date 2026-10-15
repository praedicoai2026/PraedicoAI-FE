import { notFound } from "next/navigation";
import { solutions, getSolutionBySlug } from "@/data/solutions";
import { services } from "@/data/services";
import {
  PageHero,
  ContentSections,
  ProcessSteps,
} from "@/components/sections/shared";
import { Section, SectionHeader, ButtonLink } from "@/components/ui/primitives";
import { ServiceCard } from "@/components/cards/content-card";
import { pageMetadata } from "@/lib/metadata";
export const dynamicParams = false;
export const generateStaticParams = () =>
  solutions.map(({ slug }) => ({ slug }));
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const item = getSolutionBySlug((await params).slug);
  return item
    ? pageMetadata(item.title, item.summary, `/solutions/${item.slug}`)
    : {};
}
export default async function SolutionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const solution = getSolutionBySlug((await params).slug);
  if (!solution) notFound();
  return (
    <>
      <PageHero
        title={`Solutions for ${solution.title.toLowerCase()}`}
        description={solution.summary}
        eyebrow="Your context"
        path={`/solutions/${solution.slug}`}
      />
      <Section>
        <ContentSections sections={solution.sections} />
        <div className="button-row">
          <ButtonLink href="/contact">Explore your next step</ButtonLink>
        </div>
      </Section>
      <Section className="section-tinted">
        <SectionHeader title="Relevant expertise" />
        <div className="grid-three">
          {services
            .filter((service) => solution.serviceSlugs.includes(service.slug))
            .map((service) => (
              <ServiceCard key={service.slug} service={service} />
            ))}
        </div>
      </Section>
      <Section>
        <SectionHeader title="How we could work together" />
        <ProcessSteps />
      </Section>
    </>
  );
}
