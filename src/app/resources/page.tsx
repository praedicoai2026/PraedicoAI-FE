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
        title="Useful starting points."
        description="A small library of prompts, templates, and learning resources. Available files are local samples; unfinished materials are clearly marked."
        eyebrow="Resource library"
        path="/resources"
      />
      <Section>
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
