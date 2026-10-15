import { notFound } from "next/navigation";
import { speakingFormats } from "@/data/profile";
import { PageHero } from "@/components/sections/shared";
import {
  Section,
  Alert,
  ButtonLink,
  TechnologyTags,
  SectionHeader,
  FAQList,
} from "@/components/ui/primitives";
import { processSteps, principles, learningAudiences } from "@/data/site";
import { faqs } from "@/data/faqs";
import { courses } from "@/data/courses";
import { ContentCard } from "@/components/cards/content-card";
import { pageMetadata } from "@/lib/metadata";
const pages = {
  experience: [
    "How we work",
    "A practical path from a business challenge to a well-bounded, evaluated AI or software solution.",
  ],
  education: [
    "Learning & enablement",
    "Practical AI literacy, technical learning, and team enablement shaped around real work.",
  ],
  certifications: [
    "Responsible AI",
    "Principles for considering data, risk, human oversight, evaluation, and appropriate use.",
  ],
  speaking: [
    "Ideas worth discussing",
    "AI adoption, software architecture, workflow design, and practical learning in an accessible format.",
  ],
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
  return item ? pageMetadata(item[0], item[1], `/about/${slug}`) : {};
}
export default async function AboutDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = pages[slug as keyof typeof pages];
  if (!item) notFound();
  return (
    <>
      <PageHero
        title={item[0]}
        description={item[1]}
        eyebrow={`PraedicoAI / ${slug}`}
        path={`/about/${slug}`}
      />
      <Section>
        {slug === "experience" && (
          <>
            <SectionHeader
              title="From the problem to the next decision"
              description="Each step creates clarity before the next commitment. The scope, pace, and deliverables are agreed with the team."
            />
            <ol className="process-grid">
              {processSteps.map(([title, description], index) => (
                <li key={title}>
                  <span className="process-number">0{index + 1}</span>
                  <h2>{title}</h2>
                  <p className="muted text-sm">{description}</p>
                </li>
              ))}
            </ol>
            <SectionHeader
              title="Principles that guide the work"
              description="The practical questions behind how we approach AI-enabled products and workflows."
            />
            <div className="grid-three">
              {principles.map(([title, description]) => (
                <article className="principle" key={title}>
                  <h3>{title}</h3>
                  <p className="muted">{description}</p>
                </article>
              ))}
            </div>
          </>
        )}
        {slug === "education" && (
          <>
            <SectionHeader
              title="Learning should change what a team can do"
              description="Sessions can help participants understand new concepts, practice review skills, and apply ideas to work they recognize. The content and level are agreed for each audience."
            />
            <TechnologyTags tags={learningAudiences} />
            <div className="grid-three mt-8">
              {courses
                .filter((course) => course.topic.toLowerCase().includes("ai"))
                .map((course) => (
                  <ContentCard
                    key={course.slug}
                    item={course}
                    basePath="/training/courses"
                  />
                ))}
            </div>
            <div className="button-row">
              <ButtonLink href="/training/request-training">
                Discuss a learning session
              </ButtonLink>
            </div>
          </>
        )}
        {slug === "certifications" && (
          <>
            <Alert>
              PraedicoAI does not currently publish certifications or
              compliance attestations on this page. No accreditation or
              certification claim is made.
            </Alert>
            <SectionHeader
              title="Responsible AI is a product requirement"
              description="Responsible design is not a badge. It is a set of decisions about data, access, reliability, human accountability, and what happens when a system is uncertain."
            />
            <div className="grid-three">
              {principles.slice(1, 6).map(([title, description]) => (
                <article className="principle" key={title}>
                  <h2>{title}</h2>
                  <p className="muted">{description}</p>
                </article>
              ))}
            </div>
            <div className="mt-8">
              <FAQList items={[faqs[8], faqs[9], faqs[10]]} />
            </div>
          </>
        )}
        {slug === "speaking" && (
          <>
            <SectionHeader
              title="Conversations that connect ideas to practice"
              description="Invite a discussion shaped around the audience's context and the questions they want to explore. Dates and topics are agreed individually."
            />
            <div className="grid-three">
              {speakingFormats.map((format) => (
                <article className="solution-card" key={format}>
                  <h3>{format}</h3>
                  <p className="muted">
                    Architecture, AI awareness, web technology, and learning
                    perspectives adapted to your audience.
                  </p>
                </article>
              ))}
            </div>
            <div className="button-row">
              <ButtonLink href="/contact">Discuss a speaking session</ButtonLink>
              <ButtonLink href="/events" secondary>
                Sample events
              </ButtonLink>
            </div>
          </>
        )}
      </Section>
    </>
  );
}
