export type InternshipModule = {
  title: string;
  topics: string[];
  assignment: string;
};

export type InternshipProgram = {
  slug: string;
  title: string;
  summary: string;
  overview: string;
  targetAudience: string[];
  objectives: string[];
  modules: InternshipModule[];
  projectIdeas: string[];
  eligibility: string[];
};

export const internshipPrograms: InternshipProgram[] = [
  {
    slug: "generative-ai-intern",
    title: "Generative AI Intern",
    summary:
      "Explore generative AI concepts, prompting, retrieval, and quality evaluation through guided sample projects.",
    overview:
      "A proposed learning track for exploring generative AI applications, from prompt design and source-grounded answers to output evaluation and responsible use.",
    targetAudience: [
      "College students and early-career learners",
      "Learners interested in generative AI applications and content workflows",
    ],
    objectives: [
      "Explain common generative AI capabilities and limitations",
      "Design prompts and review outputs against clear criteria",
      "Explore retrieval over approved sample information",
      "Document privacy, reliability, and human-review considerations",
    ],
    modules: [
      {
        title: "Generative AI foundations",
        topics: [
          "Language models and common application patterns",
          "Capabilities, limitations, and responsible use",
        ],
        assignment:
          "Compare generated responses on a non-sensitive sample task and record errors and assumptions.",
      },
      {
        title: "Prompt design and evaluation",
        topics: [
          "Context, constraints, examples, and output formats",
          "Quality rubrics, factual review, and iteration",
        ],
        assignment:
          "Create and evaluate prompt variants against a documented response rubric.",
      },
      {
        title: "Knowledge-grounded applications",
        topics: [
          "Approved source materials and retrieval concepts",
          "Source attribution, access boundaries, and fallback behavior",
        ],
        assignment:
          "Sketch a source-grounded assistant for an approved sample knowledge set.",
      },
      {
        title: "Responsible prototype review",
        topics: [
          "Privacy and information handling",
          "Test cases, failure examples, and human handoff",
        ],
        assignment:
          "Present a prototype concept, its test cases, limitations, and review plan.",
      },
    ],
    projectIdeas: [
      "A source-linked FAQ assistant using sample public information",
      "A content-drafting workflow with fact-check and approval checkpoints",
    ],
    eligibility: [
      "Interest in generative AI and willingness to complete practical assignments",
      "Prior programming experience is not assumed for this track; confirm cohort-specific expectations before applying",
    ],
  },
  {
    slug: "ai-automation-intern",
    title: "AI Automation Intern",
    summary:
      "Learn to map repeatable work and design bounded automation concepts with testing, approvals, and exception handling.",
    overview:
      "A proposed track focused on workflow discovery, no-code or low-code automation concepts, and human-supervised AI steps for sample business processes.",
    targetAudience: [
      "Students and early-career learners interested in process improvement",
      "Learners exploring no-code or low-code automation",
    ],
    objectives: [
      "Map workflow steps, triggers, inputs, and exceptions",
      "Identify tasks that may be suitable for bounded automation",
      "Design approval, testing, and recovery checkpoints",
      "Evaluate an automation concept using practical quality criteria",
    ],
    modules: [
      {
        title: "Workflow discovery",
        topics: [
          "Process maps, repeated work, and handoffs",
          "Inputs, outputs, dependencies, and exception paths",
        ],
        assignment:
          "Document a sample workflow and identify assumptions and manual approvals.",
      },
      {
        title: "Automation building blocks",
        topics: [
          "Triggers, actions, conditions, and connectors",
          "Safe use of sample data and scoped permissions",
        ],
        assignment:
          "Design a low-risk automation flow for a fictional process.",
      },
      {
        title: "AI steps and human checkpoints",
        topics: [
          "Classification, extraction, and draft generation",
          "Human review, exception routing, and fallback behavior",
        ],
        assignment:
          "Add an AI-assisted step and define where a person must review the result.",
      },
      {
        title: "Testing and documentation",
        topics: [
          "Normal cases, edge cases, and failure handling",
          "Quality checks, change notes, and operational limits",
        ],
        assignment:
          "Create a test checklist and present a bounded workflow proposal.",
      },
    ],
    projectIdeas: [
      "A document intake and human-approval workflow concept",
      "A meeting follow-up workflow using sample notes and review steps",
    ],
    eligibility: [
      "Interest in business processes, automation, and practical problem-solving",
      "No-code experience may be useful but is not assumed; specific tool requirements must be confirmed for a cohort",
    ],
  },
  {
    slug: "ai-agent-development-intern",
    title: "AI Agent Development Intern",
    summary:
      "Study agent patterns, tool use, retrieval, and evaluation through bounded, human-supervised application concepts.",
    overview:
      "A proposed technical learning track covering agent architecture and controlled tool use. The emphasis is on permissions, predictable limits, testing, and human approval rather than unrestricted autonomy.",
    targetAudience: [
      "Students and early-career learners interested in AI application development",
      "Learners with foundational programming experience or a willingness to build it",
    ],
    objectives: [
      "Describe agent components, tools, state, and task boundaries",
      "Design constrained tool interactions and approval checkpoints",
      "Test agent behavior with representative cases and failures",
      "Communicate limitations, permissions, and recovery behavior",
    ],
    modules: [
      {
        title: "Agent concepts and boundaries",
        topics: [
          "Models, instructions, tools, and task decomposition",
          "Deterministic workflows versus agent patterns",
        ],
        assignment:
          "Define an agent use case with explicit allowed and disallowed actions.",
      },
      {
        title: "Tools and information retrieval",
        topics: [
          "Structured tool inputs and outputs",
          "Approved knowledge retrieval and access boundaries",
        ],
        assignment:
          "Design tool schemas and a sample retrieval flow with validation.",
      },
      {
        title: "State, approvals, and recovery",
        topics: [
          "Workflow state and step-by-step execution",
          "Human approval, retries, and safe failure paths",
        ],
        assignment:
          "Create a sequence diagram for an agent task with approval and recovery steps.",
      },
      {
        title: "Evaluation and demonstration",
        topics: [
          "Test cases, trace review, and task success criteria",
          "Security, privacy, and operational limitations",
        ],
        assignment:
          "Present a constrained agent prototype or design with an evaluation summary.",
      },
    ],
    projectIdeas: [
      "A read-only research assistant that cites approved sources",
      "A task-planning prototype that pauses for approval before any action",
    ],
    eligibility: [
      "Interest in AI agents and application workflows",
      "Basic programming or API familiarity may be expected; confirm prerequisites for the specific cohort",
    ],
  },
  {
    slug: "python-machine-learning-intern",
    title: "Python and Machine Learning Intern",
    summary:
      "Build foundational Python and machine-learning skills through data exercises, model evaluation, and a scoped project.",
    overview:
      "A proposed technical track for learners developing Python foundations and exploring the machine-learning lifecycle with carefully prepared sample datasets.",
    targetAudience: [
      "Students and early-career learners interested in Python and machine learning",
      "Learners ready to practice coding and data concepts",
    ],
    objectives: [
      "Use Python fundamentals to work with structured data",
      "Explain basic supervised and unsupervised learning concepts",
      "Prepare data and evaluate a model using appropriate measures",
      "Recognize data quality, bias, and model limitations",
    ],
    modules: [
      {
        title: "Python foundations",
        topics: [
          "Variables, collections, functions, and control flow",
          "Files, notebooks, and readable code",
        ],
        assignment:
          "Complete a small Python exercise to load, inspect, and summarize sample data.",
      },
      {
        title: "Data preparation and exploration",
        topics: [
          "Structured data, missing values, and simple transformations",
          "Exploratory analysis and visualization",
        ],
        assignment:
          "Prepare an approved sample dataset and record quality decisions.",
      },
      {
        title: "Machine-learning fundamentals",
        topics: [
          "Common learning tasks and train/test separation",
          "Baseline models and evaluation measures",
        ],
        assignment:
          "Compare a baseline model with a simple alternative and explain the evaluation.",
      },
      {
        title: "Project review and responsible interpretation",
        topics: [
          "Model limitations, uncertainty, and potential bias",
          "Reproducibility, documentation, and communication",
        ],
        assignment:
          "Present a small analysis with limitations and responsible-use notes.",
      },
    ],
    projectIdeas: [
      "A sample-data classification or forecasting exercise",
      "A documented exploratory analysis with model evaluation",
    ],
    eligibility: [
      "Interest in coding, data, and machine learning",
      "Prior Python experience is not assumed, but regular coding practice is part of the proposed track",
    ],
  },
  {
    slug: "ai-application-development-intern",
    title: "AI Application Development Intern",
    summary:
      "Explore how AI capabilities can be integrated into applications through requirements, interface, API, and evaluation exercises.",
    overview:
      "A proposed application-building track for learners interested in connecting AI capabilities to user-facing software with attention to privacy, reliability, and quality.",
    targetAudience: [
      "Students and early-career learners interested in software and AI products",
      "Learners with basic programming or web-development familiarity",
    ],
    objectives: [
      "Translate a user need into a small AI-enabled application brief",
      "Understand basic model API and structured-response patterns",
      "Design validation, error handling, and user feedback",
      "Evaluate a prototype for usability, privacy, and reliability",
    ],
    modules: [
      {
        title: "Problem framing and product design",
        topics: [
          "User needs, task boundaries, and non-AI alternatives",
          "Interaction flow and success criteria",
        ],
        assignment:
          "Write a short product brief and sketch a workflow for a bounded use case.",
      },
      {
        title: "AI integration concepts",
        topics: [
          "Model APIs, prompts, and structured responses",
          "Backend boundaries, keys, and data handling",
        ],
        assignment:
          "Design an API interaction with input validation and a clear error state.",
      },
      {
        title: "Application experience and reliability",
        topics: [
          "User feedback, loading, and fallback states",
          "Output review, limits, and source presentation",
        ],
        assignment:
          "Create interface states for a successful, uncertain, and failed response.",
      },
      {
        title: "Testing and project presentation",
        topics: [
          "Representative test cases and evaluation",
          "Privacy, accessibility, and implementation limitations",
        ],
        assignment:
          "Demonstrate a scoped prototype or design and summarize its test results.",
      },
    ],
    projectIdeas: [
      "A study or knowledge assistant grounded in approved sample content",
      "An AI-assisted form or reporting feature with human review",
    ],
    eligibility: [
      "Interest in software application development and AI",
      "Basic programming experience is helpful; exact language and prerequisites depend on the confirmed cohort",
    ],
  },
  {
    slug: "data-analytics-intern",
    title: "Data Analytics Intern",
    summary:
      "Practice turning prepared data into verified summaries, visualizations, and clear analytical communication.",
    overview:
      "A proposed analytics track focused on data quality, exploration, visualization, AI-assisted analysis, and evidence-based communication using approved sample datasets.",
    targetAudience: [
      "Students and early-career learners interested in analytics and business intelligence",
      "Learners interested in data storytelling and practical reporting",
    ],
    objectives: [
      "Inspect and prepare a structured dataset",
      "Explore questions with descriptive analysis and visualizations",
      "Use AI assistance while independently validating calculations and claims",
      "Present findings with context, uncertainty, and limitations",
    ],
    modules: [
      {
        title: "Data questions and quality",
        topics: [
          "Analytical questions, sources, and data dictionaries",
          "Completeness, consistency, and data limitations",
        ],
        assignment:
          "Profile an approved sample dataset and document data-quality concerns.",
      },
      {
        title: "Exploration and visualization",
        topics: [
          "Descriptive statistics and comparisons",
          "Choosing charts to answer a defined question",
        ],
        assignment:
          "Create a small set of visualizations and explain what each does and does not show.",
      },
      {
        title: "AI-assisted analysis",
        topics: [
          "Using AI for query, formula, or narrative drafts",
          "Verifying outputs against source data",
        ],
        assignment:
          "Review an AI-assisted summary and independently check each key claim.",
      },
      {
        title: "Reporting and communication",
        topics: [
          "Evidence-based narratives and stakeholder context",
          "Uncertainty, bias, and responsible recommendations",
        ],
        assignment:
          "Present a concise analytical report with assumptions and limitations.",
      },
    ],
    projectIdeas: [
      "A sample-data dashboard and written insight summary",
      "A business question analysis with visual evidence and caveats",
    ],
    eligibility: [
      "Interest in data, analysis, and communicating findings",
      "Spreadsheet familiarity is helpful; any required software or coding prerequisites must be confirmed for a cohort",
    ],
  },
];

export function getInternshipProgram(slug: string) {
  return internshipPrograms.find((program) => program.slug === slug);
}
