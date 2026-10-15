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
  "Software, AI, workflow, digital growth, and training services with a practical architecture-first approach.",
  "/services",
);
export default function ServicesPage() {
  return (
    <>
      <PageHero
        title="Expertise that connects the dots."
        description="From software foundations to AI possibilities and practical learning. Start with the challenge, then choose the right approach."
        eyebrow="Services"
        path="/services"
      />
      <Section>
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
            <SectionHeader title="Common business challenges" />
            <BulletList
              items={[
                "Ideas need a clear technical direction",
                "Existing applications are difficult to maintain",
                "AI opportunities need practical boundaries",
                "Teams need a shared foundation for learning",
              ]}
            />
          </div>
          <div>
            <SectionHeader title="Technology areas" />
            <TechnologyTags
              tags={[...new Set(services.flatMap((service) => service.tags))]}
            />
          </div>
        </div>
      </Section>
      <Section>
        <SectionHeader title="A collaborative engagement approach" />
        <ProcessSteps />
      </Section>
      <Section className="section-tinted">
        <SectionHeader title="Services FAQ" />
        <FAQList items={faqs.slice(0, 3)} />
      </Section>
    </>
  );
}
