import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { principles, learningAudiences } from "@/data/site";
import { services } from "@/data/services";
import { solutions } from "@/data/solutions";
import { portfolioProjects } from "@/data/portfolio";
import { blogPosts } from "@/data/blogPosts";
import { courses } from "@/data/courses";
import { testimonials } from "@/data/profile";
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
  TestimonialCard,
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
            <p className="eyebrow">A little perspective</p>
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
              Our approach combines maintainable software, thoughtful
              architecture, and practical learning. Good solutions should be
              useful today and understandable tomorrow.
            </p>
            <Link className="text-link" href="/about">
              More about my approach
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </Section>
      <Section className="expertise-section" id="expertise">
        <SectionHeader
          eyebrow="What I can help with"
          title="Big-picture thinking. Hands-on expertise."
          description="Technology, AI, digital growth, and learning. Connected by a practical, architecture-first approach."
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
          title="Different ambitions. A thoughtful approach."
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
          eyebrow="Why work together"
          title="Clarity is part of the deliverable."
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
          title="A shared understanding, at every step."
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
                "AI assistant and agent concepts",
                "Knowledge assistants with visible source context",
                "Workflow opportunities and process discovery",
                "Human approvals and clear escalation",
                "Responsible AI and business use-case exploration",
              ]}
            />
            <Link className="text-link" href="/services/workflow-consulting">
              Explore workflow consulting
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </Section>
      <Section className="section-tinted">
        <SectionHeader
          eyebrow="Learn. Apply. Reflect."
          title="Practical learning for the next step."
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
          eyebrow="Feedback, with transparency"
          title="A place for verified experiences."
        />
        {testimonials.map((testimonial) => (
          <TestimonialCard key={testimonial.id} testimonial={testimonial} />
        ))}
      </Section>
      <Section className="section-tinted">
        <SectionHeader
          eyebrow="The journal"
          title="Notes from a curious mind."
          description="Practical perspectives on building, learning, and making better technology decisions."
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
