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
      "Purpose-built business applications with a maintainable foundation.",
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
      "Thoughtful web experiences that work across devices and grow with your ideas.",
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
      "Explore useful AI opportunities with clear boundaries and human oversight.",
    audience: ["Business leaders", "Product teams"],
    capabilities: [
      "AI use-case discovery",
      "Task-based assistants",
      "Knowledge assistants",
      "Process-based and goal-based agents",
      "Human approval concepts",
      "Responsible AI considerations",
      "AI agent design",
      "Future integration planning",
    ],
    challenges: [
      "AI experiments are disconnected from business needs",
      "Unclear ownership and approval create risk",
    ],
    deliverables: [
      "Use-case prioritization worksheet",
      "Agent responsibility and approval map",
      "Evaluation and future integration plan",
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
      "Notification-flow concepts",
      "Approval-flow concepts",
      "Information-flow design",
      "Human checkpoints",
      "Error-handling concepts",
      "Future workflow planning",
    ],
    challenges: [
      "Work gets lost between teams",
      "Exceptions and approvals are difficult to trace",
    ],
    deliverables: [
      "Current and proposed process maps",
      "Human checkpoint inventory",
      "Exception-handling recommendations",
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
      "Make technology decisions with an understanding of business and technical trade-offs.",
    audience: ["Technology leaders", "Startups", "Enterprises"],
    capabilities: [
      "Solution architecture",
      "Technical discovery",
      "Technology assessment",
      "Architecture review",
      "Integration planning",
      "Application roadmap",
      "Scalability planning",
      "Technical risk identification",
    ],
    challenges: [
      "Too many technology options obscure priorities",
      "Architecture decisions are undocumented",
    ],
    deliverables: [
      "Architecture assessment",
      "Decision records",
      "Incremental technical roadmap",
    ],
    tags: ["Architecture", "Technical Strategy", "Integration Design"],
  },
  {
    slug: "application-modernization",
    title: "Application Modernization",
    icon: "refresh",
    category: "Engineering",
    summary:
      "Plan practical improvements to existing interfaces, one well-defined step at a time.",
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
