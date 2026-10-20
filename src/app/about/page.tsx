import { PageHero, ContentSections } from "@/components/sections/shared";
import { Section, SectionHeader, ButtonLink } from "@/components/ui/primitives";
import { principles } from "@/data/site";
import { pageMetadata } from "@/lib/metadata";
import { Linkedin } from "lucide-react";
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
                "PraedicoAI Services Private Limited is an AI-focused technology company working at the intersection of applied AI, software engineering, and business workflows.",
                "The company focuses on helping organizations identify meaningful opportunities, validate the information and operating conditions they depend on, and shape a responsible path to an AI-enabled product or process.",
              ],
            },
            {
              title: "Our mission",
              paragraphs: [
                "Make useful AI more approachable and accountable: connect the technology to a real task, make its limits understandable, and leave people equipped to review the outcome.",
              ],
            },
            {
              title: "Our approach",
              paragraphs: [
                "We begin with context, make constraints visible, and test assumptions early. A focused discovery, a small prototype, or a learning session can reveal what is valuable before a larger investment is considered.",
              ],
            },
            {
              title: "Technology and AI",
              paragraphs: [
                "Our areas of focus include generative AI, task-specific assistants, knowledge experiences, workflow automation, accessible interfaces, and application architecture. A technology becomes useful when it fits a real need and can be operated responsibly.",
              ],
            },
            {
              title: "Training and learning",
              paragraphs: [
                "Practical learning connects a concept to a decision. Learning topics include AI capabilities and limitations, safe use, evaluation, software architecture, and the human practices needed for adoption.",
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
      <Section className="section-lined">
        <SectionHeader
          eyebrow="Professional profile"
          title="Connect with Priyank Gupta."
          description="View the professional LinkedIn profile for background and career details."
        />
        <a
          className="text-link"
          href="https://www.linkedin.com/in/priyank-gupta-586764244/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Linkedin size={18} aria-hidden="true" />
          View LinkedIn profile
        </a>
      </Section>
      <Section className="section-tinted">
        <SectionHeader
          title="Principles for building useful AI"
          description="We make the intended task, evidence, limitations, and human responsibilities visible in the product and the delivery conversation."
        />
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
