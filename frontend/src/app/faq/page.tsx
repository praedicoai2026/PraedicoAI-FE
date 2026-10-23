import { faqs } from "@/data/faqs";
import { PageHero } from "@/components/sections/shared";
import { Section, FAQList } from "@/components/ui/primitives";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "Frequently Asked Questions",
  "Answers about services, remote collaboration, learning, and email inquiries.",
  "/faq",
);
export default function FAQPage() {
  return (
    <>
      <PageHero
        title="A little clarity before we begin."
        description="Answers to common questions about collaboration, learning, and this demonstration website."
        eyebrow="Frequently asked questions"
        path="/faq"
      />
      <Section>
        <FAQList items={faqs} />
      </Section>
    </>
  );
}
