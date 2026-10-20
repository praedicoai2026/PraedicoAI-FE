import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import {
  sectors,
  sectorPrograms,
  type ProgramSector,
  type SectorProgram,
} from "@/data/sectors";
import { PageHero } from "@/components/sections/shared";
import { ProgramSyllabusAccordion } from "@/components/sections/program-syllabus-accordion";
import { ProgramCatalog } from "@/components/sections/program-catalog";
import { slugify } from "@/lib/formatting";
import {
  ButtonLink,
  FAQList,
  Section,
  SectionHeader,
} from "@/components/ui/primitives";

export function SectorDetailContent({ sector }: { sector: ProgramSector }) {
  const learningTopics = [
    ...new Set(sector.subjects.flatMap((subject) => subject.focusAreas)),
  ].sort();
  return (
    <div className="program-detail-page">
      <PageHero
        title={sector.name}
        description={sector.description}
        eyebrow="Programs by sector"
        path={`/programs/${sector.slug}`}
      />
      <Section>
        <div className="sector-introduction">
          <div>
            <SectionHeader
              eyebrow="Sector overview"
              title="Practical learning for your work"
              description={`Explore ${sector.name.toLowerCase()} topics through proposed, role-aware learning outlines. Each subject includes seven formats, from a two-hour session through a fifteen-day training.`}
            />
          </div>
          <div className="program-attendee-card">
            <div>
              <SectionHeader title="Designed for" />
              <ul className="program-detail-list">
                {sector.audience.map((item) => (
                  <li key={item}>
                    <Check size={16} aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <SectionHeader title="Common challenges" />
              <ul className="program-detail-list">
                {sector.challenges.map((item) => (
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
        <SectionHeader
          eyebrow="Practical applications"
          title="Where AI can support the work"
          description="Use cases are discussion starting points. Suitability depends on approved tools, data, and human review."
        />
        <ul className="sector-use-case-list">
          {sector.useCases.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Section>
      <Section id="sector-subjects">
        <SectionHeader
          eyebrow="Choose a subject"
          title="Explore programs in this sector"
          description="Search this sector's subjects and filter by learning format, duration, or audience. Open a subject for its complete duration-specific syllabus."
        />
        <nav
          className="program-category-list"
          aria-label={`${sector.name} learning topics`}
        >
          {learningTopics.map((topic) => (
            <Link
              href={`/programs/${sector.slug}/topic/${slugify(topic)}`}
              className="program-category-chip"
              key={topic}
            >
              {topic}
            </Link>
          ))}
        </nav>
        <ProgramCatalog
          key={sector.slug}
          initialSector={sector.slug}
          showSectorFilter={false}
          items={sectorPrograms
            .filter((item) => item.sector.slug === sector.slug)
            .map(
              ({
                href,
                status,
                availabilityStatus,
                sector: itemSector,
                subject,
                formats,
              }) => ({
                href,
                status,
                availabilityStatus,
                sector: itemSector,
                subject,
                formats: formats.map(({ category, duration }) => ({
                  category,
                  duration,
                })),
              }),
            )}
        />
      </Section>
      <Section className="section-tinted">
        <SectionHeader
          eyebrow="Related sectors"
          title="Explore adjacent learning paths"
          description="AI workflows can span professional teams. Explore related sectors to compare subjects and approaches."
        />
        <nav className="program-category-list" aria-label="Related sectors">
          {sectors
            .filter(({ slug }) => slug !== sector.slug)
            .slice(0, 4)
            .map((related) => (
              <Link
                className="program-category-chip"
                href={`/programs/${related.slug}`}
                key={related.slug}
              >
                {related.name} <ArrowRight size={14} aria-hidden="true" />
              </Link>
            ))}
        </nav>
      </Section>
      <Section className="section-tinted">
        <div className="program-enquiry">
          <div>
            <SectionHeader
              eyebrow="Team and organization enquiries"
              title="Discuss a customized program"
              description="Share your audience, workflow, learning goals, and preferred format through the contact form."
            />
          </div>
          <ButtonLink href="/contact?inquiryType=Programs%20and%20learning">
            Discuss a program
          </ButtonLink>
        </div>
      </Section>
    </div>
  );
}

export function SectorSubjectContent({ item }: { item: SectorProgram }) {
  const { sector, subject, formats, existingProgram } = item;
  const program = existingProgram;
  const outcomes =
    program?.outcomes ??
    subject.focusAreas.map(
      (focus) =>
        `Apply and evaluate ${focus} in a relevant ${sector.name.toLowerCase()} workflow.`,
    );
  const audience = program?.audience ?? sector.audience;
  const prerequisites = program?.prerequisites ?? [
    "No specialist AI experience is required unless agreed for a specific delivery.",
    "Bring familiarity with a relevant professional, academic, or organizational workflow.",
  ];
  const title = subject.title;
  const summary = program?.summary ?? subject.summary;
  const description = program?.description ?? subject.summary;
  const tools = program?.tools ?? [
    "Approved or synthetic sample materials relevant to the subject",
    "Generative AI assistant or relevant approved sector tools",
    "A checklist for quality, privacy, and human review",
  ];
  const activities = program?.practicalActivities ?? [
    `Map a current workflow involving ${subject.focusAreas[0].toLowerCase()}.`,
    `Complete a guided exercise applying ${subject.focusAreas[1].toLowerCase()}.`,
    "Review an output against criteria for accuracy, privacy, and usefulness.",
  ];
  const enquiryHref = `/contact?program=${subject.slug}`;

  return (
    <div className="program-detail-page">
      <PageHero
        title={title}
        description={description}
        eyebrow={sector.name}
        path={item.href}
      />
      <Section>
        <div className="program-overview-layout">
          <div>
            <SectionHeader
              eyebrow="Program overview"
              title="A practical starting point"
              description={summary}
            />
            <p className="muted">
              This is a proposed curriculum for PraedicoAI review. Delivery
              goals and scope can be adapted to the audience and agreed format.
            </p>
          </div>
          <div className="program-attendee-card">
            <div>
              <SectionHeader title="Experience level" />
              <p className="muted">{subject.experienceLevel}</p>
            </div>
            <div>
              <SectionHeader title="Who should attend" />
              <ul className="program-detail-list">
                {audience.map((entry) => (
                  <li key={entry}>
                    <Check size={16} aria-hidden="true" />
                    <span>{entry}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <SectionHeader title="Prerequisites" />
              <ul className="program-detail-list">
                {prerequisites.map((entry) => (
                  <li key={entry}>
                    <Check size={16} aria-hidden="true" />
                    <span>{entry}</span>
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
            eyebrow="Learning outcomes"
            title="Build understanding you can apply"
            description="Learning outcomes are illustrative and depend on the agreed audience, tools, and delivery format."
          />
          <ul className="program-outcome-list">
            {outcomes.map((entry) => (
              <li key={entry}>
                <Check size={18} aria-hidden="true" />
                <span>{entry}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="program-available-formats">
          <h3>Formats and duration outlines</h3>
          <ul>
            {formats.map(({ category, duration, availabilityStatus }) => (
              <li key={`${category}-${duration}`}>
                {category} · {duration} —{" "}
                {availabilityStatus ?? item.availabilityStatus}
              </li>
            ))}
          </ul>
          <p className="program-curriculum-note">
            Confirm delivery and schedule through an enquiry.
          </p>
        </div>
      </Section>
      <Section id="program-syllabus">
        <SectionHeader
          eyebrow="Complete proposed syllabus"
          title="Explore the curriculum by format"
          description="Each format has a subject-specific outline. Open a format, then a duration, to review modules, topics, practical activities, and deliverables."
        />
        <ProgramSyllabusAccordion formats={formats} />
        <p className="program-curriculum-note">
          All catalog outlines are proposed for PraedicoAI review and
          refinement. Program details and availability are confirmed through an
          enquiry.
        </p>
      </Section>
      <Section className="section-tinted">
        <div className="grid-two">
          <div className="program-info-block">
            <SectionHeader
              eyebrow="Tools and resources"
              title="What the program may cover"
            />
            <ul className="program-info-list">
              {tools.map((entry) => (
                <li key={entry}>{entry}</li>
              ))}
            </ul>
          </div>
          <div className="program-info-block">
            <SectionHeader eyebrow="Practice" title="Activities and projects" />
            <ul className="program-info-list">
              {activities.map((entry) => (
                <li key={entry}>{entry}</li>
              ))}
            </ul>
          </div>
        </div>
        {subject.safeguards?.length ? (
          <aside className="program-safeguard">
            <strong>Important safeguard</strong>
            <p>{subject.safeguards.join(" ")}</p>
          </aside>
        ) : null}
      </Section>
      <Section>
        <SectionHeader
          eyebrow="Assessment approach"
          title="Practice, review, and reflect"
          description="Assessment is learning-focused and matched to the selected duration. Longer formats include practical work and a subject-specific capstone."
        />
        <ul className="sector-use-case-list">
          {[
            "Short knowledge checks and review of key concepts.",
            "Feedback on a guided activity, work product, or workflow prototype.",
            "For extended training, evaluation and presentation of a subject-specific project.",
          ].map((entry) => (
            <li key={entry}>{entry}</li>
          ))}
        </ul>
      </Section>
      <Section className="section-tinted">
        <SectionHeader eyebrow="Common questions" title="Before you enquire" />
        <FAQList
          items={[
            {
              question: "Are these dates and programs open for registration?",
              answer:
                "No. These are proposed syllabus outlines. Availability, delivery, timing, and scope are confirmed through an enquiry.",
            },
            {
              question: "Can this syllabus be adapted for our organization?",
              answer:
                "Yes. Share the audience, experience level, learning goals, and preferred format through the existing training enquiry form.",
            },
            {
              question: "Are all AI-generated results treated as correct?",
              answer:
                "No. The curriculum includes verification, limitations, and human review. Subject-specific safeguards are listed where relevant.",
            },
          ]}
        />
      </Section>
      <Section>
        <div className="program-enquiry">
          <div>
            <SectionHeader
              eyebrow="Enquiries"
              title="Discuss this program"
              description="Use the existing training enquiry form to share your audience, goals, and preferred format."
            />
          </div>
          <div className="button-row">
            <ButtonLink href={enquiryHref}>
              Enquire about this program
            </ButtonLink>
            <ButtonLink href={`${enquiryHref}&format=seminar`} secondary>
              Request a Seminar
            </ButtonLink>
            <ButtonLink href={`${enquiryHref}&format=webinar`} secondary>
              Request a Webinar
            </ButtonLink>
            <ButtonLink href={`${enquiryHref}&format=workshop`} secondary>
              Request a Workshop
            </ButtonLink>
            <ButtonLink href={`${enquiryHref}&format=training`} secondary>
              Request Training
            </ButtonLink>
            <ButtonLink href={`${enquiryHref}&format=corporate`} secondary>
              Request Corporate Training
            </ButtonLink>
            <ButtonLink href="/contact" secondary>
              Contact PraedicoAI
            </ButtonLink>
          </div>
        </div>
      </Section>
      <Section className="section-tinted">
        <SectionHeader
          eyebrow="Continue exploring"
          title={`More ${sector.name} subjects`}
          href={`/programs/${sector.slug}`}
          linkLabel="All sector subjects"
        />
        <div className="related-program-grid">
          {sector.subjects
            .filter((entry) => entry.slug !== subject.slug)
            .slice(0, 3)
            .map((entry) => (
              <article className="related-program-card" key={entry.slug}>
                <h3>
                  <Link href={`/programs/${sector.slug}/${entry.slug}`}>
                    {entry.title}
                  </Link>
                </h3>
                <p className="muted">{entry.summary}</p>
                <Link
                  className="text-link"
                  href={`/programs/${sector.slug}/${entry.slug}`}
                >
                  View syllabus <ArrowRight size={15} aria-hidden="true" />
                </Link>
              </article>
            ))}
        </div>
      </Section>
    </div>
  );
}
