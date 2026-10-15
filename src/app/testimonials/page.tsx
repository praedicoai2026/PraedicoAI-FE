import { testimonials } from "@/data/profile";
import { TestimonialCard } from "@/components/cards/content-card";
import { PageHero } from "@/components/sections/shared";
import { Section, Alert } from "@/components/ui/primitives";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "Sample Feedback",
  "A clearly marked placeholder for future verified feedback.",
  "/testimonials",
);
export default function TestimonialsPage() {
  return (
    <>
      <PageHero
        title="A place for real experiences."
        description="Verified feedback belongs here, with the author's permission. Until then, this page remains a transparent placeholder."
        eyebrow="Sample testimonials"
        path="/testimonials"
      />
      <Section>
        <Alert warning>
          No real customer feedback or endorsement is claimed.
        </Alert>
        {testimonials.map((testimonial) => (
          <TestimonialCard key={testimonial.id} testimonial={testimonial} />
        ))}
      </Section>
    </>
  );
}
