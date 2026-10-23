import Link from "next/link";
import { site } from "@/data/site";
import { portfolioProjects } from "@/data/portfolio";
import { services } from "@/data/services";
import { resources } from "@/data/resources";
import {
  Section,
  SectionHeader,
  BulletList,
  TechnologyTags,
  FAQList,
  ButtonLink,
  Alert,
} from "@/components/ui/primitives";
import {
  PageHero,
  ContentSections,
  TableOfContents,
  ProcessSteps,
  AuthorCard,
} from "./shared";
import { ContentCard, ServiceCard } from "@/components/cards/content-card";
import type { CatalogItem, Service, Event, BlogPost } from "@/types/content";
import { calculateReadingTime, formatDate, slugify } from "@/lib/formatting";
import { getRelatedBlogPosts } from "@/data/blogPosts";

export function ServiceDetailLayout({ service }: { service: Service }) {
  const related = portfolioProjects
    .filter(
      (project) =>
        project.service === service.title ||
        project.tags.some((tag) => service.tags.includes(tag)),
    )
    .slice(0, 3);
  return (
    <>
      <PageHero
        title={service.title}
        description={service.summary}
        eyebrow={service.category}
        path={`/services/${service.slug}`}
        breadcrumbs={[
          { label: "Services", href: "/services" },
          {
            label: service.category,
            href: `/services/category/${slugify(service.category)}`,
          },
          { label: service.title },
        ]}
      />
      <Section>
        <div className="split-section">
          <div>
            <SectionHeader
              title="A practical starting point"
              eyebrow="Overview"
            />
            <p className="muted">
              {service.summary} The engagement starts by understanding your
              context and agreeing on a useful, realistic scope.
            </p>
            <div className="button-row">
              <ButtonLink href="/request-proposal">
                Discuss a project
              </ButtonLink>
              <ButtonLink href="/book-consultation" secondary>
                Request consultation
              </ButtonLink>
            </div>
          </div>
          <div>
            <h2>Common challenges</h2>
            <BulletList items={service.challenges} />
            <h3>Who this is for</h3>
            <TechnologyTags tags={service.audience} />
          </div>
        </div>
      </Section>
      <Section className="section-tinted">
        <div className="grid-two">
          <div>
            <SectionHeader title="Capabilities" />
            <BulletList items={service.capabilities} />
          </div>
          <div>
            <SectionHeader title="Possible deliverables" />
            <BulletList items={service.deliverables} />
            <Alert>
              These service areas describe potential project scope; this website
              itself does not run an AI agent or automated workflow. Data
              access, model selection, security, evaluation, and implementation
              boundaries must be agreed for each project.
            </Alert>
          </div>
        </div>
      </Section>
      <Section>
        <SectionHeader
          title="From context to clarity"
          eyebrow="Working approach"
        />
        <ProcessSteps />
        <div className="mt-8">
          <h3 className="mb-4">Related technology areas</h3>
          <TechnologyTags tags={service.tags} />
        </div>
      </Section>
      <Section className="section-tinted">
        <SectionHeader
          title="Related concept work"
          href="/portfolio"
          linkLabel="View portfolio"
        />
        <div className="grid-three">
          {(related.length ? related : portfolioProjects.slice(0, 2)).map(
            (project) => (
              <ContentCard
                key={project.slug}
                item={project}
                basePath="/portfolio"
              />
            ),
          )}
        </div>
      </Section>
      <Section>
        <SectionHeader title="A few useful answers" />
        <FAQList items={service.faqs} />
      </Section>
    </>
  );
}
export function ProjectDetailLayout({
  item,
  basePath,
  related,
  relatedServices = [],
}: {
  item: CatalogItem;
  basePath: string;
  related: CatalogItem[];
  relatedServices?: string[];
}) {
  return (
    <>
      <PageHero
        title={item.title}
        description={item.summary}
        eyebrow={item.label}
        path={`${basePath}/${item.slug}`}
        image={item.image}
        imageAlt={item.imageAlt}
      />
      <Section>
        <div className="detail-meta">
          <span>{item.category}</span>
          <TechnologyTags tags={item.tags} />
        </div>
        <div className="detail-layout">
          <ContentSections sections={item.sections} />
          <TableOfContents sections={item.sections} />
        </div>
      </Section>
      {relatedServices.length > 0 && (
        <Section className="section-tinted">
          <SectionHeader title="Related services" />
          <div className="grid-three">
            {services
              .filter((service) => relatedServices.includes(service.slug))
              .map((service) => (
                <ServiceCard key={service.slug} service={service} />
              ))}
          </div>
        </Section>
      )}
      <Section>
        <SectionHeader title="Continue exploring" href={basePath} />
        <div className="grid-three">
          {related
            .filter((candidate) => candidate.slug !== item.slug)
            .slice(0, 3)
            .map((candidate) => (
              <ContentCard
                key={candidate.slug}
                item={candidate}
                basePath={basePath}
              />
            ))}
        </div>
      </Section>
    </>
  );
}
export function EventDetailLayout({ event }: { event: Event }) {
  return (
    <>
      <PageHero
        title={event.title}
        description={event.summary}
        eyebrow={event.label}
        path={`/events/${event.slug}`}
        image={event.image}
        imageAlt={event.imageAlt}
      />
      <Section>
        <Alert warning>
          This is a sample {event.status.toLowerCase()} event entry, not a
          confirmed event. No registration or booking takes place here.
        </Alert>
        <dl className="facts">
          {[
            ["Date", event.date],
            ["Time", event.time],
            ["Time zone", event.timeZone],
            ["Format", event.mode],
            ["Organization", site.name],
            ["Event type", event.type],
          ].map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
        <ContentSections sections={event.sections} />
        <div className="grid-two mt-10">
          <div>
            <SectionHeader title="Proposed agenda" />
            <BulletList items={event.agenda} />
            <h3>Audience</h3>
            <TechnologyTags tags={event.audience} />
          </div>
          <div>
            <SectionHeader title="Learning outcomes" />
            <BulletList items={event.outcomes} />
            <ButtonLink href="/contact">Express interest</ButtonLink>
          </div>
        </div>
      </Section>
      <Section className="section-tinted">
        <SectionHeader title="Related resources" />
        <div className="button-row">
          {resources.slice(0, 3).map((resource) => (
            <Link className="text-link" href="/resources" key={resource.slug}>
              {resource.title}
            </Link>
          ))}
        </div>
        <Alert>No recording is available for this demonstration event.</Alert>
      </Section>
      <Section>
        <SectionHeader title="Event questions" />
        <FAQList items={event.faqs} />
      </Section>
    </>
  );
}
export function BlogDetailLayout({ post }: { post: BlogPost }) {
  const url = site.canonicalUrlConfigured
    ? encodeURIComponent(`${site.url}/blog/${post.slug}`)
    : null;
  return (
    <>
      <PageHero
        title={post.title}
        description={post.summary}
        eyebrow={`${post.label} · ${post.category}`}
        path={`/blog/${post.slug}`}
        breadcrumbs={[
          { label: "Blog", href: "/blog" },
          {
            label: post.category,
            href: `/blog/category/${slugify(post.category)}`,
          },
          { label: post.title },
        ]}
        image={post.image}
        imageAlt={post.imageAlt}
      />
      <Section>
        <div className="detail-meta">
          <span>By {post.author}</span>
          <span>Published {formatDate(post.published)}</span>
          <span>Updated {formatDate(post.updated)}</span>
          <span>{calculateReadingTime(post.sections)} min read</span>
          <TechnologyTags tags={post.tags} />
        </div>
        <div className="detail-layout">
          <div>
            <ContentSections sections={post.sections} />
            <AuthorCard />
            {url ? (
              <nav className="button-row" aria-label="Share article">
                <a
                  className="text-link"
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${url}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Share on LinkedIn
                </a>
                <a
                  className="text-link"
                  href={`https://twitter.com/intent/tweet?url=${url}&text=${encodeURIComponent(post.title)}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Share on X
                </a>
                <a
                  className="text-link"
                  href={`mailto:?subject=${encodeURIComponent(post.title)}&body=${url}`}
                >
                  Share by email
                </a>
              </nav>
            ) : (
              <p className="muted text-sm mt-3">
                Sharing links are unavailable until NEXT_PUBLIC_SITE_URL is
                configured.
              </p>
            )}
          </div>
          <TableOfContents sections={post.sections} />
        </div>
      </Section>
      <Section className="section-tinted">
        <SectionHeader title="More from the journal" href="/blog" />
        <div className="grid-three">
          {getRelatedBlogPosts(post).map((related) => (
            <ContentCard key={related.slug} item={related} basePath="/blog" />
          ))}
        </div>
      </Section>
    </>
  );
}
