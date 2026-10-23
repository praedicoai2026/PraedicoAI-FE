import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";
import { getProgram, programs } from "@/data/programs";
import { getSector, sectors } from "@/data/sectors";
import { PageHero } from "@/components/sections/shared";
import { ProgramSyllabusAccordion } from "@/components/sections/program-syllabus-accordion";
import { SectorDetailContent } from "@/components/sections/program-sector-pages";
import {
  ButtonLink,
  FAQList,
  Section,
  SectionHeader,
} from "@/components/ui/primitives";
import { pageMetadata } from "@/lib/metadata";

export const dynamicParams = false;
export const generateStaticParams = () => [
  ...programs.map(({ slug }) => ({ slug })),
  ...sectors.map(({ slug }) => ({ slug })),
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  const program = getProgram(slug);
  const sector = getSector(slug);
  return program
    ? pageMetadata(
        program.title,
        program.description,
        `/programs/${program.slug}`,
      )
    : sector
      ? pageMetadata(
          sector.name,
          sector.description,
          `/programs/${sector.slug}`,
        )
      : {};
}

const programFaqs = [
  {
    question: "Are these programs scheduled or open for registration?",
    answer:
      "No. These are proposed learning outlines, not published schedules or registration pages. Audience, format, timing, and scope are discussed individually.",
  },
  {
    question: "Can the syllabus be adapted to a group?",
    answer:
      "The outline is a starting point. You can discuss learner experience, goals, delivery format, and relevant examples with the training team.",
  },
  {
    question: "Do these programs include a certificate or placement support?",
    answer:
      "No certification, accreditation, job placement, or employment outcome is promised. Any program arrangements and completion criteria must be agreed separately.",
  },
  {
    question: "What should I include in an enquiry?",
    answer:
      "Share the program, your audience, learning goals, approximate group size, and preferred format. Please do not include credentials or confidential information.",
  },
];

export default async function ProgramDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  const sector = getSector(slug);
  if (sector) return <SectorDetailContent sector={sector} />;

  const program = getProgram(slug);
  if (!program) notFound();

  const relatedPrograms = program.related
    .map((slug) => getProgram(slug))
    .filter((related) => related !== undefined);
  const durationLabels = program.formats.map(
    ({ category, duration }) => `${category} · ${duration}`,
  );
  const enquiryHref = `/contact?program=${program.slug}`;
  const formatEnquiryHref = (format: string) =>
    `${enquiryHref}&format=${format}`;

  return (
    <div className="program-detail-page">
      <PageHero
        title={program.title}
        description={program.description}
        eyebrow={program.category}
        path={`/programs/${program.slug}`}
      />
      <Section>
        <div className="program-overview-layout">
          <div>
            <SectionHeader
              eyebrow="Program overview"
              title="A practical starting point"
              description={program.summary}
            />
            <p className="muted">
              The syllabus offers a structured path from core concepts to
              subject-specific practice. The selected delivery format shapes the
              depth, activities, and expected deliverables.
            </p>
          </div>
          <div className="program-attendee-card">
            <div>
              <SectionHeader title="Who should attend" />
              <ul className="program-detail-list">
                {program.audience.map((item) => (
                  <li key={item}>
                    <Check size={16} aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <SectionHeader title="Prerequisites" />
              <ul className="program-detail-list">
                {program.prerequisites.map((item) => (
                  <li key={item}>
                    <Check size={16} aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Section>
      <Section className="section-tinted">
        <div className="program-outcomes-layout">
          <SectionHeader
            eyebrow="What you will learn"
            title="Build understanding you can apply"
            description="Learning outcomes are examples of what the selected program can address; the final scope depends on audience and format."
          />
          <ul className="program-outcome-list">
            {program.outcomes.map((outcome) => (
              <li key={outcome}>
                <Check size={18} aria-hidden="true" />
                <span>{outcome}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="program-available-formats">
          <h3>Formats and duration outlines</h3>
          <ul>
            {durationLabels.map((label) => (
              <li key={label}>{label}</li>
            ))}
          </ul>
          <p className="program-curriculum-note">
            Availability status: proposed; confirm delivery and schedule through
            an enquiry.
          </p>
        </div>
      </Section>
      <Section id="program-syllabus">
        <SectionHeader
          eyebrow="Complete syllabus"
          title="Explore the curriculum by format"
          description="Open a program format, then a duration, to review its modules, topics, activities, and deliverables. Sections open independently."
        />
        <ProgramSyllabusAccordion formats={program.formats} />
        <p className="program-curriculum-note">
          This curriculum is proposed content for PraedicoAI&apos;s review and
          refinement. Program details are confirmed through an enquiry.
        </p>
      </Section>
      <Section className="section-tinted">
        <div className="grid-two">
          <div className="program-info-block">
            <SectionHeader
              eyebrow="Tools and technologies"
              title="What the program may cover"
            />
            <ul className="program-info-list">
              {program.tools.map((tool) => (
                <li key={tool}>{tool}</li>
              ))}
            </ul>
          </div>
          <div className="program-info-block">
            <SectionHeader eyebrow="Practice" title="Activities and projects" />
            <ul className="program-info-list">
              {program.practicalActivities.map((activity) => (
                <li key={activity}>{activity}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="program-assessment">
          <SectionHeader
            eyebrow="Review and reflection"
            title="Assessment and completion"
            description="Assessment is learning-focused; the specific activities depend on the agreed delivery format."
          />
          <ul className="program-info-list">
            {program.assessment.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </Section>
      <Section>
        <SectionHeader eyebrow="Common questions" title="Before you enquire" />
        <FAQList items={programFaqs} />
      </Section>
      <Section className="section-tinted">
        <div className="program-enquiry">
          <div>
            <SectionHeader
              eyebrow="Enquiries"
              title="Discuss this program"
              description="Choose a program format to open the contact form with this subject and format outlined. Add your audience and goals before sending the enquiry."
            />
          </div>
          <div className="button-row">
            <ButtonLink href={enquiryHref}>
              Enquire about this program
            </ButtonLink>
            <ButtonLink href={formatEnquiryHref("seminar")} secondary>
              Request a Seminar
            </ButtonLink>
            <ButtonLink href={formatEnquiryHref("webinar")} secondary>
              Request a Webinar
            </ButtonLink>
            <ButtonLink href={formatEnquiryHref("workshop")} secondary>
              Request a Workshop
            </ButtonLink>
            <ButtonLink href={formatEnquiryHref("training")} secondary>
              Request a 7- or 15-day program
            </ButtonLink>
            <ButtonLink href={formatEnquiryHref("corporate")} secondary>
              Discuss a customized group program
            </ButtonLink>
            <ButtonLink href="/contact" secondary>
              Contact PraedicoAI
            </ButtonLink>
          </div>
        </div>
      </Section>
      <Section>
        <SectionHeader
          eyebrow="Continue exploring"
          title="Related programs"
          href="/programs"
          linkLabel="All programs"
        />
        <div className="related-program-grid">
          {relatedPrograms.map((related) => (
            <article className="related-program-card" key={related.slug}>
              <p className="eyebrow small">{related.category}</p>
              <h3>
                <Link href={`/programs/${related.slug}`}>{related.title}</Link>
              </h3>
              <p className="muted">{related.summary}</p>
              <Link className="text-link" href={`/programs/${related.slug}`}>
                View syllabus <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </article>
          ))}
        </div>
      </Section>
    </div>
  );
}
