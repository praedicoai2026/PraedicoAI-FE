import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { processSteps, expertise, site } from "@/data/site";
import { Container, Badge, ButtonLink } from "@/components/ui/primitives";
import type { ContentSection } from "@/types/content";
import { slugify } from "@/lib/formatting";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

export function Breadcrumbs({
  path,
  title,
  items,
}: {
  path: string;
  title: string;
  items?: BreadcrumbItem[];
}) {
  if (items) {
    return (
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <ol>
          <li>
            <Link href="/">Home</Link>
          </li>
          {items.map((item, index) => (
            <li key={`${item.label}-${index}`}>
              <ChevronRight size={12} aria-hidden="true" />
              {item.href ? (
                <Link href={item.href}>{item.label}</Link>
              ) : (
                <span aria-current="page">{item.label}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    );
  }

  const segments = path.split("/").filter(Boolean);
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <ol>
        <li>
          <Link href="/">Home</Link>
        </li>
        {segments.map((segment, index) => (
          <li key={segment}>
            <ChevronRight size={12} aria-hidden="true" />
            {index === segments.length - 1 ? (
              <span aria-current="page">{title}</span>
            ) : ["category", "capability", "topic"].includes(segment) ? (
              <span>
                {segment === "category"
                  ? "Category"
                  : segment === "capability"
                    ? "Subcategory"
                    : "Topic"}
              </span>
            ) : (
              <Link href={`/${segments.slice(0, index + 1).join("/")}`}>
                {segment.replaceAll("-", " ")}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
export function PageHero({
  title,
  description,
  eyebrow,
  path,
  breadcrumbs,
  image,
  imageAlt = "Abstract technology composition",
}: {
  title: string;
  description: string;
  eyebrow: string;
  path: string;
  breadcrumbs?: BreadcrumbItem[];
  image?: string;
  imageAlt?: string;
}) {
  return (
    <section className={`page-hero ${image ? "has-image" : ""}`}>
      <Container>
        <Breadcrumbs path={path} title={title} items={breadcrumbs} />
        <div className="page-hero-content">
          <div>
            <p className="eyebrow">{eyebrow}</p>
            <h1>{title}</h1>
            <p className="lead">{description}</p>
          </div>
          {image && (
            <Image
              src={image}
              width={1200}
              height={720}
              alt={imageAlt}
              sizes="(max-width: 760px) 100vw, 40vw"
              priority
              className="hero-detail-image"
            />
          )}
        </div>
      </Container>
    </section>
  );
}
export function ExpertiseStrip() {
  return (
    <div className="expertise-strip">
      <Container>
        {expertise.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </Container>
    </div>
  );
}
export function ProcessSteps() {
  return (
    <ol className="process-grid">
      {processSteps.map(([title, description], index) => (
        <li key={title}>
          <span className="process-number">0{index + 1}</span>
          <h3>{title}</h3>
          <p className="muted text-sm">{description}</p>
        </li>
      ))}
    </ol>
  );
}
export function ContentSections({ sections }: { sections: ContentSection[] }) {
  return (
    <div className="prose-content">
      {sections.map((section) => (
        <section id={slugify(section.title)} key={section.title}>
          <h2>{section.title}</h2>
          {section.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          {section.bullets && (
            <ul>
              {section.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          )}
          {section.callout && (
            <aside className="alert">{section.callout}</aside>
          )}
          {section.code && (
            <pre>
              <code>{section.code}</code>
            </pre>
          )}
        </section>
      ))}
    </div>
  );
}
export function TableOfContents({ sections }: { sections: ContentSection[] }) {
  return (
    <nav className="table-of-contents" aria-label="On this page">
      <h2>On this page</h2>
      {sections.map((section) => (
        <a key={section.title} href={`#${slugify(section.title)}`}>
          {section.title}
        </a>
      ))}
    </nav>
  );
}
export function AuthorCard() {
  return (
    <aside className="author-card">
      <div className="author-monogram" aria-hidden="true">
        PAI
      </div>
      <div>
        <p className="eyebrow">Written by</p>
        <h2>{site.name}</h2>
        <p className="muted">
          {site.title}. Sharing practical perspectives on architecture, AI, and
          learning.
        </p>
        <Link className="text-link" href="/about">
          About the author
        </Link>
      </div>
    </aside>
  );
}
export function ContactAside() {
  return (
    <aside className="contact-aside">
      <Badge>Let&apos;s connect</Badge>
      <h2>A clear conversation is a good starting point.</h2>
      <p className="muted">
        Share your context, your audience, and what you would like to explore.
        Please leave out credentials and confidential information.
      </p>
      <p className="muted">
        Project scope, timing, and collaboration details are agreed
        individually.
      </p>
      {site.contactEmailConfigured && (
        <p className="text-sm break-anywhere">{site.contactEmail}</p>
      )}
      <ButtonLink href="/faq" secondary>
        Common questions
      </ButtonLink>
    </aside>
  );
}
