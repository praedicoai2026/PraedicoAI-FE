import { ProgramsLanding } from "@/components/sections/programs-landing";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  "AI Learning for Students, Professionals, and Teams",
  "Explore practical AI learning for students, working professionals, organizations, and colleges, alongside proposed role-specific programs and training outlines.",
  "/programs",
);

export default function ProgramsPage() {
  return <ProgramsLanding />;
}
