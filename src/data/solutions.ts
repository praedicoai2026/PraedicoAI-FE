import type { Solution } from "@/types/content";
const audiences = [
  {
    slug: "startups",
    title: "Startups",
    summary:
      "Give an early idea enough structure to discuss, demonstrate, and refine.",
    needs: [
      "Product idea presentation",
      "MVP frontend",
      "Landing pages and SaaS UI",
      "Technology consultation",
      "AI opportunity exploration",
      "Digital growth foundations",
    ],
    serviceSlugs: [
      "web-application-development",
      "technology-consulting",
      "ai-agents",
    ],
  },
  {
    slug: "enterprises",
    title: "Enterprises",
    summary:
      "Align complex systems, useful interfaces, and the people who depend on them.",
    needs: [
      "Frontend modernization",
      "Enterprise UX",
      "Architecture consulting",
      "AI adoption concepts",
      "Workflow discovery",
      "Digital transformation",
      "Training and enablement",
    ],
    serviceSlugs: [
      "application-modernization",
      "workflow-consulting",
      "training",
    ],
  },
  {
    slug: "professionals",
    title: "Professionals",
    summary:
      "Build a credible digital presence and a purposeful learning path.",
    needs: [
      "Personal branding",
      "Portfolio websites",
      "Technology mentoring",
      "AI learning",
      "Career-oriented training",
      "Professional content strategy",
      "Social media positioning",
    ],
    serviceSlugs: [
      "web-application-development",
      "social-media-growth",
      "training",
    ],
  },
  {
    slug: "students",
    title: "Students",
    summary:
      "Connect curiosity with practical projects and a stronger understanding of technology.",
    needs: [
      "Technology awareness",
      "Web-development learning",
      "Next.js learning",
      "AI fundamentals",
      "Career guidance",
      "Hands-on frontend projects",
      "Portfolio creation",
    ],
    serviceSlugs: ["training", "web-application-development"],
  },
  {
    slug: "educational-institutions",
    title: "Educational Institutions",
    summary:
      "Bring relevant technology conversations and hands-on learning to your community.",
    needs: [
      "Student workshops",
      "Faculty sessions",
      "AI awareness",
      "Web technology sessions",
      "Career-development programs",
      "Customized learning sessions",
    ],
    serviceSlugs: ["training", "ai-agents"],
  },
  {
    slug: "manufacturing",
    title: "Manufacturing & Operations",
    summary:
      "Explore clearer operational interfaces without exposing confidential production information.",
    needs: [
      "Enterprise manufacturing application concepts",
      "Shop-floor user experience",
      "MES UI modernization",
      "Dashboard concepts",
      "Workflow visibility",
      "Integration architecture concepts",
      "Training and knowledge sharing",
    ],
    serviceSlugs: [
      "application-modernization",
      "workflow-consulting",
      "technology-consulting",
    ],
  },
];
export const solutions: Solution[] = audiences.map((item) => ({
  ...item,
  category: "By audience",
  tags: item.needs.slice(0, 2),
  image: "/images/services/architecture.png",
  imageAlt: "Connected architectural layers",
  label: "Audience solution",
  sections: [
    {
      title: "Start with your context",
      paragraphs: [
        item.summary,
        "A useful first conversation identifies the people involved, the decisions they make, and the constraints that matter. Scope and delivery would be agreed separately.",
      ],
      bullets: item.needs,
    },
    {
      title: "A practical first step",
      paragraphs: [
        "Choose one high-value journey to explore. A focused discovery session, a visual prototype, or a tailored learning session can make assumptions visible before a larger commitment.",
      ],
      bullets: [
        "Clarify goals and intended users",
        "Map dependencies and constraints",
        "Agree on a small, reviewable deliverable",
      ],
    },
  ],
}));
export const getSolutionBySlug = (slug: string) =>
  solutions.find((solution) => solution.slug === slug);
