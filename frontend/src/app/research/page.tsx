import { ResearchLandingPage } from "@/components/sections/ecosystem-pages";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  "AI Research & Innovation",
  "Explore PraedicoAI's research interests in generative AI, machine learning, retrieval systems, AI agents, and responsible automation.",
  "/research",
);

export default function ResearchPage() {
  return <ResearchLandingPage />;
}
