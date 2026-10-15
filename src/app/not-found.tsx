import { Section, ButtonLink } from "@/components/ui/primitives";
export default function NotFound() {
  return (
    <Section>
      <div className="loading-content">
        <p className="eyebrow">404 / Page not found</p>
        <h1>This path doesn&apos;t lead anywhere yet.</h1>
        <p className="muted mt-5">
          The page may have moved, or the address may be incomplete.
        </p>
        <div className="button-row">
          <ButtonLink href="/">Back to home</ButtonLink>
          <ButtonLink href="/services" secondary>
            Explore services
          </ButtonLink>
        </div>
      </div>
    </Section>
  );
}
