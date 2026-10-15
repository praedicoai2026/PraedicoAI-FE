import type { CaseStudy } from "@/types/content";
import { portfolioProjects } from "./portfolio";
export const caseStudies: CaseStudy[] = portfolioProjects
  .slice(0, 3)
  .map((project, index) => ({
    ...project,
    slug: `${project.slug}-study`,
    label: "Illustrative Case Study · Concept",
    projectType: "Illustrative Case Study",
    relatedServices: [
      ["application-modernization", "technology-consulting"],
      ["ai-agents", "workflow-consulting"],
      ["training", "web-application-development"],
    ][index],
    sections: [
      {
        title: "Executive summary",
        paragraphs: [
          project.summary,
          "Illustrative scenario created to explain a possible approach. It is not anonymized client work or a report of a real customer engagement.",
        ],
      },
      {
        title: "Background",
        paragraphs: [
          "This scenario explores a common design problem without referring to any employer, customer, or confidential application.",
        ],
      },
      {
        title: "Challenge",
        paragraphs: [
          project.sections.find((section) => section.title === "Problem")!
            .paragraphs[0],
        ],
      },
      {
        title: "Constraints",
        paragraphs: [
          "The brief is intentionally limited to a frontend concept. Operational, security, and integration assumptions would require validation in a real engagement.",
        ],
      },
      {
        title: "Discovery",
        paragraphs: [
          "Proposed discovery would identify primary users, review a representative journey, and record assumptions that need confirmation.",
        ],
      },
      {
        title: "Proposed solution",
        paragraphs: [
          project.sections.find(
            (section) => section.title === "Proposed approach",
          )!.paragraphs[0],
        ],
      },
      {
        title: "UI architecture",
        paragraphs: [
          "Use a clear content hierarchy, consistent page regions, and a small set of named interaction states.",
        ],
      },
      {
        title: "Component strategy",
        paragraphs: [
          "Separate reusable controls from domain-specific cards. Typed local data provides predictable inputs without simulating an API.",
        ],
      },
      {
        title: "Implementation approach",
        paragraphs: [
          "Build the smallest representative journey first, then extend shared components to adjacent screens. Document unresolved assumptions.",
        ],
      },
      {
        title: "Manual validation",
        paragraphs: [
          "Review navigation, keyboard operation, empty results, readable mobile layouts, and theme contrast with representative example content.",
        ],
      },
      {
        title: "Concept outcome",
        paragraphs: [
          `The proposed concept makes the main task and its decision context easier to inspect. It is a design direction only: no customer delivery, operational change, or measured business result is claimed. A real project would define its own acceptance criteria and evaluation evidence.`,
        ],
      },
      {
        title: "Lessons learned",
        paragraphs: [
          "Visible constraints make a concept more useful. A polished interface should not conceal missing evidence or an unvalidated decision.",
        ],
      },
      {
        title: "Future improvement",
        paragraphs: [
          "Seek real user feedback with permission, validate domain assumptions, and agree on integration boundaries before considering implementation beyond the frontend.",
        ],
      },
    ],
  }));
export const getCaseStudyBySlug = (slug: string) =>
  caseStudies.find((study) => study.slug === slug);
