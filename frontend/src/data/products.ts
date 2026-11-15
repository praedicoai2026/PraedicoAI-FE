export type ProductLifecycleStatus =
  "Idea" | "Under Development" | "Prototype" | "Beta" | "Live" | "Deprecated";

export interface ProductIdea {
  slug: string;
  title: string;
  category: string;
  audience: string;
  summary: string;
  capabilityIdeas: string[];
  status: ProductLifecycleStatus;
}

export const productIdeas: ProductIdea[] = [
  {
    slug: "hr-assistant",
    title: "AI HR Assistant",
    category: "AI Business Assistants",
    audience: "HR and people-operations teams",
    summary:
      "An early concept for exploring how approved HR information might support routine policy and onboarding questions.",
    capabilityIdeas: [
      "Search approved policy and onboarding material",
      "Show source references and uncertainty",
      "Escalate sensitive employee questions to an authorized person",
    ],
    status: "Idea",
  },
  {
    slug: "sales-assistant",
    title: "AI Sales Assistant",
    category: "AI Business Assistants",
    audience: "Sales and account teams",
    summary:
      "An early concept for organizing approved account context and preparing drafts for a salesperson to review.",
    capabilityIdeas: [
      "Prepare account and meeting briefs from approved sources",
      "Draft follow-up options for human review",
      "Surface missing context instead of inventing customer details",
    ],
    status: "Idea",
  },
  {
    slug: "marketing-assistant",
    title: "AI Marketing Assistant",
    category: "AI Business Assistants",
    audience: "Marketing and communications teams",
    summary:
      "An early concept for working with approved brand guidance, campaign briefs, and content-review workflows.",
    capabilityIdeas: [
      "Organize briefs and approved brand guidance",
      "Prepare draft content variations for editorial review",
      "Flag claims that need source verification",
    ],
    status: "Idea",
  },
  {
    slug: "finance-assistant",
    title: "AI Finance Assistant",
    category: "AI Business Assistants",
    audience: "Finance and accounting teams",
    summary:
      "An early concept for assisting with financial-document workflows while retaining validation and professional review.",
    capabilityIdeas: [
      "Organize documents and extracted fields for review",
      "Prepare draft summaries from approved information",
      "Keep calculations and financial decisions with accountable reviewers",
    ],
    status: "Idea",
  },
  {
    slug: "operations-assistant",
    title: "AI Operations Assistant",
    category: "AI Business Assistants",
    audience: "Operations and process owners",
    summary:
      "An early concept for finding approved procedures and making workflow handoffs easier to inspect.",
    capabilityIdeas: [
      "Search approved operating procedures",
      "Summarize workflow status for human review",
      "Route exceptions to a named process owner",
    ],
    status: "Idea",
  },
  {
    slug: "workflow-automation",
    title: "AI Workflow Automation",
    category: "AI Automation Platforms",
    audience: "Operations and technology teams",
    summary:
      "An early concept for connecting repeatable workflow steps while preserving approvals, exception handling, and ownership.",
    capabilityIdeas: [
      "Map workflow steps and system boundaries",
      "Identify candidate handoffs for automation",
      "Keep approvals and fallback paths visible",
    ],
    status: "Idea",
  },
  {
    slug: "document-processing",
    title: "AI Document Processing",
    category: "AI Automation Platforms",
    audience: "Teams handling recurring documents",
    summary:
      "An early concept for assisting with document intake and extraction using approved samples and human verification.",
    capabilityIdeas: [
      "Classify document types for review",
      "Extract candidate fields with source references",
      "Route incomplete or uncertain results for verification",
    ],
    status: "Idea",
  },
  {
    slug: "email-automation",
    title: "AI Email Automation",
    category: "AI Automation Platforms",
    audience: "Teams with repeatable email workflows",
    summary:
      "An early concept for organizing incoming messages and preparing responses without sending unreviewed content.",
    capabilityIdeas: [
      "Group messages by an agreed workflow",
      "Prepare response drafts for a person to review",
      "Escalate sensitive or ambiguous requests",
    ],
    status: "Idea",
  },
  {
    slug: "customer-support-automation",
    title: "AI Customer Support Automation",
    category: "AI Automation Platforms",
    audience: "Customer support and service teams",
    summary:
      "An early concept for supporting request triage and approved answers with clear handoff to a person.",
    capabilityIdeas: [
      "Classify and route support requests",
      "Retrieve answers from approved support material",
      "Escalate when information is missing or uncertain",
    ],
    status: "Idea",
  },
  {
    slug: "business-analytics",
    title: "AI Business Analytics",
    category: "AI Intelligence Platforms",
    audience: "Business analysts and decision-makers",
    summary:
      "An early concept for exploring business information and preparing analysis for validation by responsible teams.",
    capabilityIdeas: [
      "Organize approved data sources and definitions",
      "Prepare summaries with assumptions made explicit",
      "Keep consequential decisions with accountable people",
    ],
    status: "Idea",
  },
  {
    slug: "knowledge-management",
    title: "AI Knowledge Management",
    category: "AI Intelligence Platforms",
    audience: "Organizations with approved knowledge collections",
    summary:
      "An early concept for helping people find approved organizational information with visible sources and access boundaries.",
    capabilityIdeas: [
      "Search approved knowledge collections",
      "Return source-linked responses for review",
      "Respect information permissions and escalation rules",
    ],
    status: "Idea",
  },
  {
    slug: "document-intelligence",
    title: "AI Document Intelligence",
    category: "AI Intelligence Platforms",
    audience: "Teams reviewing structured document collections",
    summary:
      "An early concept for making document information easier to locate and compare, subject to quality and source review.",
    capabilityIdeas: [
      "Index approved documents for retrieval",
      "Prepare source-linked summaries",
      "Flag uncertain extraction for human review",
    ],
    status: "Idea",
  },
  {
    slug: "enterprise-search",
    title: "AI Enterprise Search",
    category: "AI Intelligence Platforms",
    audience: "Organizations with distributed internal information",
    summary:
      "An early concept for searching authorized internal sources while respecting access controls and source ownership.",
    capabilityIdeas: [
      "Search connected sources selected by the organization",
      "Preserve source permissions in retrieval",
      "Show where information came from",
    ],
    status: "Idea",
  },
];

export function getProductIdea(slug: string) {
  return productIdeas.find((product) => product.slug === slug);
}
