import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  BookOpenCheck,
  BrainCircuit,
  BriefcaseBusiness,
  Building2,
  Code2,
  Factory,
  GraduationCap,
  HeartPulse,
  Lightbulb,
  Layers3,
  Megaphone,
  MessageSquareText,
  PlugZap,
  Scale,
  ShoppingBag,
  Sparkles,
  Truck,
  Users,
  UsersRound,
  Workflow,
} from "lucide-react";
import { industries } from "@/data/industries";
import { services } from "@/data/services";
import { ButtonLink, Section, SectionHeader } from "@/components/ui/primitives";

const industryIcons = {
  "human-resources": Users,
  sales: BriefcaseBusiness,
  marketing: Megaphone,
  "finance-accounting": BarChart3,
  "retail-ecommerce": ShoppingBag,
  healthcare: HeartPulse,
  "legal-compliance": Scale,
  education: GraduationCap,
  manufacturing: Factory,
  "logistics-supply-chain": Truck,
  "business-operations": Workflow,
} as const;

const industryTitles: Record<string, string> = {
  "human-resources": "HR",
  "finance-accounting": "Finance",
  "retail-ecommerce": "Retail",
  "legal-compliance": "Legal",
  "logistics-supply-chain": "Logistics",
  "business-operations": "Operations",
};

const homeIndustries = Object.entries(industryIcons).map(([slug, Icon]) => {
  const industry = industries.find((item) => item.slug === slug);
  if (!industry) {
    throw new Error(`Homepage industry is missing from the catalog: ${slug}`);
  }
  return {
    industry,
    Icon,
    title: industryTitles[slug] ?? industry.name,
  };
});

const serviceCardDefinitions = [
  {
    slug: "ai-consulting-strategy",
    title: "AI Consulting",
    Icon: Layers3,
  },
  { slug: "ai-agents", title: "AI Agents", Icon: BrainCircuit },
  {
    slug: "workflow-consulting",
    title: "Business Automation",
    Icon: Workflow,
  },
  {
    slug: "custom-ai-application-development",
    title: "Custom AI Development",
    Icon: Code2,
  },
  {
    slug: "ai-chatbots-virtual-assistants",
    title: "Chatbots & Virtual Assistants",
    Icon: MessageSquareText,
  },
  {
    slug: "data-analytics-predictive-intelligence",
    title: "Predictive Analytics",
    Icon: BarChart3,
  },
  {
    slug: "workflow-automation-integration",
    title: "AI Integration",
    Icon: PlugZap,
  },
];

const homeServices = serviceCardDefinitions.map(({ slug, title, Icon }) => {
  const service = services.find((item) => item.slug === slug);
  if (!service) {
    throw new Error(`Homepage service is missing from the catalog: ${slug}`);
  }
  return { ...service, displayTitle: title, Icon };
});

const learningPrograms = [
  {
    title: "AI Training for College Students",
    description:
      "Build AI literacy and explore practical skills, guided projects, and career-ready learning.",
    href: "/learning/students",
    label: "For students",
    Icon: GraduationCap,
  },
  {
    title: "AI Tools for Working Professionals",
    description:
      "Explore role-relevant AI tools and workflows with an emphasis on effective review and responsible use.",
    href: "/learning/professionals",
    label: "For professionals",
    Icon: BriefcaseBusiness,
  },
  {
    title: "Industry-Specific AI Programs",
    description:
      "Browse proposed subjects for professional sectors, teams, and workplace learning goals.",
    href: "/programs",
    label: "Browse programs",
    Icon: Building2,
  },
  {
    title: "AI Internship Programs",
    description:
      "Discuss practical AI learning and project experience; availability and eligibility are confirmed individually.",
    href: "/internships",
    label: "Explore internships",
    Icon: Sparkles,
  },
  {
    title: "Corporate AI Training",
    description:
      "Shape a team learning conversation around your people, approved tools, and organizational context.",
    href: "/learning/organizations",
    label: "For organizations",
    Icon: Users,
  },
];

const businessValueSteps = [
  "Discover",
  "Analyze",
  "Design",
  "Implement",
  "Optimize",
];
const learnerValueSteps = ["Learn", "Practice", "Build", "Apply", "Grow"];

const reasons = [
  {
    title: "Industry-oriented AI solutions",
    description:
      "Start from your sector, workflows, information boundaries, and people.",
    Icon: Building2,
  },
  {
    title: "Practical, hands-on learning",
    description:
      "Connect concepts with guided practice and exercises shaped to learners.",
    Icon: BookOpenCheck,
  },
  {
    title: "Real-world use cases",
    description:
      "Explore grounded examples drawn from familiar business and professional work.",
    Icon: BriefcaseBusiness,
  },
  {
    title: "Business-focused automation",
    description:
      "Map the process first, then consider where automation and AI may fit.",
    Icon: Workflow,
  },
  {
    title: "Continuous AI skill development",
    description:
      "Support people as AI tools, roles, and responsible practices continue to evolve.",
    Icon: Sparkles,
  },
];

export function HomeIndustrySolutions() {
  return (
    <Section className="home-industry-section" id="industries">
      <SectionHeader
        eyebrow="AI Solutions by Industry"
        title="Explore AI opportunities in your industry."
        description="Start with the workflows and decisions your teams know best. Explore possible use cases, then assess what fits your context."
        href="/industries"
        linkLabel="Explore all industries"
      />
      <div className="home-industry-grid">
        {homeIndustries.map(({ industry, Icon, title }) => (
          <article className="home-industry-card" key={industry.slug}>
            <div className="home-card-heading">
              <span className="home-card-icon">
                <Icon size={20} aria-hidden="true" />
              </span>
              <h3>
                <Link href={`/industries/${industry.slug}`}>{title}</Link>
              </h3>
            </div>
            <p className="muted">{industry.summary}</p>
            <div className="home-industry-example">
              <span>Example AI use cases</span>
              <ul>
                {industry.opportunities.slice(0, 2).map((opportunity) => (
                  <li key={opportunity}>{opportunity}</li>
                ))}
              </ul>
            </div>
            <Link className="text-link" href={`/industries/${industry.slug}`}>
              Explore Solutions <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </article>
        ))}
      </div>
    </Section>
  );
}

export function HomeServices() {
  return (
    <Section className="section-tinted home-services-section" id="services">
      <SectionHeader
        eyebrow="Our AI Services"
        title="From an opportunity to a solution that fits."
        description="Explore practical capabilities across strategy, AI experiences, software, automation, and integration."
        href="/services"
        linkLabel="All AI solutions"
      />
      <div className="home-services-grid">
        {homeServices.map(({ slug, displayTitle, summary, Icon }) => (
          <article className="home-service-card" key={slug}>
            <span className="home-card-icon">
              <Icon size={20} aria-hidden="true" />
            </span>
            <h3>
              <Link href={`/services/${slug}`}>{displayTitle}</Link>
            </h3>
            <p className="muted">{summary}</p>
            <Link className="text-link" href={`/services/${slug}`}>
              Explore service <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </article>
        ))}
      </div>
    </Section>
  );
}

export function HomeLearningPrograms() {
  return (
    <Section className="home-learning-section" id="learning">
      <SectionHeader
        eyebrow="AI Learning Programs"
        title="Build practical skills for work and what comes next."
        description="Explore learning pathways for college students, professionals, organizations, and institutions."
        href="/programs"
        linkLabel="Browse all programs"
      />
      <div className="home-learning-grid">
        {learningPrograms.map(({ title, description, href, label, Icon }) => (
          <article className="home-learning-card" key={title}>
            <span className="home-card-icon">
              <Icon size={20} aria-hidden="true" />
            </span>
            <p className="eyebrow small">{label}</p>
            <h3>
              <Link href={href}>{title}</Link>
            </h3>
            <p className="muted">{description}</p>
            <Link className="text-link" href={href}>
              Explore program <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </article>
        ))}
      </div>
      <p className="home-program-note">
        Program outlines are proposed. Availability, delivery, and final scope
        are discussed through an enquiry.
      </p>
    </Section>
  );
}

export function HomeEcosystem() {
  const ecosystemAreas = [
    {
      title: "AI Products & Platforms",
      description:
        "Browse early product concepts. Each is labeled as an idea, not a working product or demo.",
      href: "/products",
      label: "Explore product ideas",
      Icon: Layers3,
    },
    {
      title: "Research & Innovation",
      description:
        "See areas of interest and check back for verified, published research projects.",
      href: "/research",
      label: "Explore research interests",
      Icon: Lightbulb,
    },
    {
      title: "Community & Partnerships",
      description:
        "Register interest in learning communities, event concepts, and institutional collaboration.",
      href: "/community",
      label: "Explore community",
      Icon: UsersRound,
    },
    {
      title: "AI Demo Center",
      description:
        "Explore text-based AI previews with clear availability, data-use, and human-review notices.",
      href: "/demos",
      label: "Explore AI demos",
      Icon: Sparkles,
    },
  ];

  return (
    <Section className="section-tinted home-ecosystem-section" id="ecosystem">
      <SectionHeader
        eyebrow="Explore the ecosystem"
        title="More ways to learn, build, and collaborate."
        description="Alongside services and training, explore early product ideas, research interests, and opportunities to register community or partnership interest."
      />
      <div className="grid-three ecosystem-card-grid">
        {ecosystemAreas.map(({ title, description, href, label, Icon }) => (
          <article className="service-card ecosystem-card" key={title}>
            <span className="service-icon" aria-hidden="true">
              <Icon size={20} />
            </span>
            <h3>
              <Link href={href}>{title}</Link>
            </h3>
            <p className="muted">{description}</p>
            <Link className="text-link" href={href}>
              {label} <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </article>
        ))}
      </div>
    </Section>
  );
}

function ValueJourney({
  audience,
  title,
  steps,
}: {
  audience: string;
  title: string;
  steps: string[];
}) {
  return (
    <article className="home-value-card">
      <p className="eyebrow small">{audience}</p>
      <h3>{title}</h3>
      <ol className="home-value-steps">
        {steps.map((step, index) => (
          <li key={step}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{step}</strong>
          </li>
        ))}
      </ol>
    </article>
  );
}

export function HomeValueAndWhy() {
  return (
    <>
      <Section className="section-tinted home-value-section" id="our-approach">
        <SectionHeader
          eyebrow="How We Create Value"
          title="A clear path from curiosity to progress."
          description="The journey is different for each audience, but every step is grounded in purpose, practice, and meaningful next actions."
        />
        <div className="home-value-grid">
          <ValueJourney
            audience="For businesses"
            title="Make AI work for your organization."
            steps={businessValueSteps}
          />
          <ValueJourney
            audience="For learners"
            title="Turn AI learning into real capability."
            steps={learnerValueSteps}
          />
        </div>
      </Section>
      <Section className="home-why-section">
        <SectionHeader
          eyebrow="Why PraedicoAI"
          title="AI progress shaped around people and purpose."
          description="Business outcomes and learner growth both begin with relevant context, practical work, and thoughtful application."
        />
        <div className="home-why-grid">
          {reasons.map(({ title, description, Icon }) => (
            <article className="home-why-card" key={title}>
              <span className="home-card-icon">
                <Icon size={20} aria-hidden="true" />
              </span>
              <h3>{title}</h3>
              <p className="muted">{description}</p>
            </article>
          ))}
        </div>
      </Section>
    </>
  );
}

export function HomeFinalCta() {
  return (
    <section className="home-final-cta" aria-labelledby="home-final-cta-title">
      <div className="container">
        <p className="eyebrow">Take the next step</p>
        <h2 id="home-final-cta-title">Ready to Start Your AI Journey?</h2>
        <p className="home-final-cta-intro">
          Start with the goal you have today. We&apos;ll help you explore a
          practical next step.
        </p>
        <div className="home-final-cta-grid">
          <article className="home-final-cta-card">
            <span className="home-final-cta-icon">
              <BriefcaseBusiness size={22} aria-hidden="true" />
            </span>
            <div>
              <h3>Looking for AI Solutions?</h3>
              <p>
                Explore consulting, automation, AI applications, and
                integrations for your business.
              </p>
            </div>
            <ButtonLink href="/services">Explore AI Solutions</ButtonLink>
          </article>
          <article className="home-final-cta-card">
            <span className="home-final-cta-icon">
              <GraduationCap size={23} aria-hidden="true" />
            </span>
            <div>
              <h3>Looking for AI Training or Internships?</h3>
              <p>
                Find learning options for students, professionals, teams, and
                institutions.
              </p>
            </div>
            <div className="home-final-cta-actions">
              <ButtonLink href="/programs">Explore AI Training</ButtonLink>
              <Link className="home-final-cta-secondary" href="/internships">
                Explore internships
                <ArrowUpRight size={15} aria-hidden="true" />
              </Link>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
