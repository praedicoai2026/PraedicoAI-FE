import { testimonials } from "@/data/profile";
import { PageHero } from "@/components/sections/shared";
import { Section, Alert, ButtonLink } from "@/components/ui/primitives";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "Customer Stories",
  "PraedicoAI publishes customer stories and feedback only when they are verified and approved for sharing.",
  "/testimonials",
);
export default function TestimonialsPage() {
  return (
    <>
      <PageHero
        title="Evidence matters more than praise."
        description="We will publish customer stories only when a real engagement, its context, and permission to share have been verified."
        eyebrow="Customer stories"
        path="/testimonials"
      />
      <Section>
        {testimonials.length ? (
          testimonials.map((testimonial) => (
            <article className="info-card" key={testimonial.id}>
              <blockquote>{testimonial.quote}</blockquote>
              <p>{testimonial.attribution}</p>
              <p className="muted text-sm">{testimonial.note}</p>
            </article>
          ))
        ) : (
          <div className="info-card">
            <Alert>
              There are no published customer testimonials yet. The portfolio
              currently contains illustrative concepts, not completed client
              engagements.
            </Alert>
            <h2>What a useful case study should show</h2>
            <p>
              The problem and constraints, the people involved, the solution
              choices, how the work was evaluated, and results that can be
              substantiated.
            </p>
            <div className="button-row">
              <ButtonLink href="/portfolio" secondary>
                Explore concept work
              </ButtonLink>
              <ButtonLink href="/contact">Discuss an opportunity</ButtonLink>
            </div>
          </div>
        )}
      </Section>
    </>
  );
}
