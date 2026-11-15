export interface SeoPageOverride {
  title: string;
  description: string;
}

export const seoPageOverrides: Record<string, SeoPageOverride> = {
  "/services": {
    title: "AI Solutions Company for Businesses",
    description:
      "Explore business-focused AI consulting, automation, agent design, and custom application services. Start with your goals, workflows, and constraints.",
  },
  "/services/workflow-automation-integration": {
    title: "AI Automation Services & Workflow Integration",
    description:
      "Explore AI automation services for repeatable workflows, handoffs, and system integrations, with approvals, exceptions, and process ownership kept visible.",
  },
  "/services/ai-consulting-strategy": {
    title: "AI Consulting Services & Strategy",
    description:
      "Discuss AI readiness, use-case priorities, data and integration constraints, and a practical adoption roadmap before committing to implementation.",
  },
  "/services/ai-agents": {
    title: "AI Agents Development & Design",
    description:
      "Explore bounded AI agent and multi-agent concepts with defined data access, evaluation criteria, human review, and operational responsibilities.",
  },
  "/industries/human-resources": {
    title: "AI Solutions for HR",
    description:
      "Explore AI opportunities for HR knowledge, onboarding content, and administrative workflows while protecting employee information and human oversight.",
  },
  "/industries/sales": {
    title: "AI Solutions for Sales",
    description:
      "Explore AI-assisted sales research, follow-up drafts, CRM workflows, and reporting using approved information and accountable human review.",
  },
  "/industries/marketing": {
    title: "AI Solutions for Marketing",
    description:
      "Explore generative AI for marketing research, campaign planning, content workflows, and measurement with brand and factual review.",
  },
  "/industries/finance-accounting": {
    title: "AI Solutions for Finance",
    description:
      "Explore AI-assisted finance document handling, reporting, and analysis with validated calculations, approved data, and accountable review.",
  },
  "/industries/retail-ecommerce": {
    title: "AI Solutions for Retail",
    description:
      "Explore AI for retail product information, customer support, feedback analysis, and operational workflows with human review.",
  },
  "/programs": {
    title: "Practical AI Training Programs",
    description:
      "Explore proposed AI training programs for students, professionals, organizations, and institutions, with practical topics and enquiry-based scope.",
  },
  "/internships": {
    title: "AI Internship Programs",
    description:
      "Explore proposed internship learning tracks in generative AI, automation, agents, Python, machine learning, applications, and data analytics.",
  },
  "/programs/generative-ai-prompt-engineering": {
    title: "Generative AI Training & Prompt Engineering",
    description:
      "Explore a proposed generative AI and prompt engineering curriculum covering practical use, output review, responsible use, and hands-on exercises.",
  },
  "/learning/professionals": {
    title: "AI Tools for Professionals",
    description:
      "Explore practical AI tools and role-specific workflows for working professionals, with an emphasis on productivity, verification, and responsible use.",
  },
  "/learning/students": {
    title: "AI Training for College Students",
    description:
      "Explore practical AI training for college students, including AI fundamentals, generative AI, Python, machine learning, automation, and projects.",
  },
  "/programs/hr": {
    title: "AI Training for HR Professionals",
    description:
      "Explore proposed AI learning for HR professionals, covering practical HR workflows, employee-data care, human review, and responsible tool use.",
  },
  "/programs/sales-business-development": {
    title: "AI Training for Sales Professionals",
    description:
      "Explore proposed AI learning for sales professionals, including account research, outreach drafts, CRM workflows, and human review.",
  },
  "/programs/marketing": {
    title: "AI Training for Marketing Professionals",
    description:
      "Explore proposed AI learning for marketing professionals, including research, content workflows, campaign planning, and brand-safe review.",
  },
  "/learning/organizations": {
    title: "Corporate AI Training for Teams",
    description:
      "Discuss practical AI training for organizational teams, tailored to learner roles, approved tools, workplace workflows, and responsible use.",
  },
  "/products": {
    title: "AI Products & Platforms | Early Product Ideas",
    description:
      "Explore PraedicoAI's early concepts for AI business assistants, workflow automation, and organizational intelligence. Concepts are not available products or demos.",
  },
  "/research": {
    title: "AI Research & Innovation Interests",
    description:
      "Explore PraedicoAI's research interests in generative AI, machine learning, retrieval systems, AI agents, and responsible automation.",
  },
  "/community": {
    title: "AI Community & Institutional Partnerships",
    description:
      "Register interest in AI learning communities, events, project collaboration, and institutional partnerships with PraedicoAI.",
  },
  "/demos": {
    title: "AI Demo Center | Interactive AI Previews",
    description:
      "Explore responsible AI demos for business workflows, learning, research, and community projects. Each demo's status and limitations are clearly identified.",
  },
};

const noIndexPaths = new Set(["/enquiry", "/register", "/admin", "/demo"]);

export function isNoIndexPath(path: string) {
  const normalizedPath = path.length > 1 ? path.replace(/\/+$/, "") : path;
  return (
    noIndexPaths.has(normalizedPath) ||
    normalizedPath.startsWith("/enquiry/") ||
    normalizedPath.startsWith("/admin/") ||
    normalizedPath.startsWith("/demo/")
  );
}
