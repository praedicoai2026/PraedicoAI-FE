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
      "Custom AI-enabled application development",
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
    title: "AI Agents & Multi-Agent Systems",
    icon: "brain",
    category: "AI & Automation",
    summary:
      "Move from AI curiosity to a bounded, testable use case with clear data boundaries, evaluation criteria, and human accountability.",
    audience: ["Business leaders", "Product teams"],
    capabilities: [
      "AI opportunity and readiness discovery",
      "Task-specific assistant and agent design",
      "Multi-agent workflow concepts",
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
    summary:
      "Redesign information flow and handoffs so AI assistance supports a process people can understand, review, and own.",
    audience: ["Operations teams", "Growing businesses"],
    capabilities: [
      "Business process understanding",
      "Repetitive task identification",
      "Current-state and future-state process mapping",
      "Workflow automation and system integration planning",
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
    slug: "custom-ai-application-development",
    title: "Custom AI Application Development",
    icon: "code",
    category: "Engineering",
    summary:
      "Design and build custom applications that connect AI capabilities to real user workflows, approved information, and clear human controls.",
    audience: ["Businesses", "Product teams", "Technology leaders"],
    capabilities: [
      "AI-enabled web application design",
      "Assistant and agent integration planning",
      "User experience and workflow prototyping",
      "API, data, and identity integration",
      "Access, review, and escalation controls",
      "Quality, accessibility, and performance planning",
    ],
    challenges: [
      "An AI proof of concept does not fit the real application journey",
      "Users need to understand, review, and correct AI-assisted results",
    ],
    deliverables: [
      "Application scope and user journey",
      "Working prototype or agreed implementation scope",
      "Evaluation and operational-readiness plan",
    ],
    tags: ["AI Applications", "Web Development", "Human Review"],
  },
  {
    slug: "ai-consulting-strategy",
    title: "AI Consulting & Strategy",
    icon: "layers",
    category: "Strategy",
    summary:
      "Identify where AI may help, assess readiness and constraints, and shape a practical roadmap before committing to implementation.",
    audience: ["Business owners", "Leaders", "Product and operations teams"],
    capabilities: [
      "AI readiness and opportunity discovery",
      "Use-case prioritization by value, feasibility, and risk",
      "Build, buy, or partner decision support",
      "Data, integration, and operating-model assessment",
      "Responsible AI and governance planning",
      "Incremental adoption roadmaps",
    ],
    challenges: [
      "Teams have many AI ideas but no shared priority",
      "Business goals, data constraints, and delivery plans are disconnected",
    ],
    deliverables: [
      "Opportunity and readiness brief",
      "Prioritized use-case map",
      "Practical roadmap with assumptions and open decisions",
    ],
    tags: ["AI Strategy", "Readiness", "Responsible AI"],
  },
  {
    slug: "generative-ai-solutions",
    title: "Generative AI Solutions",
    icon: "brain",
    category: "AI & Automation",
    summary:
      "Explore generative AI experiences for research, knowledge work, and content workflows with clear source, review, and data boundaries.",
    audience: ["Business teams", "Product teams", "Technology leaders"],
    capabilities: [
      "Generative AI opportunity discovery",
      "Knowledge retrieval and source-grounded response concepts",
      "Drafting and summarization workflows",
      "Prompt and output evaluation",
      "Model and deployment trade-off assessment",
      "Human review and escalation design",
    ],
    challenges: [
      "Generated content is difficult to verify",
      "Teams need to control which information an AI experience can use",
    ],
    deliverables: [
      "Bounded use-case and experience brief",
      "Source, permission, and review model",
      "Evaluation scenarios and prototype scope",
    ],
    tags: ["Generative AI", "Knowledge Systems", "Evaluation"],
  },
  {
    slug: "ai-chatbots-virtual-assistants",
    title: "AI Chatbots & Virtual Assistants",
    icon: "brain",
    category: "AI & Automation",
    summary:
      "Design conversational support for defined tasks, with approved knowledge, visible limitations, and clear paths to a person.",
    audience: [
      "Customer support",
      "Service teams",
      "Internal knowledge owners",
    ],
    capabilities: [
      "Customer and employee assistant use-case design",
      "Approved knowledge-source planning",
      "Conversation flows and response boundaries",
      "Uncertainty, fallback, and escalation design",
      "Privacy and access-control review",
      "Quality evaluation and handoff planning",
    ],
    challenges: [
      "People receive inconsistent answers across channels",
      "A bot may fail to recognize when a person should take over",
    ],
    deliverables: [
      "Assistant scope and conversation map",
      "Knowledge and access requirements",
      "Human handoff and evaluation plan",
    ],
    tags: ["Conversational AI", "Knowledge Retrieval", "Human Handoff"],
  },
  {
    slug: "data-analytics-predictive-intelligence",
    title: "Data Analytics & Predictive Intelligence",
    icon: "chart",
    category: "Strategy",
    summary:
      "Turn approved data into clearer reporting and testable predictive concepts, with assumptions, limitations, and human decisions made explicit.",
    audience: ["Business analysts", "Data teams", "Operations leaders"],
    capabilities: [
      "Analytics and reporting opportunity discovery",
      "Data quality and source-readiness review",
      "Predictive use-case and assumption mapping",
      "Dashboard and decision-support concepts",
      "Evaluation and monitoring questions",
      "Human review for consequential decisions",
    ],
    challenges: [
      "Reports take time to prepare and reconcile",
      "Predictions may be treated as certainty without validation",
    ],
    deliverables: [
      "Data and decision context brief",
      "Analytics or predictive prototype scope",
      "Evaluation measures and limitation notes",
    ],
    tags: ["Data Analytics", "Predictive Models", "Decision Support"],
  },
  {
    slug: "workflow-automation-integration",
    title: "Workflow Automation & System Integration",
    icon: "workflow",
    category: "AI & Automation",
    summary:
      "Connect tools and automate repeatable handoffs while keeping approvals, exceptions, and process ownership visible.",
    audience: ["Operations teams", "Process owners", "Technology leaders"],
    capabilities: [
      "Workflow and system-boundary mapping",
      "API and integration planning",
      "Intake, routing, and approval automation concepts",
      "Exception handling and fallback design",
      "Information ownership and permissions review",
      "Measurement and operational handover planning",
    ],
    challenges: [
      "Information is re-entered across disconnected systems",
      "Automations are hard to audit when an exception occurs",
    ],
    deliverables: [
      "Current-state workflow and integration map",
      "Automation opportunities and boundaries",
      "Exception, ownership, and rollout plan",
    ],
    tags: ["Workflow Automation", "System Integration", "Process Design"],
  },
  {
    slug: "ai-adoption-implementation",
    title: "AI Adoption & Implementation",
    icon: "layers",
    category: "Strategy",
    summary:
      "Prepare teams to adopt a bounded AI capability through clear roles, practical enablement, staged delivery, and ongoing evaluation.",
    audience: ["Executive sponsors", "Managers", "Cross-functional teams"],
    capabilities: [
      "Adoption readiness and stakeholder mapping",
      "Role-based AI learning and enablement",
      "Pilot and implementation planning",
      "Governance, ownership, and escalation design",
      "Adoption and quality measurement",
      "Incremental rollout and feedback loops",
    ],
    challenges: [
      "Tools are introduced without shared expectations or support",
      "Teams lack a plan for review, ownership, and ongoing improvement",
    ],
    deliverables: [
      "Adoption and stakeholder plan",
      "Pilot scope, roles, and success measures",
      "Enablement and iteration roadmap",
    ],
    tags: ["AI Adoption", "Enablement", "Implementation Planning"],
  },
];
export const services: Service[] = seeds
  .map((seed) => ({
    ...seed,
    image: "/images/services/architecture.png",
    imageAlt: "Abstract layered technology architecture",
    label: "Consulting & services",
    sections: [],
    benefits: [seed.deliverables[0], "Clear scope and practical next steps"],
    faqs:
      seed.slug === "ai-agents"
        ? [faqs[8], faqs[9], faqs[10], faqs[11], faqs[12], faqs[13]]
        : seed.slug === "workflow-consulting"
          ? [faqs[8], faqs[9], faqs[0]]
          : seed.category === "Digital Growth"
            ? [faqs[7], faqs[0]]
            : [faqs[1], faqs[0]],
  }))
  .sort(
    (left, right) =>
      Number(right.slug === "ai-agents") - Number(left.slug === "ai-agents"),
  );
export const serviceCategories = [
  ...new Set(services.map((service) => service.category)),
].sort();
export const getServiceBySlug = (slug: string) =>
  services.find((service) => service.slug === slug);
