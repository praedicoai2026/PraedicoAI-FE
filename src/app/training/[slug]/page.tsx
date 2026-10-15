import { notFound } from "next/navigation";
import { courses, trainingTopics } from "@/data/courses";
import { PageHero, ProcessSteps } from "@/components/sections/shared";
import {
  Section,
  SectionHeader,
  BulletList,
  TechnologyTags,
  ButtonLink,
} from "@/components/ui/primitives";
import { ContentCard } from "@/components/cards/content-card";
import { pageMetadata } from "@/lib/metadata";
const pages = {
  workshops: {
    title: "Make room for practical learning.",
    description:
      "Focused workshops for students, communities, and professional groups.",
    bullets: [
      "School and college technology awareness",
      "Frontend development exercises",
      "AI and workflow concept discovery",
      "Discussion, practice, and reflection",
    ],
  },
  "corporate-training": {
    title: "A shared foundation for your team.",
    description:
      "Training concepts aligned with team context, technical vocabulary, and practical goals.",
    bullets: [
      "Audience and skill-level discovery",
      "Customized architecture and frontend topics",
      "AI awareness with responsible-use discussion",
      "Guided exercises and learning resources",
    ],
  },
};
export const dynamicParams = false;
export const generateStaticParams = () =>
  Object.keys(pages).map((slug) => ({ slug }));
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  const item = pages[slug as keyof typeof pages];
  return item
    ? pageMetadata(item.title, item.description, `/training/${slug}`)
    : {};
}
export default async function TrainingFormatPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = pages[slug as keyof typeof pages];
  if (!page) notFound();
  return (
    <>
      <PageHero
        title={page.title}
        description={page.description}
        eyebrow="Training formats"
        path={`/training/${slug}`}
      />
      <Section>
        <div className="grid-two">
          <div>
            <SectionHeader title="Shape the session around your audience" />
            <BulletList items={page.bullets} />
            <ButtonLink href="/training/request-training">
              Request training
            </ButtonLink>
          </div>
          <div>
            <SectionHeader title="Possible topics" />
            <TechnologyTags tags={trainingTopics} />
            <p className="muted mt-5">
              Timing, language, delivery mode, materials, and scope are
              discussed individually. The website does not accept registrations
              or confirm sessions.
            </p>
          </div>
        </div>
      </Section>
      <Section className="section-tinted">
        <SectionHeader title="Learning approach" />
        <ProcessSteps />
      </Section>
      <Section>
        <SectionHeader
          title="Example starting points"
          href="/training/courses"
        />
        <div className="grid-three">
          {courses.slice(0, 3).map((course) => (
            <ContentCard
              key={course.slug}
              item={course}
              basePath="/training/courses"
            />
          ))}
        </div>
      </Section>
    </>
  );
}
