import Link from "next/link";
import { ArrowRight, ArrowUpRight, BriefcaseBusiness } from "lucide-react";
import {
  industries,
  getIndustryPageName,
  getIndustryServices,
  type Industry,
} from "@/data/industries";
import { PageHero } from "@/components/sections/shared";
import {
  ButtonLink,
  FAQList,
  Section,
  SectionHeader,
} from "@/components/ui/primitives";
import { getIndustryProfile } from "@/data/industry-profiles";

function industryInquiryHref(
  subject: string,
  message: string,
  industry?: string,
) {
  const params = new URLSearchParams({ solution: subject, problem: message });
  if (industry) params.set("industry", industry);
  return `/enquiry/ai-business-solutions?${params.toString()}`;
}

export function IndustriesLanding() {
  return (
    <>
      <PageHero
        title="Explore AI opportunities across your industry."
        description="Every organization has different workflows, information, and responsibilities. Start with possible use cases, then assess what fits your context."
        eyebrow="Industries"
        path="/industries"
      />
      <Section>
        <SectionHeader
          eyebrow="Where to begin"
          title="Start with the work, not the trend."
          description="These examples are conversation starters, not promises of automation or business outcomes. A useful next step depends on your people, systems, data, and operating constraints."
        />
        <div className="grid-three">
          {industries.map((industry) => (
            <article className="principle" key={industry.slug}>
              <span className="service-icon">
                <BriefcaseBusiness size={19} aria-hidden="true" />
              </span>
              <p className="eyebrow small">Industry</p>
              <h2>
                <Link href={`/industries/${industry.slug}`}>
                  {industry.name}
                </Link>
              </h2>
              <p className="muted">{industry.summary}</p>
              <Link className="text-link" href={`/industries/${industry.slug}`}>
                Explore possibilities
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </article>
          ))}
        </div>
      </Section>
      <Section className="section-tinted">
        <SectionHeader
          eyebrow="A practical next step"
          title="Not sure where AI fits?"
          description="Share a non-sensitive description of the task and the people it affects. We can discuss whether AI, software, a process change, or a combination deserves further exploration."
        />
        <ButtonLink
          href={industryInquiryHref(
            "Discuss an AI opportunity",
            "I would like to discuss whether AI, software, a process change, or a combination may fit a non-sensitive workflow in my organization.",
          )}
        >
          Discuss an AI opportunity
        </ButtonLink>
      </Section>
    </>
  );
}

export function IndustryPreview() {
  return (
    <Section className="section-tinted home-industry-preview">
      <SectionHeader
        eyebrow="Across industries"
        title="Start with the context your team knows best."
        description="Explore possible AI workflows in your sector. Each is a starting point for discovery—not a promise of results."
        href="/industries"
        linkLabel="Browse all industries"
      />
      <div className="grid-three">
        {industries.slice(0, 6).map((industry) => (
          <article className="principle" key={industry.slug}>
            <h3>
              <Link href={`/industries/${industry.slug}`}>{industry.name}</Link>
            </h3>
            <p className="muted">{industry.opportunities[0]}</p>
          </article>
        ))}
      </div>
    </Section>
  );
}

export function IndustryDetailContent({ industry }: { industry: Industry }) {
  const relatedServices = getIndustryServices(industry);
  const profile = getIndustryProfile(industry.slug);
  const industryLabel = getIndustryPageName(industry.slug) ?? industry.name;
  const enquiryHref = industryInquiryHref(
    `AI opportunity in ${industryLabel}`,
    `I am exploring an AI opportunity in ${industryLabel}. Please discuss possible workflows, relevant capabilities, and a suitable next step. I will not include confidential information.`,
    industry.name,
  );

  return (
    <>
      <PageHero
        title={`AI for ${industryLabel}`}
        description={industry.summary}
        eyebrow="Industry solutions"
        path={`/industries/${industry.slug}`}
        breadcrumbs={[
          { label: "Industries", href: "/industries" },
          { label: industry.name },
        ]}
      />
      <Section>
        <div className="industry-detail-overview">
          <div>
            <SectionHeader
              eyebrow="Industry overview"
              title={`Understand the work in ${industryLabel}.`}
              description={industry.summary}
            />
          </div>
          <aside className="industry-detail-note">
            <strong>Start with context</strong>
            <p>
              Every organization has different people, processes, systems, and
              responsibilities. The examples on this page are possibilities to
              evaluate, not claims about deployed solutions or guaranteed
              results.
            </p>
          </aside>
        </div>
      </Section>
      <Section className="section-tinted industry-challenges-section">
        <SectionHeader
          eyebrow="Existing challenges"
          title="Where teams may feel the friction."
          description="These common challenges are starting points for discovery. The right priorities depend on your organization."
        />
        <div className="industry-detail-grid">
          {profile.challenges.map((challenge, index) => (
            <article className="industry-detail-card" key={challenge}>
              <span className="industry-detail-number">
                {String(index + 1).padStart(2, "0")}
              </span>
              <p>{challenge}</p>
            </article>
          ))}
        </div>
      </Section>
      <Section>
        <SectionHeader
          eyebrow="How AI may help"
          title="Use AI to support the work, not obscure it."
          description="Well-scoped AI can help people find, organize, and act on information. Its role and limits should be agreed before implementation."
        />
        <div className="industry-detail-grid">
          {profile.solutionApproaches.map((approach) => (
            <article className="industry-detail-card" key={approach}>
              <p>{approach}</p>
            </article>
          ))}
        </div>
      </Section>
      <Section className="section-tinted">
        <SectionHeader
          eyebrow="Relevant AI use cases"
          title={`Possibilities to explore in ${industryLabel}.`}
          description="Use cases are illustrative. Suitability depends on your workflow, information, systems, risk, and human review requirements."
        />
        <ul className="industry-use-case-grid">
          {profile.useCases.map((useCase) => (
            <li key={useCase}>{useCase}</li>
          ))}
        </ul>
      </Section>
      <Section>
        <SectionHeader
          eyebrow="Example automation workflows"
          title="Make the steps and checkpoints visible."
          description="These sample sequences show where AI might assist; they do not imply that a workflow is deployed or runs without human oversight."
        />
        <div className="industry-workflow-grid">
          {profile.workflows.map((workflow) => (
            <article className="industry-workflow-card" key={workflow.title}>
              <h3>{workflow.title}</h3>
              <ol>
                {workflow.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </article>
          ))}
        </div>
      </Section>
      <Section className="section-tinted">
        <SectionHeader
          eyebrow="AI tools and technologies"
          title="Choose technology after understanding the need."
          description="These are capability categories to consider, not a prescribed stack or a claim that any integration is already in place."
        />
        <ul className="industry-technology-grid">
          {profile.technologies.map((technology) => (
            <li key={technology}>{technology}</li>
          ))}
        </ul>
      </Section>
      <Section>
        <SectionHeader
          eyebrow="Expected business benefits"
          title="Define the outcomes worth evaluating."
          description="Potential value depends on baseline conditions, adoption, data quality, implementation, and ongoing review. No result is guaranteed."
        />
        <ul className="industry-benefit-list">
          {profile.potentialBenefits.map((benefit) => (
            <li key={benefit}>{benefit}</li>
          ))}
        </ul>
      </Section>
      <Section className="section-tinted">
        <div className="industry-prototype-card">
          <div>
            <p className="eyebrow">Example solution concept</p>
            <h2>{profile.prototype.title}</h2>
            <p className="muted">{profile.prototype.description}</p>
          </div>
          <span className="industry-prototype-status">
            Illustrative prototype concept
          </span>
        </div>
      </Section>
      <Section>
        <SectionHeader
          eyebrow="Implementation approach"
          title="Move forward in clear, reviewable steps."
          description="Each engagement is scoped individually. The sequence below is a discussion framework, not a promise of implementation or timeline."
        />
        <ol className="industry-implementation-steps">
          {[
            [
              "Discover",
              "Understand users, workflows, current tools, and the problem to address.",
            ],
            [
              "Analyze",
              "Assess data access, feasibility, risks, constraints, and non-AI alternatives.",
            ],
            [
              "Design",
              "Define a bounded solution, human checkpoints, and measurable evaluation criteria.",
            ],
            [
              "Prototype",
              "Test the experience with approved sample information and representative scenarios.",
            ],
            [
              "Evaluate and plan",
              "Review quality, exceptions, operational readiness, and next-step decisions before any rollout.",
            ],
          ].map(([step, description], index) => (
            <li key={step}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div>
                <h3>{step}</h3>
                <p>{description}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>
      {relatedServices.length > 0 && (
        <Section className="section-tinted">
          <SectionHeader
            eyebrow="Related capabilities"
            title={`Services to explore for ${industryLabel.toLowerCase()}.`}
            href="/services"
            linkLabel="All AI solutions"
          />
          <div className="grid-three">
            {relatedServices.map((service) => (
              <article className="principle" key={service.slug}>
                <p className="eyebrow small">{service.category}</p>
                <h3>
                  <Link href={`/services/${service.slug}`}>
                    {service.title}
                  </Link>
                </h3>
                <p className="muted">{service.summary}</p>
                <Link className="text-link" href={`/services/${service.slug}`}>
                  Explore service
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </article>
            ))}
          </div>
        </Section>
      )}
      <Section>
        <SectionHeader
          eyebrow="Frequently asked questions"
          title={`Questions about AI for ${industryLabel}.`}
        />
        <FAQList
          items={[
            {
              question: `Are these ${industryLabel} use cases already deployed for clients?`,
              answer:
                "No. The use cases and solution concept on this page are illustrative starting points. They do not represent deployed client solutions or verified business results.",
            },
            {
              question: "How do you choose tools and data for a solution?",
              answer:
                "Tool selection follows discovery of the workflow, authorized data, privacy and security needs, existing systems, evaluation criteria, and human responsibilities. Please do not send confidential or production information through this website.",
            },
            {
              question: "Will AI make decisions automatically?",
              answer:
                "That is not assumed. The appropriate role for AI depends on the use case and its risks. Consequential decisions and exceptions should remain with authorized, accountable people.",
            },
            {
              question:
                "How can we discuss an opportunity for our organization?",
              answer:
                "Use the enquiry link below to share a non-sensitive requirement, your organization, and contact details. Availability, scope, and next steps are discussed individually.",
            },
          ]}
        />
      </Section>
      <Section className="section-tinted">
        <SectionHeader
          eyebrow="Continue the conversation"
          title={`Discuss an AI opportunity in ${industryLabel}.`}
          description="The enquiry form requests your name, organization, email, phone, industry, requirement, and consent. Share only non-sensitive information."
        />
        <div className="button-row">
          <ButtonLink href={enquiryHref}>Start an industry enquiry</ButtonLink>
          <Link className="text-link" href="/industries">
            Browse other industries
            <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </Section>
    </>
  );
}
