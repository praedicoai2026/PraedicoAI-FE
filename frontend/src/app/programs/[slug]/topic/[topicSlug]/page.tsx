import { notFound } from "next/navigation";
import { PageHero } from "@/components/sections/shared";
import { ProgramCatalog } from "@/components/sections/program-catalog";
import { sectors, sectorPrograms } from "@/data/sectors";
import { slugify } from "@/lib/formatting";
import { pageMetadata } from "@/lib/metadata";

export const dynamicParams = false;

const programTopics = sectors.flatMap((sector) =>
  [...new Set(sector.subjects.flatMap((subject) => subject.focusAreas))].map(
    (topic) => ({
      slug: sector.slug,
      topicSlug: slugify(topic),
    }),
  ),
);

export const generateStaticParams = () => programTopics;

async function getProgramTopic({
  slug,
  topicSlug,
}: {
  slug: string;
  topicSlug: string;
}) {
  const sector = sectors.find((item) => item.slug === slug);
  if (!sector) return null;
  const topic = [
    ...new Set(sector.subjects.flatMap((subject) => subject.focusAreas)),
  ].find((item) => slugify(item) === topicSlug);
  return topic ? { sector, topic } : null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; topicSlug: string }>;
}) {
  const resolved = await getProgramTopic(await params);
  return resolved
    ? pageMetadata(
        `${resolved.topic} Programs`,
        `Explore proposed ${resolved.topic} learning outlines in ${resolved.sector.name}.`,
        `/programs/${resolved.sector.slug}/topic/${slugify(resolved.topic)}`,
      )
    : {};
}

export default async function ProgramTopicPage({
  params,
}: {
  params: Promise<{ slug: string; topicSlug: string }>;
}) {
  const resolved = await getProgramTopic(await params);
  if (!resolved) notFound();

  const catalogItems = sectorPrograms
    .filter((item) => item.sector.slug === resolved.sector.slug)
    .map(({ href, status, availabilityStatus, sector, subject, formats }) => ({
      href,
      status,
      availabilityStatus,
      sector,
      subject,
      formats: formats.map(({ category, duration }) => ({
        category,
        duration,
      })),
    }));

  return (
    <>
      <PageHero
        title={resolved.topic}
        description={`Explore proposed ${resolved.topic} learning outlines for ${resolved.sector.name}.`}
        eyebrow={`${resolved.sector.name} learning topic`}
        path={`/programs/${resolved.sector.slug}/topic/${slugify(resolved.topic)}`}
        breadcrumbs={[
          { label: "Programs", href: "/programs" },
          {
            label: resolved.sector.name,
            href: `/programs/${resolved.sector.slug}`,
          },
          { label: "Topic" },
          { label: resolved.topic },
        ]}
      />
      <section className="section">
        <div className="container">
          <ProgramCatalog
            key={`${resolved.sector.slug}-${resolved.topic}`}
            items={catalogItems}
            initialSector={resolved.sector.slug}
            initialFocusArea={resolved.topic}
            showSectorFilter={false}
          />
        </div>
      </section>
    </>
  );
}
