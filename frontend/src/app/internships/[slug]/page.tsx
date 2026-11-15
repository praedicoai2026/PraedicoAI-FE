import { notFound } from "next/navigation";
import { InternshipProgramDetailPage } from "@/components/sections/learning-audience-pages";
import {
  getInternshipProgram,
  internshipPrograms,
} from "@/data/internship-programs";
import { pageMetadata } from "@/lib/metadata";

export const dynamicParams = false;

export const generateStaticParams = () =>
  internshipPrograms.map(({ slug }) => ({ slug }));

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const program = getInternshipProgram((await params).slug);
  return program
    ? pageMetadata(
        program.title,
        program.summary,
        `/internships/${program.slug}`,
      )
    : {};
}

export default async function InternshipProgramPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const program = getInternshipProgram((await params).slug);
  if (!program) notFound();

  return <InternshipProgramDetailPage program={program} />;
}
