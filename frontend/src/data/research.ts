export const researchCategories = [
  "Generative AI",
  "Large Language Models",
  "Open-Source AI Models",
  "Retrieval-Augmented Generation",
  "AI Agent Architecture",
  "Multi-Agent Systems",
  "Agentic AI",
  "Computer Vision",
  "Natural Language Processing",
  "Machine Learning",
  "AI Automation",
  "Local AI and Edge AI",
];

export interface ResearchProject {
  slug: string;
  title: string;
  summary: string;
  status:
    | "Research Idea"
    | "Experimentation"
    | "Proof of Concept"
    | "Prototype"
    | "Completed"
    | "Published";
}

export const researchProjects: ResearchProject[] = [];
