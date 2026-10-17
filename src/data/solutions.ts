import type { Solution } from "@/types/content";
const audiences = [
  {
    slug: "startups",
    title: "Startups",
    summary:
      "Test an AI-enabled product idea against a real user problem before investing in a polished demo or a larger build.",
    approach:
      "Clarify the user and unmet need, compare AI with simpler approaches, and choose one end-to-end journey to prototype. Make data dependencies, evaluation criteria, and the smallest useful release explicit.",
    needs: [
      "AI product discovery and problem validation",
      "Prototype scope and first-release priorities",
      "Assistant, copilot, or agent interaction design",
      "Knowledge and data-source feasibility",
      "MVP frontend and application architecture",
      "Evaluation plan and investor-ready product narrative",
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
      "Connect AI adoption to enterprise workflows, information controls, existing systems, and accountable operations.",
    approach:
      "Start with a bounded workflow and its owners. Map permissions, source systems, integration boundaries, human approvals, and failure handling before deciding whether a pilot is appropriate.",
    needs: [
      "AI readiness and use-case prioritization",
      "Knowledge assistant and internal search concepts",
      "Workflow copilots with human approval",
      "Data access and integration planning",
      "Application modernization and experience design",
      "Evaluation, risk, and operational ownership",
      "AI literacy and team enablement",
    ],
    serviceSlugs: [
      "application-modernization",
      "workflow-consulting",
      "training",
    ],
  },
  {
    slug: "professionals",
    title: "Professional Teams",
    summary:
      "Help specialists and small teams use AI and digital tools thoughtfully to improve repeatable work without losing expertise or accountability.",
    approach:
      "Identify a repeatable task or learning goal, select tools that fit the sensitivity of the information involved, and keep important decisions under human control.",
    needs: [
      "AI-assisted work practices",
      "Portfolio websites",
      "Practical AI literacy and tool evaluation",
      "Technology mentoring",
      "Responsible AI use in daily work",
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
      "Build AI and software understanding through guided projects that teach how tools work, where they fail, and how to verify results.",
    approach:
      "Pair foundational concepts with small, explainable exercises. Emphasize source checking, privacy, attribution, and learning rather than using generated answers as a substitute for understanding.",
    needs: [
      "Technology awareness",
      "Web-development learning",
      "Next.js learning",
      "Generative AI fundamentals and limitations",
      "Prompting, verification, and responsible use",
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
      "Support educators and learners with practical AI literacy, safe-use discussions, and technology workshops shaped around the institution's goals.",
    approach:
      "Align the session with learner age, curriculum, policies, and educator needs. Use non-sensitive examples and make clear where AI output needs human checking.",
    needs: [
      "Student workshops",
      "Faculty sessions",
      "AI literacy and safe-use awareness",
      "Generative AI limitations and verification",
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
      "Explore how AI-assisted knowledge and workflow experiences could support operational teams without bypassing safety, process ownership, or established controls.",
    approach:
      "Begin with a non-sensitive process walkthrough. Identify where information is fragmented, what decisions are safety- or quality-critical, and what a person must always verify.",
    needs: [
      "Operational AI opportunity discovery",
      "Enterprise manufacturing application concepts",
      "Shop-floor user experience",
      "MES UI modernization",
      "Dashboard concepts",
      "Workflow visibility",
      "Knowledge assistant concepts for approved procedures",
      "Integration and information-access planning",
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
        item.approach,
        "A useful first conversation identifies the people involved, the decisions they make, the information they can use, and the constraints that matter. Scope and delivery would be agreed separately.",
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
