import type { ContentSection, PortfolioProject } from "@/types/content";
export const portfolioCategories = [
  "Web Applications",
  "Enterprise Applications",
  "AI Concepts",
  "Workflow Concepts",
  "Digital Marketing",
  "AI Video",
  "Training",
  "Architecture",
  "Personal Branding",
  "UI Modernization",
];
const seeds = [
  {
    slug: "operations-workspace",
    title: "A clearer view of operations",
    summary:
      "A shop-floor workspace concept that brings work queues, exceptions, and decisions into one coherent interface.",
    category: "Enterprise Applications",
    tags: ["React", "TypeScript", "Architecture"],
    projectType: "UI Prototype",
    service: "Application Modernization",
    industry: "Manufacturing",
    challenge: "Information clarity",
    image: "/images/portfolio/operations.png",
    users: "Production coordinators and operations reviewers",
    problem:
      "Operational queues can hide urgent exceptions when every field receives equal emphasis.",
    approach:
      "Separate the queue, selected work item, and exception context. Keep decision history close to the action.",
  },
  {
    slug: "knowledge-assistant",
    title: "Knowledge, with human judgment",
    summary:
      "An AI knowledge-assistant concept centered on source visibility, uncertainty, and responsible handoffs.",
    category: "AI Concepts",
    tags: ["Responsible AI", "TypeScript", "Agent Design"],
    projectType: "Concept Project",
    service: "AI Agent Consulting",
    industry: "Professional Services",
    challenge: "Human oversight",
    image: "/images/portfolio/knowledge.png",
    users: "Internal knowledge workers and content reviewers",
    problem:
      "An answer without source context makes it difficult to judge whether a response should be trusted.",
    approach:
      "Design source previews, an explicit uncertainty state, and a human escalation path before considering model integration.",
  },
  {
    slug: "learning-hub",
    title: "A learning path with purpose",
    summary:
      "A course-discovery frontend that helps learners choose topics by audience, level, and available time.",
    category: "Training",
    tags: ["Next.js", "TypeScript", "Accessibility"],
    projectType: "Learning Project",
    service: "Training & Workshops",
    industry: "Education",
    challenge: "Content discovery",
    image: "/images/portfolio/learning.png",
    users: "Students, career changers, and working professionals",
    problem:
      "A long course catalog can make it difficult to identify an appropriate starting point.",
    approach:
      "Pair concise course summaries with combinable filters, transparent prerequisites, and an inquiry-based next step.",
  },
  {
    slug: "approval-workbench",
    title: "Every handoff, made visible",
    summary:
      "An approval-flow concept with explicit ownership, review context, and exception states.",
    category: "Workflow Concepts",
    tags: ["Process Mapping", "React", "Human Approval"],
    projectType: "Concept Project",
    service: "Workflow Consulting",
    industry: "Operations",
    challenge: "Process visibility",
    image: "/images/portfolio/operations.png",
    users: "Request owners and cross-functional approvers",
    problem:
      "A pending label rarely explains who owns the next step or what information is missing.",
    approach:
      "Represent ownership, required evidence, and escalation as distinct states. Keep the proposed workflow display-only.",
  },
  {
    slug: "professional-presence",
    title: "A professional story, connected",
    summary:
      "A personal-branding portfolio concept connecting expertise, writing, and a clear inquiry journey.",
    category: "Personal Branding",
    tags: ["Next.js", "Content Strategy", "SEO"],
    projectType: "Personal Project",
    service: "Web Application Development",
    industry: "Professional Services",
    challenge: "Content discovery",
    image: "/images/portfolio/learning.png",
    users: "Independent professionals and prospective collaborators",
    problem:
      "A résumé alone does not explain how expertise translates into services or learning opportunities.",
    approach:
      "Organize content around the visitor's question: who, what, how, and what to do next.",
  },
  {
    slug: "explain-with-video",
    title: "From idea to visual explanation",
    summary:
      "A storyboard concept for an accessible technology explainer, including script beats and caption planning.",
    category: "AI Video",
    tags: ["Storyboarding", "Content Strategy", "Accessibility"],
    projectType: "Concept Project",
    service: "AI Video Creation",
    industry: "Education",
    challenge: "Information clarity",
    image: "/images/portfolio/knowledge.png",
    users: "Educators and product communication teams",
    problem:
      "A technically accurate script can still overwhelm an audience unfamiliar with the terminology.",
    approach:
      "Begin with one learner question, use a concrete example, and plan captions alongside the storyboard.",
  },
];
function projectSections(seed: (typeof seeds)[number]): ContentSection[] {
  return [
    {
      title: "Project context",
      paragraphs: [
        seed.summary,
        "This is a demonstration brief. No client, confidential system, or verified delivery result is represented.",
      ],
    },
    { title: "Problem", paragraphs: [seed.problem] },
    { title: "Target users", paragraphs: [seed.users] },
    {
      title: "Objectives",
      paragraphs: [
        "Make the primary task understandable, expose the relevant context, and provide a clear next action.",
      ],
      bullets: [
        "Reduce ambiguity in navigation",
        "Make empty and error states useful",
        "Keep interfaces accessible across devices",
      ],
    },
    {
      title: "Constraints",
      paragraphs: [
        "Local demonstration content only. No real operational data, backend connections, authentication, or automated decisions.",
      ],
    },
    {
      title: "Role",
      paragraphs: [
        "Demonstration role: frontend architecture and UI/UX exploration. This is not a claim of work performed for a named customer.",
      ],
    },
    { title: "Proposed approach", paragraphs: [seed.approach] },
    {
      title: "UI/UX approach",
      paragraphs: [
        "Start with the primary journey, establish readable hierarchy, and design keyboard and small-screen interactions alongside the desktop layout.",
      ],
    },
    {
      title: "Frontend architecture",
      paragraphs: [
        "Separate typed content from presentation. Keep route-level composition on the server and isolate interactive controls in small Client Components.",
      ],
    },
    {
      title: "Main features",
      paragraphs: [],
      bullets: [
        "Responsive content layouts",
        "Local search and filtering concepts",
        "Explicit loading, empty, and feedback states",
        "Accessible navigation and labeled controls",
      ],
    },
    {
      title: "Manual validation approach",
      paragraphs: [
        "Walk through the main task using keyboard only, check mobile and desktop widths, combine filters, and review labels and contrast in both themes.",
      ],
    },
    {
      title: "Challenges",
      paragraphs: [
        "Balancing information density with useful context requires prioritization. A prototype helps reveal where additional domain input is needed.",
      ],
    },
    {
      title: "Learning",
      paragraphs: [
        "Clear data contracts and a small shared component vocabulary make it easier to explore variations without duplicating the whole interface.",
      ],
    },
    {
      title: "Concept outcome",
      paragraphs: [
        "The concept makes a user journey and its important interface states tangible enough to discuss and evaluate. It is not a production implementation, user-tested result, or claim of customer impact.",
      ],
    },
  ];
}
export const portfolioProjects: PortfolioProject[] = seeds.map(
  (seed, index) => ({
    ...seed,
    label: seed.projectType,
    featured: index < 3,
    imageAlt: `${seed.title}: illustrative concept interface, not a client screenshot`,
    sections: projectSections(seed),
  }),
);
export const getPortfolioProjectBySlug = (slug: string) =>
  portfolioProjects.find((project) => project.slug === slug);
