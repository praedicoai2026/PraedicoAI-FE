import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { principles, learningAudiences } from "@/data/site";
import { services } from "@/data/services";
import { solutions } from "@/data/solutions";
import { portfolioProjects } from "@/data/portfolio";
import { blogPosts } from "@/data/blogPosts";
import { courses } from "@/data/courses";
import { faqs } from "@/data/faqs";
import {
  Section,
  SectionHeader,
  ButtonLink,
  FAQList,
  BulletList,
  TechnologyTags,
} from "@/components/ui/primitives";
import { ExpertiseStrip, ProcessSteps } from "@/components/sections/shared";
import {
  ContentCard,
  SolutionCard,
} from "@/components/cards/content-card";
import { InteractiveHero } from "@/components/sections/interactive-hero";
import { ServiceExplorer } from "@/components/sections/service-explorer";

export default function Home() {
  return (
    <>
      <InteractiveHero />
      <ExpertiseStrip />
      <Section className="perspective-section">
        <div className="split-section">
          <div>
            <p className="eyebrow">A practical point of view</p>
            <h2>
              Connecting the big picture
              <br />
              with the details that matter.
            </h2>
          </div>
          <div>
            <p className="muted">
              PraedicoAI Services Private Limited connects business questions
              with practical technology decisions across software, AI,
              consulting, and learning.
            </p>
            <p className="muted">
              We connect AI, software engineering, and business process design.
              That means starting with the work people need to do, not starting
              with a model or a promise that automation will solve everything.
            </p>
            <Link className="text-link" href="/about">
              How we approach the work
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </Section>
      <Section className="expertise-section" id="expertise">
        <SectionHeader
          eyebrow="What we work on"
          title="Applied AI, grounded in real workflows."
          description="We help teams examine a real task, decide whether AI belongs in the solution, and shape a responsible path from discovery to a testable experience."
          href="/services"
          linkLabel="All services"
        />
        <ServiceExplorer
          services={services.map(
            ({ slug, title, summary, category, tags }) => ({
              slug,
              title,
              summary,
              category,
              tags,
            }),
          )}
        />
      </Section>
      <Section>
        <SectionHeader
          eyebrow="Built around your context"
          title="Different teams. Clearer next steps."
          href="/solutions"
          linkLabel="Explore solutions"
        />
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
      <Section className="section-tinted">
        <SectionHeader
          eyebrow="How we think"
          title="Good AI is designed around the whole system."
          description="A useful experience depends on more than a model: task definition, trusted information, permissions, interface, evaluation, and the people responsible for the result."
        />
        <div className="grid-three">
          {principles.map(([title, description]) => (
            <article className="principle" key={title}>
              <h3>{title}</h3>
              <p className="muted">{description}</p>
            </article>
          ))}
        </div>
      </Section>
      <Section>
        <SectionHeader
          eyebrow="The working approach"
          title="Evidence at every step, not just at launch."
        />
        <ProcessSteps />
      </Section>
      <Section className="section-tinted selected-work">
        <SectionHeader
          eyebrow="Selected concept work"
          title="Ideas made tangible."
          description="Demonstration projects and UI explorations. No client work or verified outcomes are claimed."
          href="/portfolio"
          linkLabel="View portfolio"
        />
        <div className="grid-three">
          {portfolioProjects
            .filter((project) => project.featured)
            .map((project) => (
              <ContentCard
                key={project.slug}
                item={project}
                basePath="/portfolio"
              />
            ))}
        </div>
      </Section>
      <Section>
        <div className="split-section">
          <div>
            <p className="eyebrow">AI, with intention</p>
            <h2>
              Explore what&apos;s possible.
              <br />
              Be clear about what&apos;s responsible.
            </h2>
            <p className="muted mt-5">
              Useful AI starts with a business question, a bounded task, and an
              understanding of where human judgment belongs. These are
              consulting concepts, not live AI services.
            </p>
            <div className="button-row">
              <ButtonLink href="/services/ai-agents">
                Explore AI consulting
              </ButtonLink>
            </div>
          </div>
          <div>
            <BulletList
              items={[
                "Define what the system may and may not do",
                "Decide which information it can use",
                "Show sources, uncertainty, and missing context",
                "Keep consequential actions with an accountable person",
                "Test failure cases as deliberately as expected answers",
              ]}
            />
            <Link className="text-link" href="/services/workflow-consulting">
              Explore workflow consulting
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </Section>
      <Section>
        <SectionHeader
          eyebrow="Where to begin"
          title="Choose a workflow, not an AI buzzword."
          description="A useful starting point is a repeatable task with a clear owner, a measurable pain point, and information the team is permitted to use."
          href="/services/ai-agents"
          linkLabel="Explore applied AI"
        />
        <div className="grid-three">
          {[
            {
              title: "Find the right information",
              description:
                "Explore knowledge experiences that help people locate relevant internal guidance and inspect the sources behind a response.",
            },
            {
              title: "Reduce repetitive preparation",
              description:
                "Consider AI-assisted classification, summarization, or drafting when a person can verify the result before it is used.",
            },
            {
              title: "Make handoffs easier to follow",
              description:
                "Map intake, routing, approvals, and exceptions so automation supports a process people can understand and control.",
            },
          ].map(({ title, description }) => (
            <article className="principle" key={title}>
              <h3>{title}</h3>
              <p className="muted">{description}</p>
            </article>
          ))}
        </div>
      </Section>
      <Section className="section-tinted">
        <SectionHeader
          eyebrow="Learn. Apply. Reflect."
          title="Give your team a shared AI vocabulary."
          href="/training"
          linkLabel="Explore training"
        />
        <TechnologyTags tags={learningAudiences} />
        <div className="grid-three mt-7">
          {courses.slice(0, 3).map((course) => (
            <ContentCard
              key={course.slug}
              item={course}
              basePath="/training/courses"
            />
          ))}
        </div>
      </Section>
      <Section>
        <SectionHeader
          eyebrow="Evidence before claims"
          title="Clear concepts. Honest proof."
        />
        <div className="split-section">
          <p className="muted">
            Our portfolio and case-study pages are illustrative concepts, not
            customer engagements. We publish real outcomes only when they are
            verified and approved for sharing.
          </p>
          <div className="button-row">
            <ButtonLink href="/portfolio" secondary>
              Explore concept work
            </ButtonLink>
            <ButtonLink href="/case-studies" secondary>
              Read illustrative scenarios
            </ButtonLink>
          </div>
        </div>
      </Section>
      <Section className="section-tinted">
        <SectionHeader
          eyebrow="The journal"
          title="Practical thinking for an AI-enabled world."
          description="Ideas on AI adoption, workflow design, evaluation, software foundations, and helping people work confidently with new tools."
          href="/blog"
          linkLabel="All articles"
        />
        <div className="grid-three">
          {blogPosts.slice(0, 3).map((post) => (
            <ContentCard key={post.slug} item={post} basePath="/blog" />
          ))}
        </div>
      </Section>
      <Section>
        <div className="split-section">
          <div>
            <p className="eyebrow">Before we begin</p>
            <h2>A few things you might be wondering.</h2>
          </div>
          <FAQList items={faqs.slice(0, 4)} />
        </div>
      </Section>
    </>
  );
}
