import type { Resource } from "@/types/content";
export const resources: Resource[] = [
  {
    title: "Frontend discovery checklist",
    type: "Checklist",
    audience: "Product teams",
    category: "Product discovery",
    summary:
      "Frame the user, task, constraints, interaction states, and evidence needed before designing a digital experience.",
    download: "/documents/frontend-discovery.txt",
  },
  {
    title: "Architecture decision record",
    type: "Decision template",
    audience: "Product and technical teams",
    category: "Software architecture",
    summary:
      "Capture the decision context, options, trade-offs, assumptions, ownership, and conditions that should trigger a review.",
    download: "/documents/architecture-decision.txt",
  },
  {
    title: "AI-agent discovery worksheet",
    type: "Worksheet",
    audience: "Business and product teams",
    category: "Applied AI",
    summary:
      "Bound an AI use case by its purpose, users, permitted information, human decisions, stopping conditions, and evaluation plan.",
    download: "/documents/ai-discovery.txt",
  },
  {
    title: "AI opportunity readiness checklist",
    type: "Checklist",
    audience: "Business and technology leaders",
    category: "AI adoption",
    summary:
      "Check problem fit, workflow ownership, data access, risk, evaluation, and operational readiness before starting an AI pilot.",
    download: "/documents/ai-readiness-checklist.txt",
  },
  {
    title: "AI evaluation plan",
    type: "Evaluation template",
    audience: "Product, AI, and quality teams",
    category: "Responsible AI",
    summary:
      "Define realistic test cases, expected behavior, failure handling, reviewer responsibilities, and evidence for a next-step decision.",
    download: "/documents/ai-evaluation-plan.txt",
  },
  {
    title: "Workflow opportunity map",
    type: "Workshop worksheet",
    audience: "Operations and product teams",
    category: "Workflow design",
    summary:
      "Map a process from trigger to outcome, including handoffs, decisions, exceptions, information, and safe automation opportunities.",
    download: "/documents/workflow-opportunity-map.txt",
  },
].map((resource, index) => ({
  ...resource,
  slug: `resource-${index + 1}`,
  tags: [resource.type],
  label: resource.download ? "Local sample resource" : "Coming Soon",
  image: "/images/training/learning.png",
  imageAlt: "Abstract document and learning modules",
  sections: [],
}));
