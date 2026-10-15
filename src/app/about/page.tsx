import { PageHero, ContentSections } from "@/components/sections/shared";
import { Section, SectionHeader, ButtonLink } from "@/components/ui/primitives";
import { principles } from "@/data/site";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "About PraedicoAI Services",
  "Learn about PraedicoAI Services Private Limited and its approach to software, AI, architecture, and practical learning.",
  "/about",
);
export default function AboutPage() {
  return (
    <>
      <PageHero
        title="PraedicoAI Services Private Limited"
        description="Technology services connecting software, AI, architecture, consulting, and practical learning."
        eyebrow="About the company"
        path="/about"
      />
      <Section>
        <ContentSections
          sections={[
            {
              title: "Our company",
              paragraphs: [
                "PraedicoAI Services Private Limited focuses on solution architecture, software and web applications, technology consulting, and digital transformation.",
                "We explore how AI assistants, thoughtful workflows, and clear digital communication can support people in their work. This site brings those services together without making claims about unverified customer outcomes.",
              ],
            },
            {
              title: "Our mission",
              paragraphs: [
                "Help businesses, professionals, students, and teams transform ideas into maintainable digital experiences through architecture, software, AI, automation concepts, training, and consulting.",
              ],
            },
            {
              title: "Our approach",
              paragraphs: [
                "We begin with context, make constraints visible, and prefer clear boundaries, documented trade-offs, and small improvements that teams can understand and maintain.",
              ],
            },
            {
              title: "Technology and AI",
              paragraphs: [
                "Our areas of focus include frontend architecture, accessible interfaces, application modernization, knowledge assistants, human approval, and responsible AI use-case discovery. A tool becomes useful when it fits a real need.",
              ],
            },
            {
              title: "Training and learning",
              paragraphs: [
                "Practical learning connects a concept to a decision. We support students, professionals, and teams through focused examples, discussion, and reflection.",
              ],
            },
            {
              title: "Speaking and knowledge sharing",
              paragraphs: [
                "Webinars, workshops, architecture presentations, and technology discussions can make complex ideas more approachable. Topics and formats are available in the speaking section.",
              ],
            },
          ]}
        />
      </Section>
      <Section className="section-tinted">
        <SectionHeader title="Professional values" />
        <div className="grid-three">
          {principles.map(([title, description]) => (
            <article className="principle" key={title}>
              <h3>{title}</h3>
              <p className="muted">{description}</p>
            </article>
          ))}
        </div>
        <div className="button-row">
          <ButtonLink href="/contact">Start a conversation</ButtonLink>
        </div>
      </Section>
    </>
  );
}
