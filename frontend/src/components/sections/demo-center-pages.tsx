import Link from "next/link";
import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { DemoCatalog } from "@/components/sections/demo-catalog";
import { DemoWorkbench } from "@/components/sections/demo-workbench";
import {
  type DemoCategory,
  type DemoDefinition,
  demoCategories,
} from "@/data/demos";
import { PageHero } from "@/components/sections/shared";
import {
  Alert,
  ButtonLink,
  EmptyState,
  Section,
  SectionHeader,
  TechnologyTags,
} from "@/components/ui/primitives";

export function DemoCenterLandingPage() {
  return (
    <>
      <PageHero
        title="Experience the Power of AI Before You Implement It."
        description="Explore interactive AI demonstrations, intelligent workflows, and practical applications developed to help teams examine real-world tasks."
        eyebrow="AI Demos · responsible previews"
        path="/demos"
      />
      <Section className="demo-center-introduction">
        <div className="demo-center-actions">
          <ButtonLink href="#all-demos">Explore All Demos</ButtonLink>
          <ButtonLink href="#solutions-demos" secondary>
            Browse by Industry
          </ButtonLink>
          <ButtonLink
            href="/enquiry/ai-business-solutions?sourcePath=%2Fdemos"
            secondary
          >
            Request Custom Demo
          </ButtonLink>
        </div>
        <Alert warning>
          <strong>Free Gemini demo data notice:</strong> use only fictional or
          non-sensitive examples. Google may review and use unpaid-tier inputs
          and outputs to improve its services. Demo access is limited to people
          aged 18 or older and is blocked in the EEA, UK, and Switzerland. See
          the <Link href="/privacy">privacy notice</Link> before using a demo.
        </Alert>
        <nav className="demo-category-nav" aria-label="Demo categories">
          {demoCategories.map((category) => (
            <a
              href={`#${category.toLowerCase().replaceAll(" ", "-")}-demos`}
              key={category}
            >
              {category}
            </a>
          ))}
        </nav>
      </Section>
      <Section className="section-tinted" id="all-demos">
        <SectionHeader
          eyebrow="Five dimensions"
          title="Choose a task to explore."
          description="Each preview is bounded to the text you enter. Demos do not connect to company systems or perform actions on your behalf."
        />
        <DemoCatalog />
      </Section>
      <Section>
        <SectionHeader
          eyebrow="Safety and transparency"
          title="Useful drafts, with people in control."
          description="AI responses can be inaccurate or incomplete. Verify outputs and use qualified review for important decisions."
        />
        <div className="grid-three ecosystem-card-grid">
          <article className="service-card ecosystem-card">
            <span className="service-icon" aria-hidden="true">
              <ShieldCheck size={20} />
            </span>
            <h3>Fictional examples only</h3>
            <p className="muted">
              Do not enter personal data, customer information, confidential
              business material, passwords, or secrets.
            </p>
          </article>
          <article className="service-card ecosystem-card">
            <span className="service-icon" aria-hidden="true">
              <Sparkles size={20} />
            </span>
            <h3>Human review is essential</h3>
            <p className="muted">
              Drafts are not verified facts, professional advice, or decisions.
              Review and adapt every output before use.
            </p>
          </article>
          <article className="service-card ecosystem-card">
            <span className="service-icon" aria-hidden="true">
              <ArrowRight size={20} />
            </span>
            <h3>Need a tailored discussion?</h3>
            <p className="muted">
              Ask about a possible demo using your requirements without sending
              confidential source data.
            </p>
            <Link
              className="text-link"
              href="/enquiry/ai-business-solutions?solution=Request%20a%20custom%20demo&sourcePath=%2Fdemos"
            >
              Request a custom demo <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </article>
        </div>
      </Section>
    </>
  );
}

export function DemoDetailPage({ demo }: { demo: DemoDefinition }) {
  const demoUrl = `/demos/${demo.slug}`;
  const enquiryParams = new URLSearchParams({
    solution: `Request a custom demo related to ${demo.title}.`,
    problem: `Please discuss a possible implementation related to ${demo.title}.`,
    sourcePath: demoUrl,
  });

  return (
    <>
      <PageHero
        title={demo.title}
        description={demo.summary}
        eyebrow={`${demo.category} · ${demo.industry} · demo preview`}
        path={demoUrl}
        breadcrumbs={[
          { label: "AI Demos", href: "/demos" },
          { label: demo.title },
        ]}
      />
      <Section className="section-tinted">
        <div className="grid-two">
          <article className="info-card ecosystem-detail-card">
            <h2>The problem</h2>
            <p>{demo.problem}</p>
          </article>
          <article className="info-card ecosystem-detail-card">
            <h2>How this preview works</h2>
            <p>{demo.approach}</p>
          </article>
        </div>
        <div className="demo-detail-highlights">
          <div className="info-card ecosystem-detail-card">
            <h2>What to explore</h2>
            <ul className="check-list">
              {demo.highlights.map((highlight) => (
                <li key={highlight}>
                  <ShieldCheck size={16} aria-hidden="true" />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="info-card ecosystem-detail-card">
            <h2>Demo details</h2>
            <dl className="demo-detail-list">
              <div>
                <dt>Industry or audience</dt>
                <dd>{demo.industry}</dd>
              </div>
              <div>
                <dt>Technology</dt>
                <dd>{demo.technology}</dd>
              </div>
              <div>
                <dt>Estimated usage time</dt>
                <dd>{demo.estimatedUsageTime}</dd>
              </div>
              <div>
                <dt>Connections</dt>
                <dd>No CRM, company systems, or external tools</dd>
              </div>
            </dl>
            <TechnologyTags
              tags={["Text-only input", "Human review", "No stored prompts"]}
            />
          </div>
        </div>
      </Section>
      <Section id="interactive-demo">
        <SectionHeader
          eyebrow="Interactive preview"
          title="Try a short, fictional example."
          description="Your text is sent to Google's Gemini API only when interactive access is enabled. No prompt or generated response is stored in PraedicoAI's database."
        />
        <DemoWorkbench demo={demo} />
      </Section>
      <Section className="section-tinted">
        <Alert warning>
          This preview can produce incorrect or incomplete output. It does not
          provide professional advice, make decisions, or validate facts. Review
          content before relying on or sharing it.
        </Alert>
        <div className="button-row">
          <ButtonLink
            href={`/enquiry/ai-business-solutions?${enquiryParams.toString()}`}
          >
            Request Custom Implementation
          </ButtonLink>
          <ButtonLink href="/demos" secondary>
            Explore all demos
          </ButtonLink>
        </div>
      </Section>
    </>
  );
}

export function EmptyDemoCategory({ category }: { category: DemoCategory }) {
  return (
    <EmptyState
      title={`No ${category.toLowerCase()} are available yet`}
      description="We will add a demo only after its functionality and status are verified."
    >
      {category === "AI Products" && (
        <ButtonLink href="/products" secondary>
          Explore product ideas
        </ButtonLink>
      )}
    </EmptyState>
  );
}
