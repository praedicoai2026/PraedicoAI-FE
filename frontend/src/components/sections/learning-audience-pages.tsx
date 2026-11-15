import Link from "next/link";
import { ArrowRight, BookOpenCheck } from "lucide-react";
import {
  learningAudiences,
  type LearningAudience,
} from "@/data/learning-audiences";
import { learningIndustryPaths } from "@/data/learning-industry-paths";
import {
  internshipPrograms,
  type InternshipProgram,
} from "@/data/internship-programs";
import { programs } from "@/data/programs";
import { getSector, sectorPrograms } from "@/data/sectors";
import { PageHero } from "@/components/sections/shared";
import {
  Alert,
  ButtonLink,
  Section,
  SectionHeader,
} from "@/components/ui/primitives";

function contactHref(audience: LearningAudience) {
  const formSlug =
    audience.slug === "students"
      ? "student-ai-training"
      : audience.slug === "organizations"
        ? "corporate-training"
        : audience.slug === "institutions"
          ? "college-partnerships"
          : "professional-ai-training";
  const params = new URLSearchParams();
  if (audience.slug === "institutions") {
    params.set("goal", audience.inquiryMessage);
  } else if (audience.slug === "organizations") {
    params.set("problem", audience.inquiryMessage);
    params.set("solution", "AI skills training for organizational teams");
  } else {
    params.set("objectives", audience.inquiryMessage);
  }
  return `/enquiry/${formSlug}?${params.toString()}`;
}

export function LearningAudienceDetail({
  audience,
}: {
  audience: LearningAudience;
}) {
  const featuredPrograms = audience.programSlugs
    .map((slug) => {
      const sectorProgram = sectorPrograms.find(
        (item) => item.subject.slug === slug,
      );
      if (sectorProgram) {
        return {
          href: sectorProgram.href,
          category: sectorProgram.sector.name,
          title: sectorProgram.subject.title,
          summary: sectorProgram.subject.summary,
        };
      }

      const program = programs.find((item) => item.slug === slug);
      return program
        ? {
            href: `/programs/${program.slug}`,
            category: program.category,
            title: program.title,
            summary: program.description,
          }
        : undefined;
    })
    .filter((item) => item !== undefined);
  const industryPaths = ["industry-programs", "professionals"].includes(
    audience.slug,
  )
    ? learningIndustryPaths
    : [];
  const isIndividualAudience = ["students", "professionals"].includes(
    audience.slug,
  );
  const enquiryHref = contactHref(audience);

  return (
    <div className="programs-portal-page">
      <PageHero
        title={audience.title}
        description={audience.description}
        eyebrow={audience.eyebrow}
        path={`/learning/${audience.slug}`}
        breadcrumbs={[
          { label: "AI Learning", href: "/programs" },
          { label: audience.title },
        ]}
      />
      <Section>
        <SectionHeader
          eyebrow="Learning focus"
          title="Practical topics, shaped around your goals"
          description="Learning scope, delivery format, and examples can be discussed based on the audience and experience level."
        />
        <ul className="check-list">
          {audience.learningGoals.map((goal) => (
            <li key={goal}>
              <BookOpenCheck size={17} aria-hidden="true" />
              <span>{goal}</span>
            </li>
          ))}
        </ul>
      </Section>
      {featuredPrograms.length > 0 && (
        <Section className="section-tinted">
          <SectionHeader
            eyebrow="Explore the catalog"
            title="Relevant subjects to consider"
            description="These proposed outlines are starting points; availability, format, and final scope are confirmed through an enquiry."
            href="/programs"
            linkLabel="Browse all AI learning"
          />
          <div className="program-card-grid">
            {featuredPrograms.map((item) => (
              <article className="program-card" key={item.href}>
                <p className="eyebrow small">{item.category}</p>
                <h3>
                  <Link href={item.href}>{item.title}</Link>
                </h3>
                <p className="muted">{item.summary}</p>
                <Link className="text-link" href={item.href}>
                  Explore subject <ArrowRight size={15} aria-hidden="true" />
                </Link>
              </article>
            ))}
          </div>
        </Section>
      )}
      {industryPaths.length > 0 && (
        <Section className="section-tinted">
          <SectionHeader
            eyebrow="Choose your profession"
            title={
              audience.slug === "professionals"
                ? "Choose an AI learning path for your role"
                : "Practical AI learning for the work you already do"
            }
            description="Each pathway focuses on practical tools and role-relevant workflows—not a requirement to become an AI developer. Select a path to explore its proposed curriculum."
          />
          <div className="program-card-grid">
            {industryPaths.map((path) => {
              const sector = getSector(path.sectorSlug);
              if (!sector) return null;
              return (
                <article className="program-card" key={path.sectorSlug}>
                  <p className="eyebrow small">{sector.name}</p>
                  <h3>{path.title}</h3>
                  <p className="muted">{path.description}</p>
                  <Link
                    className="text-link"
                    href={`/programs/${sector.slug}`}
                  >
                    Explore learning path{" "}
                    <ArrowRight size={15} aria-hidden="true" />
                  </Link>
                </article>
              );
            })}
          </div>
        </Section>
      )}
      {audience.slug === "students" && (
        <Section>
          <div className="programs-enquiry">
            <div>
              <SectionHeader
                eyebrow="Project practice"
                title="Learn by building and reviewing"
                description="Program outlines include guided assignments and project work matched to the selected subject and format. Project scope and assessment details are agreed before enrollment."
              />
            </div>
            <ButtonLink href="/internships">Explore Internship Programs</ButtonLink>
          </div>
        </Section>
      )}
      <Section className="section-tinted">
        <SectionHeader
          eyebrow="Next step"
          title={
            isIndividualAudience
              ? "Start an enrollment enquiry"
              : audience.slug === "industry-programs"
                ? "Request an industry-specific program"
                : audience.slug === "organizations"
                  ? "Request corporate training"
                  : audience.slug === "institutions"
                    ? "Partner with PraedicoAI"
                    : "Discuss a learning path"
          }
          description="This opens the enquiry form with your learning request. Program availability, dates, fees, delivery, and any completion terms are confirmed through discussion; submitting an enquiry does not confirm enrollment."
        />
        <ButtonLink
          href={enquiryHref}
        >
          {audience.primaryAction}
        </ButtonLink>
      </Section>
    </div>
  );
}

export function InternshipInterestPage() {
  return (
    <div className="programs-portal-page">
      <PageHero
        title="AI Internship Programs"
        description="Explore proposed internship learning tracks in generative AI, automation, agents, Python and machine learning, AI applications, and data analytics."
        eyebrow="AI internships"
        path="/internships"
        breadcrumbs={[
          { label: "AI Learning", href: "/programs" },
          { label: "Internships" },
        ]}
      />
      <Section>
        <SectionHeader
          eyebrow="Choose an internship track"
          title="Practice a focused AI skill set"
          description="Each track has its own proposed overview, learning objectives, modules, assignments, project examples, and eligibility notes."
        />
        <div className="program-card-grid">
          {internshipPrograms.map((program) => (
            <article className="program-card" key={program.slug}>
              <p className="eyebrow small">Proposed learning track</p>
              <h2>
                <Link href={`/internships/${program.slug}`}>
                  {program.title}
                </Link>
              </h2>
              <p className="muted">{program.summary}</p>
              <Link
                className="text-link"
                href={`/internships/${program.slug}`}
              >
                View track details <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </article>
          ))}
        </div>
      </Section>
      <Section className="section-tinted">
        <Alert>
          These outlines do not indicate that a cohort or position is currently
          open. Availability, duration, delivery, eligibility, fees,
          supervision, and any completion terms must be confirmed before
          applying. An enquiry does not confirm an internship, certificate,
          placement, or employment outcome.
        </Alert>
      </Section>
    </div>
  );
}

export function InternshipProgramDetailPage({
  program,
}: {
  program: InternshipProgram;
}) {
  const enquiryParams = new URLSearchParams({
    program: program.title,
    objectives: `I am interested in the ${program.title} learning track. Please confirm current availability, eligibility, duration, delivery, fees, and any applicable completion or support details.`,
  });
  const enquiryHref = `/enquiry/ai-internships?${enquiryParams.toString()}`;

  return (
    <div className="program-detail-page">
      <PageHero
        title={program.title}
        description={program.summary}
        eyebrow="AI Internship Programs"
        path={`/internships/${program.slug}`}
        breadcrumbs={[
          { label: "AI Learning", href: "/programs" },
          { label: "Internships", href: "/internships" },
          { label: program.title },
        ]}
      />
      <Section>
        <div className="program-overview-layout">
          <div>
            <SectionHeader
              eyebrow="Program overview"
              title="A practical, proposed learning track"
              description={program.overview}
            />
            <Alert>
              Applying opens an enquiry form; it is not confirmation of an
              available internship, selection, or placement.
            </Alert>
          </div>
          <div className="program-attendee-card">
            <div>
              <SectionHeader title="Target audience" />
              <ul className="program-info-list">
                {program.targetAudience.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <SectionHeader title="Eligibility to discuss" />
              <ul className="program-info-list">
                {program.eligibility.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Section>
      <Section className="section-tinted">
        <SectionHeader
          eyebrow="Learning objectives"
          title="Skills this track is designed to explore"
        />
        <ul className="program-outcome-list">
          {program.objectives.map((objective) => (
            <li key={objective}>
              <BookOpenCheck size={17} aria-hidden="true" />
              <span>{objective}</span>
            </li>
          ))}
        </ul>
      </Section>
      <Section>
        <SectionHeader
          eyebrow="Proposed curriculum"
          title="Modules, assignments, and practice"
          description="Topics and assignments are starting points; final scope and supervision are confirmed for any available cohort."
        />
        <div className="program-card-grid">
          {program.modules.map((module, index) => (
            <article className="program-card" key={module.title}>
              <p className="eyebrow small">Module {index + 1}</p>
              <h3>{module.title}</h3>
              <ul className="program-info-list">
                {module.topics.map((topic) => (
                  <li key={topic}>{topic}</li>
                ))}
              </ul>
              <p className="muted">
                <strong>Practical assignment:</strong> {module.assignment}
              </p>
            </article>
          ))}
        </div>
      </Section>
      <Section className="section-tinted">
        <div className="grid-two">
          <div className="program-info-block">
            <SectionHeader
              eyebrow="Project examples"
              title="Possible practice projects"
              description="These are illustrative learning concepts, not claims about deployed client work."
            />
            <ul className="program-info-list">
              {program.projectIdeas.map((project) => (
                <li key={project}>{project}</li>
              ))}
            </ul>
          </div>
          <div className="program-info-block">
            <SectionHeader
              eyebrow="Program details"
              title="Confirm terms before applying"
            />
            <ul className="program-info-list">
              <li>
                <strong>Duration:</strong> Not published; confirm for any
                available cohort.
              </li>
              <li>
                <strong>Delivery mode:</strong> To be discussed; no mode or
                schedule is confirmed on this page.
              </li>
              <li>
                <strong>Fees:</strong> Enquiry-based; no fee is published.
              </li>
              <li>
                <strong>Certificate:</strong> Not specified; confirm any
                completion or certificate terms before enrolling.
              </li>
              <li>
                <strong>Support:</strong> No placement or job outcome is
                promised. Any supervision or career support must be explicitly
                confirmed for the relevant cohort.
              </li>
            </ul>
          </div>
        </div>
      </Section>
      <Section>
        <SectionHeader
          eyebrow="Application enquiry"
          title="Ask about this internship track"
          description="Share your studies, experience, and project interests in the enquiry form. Current openings and eligibility are confirmed individually."
        />
        <ButtonLink href={enquiryHref}>Apply for Internship</ButtonLink>
      </Section>
      <Section className="section-tinted">
        <SectionHeader
          eyebrow="More internship tracks"
          title="Explore another learning path"
          href="/internships"
          linkLabel="All internship programs"
        />
        <div className="related-program-grid">
          {internshipPrograms
            .filter((item) => item.slug !== program.slug)
            .slice(0, 3)
            .map((item) => (
              <article className="related-program-card" key={item.slug}>
                <h3>
                  <Link href={`/internships/${item.slug}`}>{item.title}</Link>
                </h3>
                <p className="muted">{item.summary}</p>
              </article>
            ))}
        </div>
      </Section>
    </div>
  );
}

export function LearningAudienceCards() {
  return (
    <div className="grid-two learning-audience-grid">
      {learningAudiences.map((audience) => (
        <article className="principle" key={audience.slug}>
          <p className="eyebrow small">{audience.eyebrow}</p>
          <h3>
            <Link href={`/learning/${audience.slug}`}>{audience.title}</Link>
          </h3>
          <p className="muted">{audience.description}</p>
          <Link className="text-link" href={`/learning/${audience.slug}`}>
            Explore learning options <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </article>
      ))}
    </div>
  );
}
