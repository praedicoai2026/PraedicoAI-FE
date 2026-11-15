import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LeadEnquiryForm } from "@/components/forms/lead-enquiry-form";
import { PageHero } from "@/components/sections/shared";
import { Section } from "@/components/ui/primitives";
import { getLeadCategoryBySlug, leadCategories } from "@/data/lead-categories";
import { pageMetadata } from "@/lib/metadata";

type LeadEnquiryPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return leadCategories.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: LeadEnquiryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = getLeadCategoryBySlug(slug);
  if (!item) return {};
  return pageMetadata(
    `${item.category} Enquiry`,
    item.description,
    `/enquiry/${item.slug}`,
  );
}

export default async function LeadEnquiryPage({
  params,
}: LeadEnquiryPageProps) {
  const { slug } = await params;
  const item = getLeadCategoryBySlug(slug);
  if (!item) notFound();

  return (
    <>
      <PageHero
        title={item.category}
        description={item.description}
        eyebrow={`${item.vertical} enquiry`}
        path={`/enquiry/${item.slug}`}
      />
      <Section className="lead-enquiry-section">
        <LeadEnquiryForm category={item.category} formKind={item.formKind} />
      </Section>
    </>
  );
}
