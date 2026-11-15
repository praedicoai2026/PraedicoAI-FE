export interface LearningAudience {
  slug: string;
  title: string;
  eyebrow: string;
  description: string;
  learningGoals: string[];
  programSlugs: string[];
  inquiryType: string;
  inquirySubject: string;
  inquiryMessage: string;
  primaryAction: string;
}

export const learningAudiences: LearningAudience[] = [
  {
    slug: "students",
    title: "AI Training for Students",
    eyebrow: "For students",
    description:
      "Build practical AI skills from fundamentals and generative AI through Python, machine learning, automation, and guided projects. Learning paths are designed for students and early-career learners, with no assumption that everyone wants to become an AI developer.",
    learningGoals: [
      "AI fundamentals, generative AI, and prompt engineering",
      "Python for AI and machine-learning foundations",
      "AI agents, no-code automation, and responsible use",
      "Hands-on assignments and projects shaped to experience level",
      "Discuss internship interests, eligibility, and current availability",
    ],
    programSlugs: [
      "ai-literacy-career-readiness",
      "ai-fundamentals",
      "generative-ai-prompt-engineering",
      "python-for-ai",
      "machine-learning-fundamentals",
      "ai-agents-intelligent-automation",
      "no-code-ai-automation",
    ],
    inquiryType: "AI Training for Individuals",
    inquirySubject: "AI training enquiry for students",
    inquiryMessage:
      "I am a student or early-career learner interested in AI training. Please share information about relevant topics, practical projects, formats, fees, and current availability.",
    primaryAction: "Enroll Now",
  },
  {
    slug: "professionals",
    title: "AI Training for Working Professionals",
    eyebrow: "For professionals",
    description:
      "Learn to apply practical AI tools to your existing profession—improving research, writing, analysis, planning, and repeatable workflows without requiring every learner to become a developer.",
    learningGoals: [
      "Choose role-relevant AI tools for day-to-day work",
      "Improve productivity in research, communication, analysis, and planning",
      "Use AI outputs with verification, privacy, and professional judgment",
      "Explore practical automation without a developer-first curriculum",
      "Apply learning to a current work task or workflow",
    ],
    programSlugs: [
      "ai-tools-for-professionals",
      "generative-ai-prompt-engineering",
      "no-code-ai-automation",
    ],
    inquiryType: "AI Training for Individuals",
    inquirySubject: "AI upskilling enquiry for professionals",
    inquiryMessage:
      "I am a working professional interested in practical AI training for my role. Please share information about relevant workflows, formats, fees, and availability.",
    primaryAction: "Enroll Now",
  },
  {
    slug: "industry-programs",
    title: "Industry-Specific AI Programs",
    eyebrow: "Learn for your profession",
    description:
      "Explore practical AI learning paths for professionals in HR, sales, marketing, finance, legal, retail, operations, business leadership, and education.",
    learningGoals: [
      "Apply AI tools to profession-specific tasks and workflows",
      "Practice with relevant examples, assignments, and review criteria",
      "Keep professional judgment, privacy, and verification central",
    ],
    programSlugs: [],
    inquiryType: "AI Training for Individuals",
    inquirySubject: "Industry-specific AI training enquiry",
    inquiryMessage:
      "I am interested in an industry-specific AI learning path. Please discuss role-relevant topics, practical assignments, formats, fees, and availability.",
    primaryAction: "Request an Industry Program",
  },
  {
    slug: "organizations",
    title: "Corporate AI Training",
    eyebrow: "For organizations",
    description:
      "Discuss practical AI awareness and skills development for teams, tailored to learner needs, approved tools, and organizational context.",
    learningGoals: [
      "Build shared AI literacy across teams and roles",
      "Practice role-specific AI workflows using appropriate sample data",
      "Discuss privacy, review, governance, and change-management needs",
      "Shape a proposed workshop or training outline around team goals",
    ],
    programSlugs: [
      "ai-strategy-leaders",
      "ai-managers-team-leaders",
      "ai-tools-for-professionals",
      "generative-ai-prompt-engineering",
      "no-code-ai-automation",
    ],
    inquiryType: "Corporate AI Training",
    inquirySubject: "Corporate AI training enquiry",
    inquiryMessage:
      "Our organization is exploring AI training for a team. Please share information about possible subjects, formats, and the details needed to discuss scope.",
    primaryAction: "Request Corporate Training",
  },
  {
    slug: "institutions",
    title: "College and Institutional Partnerships",
    eyebrow: "For institutions",
    description:
      "Explore AI learning and internship-program discussions for students and faculty, aligned to institutional goals and learner context.",
    learningGoals: [
      "Introduce AI fundamentals and responsible use",
      "Explore generative AI, Python, data, and application-development topics",
      "Discuss hands-on activities suited to learner experience",
      "Plan a conversation about training or internship-program requirements",
    ],
    programSlugs: [
      "ai-students-graduates",
      "ai-teachers-faculty",
      "ai-fundamentals",
      "python-for-ai",
      "machine-learning-fundamentals",
      "generative-ai-application-development",
    ],
    inquiryType: "College & Institutional Programs",
    inquirySubject: "College or institutional AI program enquiry",
    inquiryMessage:
      "Our college or institution is exploring AI learning or internship programs. Please share what information would be useful to discuss audience, learning goals, and format.",
    primaryAction: "Partner with Our Institution",
  },
];

export function getLearningAudience(slug: string) {
  return learningAudiences.find((audience) => audience.slug === slug);
}
