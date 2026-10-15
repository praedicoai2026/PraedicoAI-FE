import type { Service } from "@/types/content";
import { faqs } from "./faqs";
type ServiceSeed = {
  slug: string;
  title: string;
  icon: string;
  summary: string;
  category: string;
  audience: string[];
  capabilities: string[];
  challenges: string[];
  deliverables: string[];
  tags: string[];
};
const seeds: ServiceSeed[] = [
  {
    slug: "software-development",
    title: "Software Development",
    icon: "code",
    category: "Engineering",
    summary:
      "Build the web interfaces, product foundations, and integrations that turn a validated idea into dependable software.",
    audience: ["Startups", "Enterprise teams"],
    capabilities: [
      "Custom software concepts",
      "Business applications and internal tools",
      "Application modernization",
      "API-ready frontend design",
      "Maintainable architecture",
      "Performance and code quality",
      "Technical documentation",
    ],
    challenges: [
      "Disconnected tools create duplicate work",
      "Growing requirements strain existing application structure",
    ],
    deliverables: [
      "Application scope and feature map",
      "Component architecture and UI prototype",
      "Technical handover documentation",
    ],
    tags: ["TypeScript", "React", "Architecture"],
  },
  {
    slug: "web-application-development",
    title: "Web Application Development",
    icon: "globe",
    category: "Engineering",
    summary:
      "Design and develop accessible web products that make complex services, workflows, and AI capabilities clear to their users.",
    audience: ["Businesses", "Founders", "Professionals"],
    capabilities: [
      "Business websites and portfolios",
      "Customer portals",
      "SaaS frontend and dashboard UI",
      "Responsive design",
      "Accessibility and performance",
      "SEO-ready frontend",
      "Scalable components",
    ],
    challenges: [
      "A website is difficult to use on mobile",
      "Inconsistent screens slow down everyday work",
    ],
    deliverables: [
      "Responsive page system",
      "Accessible interaction patterns",
      "Frontend performance review",
    ],
    tags: ["Next.js", "TypeScript", "Tailwind CSS"],
  },
  {
    slug: "ai-agents",
    title: "AI Agent Consulting",
    icon: "brain",
    category: "AI & Automation",
    summary:
      "Move from AI curiosity to a bounded, testable use case with clear data boundaries, evaluation criteria, and human accountability.",
    audience: ["Business leaders", "Product teams"],
    capabilities: [
      "AI opportunity and readiness discovery",
      "Task-specific assistant and agent design",
      "Knowledge retrieval and source-grounded response concepts",
      "Tool-use boundaries and permission planning",
      "Human review, escalation, and override design",
      "Evaluation scenarios and acceptance criteria",
      "Privacy, security, and responsible-use questions",
      "Integration and operational-readiness planning",
    ],
    challenges: [
      "AI experiments do not have a clear user, workflow, or measurable purpose",
      "Teams cannot tell what information shaped a response",
      "An assistant may suggest an action without clear ownership or review",
      "Promising demonstrations have not been evaluated against real failure cases",
    ],
    deliverables: [
      "Prioritized use-case and feasibility brief",
      "Task, data-source, permission, and responsibility map",
      "Prototype scope with measurable acceptance criteria",
      "Evaluation scenarios, including uncertainty and failure cases",
      "Human-review and escalation model",
      "Integration and operational-readiness recommendations",
    ],
    tags: ["Responsible AI", "Agent Design", "Architecture"],
  },
  {
    slug: "workflow-consulting",
    title: "Workflow Consulting",
    icon: "workflow",
    category: "AI & Automation",
    summary: "Make information, handoffs, and decisions easier to understand.",
    audience: ["Operations teams", "Growing businesses"],
    capabilities: [
      "Business process understanding",
      "Repetitive task identification",
      "Current-state and future-state process mapping",
      "AI-assisted intake, triage, and drafting concepts",
      "Notification, routing, and approval design",
      "Information ownership and access review",
      "Human checkpoints and exception handling",
      "Automation boundaries and fallback paths",
      "Workflow measurement and improvement planning",
    ],
    challenges: [
      "Work gets lost between teams",
      "Exceptions and approvals are difficult to trace",
    ],
    deliverables: [
      "Current-state process and handoff map",
      "Prioritized automation opportunities",
      "Human checkpoint and exception inventory",
      "Proposed workflow with ownership and fallback paths",
      "Pilot measures and review questions",
    ],
    tags: ["Process Mapping", "Human Approval", "Architecture"],
  },
  {
    slug: "digital-marketing",
    title: "Digital Marketing",
    icon: "chart",
    category: "Digital Growth",
    summary:
      "A coherent digital presence built around useful content and clear positioning.",
    audience: ["Small businesses", "Professionals"],
    capabilities: [
      "Digital strategy",
      "Content planning",
      "SEO foundations",
      "Landing-page planning",
      "Campaign concepts",
      "Brand positioning",
      "Measurement planning",
      "Conversion improvement",
    ],
    challenges: [
      "Content lacks a consistent purpose",
      "Visitors cannot find a clear next step",
    ],
    deliverables: [
      "Audience and content strategy",
      "Landing-page outline",
      "Measurement planning checklist",
    ],
    tags: ["Content Strategy", "SEO", "UX"],
  },
  {
    slug: "ai-video",
    title: "AI Video Creation",
    icon: "video",
    category: "Digital Growth",
    summary:
      "Turn complex ideas into clear scripts, storyboards, and video concepts.",
    audience: ["Educators", "Product teams", "Content creators"],
    capabilities: [
      "Business explainer concepts",
      "Training-video concepts",
      "Product-introduction videos",
      "Social media video ideas",
      "Script planning",
      "Storyboard planning",
      "Caption planning",
      "Content-format planning",
    ],
    challenges: [
      "Technical ideas are difficult to explain quickly",
      "Video production starts without a clear story",
    ],
    deliverables: [
      "Narrative and script outline",
      "Storyboard and caption plan",
      "Format and accessibility checklist",
    ],
    tags: ["Storyboarding", "Content Strategy", "Accessibility"],
  },
  {
    slug: "social-media-growth",
    title: "Social Media Growth",
    icon: "users",
    category: "Digital Growth",
    summary:
      "Build a consistent, useful professional presence through ethical content practices.",
    audience: ["Professionals", "Small businesses", "Educators"],
    capabilities: [
      "Profile positioning",
      "Content pillars and calendar",
      "Post ideas",
      "Short-video ideas",
      "Community engagement",
      "Brand consistency",
      "Performance-review concepts",
      "Ethical growth practices",
    ],
    challenges: [
      "Posting feels reactive and inconsistent",
      "Profile positioning does not explain the value offered",
    ],
    deliverables: [
      "Profile positioning review",
      "Content-pillar map and sample calendar",
      "Ethical engagement guidelines",
    ],
    tags: ["Personal Branding", "Content Strategy", "Community"],
  },
  {
    slug: "technology-consulting",
    title: "Technology Consulting",
    icon: "layers",
    category: "Strategy",
    summary:
      "Turn an AI or software ambition into an architecture direction grounded in business goals, system constraints, and operational reality.",
    audience: ["Technology leaders", "Startups", "Enterprises"],
    capabilities: [
      "Product and technical discovery",
      "AI and software architecture assessment",
      "Build, buy, or partner decision support",
      "Data and system integration planning",
      "Security, privacy, and operational risk discovery",
      "Architecture review and decision records",
      "Incremental modernization and delivery roadmap",
      "Scale, reliability, and ownership planning",
    ],
    challenges: [
      "Too many technology options obscure priorities",
      "Architecture decisions are undocumented",
    ],
    deliverables: [
      "Current-state architecture and constraint summary",
      "Options analysis with documented trade-offs",
      "AI/data integration and risk questions",
      "Decision records and incremental technical roadmap",
    ],
    tags: ["Architecture", "Technical Strategy", "Integration Design"],
  },
  {
    slug: "application-modernization",
    title: "Application Modernization",
    icon: "refresh",
    category: "Engineering",
    summary:
      "Improve existing applications incrementally so new digital and AI-assisted workflows fit the systems and teams already in place.",
    audience: ["Enterprises", "Operations teams"],
    capabilities: [
      "Existing application review",
      "Frontend modernization",
      "Legacy UI replacement concepts",
      "Component-based architecture",
      "Responsive redesign",
      "Performance improvement",
      "Accessibility improvement",
      "Incremental modernization",
    ],
    challenges: [
      "Legacy screens require excessive manual work",
      "A full rewrite would introduce avoidable risk",
    ],
    deliverables: [
      "UI and accessibility assessment",
      "Modernization priority map",
      "Reusable component prototype",
    ],
    tags: ["React", "TypeScript", "Accessibility"],
  },
  {
    slug: "training",
    title: "Training & Workshops",
    icon: "graduation",
    category: "Learning",
    summary:
      "Practical learning that connects technology concepts to real design decisions.",
    audience: ["Students", "Professionals", "Corporate teams"],
    capabilities: [
      "Individual training",
      "Student workshops",
      "Corporate training",
      "Architecture learning",
      "Next.js and TypeScript learning",
      "AI awareness and agent concepts",
      "Workflow concepts",
      "Digital transformation",
    ],
    challenges: [
      "Tutorial knowledge is hard to apply",
      "Teams need a shared technical vocabulary",
    ],
    deliverables: [
      "Audience-specific learning plan",
      "Guided exercises and reference materials",
      "Reflection and next-step recommendations",
    ],
    tags: ["Next.js", "TypeScript", "AI Fundamentals"],
  },
];
export const services: Service[] = seeds.map((seed) => ({
  ...seed,
  image: "/images/services/architecture.png",
  imageAlt: "Abstract layered technology architecture",
  label: "Consulting & services",
  sections: [],
  benefits: [seed.deliverables[0], "Clear scope and practical next steps"],
  faqs:
    seed.slug === "ai-agents"
      ? [faqs[5], faqs[0]]
      : seed.category === "Digital Growth"
        ? [faqs[7], faqs[0]]
        : [faqs[1], faqs[0]],
}));
export const getServiceBySlug = (slug: string) =>
  services.find((service) => service.slug === slug);
