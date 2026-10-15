import Image from "next/image";
import { notFound } from "next/navigation";
import {
  experiences,
  education,
  certifications,
  speakingFormats,
} from "@/data/profile";
import { PageHero } from "@/components/sections/shared";
import {
  Section,
  Alert,
  ButtonLink,
  TechnologyTags,
  SectionHeader,
} from "@/components/ui/primitives";
import { pageMetadata } from "@/lib/metadata";
const pages = {
  experience: [
    "Professional experience",
    "A configurable career timeline. Roles, dates, and responsibilities await verification.",
  ],
  education: [
    "Education & learning",
    "Configurable education entries. These are placeholders, not verified qualifications.",
  ],
  certifications: [
    "Certifications",
    "A space for verified credentials and supporting evidence.",
  ],
  speaking: [
    "Ideas worth discussing",
    "Architecture, AI awareness, digital transformation, and practical learning in an accessible format.",
  ],
};
export const dynamicParams = false;
export const generateStaticParams = () =>
  Object.keys(pages).map((slug) => ({ slug }));
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  const item = pages[slug as keyof typeof pages];
  return item ? pageMetadata(item[0], item[1], `/about/${slug}`) : {};
}
export default async function AboutDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = pages[slug as keyof typeof pages];
  if (!item) notFound();
  return (
    <>
      <PageHero
        title={item[0]}
        description={item[1]}
        eyebrow={`About / ${slug}`}
        path={`/about/${slug}`}
      />
      <Section>
        {slug === "experience" && (
          <>
            <Alert>
              Listed organizations are configurable profile entries. Chronology,
              job titles, dates, and responsibilities have not been verified.
            </Alert>
            <ol className="timeline">
              {experiences.map((experience) => (
                <li key={experience.organization}>
                  <p className="eyebrow">{experience.dates}</p>
                  <h2>{experience.organization}</h2>
                  <p>{experience.role}</p>
                  <p className="muted text-sm">{experience.description}</p>
                </li>
              ))}
            </ol>
          </>
        )}
        {slug === "education" && (
          <div className="grid-two">
            {education.map((entry) => (
              <article className="info-card" key={entry.degree}>
                <p className="eyebrow">Unverified placeholder</p>
                <h2>{entry.degree}</h2>
                <p>{entry.institution}</p>
                <p>{entry.subject}</p>
                <p>
                  {entry.startDate} / {entry.completionDate}
                </p>
                <p>{entry.description}</p>
              </article>
            ))}
          </div>
        )}
        {slug === "certifications" && (
          <div className="grid-three">
            {certifications.map((certificate) => (
              <article className="info-card" key={certificate.name}>
                <Image
                  src={certificate.image}
                  alt="Certificate placeholder, not an awarded credential"
                  width={1200}
                  height={720}
                  sizes="(max-width: 700px) 100vw, 33vw"
                />
                <h2>{certificate.name}</h2>
                <p>{certificate.issuer}</p>
                <p>{certificate.date}</p>
                <p>{certificate.credentialId}</p>
                <TechnologyTags tags={certificate.skills} />
                <div className="mt-5">
                  {certificate.credentialLink ? (
                    <a className="text-link" href={certificate.credentialLink}>
                      View credential
                    </a>
                  ) : (
                    <button className="button button-secondary" disabled>
                      Credential link unavailable
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
        {slug === "speaking" && (
          <>
            <SectionHeader
              title="Conversations that connect ideas to practice"
              description="Invite a discussion shaped around the audience's context and the questions they want to explore. Dates and topics are agreed individually."
            />
            <div className="grid-three">
              {speakingFormats.map((format) => (
                <article className="solution-card" key={format}>
                  <h3>{format}</h3>
                  <p className="muted">
                    Architecture, AI awareness, web technology, and learning
                    perspectives adapted to your audience.
                  </p>
                </article>
              ))}
            </div>
            <div className="button-row">
              <ButtonLink href="/contact">Invite me to speak</ButtonLink>
              <ButtonLink href="/events" secondary>
                Sample events
              </ButtonLink>
            </div>
          </>
        )}
      </Section>
    </>
  );
}
