import Image from "next/image";
import { Download } from "lucide-react";
import { resources } from "@/data/resources";
import { PageHero } from "@/components/sections/shared";
import { Section, Badge } from "@/components/ui/primitives";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "Resources",
  "Local sample guides, checklists, architecture templates, and learning materials.",
  "/resources",
);
export default function ResourcesPage() {
  return (
    <>
      <PageHero
        title="Tools for asking better questions."
        description="Use these practical worksheets to frame AI opportunities, review workflows, record technical decisions, and plan evaluation. They are starting points for discussion, not compliance advice or a substitute for domain review."
        eyebrow="Resource library"
        path="/resources"
      />
      <Section>
        <p className="muted mb-7">
          Download a resource, adapt it to your context, and record assumptions
          separately from verified facts. Do not put confidential or personal
          information into these sample files.
        </p>
        <div className="grid-three">
          {resources.map((resource) => (
            <article className="info-card resource-card" key={resource.slug}>
              <Image
                src={resource.image}
                alt={resource.imageAlt}
                width={1200}
                height={720}
                sizes="(max-width: 600px) 100vw, (max-width: 950px) 50vw, 33vw"
              />
              <Badge>{resource.label}</Badge>
              <h2>{resource.title}</h2>
              <p>{resource.summary}</p>
              <p>
                {resource.type} / {resource.category}
              </p>
              <p>For {resource.audience}</p>
              {resource.download ? (
                <a
                  className="button button-secondary"
                  href={resource.download}
                  download
                >
                  <Download size={16} />
                  Download sample
                </a>
              ) : (
                <button className="button button-secondary" disabled>
                  Coming Soon
                </button>
              )}
            </article>
          ))}
        </div>
      </Section>
    </>
  );
}
