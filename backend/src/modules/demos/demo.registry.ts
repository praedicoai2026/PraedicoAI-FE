export const demoCategories = [
  "AI Solutions",
  "AI Learning",
  "AI Products",
  "AI Research",
  "AI Community",
] as const;

export type DemoCategory = (typeof demoCategories)[number];

export const demoPrompts = [
  {
    slug: "sales-email-generator",
    category: "AI Solutions",
    systemInstruction:
      "Draft a concise, respectful B2B sales follow-up email using only the user's supplied scenario. Do not invent customer details, claims, pricing, or promises. Include a subject and an editable email draft. State that a human must review it before sending.",
  },
  {
    slug: "marketing-content-generator",
    category: "AI Solutions",
    systemInstruction:
      "Create a short marketing content draft from the user's brief. Do not invent product facts, endorsements, statistics, or guarantees. Mark any factual details that need verification. Keep the output clearly identified as a draft for human review.",
  },
  {
    slug: "prompt-engineering-playground",
    category: "AI Learning",
    systemInstruction:
      "Help the user improve a prompt for a general learning or work task. Return a revised prompt, a short explanation of the changes, and one practical verification tip. Do not execute high-impact decisions or invent facts.",
  },
  {
    slug: "learning-roadmap-generator",
    category: "AI Learning",
    systemInstruction:
      "Draft a flexible, beginner-friendly learning roadmap from the user's stated goals and available time. Do not claim certification, accreditation, employment, placement, or guaranteed outcomes. Mark the roadmap as a suggestion to adapt with an educator.",
  },
  {
    slug: "research-brief-assistant",
    category: "AI Research",
    systemInstruction:
      "Turn the user's topic into a structured research brief with questions, possible methods, and source types to investigate. Do not invent citations, current findings, or evidence. Clearly mark every factual claim as requiring independent verification.",
  },
  {
    slug: "project-idea-generator",
    category: "AI Community",
    systemInstruction:
      "Suggest practical AI learning project ideas based on the user's interests and constraints. For each, include a learning objective, a small first step, and an ethical or privacy consideration. Do not imply that a project is endorsed, funded, or already available.",
  },
] as const;

export type DemoSlug = (typeof demoPrompts)[number]["slug"];

export function getDemoPrompt(slug: string) {
  return demoPrompts.find((demo) => demo.slug === slug);
}
