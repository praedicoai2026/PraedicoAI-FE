import type { ContentSection, PortfolioProject } from "@/types/content";
export const portfolioCategories = [
  "Web Applications",
  "Enterprise Applications",
  "AI Concepts",
  "AI Product Strategy",
  "Workflow Concepts",
  "Digital Marketing",
  "AI Video",
  "Training",
  "Architecture",
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
    service: "Applied AI & Agent Design",
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
    category: "Learning Experience",
    tags: ["Next.js", "TypeScript", "Accessibility"],
    projectType: "Learning Project",
    service: "Learning Experience Design",
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
    slug: "ai-product-presence",
    title: "An AI product story people can understand",
    summary:
      "A startup website concept that explains an AI product's purpose, limits, and next step without relying on unsupported performance claims.",
    category: "AI Product Strategy",
    tags: ["Product Positioning", "UX Writing", "Next.js"],
    projectType: "Concept Project",
    service: "Web Application Development",
    industry: "Technology Startups",
    challenge: "Content discovery",
    image: "/images/portfolio/learning.png",
    users: "Prospective users, buyers, and product collaborators",
    problem:
      "AI product sites can overemphasize model capabilities while leaving intended users unsure about the actual workflow, limitations, and evidence.",
    approach:
      "Organize the story around the user's task: the current challenge, what the product assists with, where human judgment remains, and what a safe next step looks like.",
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
  const highlights: Record<
    string,
    { objectives: string[]; features: string[]; validation: string[] }
  > = {
    "operations-workspace": {
      objectives: [
        "Help an operations reviewer identify the next item that needs attention",
        "Keep exceptions and supporting context visible alongside the work queue",
        "Make status and ownership understandable without relying on color alone",
      ],
      features: [
        "Prioritized work queue with clear status labels",
        "Selected-work detail view with issue and decision context",
        "Distinct states for delayed, blocked, and review-required work",
        "Responsive layout for a dense operational interface",
      ],
      validation: [
        "Can a reviewer find the next item requiring attention?",
        "Can the user distinguish an exception from routine work?",
        "Can the status and next owner be understood at mobile widths?",
      ],
    },
    "knowledge-assistant": {
      objectives: [
        "Help a knowledge worker inspect relevant guidance before acting",
        "Make the source and its relevant context visible",
        "Show how the experience responds when evidence is missing",
      ],
      features: [
        "Source-preview and evidence states",
        "Explicit uncertainty and no-answer handling",
        "Human review and escalation points",
        "Permission and content-freshness questions represented in the flow",
      ],
      validation: [
        "Does the cited source actually support the proposed response?",
        "Does the interface clearly handle stale, conflicting, or missing evidence?",
        "Can a reviewer reject or escalate an unsupported answer?",
      ],
    },
    "learning-hub": {
      objectives: [
        "Help learners compare a course with their goals and starting level",
        "Make prerequisites and sample outcomes clear before an inquiry",
        "Keep the next action useful without implying enrollment",
      ],
      features: [
        "Course discovery by topic and learner level",
        "Visible prerequisites, outline, and learning objectives",
        "Readable empty and filtered-result states",
        "Inquiry path that does not imply booking or enrollment",
      ],
      validation: [
        "Can a learner identify an appropriate starting course?",
        "Are prerequisites and sample-outline limitations clear?",
        "Can the catalog be navigated with a keyboard and small screen?",
      ],
    },
    "approval-workbench": {
      objectives: [
        "Show who owns the next process step",
        "Expose the evidence required for a review",
        "Make exception routing and escalation visible",
      ],
      features: [
        "Owner, status, and next-action indicators",
        "Review context and missing-evidence states",
        "Separate routine approvals from exceptions",
        "Decision-history concept for process traceability",
      ],
      validation: [
        "Can a requester see who owns the current step?",
        "Can an approver identify what evidence is missing?",
        "Are exceptions and escalation paths distinguishable from routine flow?",
      ],
    },
    "ai-product-presence": {
      objectives: [
        "Explain the intended user and task before presenting AI capabilities",
        "Make product limits and human responsibilities easy to find",
        "Offer a next step without making unverified performance claims",
      ],
      features: [
        "Problem-first product narrative",
        "Plain-language explanation of AI-assisted tasks",
        "Visible data, limitation, and human-review notes",
        "Clear evaluation and inquiry journey",
      ],
      validation: [
        "Can a prospective user explain the product's intended task?",
        "Are limitations and human review as visible as potential benefits?",
        "Does the page avoid implying unverified customer results?",
      ],
    },
    "explain-with-video": {
      objectives: [
        "Structure a technical explanation around one audience question",
        "Make the narrative understandable without relying on visuals alone",
        "Plan accessibility and review as part of the content",
      ],
      features: [
        "Audience and learning objective",
        "Script outline with a concrete example",
        "Storyboard beats and visual descriptions",
        "Caption and transcript planning",
      ],
      validation: [
        "Can the intended audience follow the explanation without unexplained jargon?",
        "Does the script communicate one clear idea?",
        "Are captions, transcript, and visual alternatives planned?",
      ],
    },
  };
  const detail = highlights[seed.slug];
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
        "This concept explores how to make the task, decision context, and next action explicit for the intended user.",
      ],
      bullets: detail.objectives,
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
      bullets: detail.features,
    },
    {
      title: "Manual validation approach",
      paragraphs: [
        "Use these questions to review the proposed experience with representative, non-confidential examples. A real deployment would need domain-specific testing and user feedback.",
      ],
      bullets: detail.validation,
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
