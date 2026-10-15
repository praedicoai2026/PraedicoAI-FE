import type { TrainingCourse } from "@/types/content";
import { faqs } from "./faqs";
export const trainingTopics = [
  "Web development",
  "Next.js",
  "TypeScript",
  "Frontend architecture",
  "Software architecture",
  "AI fundamentals",
  "Generative AI awareness",
  "AI-agent concepts",
  "Workflow concepts",
  "Digital transformation",
  "Personal branding",
  "Digital marketing foundations",
  "Social media fundamentals",
];
const seeds = [
  {
    slug: "nextjs-foundations",
    title: "Build a thoughtful Next.js frontend",
    summary:
      "Learn routes, typed content, reusable components, and accessible interactions through a small portfolio project.",
    audience: "College students",
    level: "Beginner",
    topic: "Next.js",
    format: "Online workshop",
    duration: "2 sessions",
    prerequisites: [
      "Basic HTML and CSS",
      "Familiarity with JavaScript functions",
    ],
    objectives: [
      "Explain App Router page composition",
      "Separate local data from components",
      "Build a labeled interactive form",
    ],
    modules: [
      "The web platform and React foundations",
      "Routes, layouts, and Server Components",
      "TypeScript models and reusable cards",
      "Forms, responsive layouts, and manual review",
    ],
  },
  {
    slug: "typescript-in-practice",
    title: "TypeScript for everyday decisions",
    summary:
      "Make data shapes, component contracts, and interface states easier to reason about.",
    audience: "Working professionals",
    level: "Intermediate",
    topic: "TypeScript",
    format: "Online workshop",
    duration: "1 day",
    prerequisites: [
      "Working knowledge of JavaScript",
      "Basic React experience",
    ],
    objectives: [
      "Model a content catalog",
      "Narrow unions without unsafe casts",
      "Design typed component props",
    ],
    modules: [
      "Models and optional fields",
      "Unions and narrowing",
      "Typed component boundaries",
      "Refactoring a small frontend feature",
    ],
  },
  {
    slug: "responsible-ai-awareness",
    title: "AI opportunities, responsibly explored",
    summary:
      "Understand assistants, agents, human oversight, and the questions to ask before adopting AI.",
    audience: "Corporate teams",
    level: "Beginner",
    topic: "AI fundamentals",
    format: "Facilitated session",
    duration: "Half day",
    prerequisites: ["No programming experience required"],
    objectives: [
      "Distinguish assistants from agents",
      "Identify a bounded business use case",
      "Map human approval and information risks",
    ],
    modules: [
      "Generative AI and its limitations",
      "Knowledge, task, and process assistants",
      "Human approval and responsible use",
      "Use-case worksheet and group discussion",
    ],
  },
  {
    slug: "architecture-workshop",
    title: "Architecture that teams can explain",
    summary:
      "Practice making technical trade-offs explicit through context diagrams and short decision records.",
    audience: "Technology leaders",
    level: "Advanced",
    topic: "Software architecture",
    format: "In-person workshop",
    duration: "1 day",
    prerequisites: ["Experience working on software projects"],
    objectives: [
      "Describe system boundaries",
      "Record a technical trade-off",
      "Plan an incremental improvement",
    ],
    modules: [
      "Problem framing and constraints",
      "Context and component boundaries",
      "Decision records and risk review",
      "Roadmap critique and reflection",
    ],
  },
];
export const courses: TrainingCourse[] = seeds.map((seed, index) => ({
  ...seed,
  category: seed.topic,
  tags: [seed.topic, seed.level],
  image: "/images/training/learning.png",
  imageAlt: "Illustrative modular learning-path diagram",
  label: "Sample course outline",
  featured: index < 3,
  language: "[Confirm delivery language]",
  resources: [
    "Guided exercise outline",
    "Topic reference notes",
    "Reflection checklist",
  ],
  faqs: [faqs[4], faqs[0]],
  sections: seed.modules.map((title, moduleIndex) => ({
    title: `Module ${moduleIndex + 1}: ${title}`,
    paragraphs: [
      `Explore ${title.toLowerCase()} through a guided example, a discussion of trade-offs, and a short reflection. Depth and pacing will be adapted to the audience.`,
    ],
  })),
}));
export const getCourseBySlug = (slug: string) =>
  courses.find((course) => course.slug === slug);
