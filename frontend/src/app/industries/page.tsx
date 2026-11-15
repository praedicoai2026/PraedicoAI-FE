import { IndustriesLanding } from "@/components/sections/industry-pages";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  "AI Solutions by Industry",
  "Explore practical AI opportunities in human resources, sales, marketing, finance, retail, healthcare, education, manufacturing, logistics, and more.",
  "/industries",
);

export default function IndustriesPage() {
  return <IndustriesLanding />;
}
