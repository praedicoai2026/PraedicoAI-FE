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
  "Practical AI literacy, responsible AI adoption, software architecture, and technology training for teams and learners.",
  "/training",
);
export default function TrainingPage() {
  return (
    <>
      <PageHero
        title="Help people work confidently with AI."
        description="Build practical understanding of AI capabilities, limitations, evaluation, and human review. Learning sessions can be shaped around your audience, current workflows, and real questions."
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
              "AI literacy",
              "Give non-technical teams a grounded understanding of generative AI, assistants, agents, risk, and when not to use AI.",
            ],
            [
              "Responsible adoption",
              "Use realistic scenarios to discuss data boundaries, output review, evaluation, human ownership, and escalation.",
            ],
            [
              "Technical enablement",
              "Explore architecture, AI integration patterns, software foundations, and the questions teams should resolve before building.",
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
              description="Sessions can be discussed around your audience, goals, and preferred format. Course outlines are examples, not scheduled or accredited programs."
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
