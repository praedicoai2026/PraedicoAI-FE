export const leadCategories = [
  {
    slug: "ai-business-solutions",
    category: "AI Business Solutions",
    vertical: "AI Business Solutions",
    formKind: "business",
    description:
      "Discuss AI consulting, automation, application development, or another business solution.",
  },
  {
    slug: "ai-consulting",
    category: "AI Consulting",
    vertical: "AI Business Solutions",
    formKind: "business",
    description:
      "Share your goals and request an AI strategy or discovery conversation.",
  },
  {
    slug: "ai-automation",
    category: "AI Automation",
    vertical: "AI Business Solutions",
    formKind: "business",
    description:
      "Tell us about a workflow or process you are exploring for automation.",
  },
  {
    slug: "ai-application-development",
    category: "AI Application Development",
    vertical: "AI Business Solutions",
    formKind: "business",
    description:
      "Describe the AI-powered application or integration you want to explore.",
  },
  {
    slug: "student-ai-training",
    category: "Student AI Training",
    vertical: "AI Learning",
    formKind: "student",
    description:
      "Ask about practical AI programs, projects, and learning opportunities for students.",
  },
  {
    slug: "professional-ai-training",
    category: "Professional AI Training",
    vertical: "AI Learning",
    formKind: "professional",
    description:
      "Explore practical AI learning designed around your current profession.",
  },
  {
    slug: "ai-internships",
    category: "AI Internships",
    vertical: "AI Learning",
    formKind: "student",
    description:
      "Share your background and the AI internship track you are interested in.",
  },
  {
    slug: "corporate-training",
    category: "Corporate Training",
    vertical: "AI Learning",
    formKind: "business",
    description:
      "Request a conversation about AI training for your employees or organization.",
  },
  {
    slug: "college-partnerships",
    category: "College Partnerships",
    vertical: "AI Learning",
    formKind: "institution",
    description:
      "Discuss AI training, internship, or institutional partnership opportunities.",
  },
  {
    slug: "product-interest",
    category: "AI Product Interest",
    vertical: "AI Business Solutions",
    formKind: "interest",
    description:
      "Register interest in an early AI product concept. Product ideas are not currently available products or working demos.",
  },
  {
    slug: "community-membership",
    category: "AI Community",
    vertical: "AI Learning",
    formKind: "interest",
    description:
      "Share the AI topics and community activities you would be interested in. Membership and activities are not yet active programs.",
  },
  {
    slug: "research-interest",
    category: "AI Research Interest",
    vertical: "AI Learning",
    formKind: "interest",
    description:
      "Share the responsible AI research topics, collaboration ideas, or learning interests you would like to explore.",
  },
] as const;

export type LeadCategory = (typeof leadCategories)[number]["category"];
export type LeadFormKind = (typeof leadCategories)[number]["formKind"];

export function getLeadCategoryBySlug(slug: string) {
  return leadCategories.find((item) => item.slug === slug);
}
