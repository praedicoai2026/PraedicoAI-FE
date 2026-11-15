import { CommunityLandingPage } from "@/components/sections/ecosystem-pages";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  "AI Community & Institutional Partnerships",
  "Register interest in AI learning communities, events, project collaboration, and institutional partnerships with PraedicoAI.",
  "/community",
);

export default function CommunityPage() {
  return <CommunityLandingPage />;
}
