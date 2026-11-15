import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, GraduationCap } from "lucide-react";
import { leadCategories } from "@/data/lead-categories";
import { pageMetadata } from "@/lib/metadata";
import { PageHero } from "@/components/sections/shared";
import { Section, SectionHeader } from "@/components/ui/primitives";

type EnquiryPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const metadata: Metadata = pageMetadata(
  "Enquiries",
  "Choose the right PraedicoAI enquiry form for AI business solutions, training, internships, corporate learning, or college partnerships.",
  "/enquiry",
);

export default async function EnquiryPage({ searchParams }: EnquiryPageProps) {
  const query = await searchParams;
  const preservedParams = new URLSearchParams();
  for (const key of ["industry", "program", "problem", "solution", "goal"]) {
    const value = query[key];
    if (typeof value === "string" && value.length <= 300) {
      preservedParams.set(key, value);
    }
  }
  const queryString = preservedParams.toString();
  const business = leadCategories.filter(
    ({ vertical }) => vertical === "AI Business Solutions",
  );
  const learning = leadCategories.filter(
    ({ vertical }) => vertical === "AI Learning",
  );

  return (
    <>
      <PageHero
        title="How can we help?"
        description="Choose the enquiry type that best matches what you are exploring. Each form asks for details relevant to your request."
        eyebrow="Start a conversation"
        path="/enquiry"
      />
      <Section className="lead-category-section">
        <SectionHeader
          eyebrow="PraedicoAI"
          title="Two ways to move forward with AI"
          description="Share your goals and the right team can review your enquiry."
        />
        <div className="lead-category-groups">
          <section aria-labelledby="business-enquiry-heading">
            <h2 id="business-enquiry-heading">
              <BriefcaseBusiness aria-hidden="true" />
              AI solutions for business
            </h2>
            <div className="lead-category-grid">
              {business.map((item) => (
                <Link
                  className="lead-category-card"
                  href={`/enquiry/${item.slug}${queryString ? `?${queryString}` : ""}`}
                  key={item.slug}
                >
                  <span>{item.category}</span>
                  <p>{item.description}</p>
                  <strong>
                    Start an enquiry <ArrowRight size={16} aria-hidden="true" />
                  </strong>
                </Link>
              ))}
            </div>
          </section>
          <section aria-labelledby="learning-enquiry-heading">
            <h2 id="learning-enquiry-heading">
              <GraduationCap aria-hidden="true" />
              AI learning, training & careers
            </h2>
            <div className="lead-category-grid">
              {learning.map((item) => (
                <Link
                  className="lead-category-card"
                  href={`/enquiry/${item.slug}${queryString ? `?${queryString}` : ""}`}
                  key={item.slug}
                >
                  <span>{item.category}</span>
                  <p>{item.description}</p>
                  <strong>
                    Start an enquiry <ArrowRight size={16} aria-hidden="true" />
                  </strong>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </Section>
    </>
  );
}
