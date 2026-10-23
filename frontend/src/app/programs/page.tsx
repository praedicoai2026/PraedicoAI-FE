import { ProgramsLanding } from "@/components/sections/programs-landing";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  "AI Programs for Every Industry",
  "Explore sector-specific AI seminars, webinars, workshops, and training for technology, HR, sales, marketing, finance, education, operations, leadership, and data teams.",
  "/programs",
);

export default function ProgramsPage() {
  return <ProgramsLanding />;
}
