import { solutions } from "@/data/solutions";
import { PageHero } from "@/components/sections/shared";
import { SolutionCard } from "@/components/cards/content-card";
import { Section } from "@/components/ui/primitives";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "Solutions",
  "Explore practical AI, workflow, software, and learning starting points for startups, enterprise teams, operations, and education.",
  "/solutions",
);
export default function SolutionsPage() {
  return (
    <>
      <PageHero
        title="The right AI solution starts with your people and process."
        description="A startup testing a product idea, an operations team untangling handoffs, and an enterprise assessing AI readiness need different paths. Explore a starting point, then shape it around your context."
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
