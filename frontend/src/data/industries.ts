import { services } from "@/data/services";

export type Industry = {
  slug: string;
  name: string;
  summary: string;
  opportunities: string[];
  serviceSlugs: string[];
};

export const industries: Industry[] = [
  {
    slug: "human-resources",
    name: "Human Resources",
    summary:
      "Explore AI support for people operations, learning, and HR administration while protecting employee information and keeping people decisions accountable.",
    opportunities: [
      "Drafting and reviewing job descriptions, onboarding material, and internal FAQs",
      "Finding approved policy and benefits information",
      "Summarizing non-sensitive themes for human review",
    ],
    serviceSlugs: [
      "ai-consulting-strategy",
      "ai-chatbots-virtual-assistants",
      "ai-adoption-implementation",
    ],
  },
  {
    slug: "sales",
    name: "Sales",
    summary:
      "Consider AI-assisted research, communication, and reporting that supports sales teams without replacing their judgment or making unsupported claims.",
    opportunities: [
      "Preparing account and meeting briefs from approved sources",
      "Drafting and reviewing follow-ups and proposal material",
      "Summarizing pipeline activity and customer feedback",
    ],
    serviceSlugs: [
      "generative-ai-solutions",
      "workflow-automation-integration",
      "data-analytics-predictive-intelligence",
    ],
  },
  {
    slug: "marketing",
    name: "Marketing",
    summary:
      "Apply generative AI to research, campaign planning, and content operations while keeping brand quality, originality, and factual review in view.",
    opportunities: [
      "Developing content briefs and campaign variations for editorial review",
      "Organizing audience research and approved brand guidance",
      "Summarizing campaign data and preparing test ideas",
    ],
    serviceSlugs: [
      "generative-ai-solutions",
      "data-analytics-predictive-intelligence",
      "ai-adoption-implementation",
    ],
  },
  {
    slug: "finance-accounting",
    name: "Finance & Accounting",
    summary:
      "Assess document, reporting, and analysis workflows using approved information, validated calculations, and accountable financial review.",
    opportunities: [
      "Extracting fields from documents for people to verify",
      "Preparing variance summaries and recurring reports",
      "Routing exceptions for review rather than making autonomous financial decisions",
    ],
    serviceSlugs: [
      "workflow-automation-integration",
      "data-analytics-predictive-intelligence",
      "ai-consulting-strategy",
    ],
  },
  {
    slug: "retail-ecommerce",
    name: "Retail & E-commerce",
    summary:
      "Explore customer and operations workflows where AI may help teams organize product information, respond to questions, and understand service patterns.",
    opportunities: [
      "Improving product information discovery across approved catalogs",
      "Drafting responses to routine service questions with escalation paths",
      "Summarizing demand and inventory signals for human review",
    ],
    serviceSlugs: [
      "ai-chatbots-virtual-assistants",
      "data-analytics-predictive-intelligence",
      "workflow-automation-integration",
    ],
  },
  {
    slug: "legal-compliance",
    name: "Legal & Compliance",
    summary:
      "Examine controlled document and compliance workflows with strict source visibility, access boundaries, and qualified professional oversight.",
    opportunities: [
      "Finding clauses or obligations in approved document collections",
      "Preparing matter or policy summaries for professional review",
      "Tracking workflow status and routing exceptions to accountable owners",
    ],
    serviceSlugs: [
      "generative-ai-solutions",
      "ai-chatbots-virtual-assistants",
      "workflow-automation-integration",
    ],
  },
  {
    slug: "healthcare",
    name: "Healthcare",
    summary:
      "Explore administrative and information workflows with privacy, authorized access, and clinical professionals retaining responsibility for care decisions.",
    opportunities: [
      "Finding approved operational guidance and internal procedures",
      "Supporting administrative document handling and routing",
      "Summarizing non-clinical service workflows for review",
    ],
    serviceSlugs: [
      "ai-consulting-strategy",
      "workflow-automation-integration",
      "ai-adoption-implementation",
    ],
  },
  {
    slug: "education",
    name: "Education",
    summary:
      "Support educators, learners, and institutions with AI-enabled learning and administration while protecting academic integrity and educator oversight.",
    opportunities: [
      "Preparing lesson and learning-support material for educator review",
      "Organizing approved institutional knowledge and student services",
      "Supporting administrative intake and communication workflows",
    ],
    serviceSlugs: [
      "generative-ai-solutions",
      "ai-chatbots-virtual-assistants",
      "ai-adoption-implementation",
    ],
  },
  {
    slug: "manufacturing",
    name: "Manufacturing",
    summary:
      "Identify carefully bounded ways AI may support operational knowledge and workflow visibility without bypassing safety or quality controls.",
    opportunities: [
      "Finding approved procedures and maintenance guidance",
      "Summarizing quality or production exceptions for responsible review",
      "Routing operational documents and approvals",
    ],
    serviceSlugs: [
      "ai-consulting-strategy",
      "workflow-automation-integration",
      "data-analytics-predictive-intelligence",
    ],
  },
  {
    slug: "logistics-supply-chain",
    name: "Logistics & Supply Chain",
    summary:
      "Explore information and coordination workflows across planning, shipment updates, and exceptions with clear source and approval boundaries.",
    opportunities: [
      "Summarizing shipment status and exception information",
      "Preparing demand and supply reports for human review",
      "Routing documents and operational handoffs between systems",
    ],
    serviceSlugs: [
      "data-analytics-predictive-intelligence",
      "workflow-automation-integration",
      "generative-ai-solutions",
    ],
  },
  {
    slug: "customer-support",
    name: "Customer Support",
    summary:
      "Help service teams find approved answers, organize incoming requests, and prepare responses with useful escalation to a person.",
    opportunities: [
      "Retrieving source-grounded answers from approved knowledge",
      "Summarizing, classifying, and routing support requests",
      "Drafting response options for an agent to review",
    ],
    serviceSlugs: [
      "ai-chatbots-virtual-assistants",
      "generative-ai-solutions",
      "workflow-automation-integration",
    ],
  },
  {
    slug: "it-software-development",
    name: "IT & Software Development",
    summary:
      "Consider AI assistance for engineering and technology work with code review, security practices, and developer ownership maintained.",
    opportunities: [
      "Supporting code, test, and documentation workflows",
      "Finding approved technical knowledge and architecture guidance",
      "Automating repeatable development and IT operations handoffs",
    ],
    serviceSlugs: [
      "ai-agents",
      "generative-ai-solutions",
      "custom-ai-application-development",
    ],
  },
  {
    slug: "business-operations",
    name: "Business Operations",
    summary:
      "Improve repeatable operational work by mapping the process first, then evaluating where software, integrations, or AI can assist.",
    opportunities: [
      "Handling document intake, classification, and review queues",
      "Finding current procedures and summarizing approved information",
      "Making handoffs, approvals, and exceptions easier to follow",
    ],
    serviceSlugs: [
      "workflow-consulting",
      "workflow-automation-integration",
      "ai-consulting-strategy",
    ],
  },
  {
    slug: "real-estate",
    name: "Real Estate",
    summary:
      "Explore AI support for property information, inquiries, and operational workflows while keeping financial, legal, and customer decisions with accountable people.",
    opportunities: [
      "Organizing and searching approved property information",
      "Preparing draft responses to routine property inquiries",
      "Summarizing market and portfolio data for professional review",
    ],
    serviceSlugs: [
      "ai-chatbots-virtual-assistants",
      "data-analytics-predictive-intelligence",
      "workflow-automation-integration",
    ],
  },
];

export function getIndustry(slug: string) {
  return industries.find((industry) => industry.slug === slug);
}

const industryPageNames: Record<string, string> = {
  "human-resources": "HR",
  sales: "Sales",
  marketing: "Marketing",
  "finance-accounting": "Finance",
  "retail-ecommerce": "Retail",
  healthcare: "Healthcare",
  "legal-compliance": "Legal",
  education: "Education",
  manufacturing: "Manufacturing",
  "logistics-supply-chain": "Logistics",
  "customer-support": "Customer Support",
  "business-operations": "Business Operations",
  "it-software-development": "IT & Software Development",
  "real-estate": "Real Estate",
};

export function getIndustryPageName(slug: string) {
  const industry = getIndustry(slug);
  if (!industry) return undefined;
  return industryPageNames[slug] ?? industry.name;
}

export function getIndustryServices(industry: Industry) {
  return industry.serviceSlugs
    .map((slug) => services.find((service) => service.slug === slug))
    .filter((service) => service !== undefined);
}
