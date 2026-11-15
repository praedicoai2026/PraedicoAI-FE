import { InternshipInterestPage } from "@/components/sections/learning-audience-pages";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  "AI Internship Programs",
  "Explore proposed Generative AI, automation, agent development, Python and machine learning, AI application, and data analytics internship learning tracks.",
  "/internships",
);

export default function InternshipsPage() {
  return <InternshipInterestPage />;
}
