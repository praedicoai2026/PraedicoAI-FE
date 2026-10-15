import { solutions } from "@/data/solutions";
import { PageHero } from "@/components/sections/shared";
import { SolutionCard } from "@/components/cards/content-card";
import { Section } from "@/components/ui/primitives";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "Solutions",
  "Explore technology and learning solutions for your audience and context.",
  "/solutions",
);
export default function SolutionsPage() {
  return (
    <>
      <PageHero
        title="Your context shapes the solution."
        description="Different organizations and people need different starting points. Explore the possibilities that fit your next step."
        eyebrow="Solutions by audience"
        path="/solutions"
      />
      <Section>
        <div className="grid-three">
          {solutions.map((solution, index) => (
            <SolutionCard
              key={solution.slug}
              solution={solution}
              index={index}
            />
          ))}
        </div>
      </Section>
    </>
  );
}
