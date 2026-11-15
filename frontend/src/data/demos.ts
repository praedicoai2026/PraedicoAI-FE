export const demoCategories = [
  "AI Solutions",
  "AI Learning",
  "AI Products",
  "AI Research",
  "AI Community",
] as const;

export type DemoCategory = (typeof demoCategories)[number];

export interface DemoDefinition {
  slug: string;
  title: string;
  category: DemoCategory;
  industry: string;
  summary: string;
  problem: string;
  approach: string;
  highlights: string[];
  technology: string;
  estimatedUsageTime: string;
  sampleInput: string;
}

export const demos: DemoDefinition[] = [
  {
    slug: "sales-email-generator",
    title: "AI Sales Email Generator",
    category: "AI Solutions",
    industry: "Sales",
    summary:
      "Draft a concise follow-up email from a short, fictional sales scenario.",
    problem:
      "Sales teams often need to turn meeting notes into a clear next-step message without inventing account details or commitments.",
    approach:
      "The demo sends your short prompt to Google's Gemini API and asks it to create an editable draft. It has no CRM connection and does not send email.",
    highlights: [
      "Generates a subject line and draft",
      "Uses only the scenario you provide",
      "Keeps human review before sending",
    ],
    technology: "Google Gemini API (when enabled)",
    estimatedUsageTime: "About 1 minute",
    sampleInput:
      "A fictional operations director asked for a short follow-up after a product discovery call. Invite them to share their top workflow priority and suggest a 20-minute next conversation.",
  },
  {
    slug: "marketing-content-generator",
    title: "AI Marketing Content Generator",
    category: "AI Solutions",
    industry: "Marketing",
    summary:
      "Create a short, reviewable marketing draft from a product-neutral brief.",
    problem:
      "Starting a campaign draft can take time, and unsupported claims can make a first draft unsafe to publish.",
    approach:
      "Gemini receives your brief and returns a draft with factual details marked for verification. The demo has no brand library or publishing integration.",
    highlights: [
      "Creates concise draft copy",
      "Avoids fabricated statistics and guarantees",
      "Flags details that need verification",
    ],
    technology: "Google Gemini API (when enabled)",
    estimatedUsageTime: "About 1 minute",
    sampleInput:
      "Draft a friendly social post inviting small-business teams to a general AI workflow discovery session. Do not mention results, customer names, prices, or dates.",
  },
  {
    slug: "prompt-engineering-playground",
    title: "Prompt Engineering Playground",
    category: "AI Learning",
    industry: "Learning",
    summary:
      "Improve a general-purpose prompt and learn what makes it clearer.",
    problem:
      "A vague task prompt can produce inconsistent results and make it harder to review an AI response.",
    approach:
      "The demo suggests a clearer prompt, explains a few changes, and offers a verification tip. It does not execute external tools or access your files.",
    highlights: [
      "Reworks a task prompt",
      "Explains the prompt structure",
      "Adds a practical verification step",
    ],
    technology: "Google Gemini API (when enabled)",
    estimatedUsageTime: "About 1 minute",
    sampleInput:
      "Help me write a prompt that turns a public article into a short summary for a beginner, with key terms explained and claims to verify listed separately.",
  },
  {
    slug: "learning-roadmap-generator",
    title: "AI Learning Roadmap Generator",
    category: "AI Learning",
    industry: "Education",
    summary:
      "Get a flexible learning roadmap based on a topic, goal, and available time.",
    problem:
      "Learners may need help breaking a broad subject into manageable practice steps.",
    approach:
      "Gemini proposes a draft sequence based on the details you enter. It does not enroll you in a program or guarantee accreditation, placement, or outcomes.",
    highlights: [
      "Breaks a topic into stages",
      "Suggests practice activities",
      "Leaves pace and choices open to the learner",
    ],
    technology: "Google Gemini API (when enabled)",
    estimatedUsageTime: "About 1 minute",
    sampleInput:
      "I am new to generative AI and can study about three hours per week for six weeks. Suggest a beginner roadmap with hands-on practice and responsible-use topics.",
  },
  {
    slug: "research-brief-assistant",
    title: "AI Research Brief Assistant",
    category: "AI Research",
    industry: "Research",
    summary:
      "Turn a topic into research questions and a plan for finding evidence.",
    problem:
      "An early research idea can be easier to evaluate when its questions, scope, and evidence needs are explicit.",
    approach:
      "The demo structures a brief from your topic. It does not browse the web, verify research, or provide citations.",
    highlights: [
      "Suggests research questions",
      "Proposes methods and source types",
      "Avoids fabricated citations",
    ],
    technology: "Google Gemini API (when enabled)",
    estimatedUsageTime: "About 1 minute",
    sampleInput:
      "Prepare an initial research brief about ways small teams evaluate retrieval-augmented generation quality. List questions and evidence to seek, but do not claim findings.",
  },
  {
    slug: "project-idea-generator",
    title: "AI Project Idea Generator",
    category: "AI Community",
    industry: "Community",
    summary:
      "Explore small AI learning project ideas matched to a topic and skill level.",
    problem:
      "Learners and peers may want a practical starting point for a collaborative project.",
    approach:
      "Gemini suggests project concepts, first steps, and privacy considerations. Suggestions are not funded, endorsed, or scheduled community projects.",
    highlights: [
      "Generates scoped learning ideas",
      "Suggests a first step",
      "Includes a privacy or ethics check",
    ],
    technology: "Google Gemini API (when enabled)",
    estimatedUsageTime: "About 1 minute",
    sampleInput:
      "Suggest three beginner-friendly AI learning projects for a small student group interested in accessibility. Use public or synthetic data only and include a privacy check.",
  },
];

export function getDemo(slug: string) {
  return demos.find((demo) => demo.slug === slug);
}
