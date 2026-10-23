import { programs, type Program, type ProgramFormat } from "@/data/programs";

export type SectorSubject = {
  slug: string;
  title: string;
  summary: string;
  focusAreas: string[];
  experienceLevel: string;
  safeguards?: string[];
  existingProgramSlug?: string;
};

export type ProgramSector = {
  id: string;
  name: string;
  slug: string;
  description: string;
  audience: string[];
  challenges: string[];
  useCases: string[];
  subjects: SectorSubject[];
};

const entries = (value: string): SectorSubject[] =>
  value.split("\n").map((line) => {
    const [slug, title, summary, focus, safeguards] = line.split("|");
    return {
      slug,
      title,
      summary,
      focusAreas: focus.split(";"),
      experienceLevel: "Beginner to intermediate; adaptable to the audience",
      safeguards: safeguards?.split(";"),
    };
  });

const sectorsBase: Omit<ProgramSector, "subjects">[] = [
  {
    id: "it-software",
    name: "IT & Software Development",
    slug: "it-software",
    description:
      "Explore practical ways to use AI across software engineering, application development, automation, and quality assurance.",
    audience: ["Developers", "Testers", "IT teams", "Technology leaders"],
    challenges: [
      "Keeping pace with rapidly changing engineering tools",
      "Reducing repetitive development and testing work without compromising quality",
      "Integrating AI features safely into existing applications",
    ],
    useCases: [
      "AI-assisted coding, debugging, and documentation",
      "Application and workflow prototypes",
      "Test planning, API integration, and responsible automation",
    ],
  },
  {
    id: "hr",
    name: "Human Resources (HR)",
    slug: "hr",
    description:
      "Explore AI-assisted HR communication, documentation, learning, and administration with privacy and human oversight at the center.",
    audience: [
      "HR professionals",
      "Recruiters",
      "People operations",
      "L&D teams",
    ],
    challenges: [
      "Managing recurring documentation and communication work",
      "Making employee information useful while protecting its confidentiality",
      "Using AI responsibly in sensitive people-related processes",
    ],
    useCases: [
      "Drafting job descriptions, onboarding content, and employee FAQs",
      "Summarizing approved survey themes and HR reports",
      "Creating learning materials with human review",
    ],
  },
  {
    id: "sales-business-development",
    name: "Sales and Business Development",
    slug: "sales-business-development",
    description:
      "Apply AI to sales research, communication, CRM workflows, and reporting while retaining human judgment and responsible personalization.",
    audience: [
      "Sales representatives",
      "Business development",
      "Account teams",
      "Sales leaders",
    ],
    challenges: [
      "Preparing for accounts and conversations efficiently",
      "Maintaining useful CRM records and timely follow-up",
      "Personalizing communication without unsupported claims or inappropriate data use",
    ],
    useCases: [
      "Approved-source account research and meeting preparation",
      "Drafting and reviewing outreach and proposals",
      "Summarizing pipeline information and sales activity",
    ],
  },
  {
    id: "marketing",
    name: "Marketing and Communications",
    slug: "marketing",
    description:
      "Use generative AI to support research, content, campaigns, and measurement while protecting brand quality and factual accuracy.",
    audience: [
      "Marketing teams",
      "Content creators",
      "Communications professionals",
      "Campaign managers",
    ],
    challenges: [
      "Producing relevant content across channels and audiences",
      "Connecting campaign activity to clear evaluation measures",
      "Maintaining originality, brand voice, and factual reliability",
    ],
    useCases: [
      "Campaign ideation, content briefs, and copy variations",
      "Search-intent and content planning",
      "Performance summaries and testing plans",
    ],
  },
  {
    id: "finance",
    name: "Finance and Accounting",
    slug: "finance",
    description:
      "Explore AI-supported financial document and reporting workflows using synthetic or approved sample data, with validation and human review.",
    audience: [
      "Finance professionals",
      "Accountants",
      "Business analysts",
      "Finance leaders",
    ],
    challenges: [
      "Reviewing and summarizing recurring financial documents",
      "Preparing reports while validating calculations and assumptions",
      "Protecting confidential financial information",
    ],
    useCases: [
      "Document extraction and exception routing",
      "Variance summaries and spreadsheet assistance",
      "Risk indicators and scenario analysis for human review",
    ],
  },
  {
    id: "education",
    name: "Education and Academia",
    slug: "education",
    description:
      "Use AI thoughtfully to support teaching, learning, research, and academic workflows while maintaining integrity and educator oversight.",
    audience: [
      "Teachers and faculty",
      "Students",
      "Researchers",
      "Academic teams",
    ],
    challenges: [
      "Preparing differentiated learning materials and assessments",
      "Supporting research and study without replacing learner effort",
      "Maintaining academic integrity and checking generated content",
    ],
    useCases: [
      "Lesson outlines, practice questions, and rubric drafts",
      "Study planning and research organization",
      "Reviewing summaries, citations, and learning materials",
    ],
  },
  {
    id: "customer-support",
    name: "Customer Support and Service",
    slug: "customer-support",
    description:
      "Improve support workflows with AI-assisted knowledge retrieval, ticket summaries, and response drafts while preserving escalation and human care.",
    audience: [
      "Support agents",
      "Service teams",
      "Knowledge managers",
      "Support leaders",
    ],
    challenges: [
      "Finding consistent answers across approved knowledge sources",
      "Handling ticket volume while retaining context and service quality",
      "Recognizing uncertainty, sensitive information, and cases needing escalation",
    ],
    useCases: [
      "Ticket summaries, classification, and routing suggestions",
      "Draft responses grounded in approved knowledge",
      "Knowledge-base organization and service quality review",
    ],
  },
  {
    id: "operations",
    name: "Operations and Administration",
    slug: "operations",
    description:
      "Identify and prototype responsible AI support for administrative tasks, reporting, document handling, and repeatable business workflows.",
    audience: [
      "Operations teams",
      "Administrators",
      "Process owners",
      "Business analysts",
    ],
    challenges: [
      "Documenting and improving repetitive, multi-step processes",
      "Handling exceptions and approvals consistently",
      "Measuring quality and time impact before expanding automation",
    ],
    useCases: [
      "Document summarization and classification",
      "Meeting, reporting, and workflow documentation",
      "Human-supervised automation prototypes",
    ],
  },
  {
    id: "business-leadership",
    name: "Business Management and Leadership",
    slug: "business-leadership",
    description:
      "Help leaders evaluate AI opportunities, workforce readiness, governance, and practical adoption roadmaps grounded in business context.",
    audience: [
      "Business leaders",
      "Managers",
      "Team leads",
      "Transformation sponsors",
    ],
    challenges: [
      "Selecting useful AI opportunities from a crowded landscape",
      "Balancing value, feasibility, risk, and workforce impact",
      "Supporting responsible adoption with clear ownership and measures",
    ],
    useCases: [
      "Use-case discovery and prioritization",
      "Readiness, governance, and change planning",
      "Outcome measurement and roadmap development",
    ],
  },
  {
    id: "data-analytics",
    name: "Data Analytics and Business Intelligence",
    slug: "data-analytics",
    description:
      "Combine analytical practice with AI assistance to prepare data, explore questions, create reports, and communicate verified insights.",
    audience: [
      "Data analysts",
      "Business intelligence teams",
      "Managers",
      "Students",
    ],
    challenges: [
      "Preparing data and evaluating source quality",
      "Turning analysis into clear and useful communication",
      "Verifying AI-generated calculations, summaries, and interpretations",
    ],
    useCases: [
      "Exploratory analysis and query assistance",
      "Dashboard requirements and reporting",
      "Evidence-based recommendations using approved datasets",
    ],
  },
];

const subjectsBySector: Record<string, string> = {
  "it-software": `ai-future-it-professionals|AI and the Future of IT Professionals|Understand how AI is changing IT roles, workflows, and professional skills.|AI adoption across developer, tester, support, analyst, and operations roles;Prompting and verification for technical tasks;Human judgment, career readiness, and responsible workflow design
ai-powered-software-development|AI-Powered Software Development|Use coding assistants to support implementation, debugging, testing, and maintenance with human review.|AI-assisted requirements and code generation;Debugging, refactoring, tests, and documentation;Code quality, dependency review, and secure development
generative-ai-application-development|Generative AI Application Development|Build useful application features with model APIs, structured outputs, retrieval, and evaluation.|LLM APIs, prompt design, and structured responses;Secure backend integration and application reliability;Embeddings, document retrieval, and RAG
ai-agents-intelligent-automation|AI Agents and Intelligent Automation|Design controlled AI workflows with tools, retrieval, validation, and human approval.|Agent patterns, tool calling, and task decomposition;API integration, data retrieval, and workflow state;Permissions, recovery, monitoring, and human oversight
ai-software-testing-qa|AI in Software Testing and QA|Apply AI to test planning, case design, failure analysis, and quality workflows.|Test plans, cases, and representative test data;Unit and integration testing with AI assistance;Failure analysis, quality measures, and verified test automation
mern-full-stack-ai|MERN Full Stack with AI Integration|Build working MERN applications and integrate a practical AI capability.|HTML, CSS, JavaScript, React, and Git;Node.js, Express, REST APIs, MongoDB, and Mongoose;Testing, secure AI APIs, embeddings, RAG, and a full-stack capstone`,
  hr: `generative-ai-hr|Generative AI for HR Professionals|Use generative AI for HR communication, documentation, and knowledge tasks with confidentiality and human review.|HR workflow mapping and prompt design;Job descriptions, policy summaries, onboarding, and employee FAQs;Confidentiality, fairness, and human review
ai-assisted-recruitment|AI-Assisted Recruitment and Talent Acquisition|Support recruitment administration and preparation without delegating hiring decisions to AI.|Role requirements, job descriptions, and approved sourcing assistance;Structured interview preparation and candidate communication;Candidate privacy, bias awareness, and human-led evaluation|Employment decisions and candidate screening remain subject to human review
ai-learning-development|AI for Learning and Development|Use AI to plan learning, develop materials, and review learning feedback.|Training needs analysis and learning objectives;Course outlines, quizzes, and learning resources;Feedback summaries, evaluation measures, and content review
ai-employee-engagement|AI for Employee Engagement|Explore responsible AI support for aggregate employee feedback and communication.|Survey theme summaries and feedback categorization;Communication drafts and engagement reporting;Privacy, sentiment limitations, and safeguards against individual monitoring|Use aggregated approved information; do not infer or monitor individual employee sentiment
responsible-ai-hr|Responsible AI in HR|Assess fairness, privacy, oversight, and governance in HR-related AI use.|Fairness, explainability, and sensitive employee data;Human oversight and AI governance;Risk assessment and responsible deployment|Do not use AI as an autonomous decision-maker for employment outcomes`,
  "sales-business-development": `ai-sales-productivity|AI for Sales Productivity|Use AI to support prospect research, outreach, meeting follow-up, and sales reporting.|Approved-source prospect and account research;Outreach, proposals, agendas, and meeting summaries;CRM quality, responsible personalization, and sales workflow review
ai-assisted-lead-generation|AI-Assisted Lead Generation|Explore AI-assisted research and lead workflows using approved sources and responsible outreach.|Ideal customer profiles and account research;Lead enrichment concepts and outreach drafting;CRM workflows, validation, consent, and privacy|Use approved data sources; respect consent and applicable privacy requirements
ai-crm-sales-forecasting|AI for CRM and Sales Forecasting|Use AI to summarize CRM data and explore forecasts without treating estimates as certainty.|CRM data quality and pipeline summaries;Forecasting concepts and scenario analysis;Uncertainty, human review, and responsible interpretation
ai-customer-research-personalization|AI for Customer Research and Personalization|Prepare relevant customer context and communication using approved, non-sensitive information.|Customer and account research;Personalization from verified, appropriate context;Claim checking, privacy, and human review
ai-sales-reporting|AI for Sales Reporting|Improve sales reporting through structured summaries, pipeline analysis, and validation.|Sales activity data and reporting questions;Pipeline summaries and trend interpretation;Metric validation, uncertainty, and stakeholder-ready reporting`,
  marketing: `generative-ai-marketing|Generative AI for Marketing|Use AI to support audience research, campaign ideation, copy, and planning while maintaining brand quality.|Audience research and campaign ideation;Copywriting, variations, and content calendars;Brand consistency, fact-checking, and disclosure considerations
ai-content-creation|AI Content Creation|Create and review AI-assisted content briefs and drafts across channels.|Content planning and creative briefs;Drafting, adaptation, and editorial workflows;Originality, factual review, and brand voice
ai-seo-search-visibility|AI for SEO and Search Visibility|Use AI to support search research and content quality without promising rankings.|Search intent and keyword research;Content briefs, topic clusters, and on-page review;Originality, content quality, and search performance analysis
ai-campaign-optimization|AI for Campaign Optimization|Plan and evaluate campaign variations with responsible use of audience and performance data.|Campaign briefs and creative variants;Audience segmentation concepts and testing;Performance reporting, measurement, and optimization
ai-marketing-analytics|AI Analytics for Marketing|Summarize marketing performance and test interpretations against evidence.|Marketing data quality and KPI definitions;Trend summaries and campaign comparisons;Attribution limits, validation, and reporting`,
  finance: `ai-financial-productivity|AI for Financial Productivity|Explore AI assistance for finance documents, spreadsheets, and recurring reporting using approved sample data.|Financial document summarization and report drafting;Spreadsheet support, expense categorization, and variance summaries;Anomaly review, validation, and data privacy|Use synthetic or approved sample financial data; validate calculations independently
ai-financial-reporting|AI-Assisted Reporting and Analysis|Use AI to help prepare financial summaries while checking formulas, assumptions, and conclusions.|Structured data preparation and financial summaries;Spreadsheet formulas and variance explanations;Management reporting and validation|AI-generated financial conclusions are not authoritative advice or decisions
ai-invoice-document-processing|AI for Invoice and Document Processing|Explore document extraction and exception workflows with validation and human approval.|Invoice fields and document classification;Extraction, validation, and exception routing;Secure document workflows and audit trails|Use synthetic or approved documents and retain human approval for exceptions
ai-financial-risk-analysis|AI for Risk Analysis|Understand AI-supported anomaly and scenario analysis with explainability and human-led review.|Data quality and anomaly detection concepts;Risk summaries and scenario analysis;Explainability, limitations, and human-led review|AI-generated risk assessments do not replace authorized professional decisions
responsible-ai-finance|Responsible AI in Finance|Assess privacy, reliability, governance, and oversight in financial AI workflows.|Sensitive data handling and access controls;Fairness, reliability, and explainability;Governance, accountability, and review|Use synthetic data; AI output must not be presented as financial advice`,
  education: `ai-teachers-faculty|AI for Teachers and Faculty|Use AI to support teaching preparation and resource creation while maintaining educator review.|Lesson planning and teaching materials;Quiz generation, rubrics, and differentiated resources;Verification and academic integrity
ai-students-graduates|AI for Students and Fresh Graduates|Build AI literacy and use AI responsibly for learning, research, coding, and career preparation.|AI literacy, prompts, and study planning;Research and coding assistance;Portfolio development, career readiness, and academic integrity
ai-assisted-research|AI-Assisted Research|Use AI to organize research while verifying sources, citations, and summaries.|Literature discovery and research questions;Paper summaries, notes, and knowledge organization;Citation verification, ethics, and summary limitations
ai-lesson-assessment|AI for Lesson Planning and Assessment|Develop learning objectives, lessons, practice, and feedback drafts with human review.|Learning objectives and lesson structure;Practice questions, rubrics, and feedback drafting;Accessibility, assessment quality, and educator oversight
ai-literacy-career-readiness|AI Literacy and Career Readiness|Prepare learners to understand AI, evaluate outputs, and build responsible career skills.|AI concepts, capabilities, and limitations;Prompting, research, and practical learning workflows;Career planning, portfolio practice, and responsible use`,
  "customer-support": `ai-customer-support|AI for Customer Support Teams|Apply AI assistance to support workflows while preserving customer context, privacy, and escalation.|Ticket summaries and suggested responses;Knowledge retrieval, classification, and routing;Quality monitoring, privacy, and human escalation
ai-chatbots-virtual-assistants|AI Chatbots and Virtual Assistants|Explore reliable conversational assistants with knowledge retrieval and clear human handoff.|Chatbot concepts, intents, and context;FAQ retrieval and model API concepts;Evaluation, response reliability, and escalation
ai-knowledge-management|AI for Knowledge Management|Organize knowledge for search, summaries, and source-grounded answers with access controls.|Document organization and knowledge-base preparation;Search, summarization, and retrieval;Grounded responses and access control
ai-ticket-classification|AI for Ticket Classification and Summarization|Use AI to assist with ticket categorization, summaries, and routing suggestions.|Ticket categories and priority suggestions;Conversation summaries and routing assistance;Quality evaluation and human verification
responsible-ai-customer-service|Responsible AI in Customer Service|Apply transparency, privacy, accessibility, and human care to AI-assisted service.|Customer data boundaries and transparency;Uncertainty, accessibility, and escalation;Quality review and accountable service|Escalate sensitive, high-impact, or uncertain cases to a human`,
  operations: `ai-business-process-automation|AI for Business Process Automation|Identify and prototype responsible AI assistance for repeatable business processes.|Workflow mapping and repetitive-task discovery;Automation opportunities, approvals, and exceptions;Process documentation and performance measures
ai-document-workflow-automation|AI for Document and Workflow Automation|Design document classification and extraction workflows with validation and auditability.|Document classification, extraction, and summarization;Approval workflows and exception handling;Secure handling, validation, and audit trails
ai-reporting-productivity|AI for Reporting and Productivity|Use AI to support reports, meeting summaries, and workflow documentation with quality control.|Report drafting and meeting summaries;Spreadsheet assistance and process documentation;Quality review and data protection
ai-process-improvement|AI for Process Improvement|Use process evidence to identify improvement opportunities and assess AI suitability.|Process discovery and baseline measurement;Root-cause exploration and improvement options;Pilot evaluation, safeguards, and continuous improvement
ai-business-workflow-agents|AI Agents for Business Workflows|Explore controlled agents for business tasks with approved data and human approval.|Agent fundamentals and tool calling;Task decomposition and approved data access;Human approval, recovery, and monitoring|Use mock or sandboxed integrations; require human approval for consequential actions`,
  "business-leadership": `ai-strategy-leaders|AI Strategy for Business Leaders|Evaluate AI opportunities, readiness, governance, and adoption roadmaps in business context.|AI adoption and business opportunities;Productivity, workflows, and project selection;Risk, governance, workforce readiness, and measurement
ai-managers-team-leaders|AI for Managers and Team Leaders|Help managers guide team productivity, reporting, learning, and responsible adoption.|Team productivity and delegation;AI-assisted reporting and decision support limitations;Team learning and responsible adoption
ai-change-management|AI Adoption and Change Management|Plan stakeholder engagement, workforce readiness, training, and continuous improvement.|Stakeholder analysis and workforce readiness;Training plans and adoption support;Adoption metrics, feedback, and improvement
ai-governance-risk|AI Governance and Risk|Establish accountable practices for AI use cases, privacy, security, and oversight.|Risk identification and approved use cases;Privacy, security, and human oversight;Monitoring, accountability, and governance
ai-productivity-business-value|Measuring AI Productivity and Business Value|Define realistic measures to evaluate workflow and business impact without assuming outcomes.|Baseline workflow and measurement design;Productivity, quality, and adoption indicators;Uncertainty, costs, and responsible interpretation`,
  "data-analytics": `ai-assisted-data-analysis|AI-Assisted Data Analysis|Use AI alongside data preparation, exploration, and evidence-based interpretation.|Data quality, cleaning, and exploratory analysis;Descriptive statistics and AI-generated queries;Hypothesis validation and communicating insights
ai-dashboards-reporting|AI for Dashboards and Reporting|Design meaningful dashboards and validate AI-assisted summaries.|KPI selection and dashboard requirements;Chart selection and narrative summaries;Anomaly review and report validation
business-intelligence-ai|Business Intelligence with AI|Combine business questions, structured data, analysis, and visualization for decision support.|Business questions and data sources;SQL fundamentals, analysis, and visualization;Interpretation and responsible decision support
generative-ai-data-workflows|Generative AI for Data Workflows|Use structured generation to support data transformation, summaries, and workflow integration.|Structured outputs and data transformation;Summarization and query assistance;Validation, privacy, and workflow integration
responsible-data-interpretation|Responsible Data Interpretation|Communicate data findings with attention to quality, bias, uncertainty, and appropriate conclusions.|Data provenance and quality limits;Bias, uncertainty, and interpretation;Evidence-based communication and responsible recommendations`,
};

function entrySlug(sector: ProgramSector, subject: SectorSubject) {
  return `/programs/${sector.slug}/${subject.slug}`;
}

function modulesForSubject(
  subject: SectorSubject,
  sector: ProgramSector,
): ProgramFormat[] {
  const areas = subject.focusAreas;
  const useCase = sector.useCases[0].toLowerCase();
  const safeguard = subject.safeguards?.[0] ?? sector.challenges[2];
  const practiceContext: Record<string, string> = {
    finance:
      "synthetic or approved sample financial data; validate all calculations independently",
    education: "a classroom, research, or student-learning scenario",
    "customer-support": "a support workflow and approved knowledge source",
    operations: "a documented business workflow and its exception path",
    "data-analytics":
      "an approved sample dataset and a practical reporting question",
    "it-software": "a sandboxed software or engineering workflow",
  };
  const context =
    practiceContext[sector.slug] ??
    `a realistic ${sector.name.toLowerCase()} scenario`;
  const capstone: Record<string, string> = {
    "customer-support": "support workflow prototype",
    operations: "workflow or automation prototype",
    "data-analytics": "data analysis and reporting project",
    education: "classroom or student project",
    finance:
      "financial workflow analysis using synthetic or approved sample data",
    "it-software": "technical implementation project",
    hr: "responsible HR workflow proposal",
    "sales-business-development": "sales workflow project",
    marketing: "campaign or content project",
    "business-leadership": "AI adoption roadmap",
  };
  const capstoneName = capstone[sector.slug] ?? `${subject.title} project`;
  const area = (index: number) =>
    areas[index % areas.length].replace(/[.;]+$/, "");
  const makeModule = (
    title: string,
    topics: string[],
    activity?: string,
    deliverable?: string,
  ) => ({
    title,
    topics,
    activity:
      activity ??
      `Discuss or practice ${topics[0].toLowerCase()} using a relevant subject example.`,
    deliverable:
      deliverable ??
      "Capture the key learning point and a question for further review.",
  });
  const seminar = [
    makeModule("Module 1: Concepts and Context", [
      `Core concepts behind ${subject.title.toLowerCase()}`,
      `How ${area(0)} relates to ${sector.name.toLowerCase()}`,
      "Capabilities, limitations, and current developments",
    ]),
    makeModule("Module 2: Professional Applications", [
      ...areas.slice(0, 2).map((focus) => `Introduction to ${focus}`),
      `Examples from ${useCase}`,
    ]),
    makeModule("Module 3: Responsible Practice", [
      "Human judgment, output verification, and accountability",
      safeguard,
      "Considerations for a bounded, useful first application",
    ]),
    makeModule("Module 4: Demonstration and Discussion", [
      `Walk through a sample ${area(1)} task`,
      "Review the result, assumptions, and limitations",
      "Questions and answers",
    ]),
  ];
  const webinar = [
    makeModule("Module 1: Online Subject Briefing", [
      `Overview of ${subject.title.toLowerCase()} and its terminology`,
      `Screen-shared examples related to ${area(0)}`,
    ]),
    makeModule("Module 2: Use Cases and Trade-offs", [
      ...areas.slice(0, 2).map((focus) => `Online use case: ${focus}`),
      "Discuss suitability, limitations, and human review",
    ]),
    makeModule("Module 3: Guided Demonstration", [
      `Demonstrate a sample ${area(1)} workflow`,
      "Use chat prompts or a poll to compare approaches",
    ]),
    makeModule("Module 4: Interactive Discussion and Q&A", [
      "Discuss participant questions and scenarios",
      safeguard,
    ]),
  ];
  const workshop1 = [
    makeModule("Module 1: Foundations and Workflow Mapping", [
      `Key concepts for ${subject.title.toLowerCase()}`,
      `Map a sample ${sector.name.toLowerCase()} workflow`,
      "Choose a bounded task and define a useful outcome",
    ]),
    makeModule("Module 2: Tools and Guided Practice", [
      ...areas.slice(0, 2).map((focus) => `Practice ${focus}`),
      "Use a provided, approved, or synthetic example",
    ]),
    makeModule("Module 3: Review and Improvement", [
      `Evaluate results for ${area(2)}`,
      "Check accuracy, completeness, and relevant exceptions",
      safeguard,
    ]),
    makeModule(
      "Module 4: Mini-Exercise",
      [
        `Apply the workflow to a new ${area(0)} scenario`,
        "Explain where human judgment remains necessary",
      ],
      `Complete a guided exercise using ${area(1)}.`,
      "A reviewed mini-exercise with a short reflection.",
    ),
  ];
  const workshop2 = [
    makeModule(
      "Day 1: Fundamentals and Tool Use",
      [
        `Understand core concepts for ${subject.title.toLowerCase()}`,
        `Map current practice and opportunities for ${area(0)}`,
        ...areas.slice(0, 2).map((focus) => `Guided practice: ${focus}`),
        "Define quality criteria and review boundaries",
      ],
      `Complete a guided ${area(1)} exercise.`,
      "A workflow map and initial quality checklist.",
    ),
    makeModule(
      "Day 2: Implementation and Practical Application",
      [
        `Implement a bounded ${area(2)} workflow`,
        "Test representative examples and exceptions",
        safeguard,
        "Review outcomes and improvement opportunities",
      ],
      "Build and test a sample workflow or work product.",
      "A documented implementation and review.",
    ),
  ];
  const workshop3 = [
    makeModule(
      "Day 1: Foundations and Use-Case Design",
      [
        `Core concepts and limitations for ${subject.title.toLowerCase()}`,
        `Identify a practical ${area(0)} opportunity`,
        "Define users, information boundaries, and success criteria",
      ],
      "Create a small use-case brief.",
    ),
    makeModule(
      "Day 2: Guided Implementation",
      [
        `Apply tools and techniques to ${area(1)}`,
        `Develop a prototype for ${area(2)}`,
        "Review quality and handle common exceptions",
      ],
      "Build a practical subject-specific prototype.",
    ),
    makeModule(
      "Day 3: Integration, Evaluation, and Presentation",
      [
        "Test realistic cases and document limitations",
        safeguard,
        "Discuss adoption, measurement, and next steps",
      ],
      "Refine and present the project.",
      "A demonstrated prototype and evaluation summary.",
    ),
  ];
  const trainingDays = (count: 7 | 15) => {
    const stages = [
      "Foundations and Current Practice",
      "Sector Workflow and Opportunity Mapping",
      "Tools, Inputs, and Prompt or Process Design",
      "Applied Practice and Quality Criteria",
      "Exceptions, Privacy, and Human Review",
      "Prototype or Assignment Development",
      "Evaluation and Capstone Presentation",
      "Advanced Workflow Design",
      "Data, Integration, and Documentation",
      "Quality Measurement and Iteration",
      "Risk, Governance, and Accountability",
      "User Experience and Adoption",
      "Project Planning and Success Measures",
      "Capstone Implementation and Testing",
      "Presentation, Assessment, and Next Steps",
    ];
    return stages.slice(0, count).map((stage, index) => {
      const projectDay = index === count - 2 || index === count - 1;
      return makeModule(
        `Day ${index + 1}: ${stage}`,
        [
          `Apply ${area(index)} to ${subject.title.toLowerCase()}`,
          `Practice ${area(index + 1)} using ${context}`,
          index === 0
            ? "Check understanding with a short baseline exercise"
            : "Compare results with defined quality criteria",
          sector.slug === "finance"
            ? "Use synthetic or approved sample financial data and independently verify calculations"
            : `Use a responsible review approach for ${area(index + 2)}`,
          projectDay
            ? "Document assumptions, limitations, and review steps"
            : "Capture questions, exceptions, and learning notes",
        ],
        projectDay && index === count - 2
          ? `Build a ${capstoneName} using ${context}.`
          : projectDay
            ? `Evaluate the ${capstoneName} against quality criteria and present findings.`
            : `Complete a guided exercise focused on ${area(index + 2)} using ${context}.`,
        projectDay && index === count - 2
          ? `Submit a working ${capstoneName} prototype or project increment.`
          : projectDay
            ? `Submit an evaluated ${capstoneName} with limitations and next steps.`
            : `Submit a ${count}-day practice assignment and knowledge check.`,
      );
    });
  };
  return [
    {
      id: "seminar",
      category: "Seminar",
      duration: "2 Hours",
      description:
        "In-person awareness session with concise concepts, industry examples, a demonstration, and Q&A.",
      modules: seminar,
    },
    {
      id: "webinar",
      category: "Webinar",
      duration: "2 Hours",
      description:
        "Online session with screen-shared examples, interactive discussion, and live Q&A.",
      modules: webinar,
    },
    {
      id: "workshop-1-day",
      category: "Workshop",
      duration: "1 Day",
      description: "Guided practice and a subject-specific mini-exercise.",
      modules: workshop1,
    },
    {
      id: "workshop-2-days",
      category: "Workshop",
      duration: "2 Days",
      description: "Fundamentals and tool use followed by implementation.",
      modules: workshop2,
    },
    {
      id: "workshop-3-days",
      category: "Workshop",
      duration: "3 Days",
      description: "Foundations, implementation, and a project review.",
      modules: workshop3,
    },
    {
      id: "training-7-days",
      category: "Training",
      duration: "7 Days",
      description:
        "Progressive daily learning with practice, assessment, and a capstone.",
      modules: trainingDays(7),
    },
    {
      id: "training-15-days",
      category: "Training",
      duration: "15 Days",
      description:
        "Extended foundations-to-application learning with a tested capstone.",
      modules: trainingDays(15),
    },
  ];
}

const existingPrograms = new Map(
  programs.map((program) => [program.slug, program]),
);

export const sectors: ProgramSector[] = sectorsBase.map((sector) => {
  const subjects = entries(subjectsBySector[sector.slug]);
  const existingSlugs: Record<string, string> = {
    "ai-future-it-professionals": "ai-future-it-professionals",
    "ai-powered-software-development": "ai-powered-software-development",
    "generative-ai-application-development":
      "generative-ai-application-development",
    "ai-agents-intelligent-automation": "ai-agents-intelligent-automation",
    "mern-full-stack-ai": "mern-full-stack-ai",
    "ai-assisted-data-analysis": "data-analytics-ai",
  };
  return {
    ...sector,
    subjects: subjects.map((subject) => ({
      ...subject,
      existingProgramSlug: existingSlugs[subject.slug],
    })),
  };
});

export type SectorProgram = {
  sector: ProgramSector;
  subject: SectorSubject;
  href: string;
  status: "Detailed proposed outline" | "Proposed outline";
  availabilityStatus: "proposed" | "available" | "pending-review";
  formats: ProgramFormat[];
  existingProgram?: Program;
};

export const sectorPrograms: SectorProgram[] = sectors.flatMap((sector) =>
  sector.subjects.map((subject) => {
    const existingProgram = subject.existingProgramSlug
      ? existingPrograms.get(subject.existingProgramSlug)
      : undefined;
    const formats = (
      existingProgram?.formats ?? modulesForSubject(subject, sector)
    ).map((format) => ({ ...format, availabilityStatus: "proposed" as const }));
    return {
      sector,
      subject,
      href: entrySlug(sector, subject),
      status: existingProgram
        ? "Detailed proposed outline"
        : "Proposed outline",
      availabilityStatus: "proposed",
      formats,
      existingProgram,
    };
  }),
);

export function getSector(slug: string) {
  return sectors.find((sector) => sector.slug === slug);
}

export function getSectorProgram(sectorSlug: string, subjectSlug: string) {
  return sectorPrograms.find(
    ({ sector, subject }) =>
      sector.slug === sectorSlug && subject.slug === subjectSlug,
  );
}

export function getProgramForSectorSubject(
  sectorSlug: string,
  subjectSlug: string,
) {
  return getSectorProgram(sectorSlug, subjectSlug)?.existingProgram;
}

export function allSectorRoutes() {
  return sectors.flatMap((sector) => [
    `/programs/${sector.slug}`,
    ...sector.subjects.map((subject) => entrySlug(sector, subject)),
  ]);
}
