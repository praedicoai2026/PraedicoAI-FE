import type { SiteConfiguration } from "@/types/content";
const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() ?? "";

export const site: SiteConfiguration = {
  name: "PraedicoAI Services Private Limited",
  title: "Applied AI. Powering Intelligent Solutions.",
  description:
    "PraedicoAI helps organizations explore, validate, and build practical AI-enabled software and workflows with people, business context, and responsible use at the center.",
  contactEmail,
  contactEmailConfigured: contactEmail.length > 0,
  url: configuredSiteUrl
    ? new URL(configuredSiteUrl).origin
    : "http://localhost:3000",
  canonicalUrlConfigured: Boolean(configuredSiteUrl),
};
export const expertise = [
  "Applied AI discovery",
  "AI assistants & agents",
  "Workflow automation",
  "Custom software",
  "Responsible AI design",
  "Team enablement",
];
export const principles = [
  [
    "Start with the work",
    "Understand the people, decisions, and repetitive tasks before choosing an AI model or tool.",
  ],
  [
    "Use AI where it fits",
    "Prefer a predictable rule or simpler software when it solves the problem more clearly.",
  ],
  [
    "Keep people accountable",
    "Make review, correction, escalation, and human ownership part of the experience.",
  ],
  [
    "Protect information",
    "Treat data access, privacy, retention, and permissions as design constraints from the start.",
  ],
  [
    "Evaluate before expanding",
    "Use representative examples and explicit acceptance criteria before trusting a system with more.",
  ],
  [
    "Build for change",
    "Keep software understandable, modular, and maintainable as requirements and models evolve.",
  ],
  [
    "Make trade-offs visible",
    "Explain assumptions, costs, risks, and the next decision in language teams can use.",
  ],
];
export const processSteps = [
  [
    "Discover",
    "Map the task, current workflow, users, and the cost of the problem.",
  ],
  [
    "Qualify",
    "Check whether AI is appropriate; identify data, risk, and integration constraints.",
  ],
  [
    "Define",
    "Agree on a bounded use case, success criteria, and human responsibilities.",
  ],
  [
    "Prototype",
    "Make the journey testable with representative examples and clear limitations.",
  ],
  [
    "Evaluate",
    "Review quality, failure cases, usability, and operational fit before expanding.",
  ],
  [
    "Deliver thoughtfully",
    "Plan the next step, ownership, monitoring, and ongoing improvement.",
  ],
];
export const learningAudiences = [
  "Founders & product teams",
  "Business and operations teams",
  "Technology leaders",
  "Developers & architects",
  "Customer-facing teams",
  "Educators & learners",
];
