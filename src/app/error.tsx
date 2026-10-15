"use client";
import { Section, Button, ButtonLink } from "@/components/ui/primitives";
export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <Section>
      <div className="loading-content">
        <p className="eyebrow">Something interrupted this page</p>
        <h1>Let&apos;s try that again.</h1>
        <p className="muted mt-5">
          The page could not finish loading. Any unsent form details may need to
          be entered again.
        </p>
        <div className="button-row">
          <Button onClick={reset}>Try again</Button>
          <ButtonLink href="/" secondary>
            Go home
          </ButtonLink>
        </div>
      </div>
    </Section>
  );
}
