import Link from "next/link";
import {
  ArrowRight,
  BookOpenCheck,
  BriefcaseBusiness,
  Code2,
  GraduationCap,
  Landmark,
  Megaphone,
  Network,
  Users,
} from "lucide-react";
import { sectors, sectorPrograms } from "@/data/sectors";
import { ProgramCatalog } from "@/components/sections/program-catalog";
import { PageHero } from "@/components/sections/shared";
import {
  ButtonLink,
  FAQList,
  Section,
  SectionHeader,
} from "@/components/ui/primitives";

const sectorIcons = [
  Code2,
  Users,
  BriefcaseBusiness,
  Megaphone,
  Landmark,
  GraduationCap,
  Network,
  BookOpenCheck,
  BriefcaseBusiness,
  BookOpenCheck,
];

export function ProgramsLanding() {
  const catalogItems = sectorPrograms.map(
    ({ href, status, availabilityStatus, sector, subject, formats }) => ({
      href,
      status,
      availabilityStatus,
      sector,
      subject,
      formats: formats.map(({ category, duration }) => ({
        category,
        duration,
      })),
    }),
  );

  return (
    <div className="programs-portal-page">
      <PageHero
        title="Bring AI Into the Way You Work"
        description="Practical AI learning programs designed for IT professionals, HR teams, sales and marketing professionals, educators, business leaders, and organizations preparing for the future of work."
        eyebrow="Programs by PraedicoAI"
        path="/programs"
      />
      <Section>
        <div className="programs-introduction">
          <SectionHeader
            eyebrow="Explore by sector"
            title="AI Programs for Every Industry"
            description="PraedicoAI helps individuals and organizations understand AI, improve professional workflows, build AI-enabled solutions, and adopt AI responsibly through seminars, webinars, workshops, and structured training."
          />
          <p className="muted">
            These are proposed curriculum outlines for review and refinement.
            Program availability, delivery, and scope are confirmed through an
            enquiry; no schedule or registration is implied.
          </p>
        </div>
        <div className="sector-card-grid">
          {sectors.map((sector, index) => {
            const Icon = sectorIcons[index] ?? BookOpenCheck;
            return (
              <article className="sector-card" key={sector.id}>
                <span className="sector-card-icon">
                  <Icon size={23} aria-hidden="true" />
                </span>
                <p className="eyebrow small">
                  {sector.subjects.length} subjects
                </p>
                <h2>
                  <Link href={`/programs/${sector.slug}`}>{sector.name}</Link>
                </h2>
                <p className="muted">{sector.description}</p>
                <p className="sector-card-audience">
                  <strong>Suitable for:</strong>{" "}
                  {sector.audience.slice(0, 2).join(", ")}
                </p>
                <Link className="text-link" href={`/programs/${sector.slug}`}>
                  Browse sector <ArrowRight size={15} aria-hidden="true" />
                </Link>
              </article>
            );
          })}
        </div>
      </Section>
      <Section className="section-tinted">
        <SectionHeader
          eyebrow="Featured programs"
          title="Start with practical, popular subjects"
          description="Open a featured subject to review its audience, outcomes, safeguards, and detailed syllabus."
          href="#all-programs"
          linkLabel="Search all programs"
        />
        <div className="program-card-grid">
          {[
            "ai-future-it-professionals",
            "ai-assisted-recruitment",
            "generative-ai-marketing",
          ].map((slug) => {
            const item = sectorPrograms.find(
              ({ subject }) => subject.slug === slug,
            );
            if (!item) return null;
            return (
              <article className="program-card" key={item.href}>
                <p className="eyebrow small">{item.sector.name}</p>
                <h3>
                  <Link href={item.href}>{item.subject.title}</Link>
                </h3>
                <p className="muted">{item.subject.summary}</p>
                <ul className="sector-subject-focus">
                  {item.subject.focusAreas.slice(0, 2).map((focus) => (
                    <li key={focus}>{focus}</li>
                  ))}
                </ul>
                <Link className="text-link" href={item.href}>
                  View syllabus <ArrowRight size={15} aria-hidden="true" />
                </Link>
              </article>
            );
          })}
        </div>
      </Section>
      <Section className="section-tinted" id="all-programs">
        <SectionHeader
          eyebrow="Find a specific subject"
          title="Search and filter the program catalog"
          description="Search by subject, skill, or sector. Combine filters for sector, format, duration, and audience."
        />
        <ProgramCatalog items={catalogItems} />
      </Section>
      <Section>
        <SectionHeader
          eyebrow="Seven formats"
          title="Choose a learning format"
          description="Each listed subject has its own syllabus at each of these formats and durations."
        />
        <div className="program-format-grid">
          {[
            [
              "Seminar",
              "2 Hours",
              "In-person awareness session with key concepts, a demonstration, and Q&A.",
            ],
            [
              "Webinar",
              "2 Hours",
              "Online session with screen-shared examples and interactive discussion.",
            ],
            [
              "Workshop",
              "1, 2, or 3 Days",
              "Guided practice building toward a subject-specific exercise or prototype.",
            ],
            [
              "Training",
              "7 or 15 Days",
              "Progressive daily learning with practice, review, and a capstone.",
            ],
          ].map(([title, duration, description]) => (
            <article className="program-format-card" key={title}>
              <BookOpenCheck size={22} aria-hidden="true" />
              <p className="eyebrow small">{duration}</p>
              <h3>{title}</h3>
              <p className="muted">{description}</p>
              <Link className="text-link" href="#all-programs">
                Explore subjects <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </article>
          ))}
        </div>
      </Section>
      <Section>
        <SectionHeader
          eyebrow="How it works"
          title="A learning path built around your goals"
          description="Start with a subject, choose a format to explore, then share your audience and goals so the scope can be discussed."
        />
        <div className="program-format-grid">
          {[
            [
              "01",
              "Choose a sector and subject",
              "Find a professional area and explore a subject-specific proposed syllabus.",
            ],
            [
              "02",
              "Compare the formats",
              "Review the same subject across a 2-hour session, workshops, or longer training.",
            ],
            [
              "03",
              "Discuss your needs",
              "Use the existing enquiry form to share your audience, goals, and delivery preference.",
            ],
            [
              "04",
              "Agree the scope",
              "Availability, schedule, tools, and final learning outcomes are confirmed through discussion.",
            ],
          ].map(([number, title, description]) => (
            <article className="program-format-card" key={number}>
              <span className="eyebrow">{number}</span>
              <h3>{title}</h3>
              <p className="muted">{description}</p>
            </article>
          ))}
        </div>
      </Section>
      <Section className="section-tinted">
        <SectionHeader
          eyebrow="Frequently asked questions"
          title="Before you enquire"
        />
        <FAQList
          items={[
            {
              question:
                "Are these programs currently scheduled or open for registration?",
              answer:
                "No. Catalog entries are proposed learning outlines, not published schedules or registration pages. Availability, timing, and scope are confirmed individually.",
            },
            {
              question:
                "Can the program be adapted for an organization or institution?",
              answer:
                "Yes. Use the existing training enquiry form to share the audience, learning goals, preferred format, and approximate group size.",
            },
            {
              question:
                "Do the programs promise certification, placements, or employment outcomes?",
              answer:
                "No certification, accreditation, placement, or employment outcome is promised. Any completion criteria must be agreed separately.",
            },
            {
              question:
                "Are AI decisions made automatically in sensitive areas?",
              answer:
                "No. The outlines emphasize human review, privacy, and appropriate safeguards, especially for hiring, financial, education, and customer-service contexts.",
            },
          ]}
        />
      </Section>
      <Section className="section-tinted">
        <div className="programs-enquiry">
          <div>
            <SectionHeader
              eyebrow="Teams and organizations"
              title="Discuss a customized program"
              description="Use the contact form to share the subject, audience, learning goals, and preferred format."
            />
          </div>
          <div className="button-row">
            <ButtonLink href="/contact?inquiryType=Programs%20and%20learning">
              Discuss a program
            </ButtonLink>
            <ButtonLink href="/contact" secondary>
              Contact PraedicoAI
            </ButtonLink>
          </div>
        </div>
      </Section>
    </div>
  );
}
