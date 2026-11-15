import { services, serviceCategories } from "@/data/services";
import { faqs } from "@/data/faqs";
import { PageHero, ProcessSteps } from "@/components/sections/shared";
import { IndustryPreview } from "@/components/sections/industry-pages";
import { ServiceCatalog } from "@/components/sections/service-catalog";
import {
  Section,
  SectionHeader,
  FAQList,
  TechnologyTags,
  BulletList,
} from "@/components/ui/primitives";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "AI Solutions and Services",
  "Explore AI consulting and strategy, generative AI, agents, workflow automation, chatbots, custom applications, analytics, integration, and adoption support.",
  "/services",
);
export default function ServicesPage() {
  return (
    <>
      <PageHero
        title="From AI strategy to practical implementation."
        description="Explore consulting, generative AI, agents, automation, chatbots, application development, analytics, and adoption support. Start with the work and shape the right next step."
        eyebrow="AI Solutions"
        path="/services"
      />
      <Section>
        <SectionHeader
          eyebrow="Services for business"
          title="Choose a capability. Begin with your context."
          description="These service areas are practical starting points, not off-the-shelf products. We connect business goals, people, information, and technology before defining a scope."
        />
        <ServiceCatalog services={services} categories={serviceCategories} />
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
      <IndustryPreview />
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
