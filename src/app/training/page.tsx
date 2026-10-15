import { courses, trainingTopics } from "@/data/courses";
import { learningAudiences } from "@/data/site";
import { faqs } from "@/data/faqs";
import { PageHero, ProcessSteps } from "@/components/sections/shared";
import {
  Section,
  SectionHeader,
  TechnologyTags,
  ButtonLink,
  FAQList,
} from "@/components/ui/primitives";
import { ContentCard } from "@/components/cards/content-card";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "Training",
  "Practical training and workshop concepts for students, professionals, teams, and technology leaders.",
  "/training",
);
export default function TrainingPage() {
  return (
    <>
      <PageHero
        title="Learn with context. Build with confidence."
        description="Practical technology conversations and guided learning for people at different stages of their journey. Start with a sample outline and shape it around your goals."
        eyebrow="Training & workshops"
        path="/training"
      />
      <Section>
        <SectionHeader title="A starting point for every learner" />
        <TechnologyTags tags={learningAudiences} />
        <div className="grid-three mt-8">
          {courses
            .filter((course) => course.featured)
            .map((course) => (
              <ContentCard
                key={course.slug}
                item={course}
                basePath="/training/courses"
              />
            ))}
        </div>
        <div className="button-row">
          <ButtonLink href="/training/courses" secondary>
            All course outlines
          </ButtonLink>
        </div>
      </Section>
      <Section className="section-tinted">
        <SectionHeader title="Topics we can explore" />
        <TechnologyTags tags={trainingTopics} />
        <div className="grid-three mt-9">
          {[
            [
              "Individual learning",
              "Focused mentoring and guided exercises shaped around a personal learning goal.",
            ],
            [
              "Workshops",
              "Collaborative, hands-on sessions that connect ideas to small practical examples.",
            ],
            [
              "Corporate enablement",
              "Shared foundations, architecture discussions, and audience-specific technical learning.",
            ],
          ].map(([title, description]) => (
            <article key={title} className="principle">
              <h3>{title}</h3>
              <p className="muted">{description}</p>
            </article>
          ))}
        </div>
      </Section>
      <Section>
        <SectionHeader
          title="Understand, apply, and reflect"
          description="Training starts by understanding the audience and ends with clear next steps for continued learning."
        />
        <ProcessSteps />
      </Section>
      <Section className="section-tinted">
        <div className="grid-two">
          <div>
            <SectionHeader
              title="Bring learning to your community"
              description="Online and in-person preferences can be discussed. No dates or locations are confirmed on this learning website."
            />
            <div className="button-row">
              <ButtonLink href="/training/workshops">Workshops</ButtonLink>
              <ButtonLink href="/training/corporate-training" secondary>
                Corporate training
              </ButtonLink>
            </div>
          </div>
          <FAQList items={[faqs[4], faqs[0]]} />
        </div>
        <div className="button-row">
          <ButtonLink href="/training/request-training">
            Request training
          </ButtonLink>
        </div>
      </Section>
    </>
  );
}
