import Link from "next/link";
import { ArrowRight, BookOpen, Lightbulb, UsersRound } from "lucide-react";
import { productIdeas, type ProductIdea } from "@/data/products";
import { researchCategories, researchProjects } from "@/data/research";
import {
  Alert,
  Badge,
  ButtonLink,
  EmptyState,
  Section,
  SectionHeader,
} from "@/components/ui/primitives";
import { PageHero } from "@/components/sections/shared";

function ProductStatus({ status }: { status: ProductIdea["status"] }) {
  return <Badge>Product status: {status}</Badge>;
}

export function ProductsLandingPage() {
  const productGroups = [
    ...new Set(productIdeas.map(({ category }) => category)),
  ];

  return (
    <>
      <PageHero
        title="AI Products & Platforms"
        description="Explore product concepts we are evaluating across business assistants, workflow automation, and organizational intelligence."
        eyebrow="Products · concept stage"
        path="/products"
      />
      <Section className="section-tinted">
        <Alert>
          Every item in this directory is an idea only. These concepts are not
          available products, working prototypes, or live demos.
        </Alert>
        {productGroups.map((category) => (
          <div className="ecosystem-product-group" key={category}>
            <SectionHeader
              eyebrow="Product ideas"
              title={category}
              description="Possible directions for discovery—not a feature or availability commitment."
            />
            <div className="grid-three ecosystem-card-grid">
              {productIdeas
                .filter((product) => product.category === category)
                .map((product) => (
                  <article
                    className="service-card ecosystem-card"
                    key={product.slug}
                  >
                    <div className="ecosystem-card-topline">
                      <span className="service-icon" aria-hidden="true">
                        <Lightbulb size={20} />
                      </span>
                      <ProductStatus status={product.status} />
                    </div>
                    <p className="eyebrow small">{product.audience}</p>
                    <h3>
                      <Link href={`/products/${product.slug}`}>
                        {product.title}
                      </Link>
                    </h3>
                    <p className="muted">{product.summary}</p>
                    <Link
                      className="text-link"
                      href={`/products/${product.slug}`}
                    >
                      Explore concept{" "}
                      <ArrowRight size={15} aria-hidden="true" />
                    </Link>
                  </article>
                ))}
            </div>
          </div>
        ))}
      </Section>
      <Section>
        <SectionHeader
          eyebrow="Future pricing"
          title="No payment or subscription is enabled"
          description="Pricing models such as subscriptions, licenses, and enterprise agreements would only be published after a product is validated and offered."
        />
      </Section>
    </>
  );
}

export function ProductIdeaPage({ product }: { product: ProductIdea }) {
  const params = new URLSearchParams({
    interestArea: product.title,
    objectives: `Please discuss the problem, intended users, and requirements for a possible ${product.title} product concept.`,
  });

  return (
    <>
      <PageHero
        title={product.title}
        description={product.summary}
        eyebrow={`${product.category} · ${product.status}`}
        path={`/products/${product.slug}`}
        breadcrumbs={[
          { label: "AI Products", href: "/products" },
          { label: product.title },
        ]}
      />
      <Section className="section-tinted">
        <div className="grid-two">
          <div className="info-card ecosystem-detail-card">
            <ProductStatus status={product.status} />
            <h2>Concept, not an available product</h2>
            <p className="muted">
              This page describes an early idea for discussion. There is no
              production product, working demo, published price, or service
              commitment associated with it.
            </p>
            <p>
              <strong>Intended audience:</strong> {product.audience}
            </p>
          </div>
          <div className="info-card ecosystem-detail-card">
            <h2>Areas to validate</h2>
            <ul className="check-list">
              {product.capabilityIdeas.map((idea) => (
                <li key={idea}>
                  <Lightbulb size={16} aria-hidden="true" />
                  <span>{idea}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="button-row">
          <ButtonLink href={`/enquiry/product-interest?${params.toString()}`}>
            Register interest
          </ButtonLink>
          <ButtonLink href="/services" secondary>
            Explore current service areas
          </ButtonLink>
        </div>
      </Section>
    </>
  );
}

export function ResearchLandingPage() {
  return (
    <>
      <PageHero
        title="AI Research & Innovation"
        description="Explore the research areas PraedicoAI is interested in. Published experiments and project outcomes will be added only when they are ready to share."
        eyebrow="Research · transparency first"
        path="/research"
      />
      <Section className="section-tinted">
        <SectionHeader
          eyebrow="Research interests"
          title="Areas for exploration"
          description="These are areas of interest, not claims of completed research or published results."
        />
        <div className="grid-three ecosystem-card-grid">
          {researchCategories.map((category) => (
            <article className="service-card ecosystem-card" key={category}>
              <span className="service-icon" aria-hidden="true">
                <BookOpen size={20} />
              </span>
              <h3>{category}</h3>
              <p className="muted">
                Research questions and project status have not been published
                for this topic.
              </p>
            </article>
          ))}
        </div>
      </Section>
      <Section>
        <SectionHeader
          eyebrow="Projects and publications"
          title="No research projects published yet"
          description="We will list a project when its objective, status, contributors, and any public materials are verified."
        />
        {researchProjects.length ? (
          <div className="grid-three ecosystem-card-grid">
            {researchProjects.map((project) => (
              <article
                className="service-card ecosystem-card"
                key={project.slug}
              >
                <Badge>{project.status}</Badge>
                <h3>{project.title}</h3>
                <p className="muted">{project.summary}</p>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState
            title="Nothing published here yet"
            description="No research projects, results, or publications are currently listed."
          />
        )}
        <div className="button-row">
          <ButtonLink
            href="/enquiry/research-interest?topic=AI%20research%20collaboration&objectives=Discuss%20possible%20research%20questions%20and%20collaboration%20scope."
            secondary
          >
            Discuss a research collaboration
          </ButtonLink>
        </div>
      </Section>
    </>
  );
}

export function CommunityLandingPage() {
  return (
    <>
      <PageHero
        title="AI Community & Partnerships"
        description="Register interest in learning communities, project collaboration, and institutional partnerships. Activities and availability are confirmed individually."
        eyebrow="Community · early interest"
        path="/community"
      />
      <Section className="section-tinted">
        <SectionHeader
          eyebrow="Find a starting point"
          title="Connect through learning, events, or collaboration"
          description="Community activities are being shaped; this page does not imply an active membership program or scheduled event."
        />
        <div className="grid-three ecosystem-card-grid">
          <article className="service-card ecosystem-card">
            <span className="service-icon" aria-hidden="true">
              <UsersRound size={20} />
            </span>
            <h3>Register community interest</h3>
            <p className="muted">
              Tell us which AI topics, peer groups, or project conversations
              would be useful to you.
            </p>
            <Link className="text-link" href="/enquiry/community-membership">
              Join the interest list <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </article>
          <article className="service-card ecosystem-card">
            <span className="service-icon" aria-hidden="true">
              <BookOpen size={20} />
            </span>
            <h3>College partnerships</h3>
            <p className="muted">
              Discuss proposed student training, faculty development, or
              institutional internship programs.
            </p>
            <Link className="text-link" href="/learning/institutions">
              Explore institutional programs{" "}
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </article>
          <article className="service-card ecosystem-card">
            <span className="service-icon" aria-hidden="true">
              <Lightbulb size={20} />
            </span>
            <h3>Events and workshops</h3>
            <p className="muted">
              Browse event concepts and check each listing for confirmed dates
              and availability.
            </p>
            <Link className="text-link" href="/events">
              Explore event listings <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </article>
        </div>
        <div className="button-row">
          <ButtonLink href="/enquiry/college-partnerships" secondary>
            Discuss a partnership
          </ButtonLink>
        </div>
      </Section>
      <Section>
        <Alert>
          Community membership, event registrations, and project collaboration
          opportunities are not yet represented as active programs. Please
          register interest rather than sharing sensitive information.
        </Alert>
      </Section>
    </>
  );
}
