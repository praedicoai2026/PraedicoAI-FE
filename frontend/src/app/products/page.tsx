import { ProductsLandingPage } from "@/components/sections/ecosystem-pages";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  "AI Products & Platforms",
  "Explore PraedicoAI's early product ideas for business assistants, workflow automation, and AI intelligence platforms.",
  "/products",
);

export default function ProductsPage() {
  return <ProductsLandingPage />;
}
