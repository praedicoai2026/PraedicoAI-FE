import { notFound } from "next/navigation";
import { legalPages, legalNote } from "@/data/legal";
import { PageHero, ContentSections } from "@/components/sections/shared";
import { Section, Alert } from "@/components/ui/primitives";
import { pageMetadata } from "@/lib/metadata";
export const dynamicParams = false;
export const generateStaticParams = () =>
  Object.keys(legalPages).map((document) => ({ document }));
export async function generateMetadata({
  params,
}: {
  params: Promise<{ document: string }>;
}) {
  const { document } = await params;
  const page = legalPages[document];
  return page ? pageMetadata(page.title, page.description, `/${document}`) : {};
}
export default async function LegalPage({
  params,
}: {
  params: Promise<{ document: string }>;
}) {
  const { document } = await params;
  const page = legalPages[document];
  if (!page) notFound();
  return (
    <>
      <PageHero
        title={page.title}
        description={page.description}
        eyebrow="PraedicoAI / Policy draft"
        path={`/${document}`}
      />
      <Section>
        <div className="measure">
          <Alert warning>{legalNote}</Alert>
          <ContentSections sections={page.sections} />
        </div>
      </Section>
    </>
  );
}
