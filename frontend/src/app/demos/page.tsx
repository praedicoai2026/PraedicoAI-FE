import { DemoCenterLandingPage } from "@/components/sections/demo-center-pages";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  "AI Demo Center",
  "Explore responsible interactive AI previews for business workflows, learning, research, and community projects. Demo status and limitations are clearly identified.",
  "/demos",
);

export default function DemosPage() {
  return <DemoCenterLandingPage />;
}
