import { services } from "@/data/services";
import { faqs } from "@/data/faqs";
import { PageHero, ProcessSteps } from "@/components/sections/shared";
import { ServiceCard } from "@/components/cards/content-card";
import {
  Section,
  SectionHeader,
  FAQList,
  TechnologyTags,
  BulletList,
} from "@/components/ui/primitives";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "Services",
  "Applied AI discovery, agent and knowledge-assistant design, workflow automation, custom software, and practical AI enablement.",
  "/services",
);
export default function ServicesPage() {
  return (
    <>
      <PageHero
        title="Turn a business challenge into a responsible AI plan."
        description="Explore applied AI, workflow improvement, and the software foundations that support them. Start with the task, validate the opportunity, and agree on a useful next step."
        eyebrow="Services"
        path="/services"
      />
      <Section>
        <SectionHeader
          eyebrow="Our focus"
          title="AI is a capability, not a strategy."
          description="The strongest starting point is a well-understood problem. We help teams connect business goals, people, information, and technology before committing to an implementation."
        />
        <TechnologyTags
          tags={[...new Set(services.map((service) => service.category))]}
        />
        <div className="grid-three mt-7">
          {services.map((service) => (
            <ServiceCard key={service.slug} service={service} />
          ))}
        </div>
      </Section>
      <Section className="section-tinted">
        <div className="grid-two">
          <div>
            <SectionHeader title="Questions we help teams answer" />
            <BulletList
              items={[
                "Which recurring task is costly, slow, or hard to scale?",
                "Would a rule, a better interface, or AI best address it?",
                "What data can the experience access, and under what controls?",
                "How will a person review uncertain or consequential output?",
                "What evidence would justify taking a pilot further?",
              ]}
            />
          </div>
          <div>
            <SectionHeader title="Technology and practice areas" />
            <TechnologyTags
              tags={[...new Set(services.flatMap((service) => service.tags))]}
            />
          </div>
        </div>
      </Section>
      <Section>
        <SectionHeader
          title="A collaborative engagement approach"
          description="A clear path from problem framing to evidence. Each stage can be scoped independently; no pilot or production outcome is implied until it is agreed."
        />
        <ProcessSteps />
      </Section>
      <Section className="section-tinted">
        <SectionHeader title="Services FAQ" />
        <FAQList items={faqs.slice(0, 3)} />
      </Section>
    </>
  );
}
