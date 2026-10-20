import { programTitles } from "@/data/program-options";

export type ProgramModule = {
  title: string;
  topics: string[];
  activity?: string;
  deliverable?: string;
};

export type ProgramFormat = {
  id: string;
  category: "Seminar" | "Webinar" | "Workshop" | "Training";
  duration: string;
  description: string;
  modules: ProgramModule[];
  availabilityStatus?: "proposed" | "available" | "pending-review";
};

export type Program = {
  slug: string;
  title: string;
  category: string;
  summary: string;
  description: string;
  icon: string;
  audience: string[];
  prerequisites: string[];
  outcomes: string[];
  tools: string[];
  practicalActivities: string[];
  assessment: string[];
  formats: ProgramFormat[];
  related: string[];
};

type Curriculum = {
  seminar: ProgramModule[];
  workshop1: ProgramModule[];
  workshop2: ProgramModule[];
  workshop3: ProgramModule[];
  training7: ProgramModule[];
  training15: ProgramModule[];
};

function createFormats(curriculum: Curriculum): ProgramFormat[] {
  const seminarModules = curriculum.seminar.map((module, index) => {
    if (index !== curriculum.seminar.length - 1) return module;
    const includesQuestions = module.topics.some((topic) =>
      /questions|q&a/i.test(topic),
    );
    return includesQuestions
      ? module
      : {
          ...module,
          topics: [...module.topics, "Questions and answers"],
        };
  });
  const trainingModules = (
    modules: ProgramModule[],
    duration: string,
  ): ProgramModule[] =>
    modules.map((module) => {
      const dayTopic = module.title.replace(/^Day \d+:\s*/, "").toLowerCase();
      return {
        ...module,
        activity:
          module.activity ??
          `Guided practical exercise applying ${dayTopic} to a sample task.`,
        deliverable:
          module.deliverable ??
          `${duration} practice review and a short knowledge check.`,
      };
    });

  return [
    {
      id: "seminar",
      category: "Seminar",
      duration: "2 Hours",
      description:
        "An in-person awareness session with concise concepts, industry examples, a guided demonstration, and time for questions.",
      modules: seminarModules,
    },
    {
      id: "webinar",
      category: "Webinar",
      duration: "2 Hours",
      description:
        "An online-friendly session with screen-shared examples, interactive discussion prompts, and a live Q&A.",
      modules: seminarModules.map((module, index) => ({
        ...module,
        title:
          index === curriculum.seminar.length - 1
            ? "Live Online Demonstration and Discussion"
            : module.title,
      })),
    },
    {
      id: "workshop-1-day",
      category: "Workshop",
      duration: "1 Day",
      description:
        "A focused, hands-on day of guided exercises and a subject-specific mini-project.",
      modules: curriculum.workshop1,
    },
    {
      id: "workshop-2-days",
      category: "Workshop",
      duration: "2 Days",
      description:
        "Two practical days, progressing from fundamentals and tool use to implementation and review.",
      modules: curriculum.workshop2,
    },
    {
      id: "workshop-3-days",
      category: "Workshop",
      duration: "3 Days",
      description:
        "Three days of foundations, implementation, and an integrated project with evaluation and presentation.",
      modules: curriculum.workshop3,
    },
    {
      id: "training-7-days",
      category: "Training",
      duration: "7 Days",
      description:
        "Progressive daily learning with exercises, short checks for understanding, and a final mini-project.",
      modules: trainingModules(curriculum.training7, "Daily"),
    },
    {
      id: "training-15-days",
      category: "Training",
      duration: "15 Days",
      description:
        "A progressive program from foundations through applied practice, ending in a documented capstone.",
      modules: trainingModules(curriculum.training15, "Daily"),
    },
  ];
}

export const programs: Program[] = [
  {
    slug: "ai-future-it-professionals",
    title: programTitles["ai-future-it-professionals"],
    category: "AI & Future of Work",
    summary:
      "Understand how AI is reshaping technology roles, everyday workflows, and the skills professionals can develop next.",
    description:
      "Understand how AI is transforming IT jobs, software development, business workflows, productivity, and the skills required for future careers.",
    icon: "brain",
    audience: [
      "Students and fresh graduates",
      "Developers, testers, and IT support teams",
      "Business analysts and project managers",
      "Technology leaders",
    ],
    prerequisites: [
      "No prior AI experience is required.",
      "Familiarity with a professional, academic, or IT workflow will help with applied exercises.",
    ],
    outcomes: [
      "Explain practical differences between AI, machine learning, generative AI, and AI agents.",
      "Identify tasks AI may assist, automate, or handle unreliably in common IT roles.",
      "Use prompts and review practices to validate AI-assisted work.",
      "Map a role-specific workflow and outline a practical learning roadmap.",
    ],
    tools: [
      "Generative AI assistants",
      "Prompting and output-review techniques",
      "Sample coding, research, and documentation workflows",
    ],
    practicalActivities: [
      "Compare an AI-generated technical answer with verified information.",
      "Map repetitive work in a selected IT role and identify safe assistance opportunities.",
      "Draft a human-supervised workflow and personal AI learning roadmap.",
    ],
    assessment: [
      "Short knowledge checks and review of an applied workflow map.",
      "For longer training options, present a prototype or role-specific roadmap and discuss its limitations.",
    ],
    related: [
      "generative-ai-prompt-engineering",
      "ai-powered-software-development",
      "ai-agents-intelligent-automation",
    ],
    formats: createFormats({
      seminar: [
        {
          title: "Module 1: Understanding the AI Revolution",
          topics: [
            "Artificial intelligence, machine learning, generative AI, and AI agents",
            "How AI tools are entering everyday professional workflows",
            "Examples of AI adoption across technology industries",
          ],
        },
        {
          title: "Module 2: AI and IT Jobs",
          topics: [
            "Changes in software development, testing, support, analysis, and operations",
            "Tasks AI can automate, assist with, or perform unreliably",
            "Human judgment, accountability, creativity, and critical thinking",
          ],
        },
        {
          title: "Module 3: Skills for the AI Era",
          topics: [
            "AI literacy and prompt engineering",
            "Problem-solving, communication, and domain expertise",
            "AI-assisted development, workflow automation, and continuous learning",
          ],
        },
        {
          title: "Module 4: Practical Demonstration",
          topics: [
            "Use AI to explore a technical problem and compare its result with a verified answer",
            "Discuss risks, limitations, and opportunities",
            "Questions and answers",
          ],
        },
      ],
      workshop1: [
        {
          title: "Module 1: AI Fundamentals and Workplace Change",
          topics: [
            "AI, generative AI, large language models, and agents",
            "Examples of AI-assisted work and changing job responsibilities",
          ],
          activity: "Map one familiar workflow and discuss where AI may help.",
        },
        {
          title: "Module 2: AI Tools for IT Professionals",
          topics: [
            "Research, summarization, and technical writing",
            "Code explanation, debugging, and productivity assistance",
          ],
          activity: "Try an AI-assisted research or code-explanation task.",
        },
        {
          title: "Module 3: Human-AI Collaboration",
          topics: [
            "Writing useful prompts and evaluating responses",
            "Identifying errors and hallucinations",
            "Protecting confidential information",
          ],
          activity:
            "Review a sample response and mark claims requiring verification.",
        },
        {
          title: "Module 4: Career Readiness Exercise",
          topics: [
            "Map repetitive tasks in a selected IT role",
            "Identify suitable AI-assisted workflows",
          ],
          deliverable: "A personal AI learning roadmap.",
        },
      ],
      workshop2: [
        {
          title: "Day 1: AI and Professional Productivity",
          topics: [
            "AI fundamentals and industry applications",
            "Prompt engineering and context management",
            "AI-assisted coding, testing, research, and documentation",
            "Verification, privacy, and responsible use",
          ],
          activity:
            "Complete practical productivity exercises and review the output.",
        },
        {
          title: "Day 2: Career Transformation and Workflow Design",
          topics: [
            "How AI changes developer, tester, analyst, and support roles",
            "Identify automation opportunities and design a human-supervised workflow",
            "Evaluate quality, time savings, and risks",
          ],
          deliverable:
            "A workflow proposal and portfolio or career development plan.",
        },
      ],
      workshop3: [
        {
          title: "Day 1: AI Fundamentals and the Future of Work",
          topics: [
            "Generative AI, LLMs, agents, and automation",
            "AI adoption across IT roles",
            "Strengths, limitations, and changing job tasks",
          ],
        },
        {
          title: "Day 2: Practical AI for IT Workflows",
          topics: [
            "Prompt engineering and AI-assisted coding, debugging, testing, and documentation",
            "Research, knowledge management, and productivity",
            "Validate results and identify errors",
          ],
          activity:
            "Build and test a small role-specific productivity workflow.",
        },
        {
          title: "Day 3: Career and Workplace Readiness",
          topics: [
            "Map tasks to AI-assisted workflows and evaluate quality and risk",
            "Prepare a role-specific AI skills roadmap",
          ],
          deliverable:
            "Present findings and recommendations for a workflow prototype.",
        },
      ],
      training7: [
        {
          title: "Day 1: AI Fundamentals",
          topics: [
            "AI, ML, generative AI, LLMs, and agents",
            "Capabilities, limitations, and real-world use cases",
          ],
          activity: "Classify sample tasks by appropriate AI use.",
        },
        {
          title: "Day 2: Prompt Engineering",
          topics: [
            "Clear instructions, context, constraints, and examples",
            "Structured outputs and iterative prompting",
            "Fact-checking and output evaluation",
          ],
          deliverable: "A tested prompt for a familiar work task.",
        },
        {
          title: "Day 3: AI for Developers",
          topics: [
            "Code explanation, generation, and refactoring",
            "Debugging, test generation, code review, and documentation",
          ],
          activity: "Review and verify AI-assisted code suggestions.",
        },
        {
          title: "Day 4: AI for Testing and IT Operations",
          topics: [
            "Test planning and troubleshooting",
            "Log summarization and incident documentation",
            "IT support and knowledge assistants",
          ],
          deliverable: "A reviewed test or incident-summary exercise.",
        },
        {
          title: "Day 5: AI Workflow Automation",
          topics: [
            "Identify repetitive workflows and automate safe, low-risk tasks",
            "Human approval, exception handling, and quality measures",
          ],
          activity:
            "Design a human-approved workflow with a safe stop condition.",
        },
        {
          title: "Day 6: Applied Project",
          topics: [
            "Select an IT or workplace problem and define success criteria",
            "Design and implement an AI-assisted prototype",
            "Validate outputs and document limitations",
          ],
          deliverable: "A working prototype or documented workflow.",
        },
        {
          title: "Day 7: Evaluation and Career Roadmap",
          topics: [
            "Demonstrate the project and review quality, privacy, and security",
            "Assess learning outcomes and identify next steps",
          ],
          deliverable: "Project demonstration and individual AI learning plan.",
        },
      ],
      training15: [
        {
          title: "Day 1: AI Concepts and Evolution",
          topics: [
            "AI, ML, deep learning, generative AI, and agents",
            "Applications and limitations",
          ],
        },
        {
          title: "Day 2: LLMs and Generative AI",
          topics: [
            "Tokens, context, model responses, and hallucinations",
            "Text and code generation",
          ],
        },
        {
          title: "Day 3: Prompt Engineering",
          topics: [
            "Context, constraints, examples, and structured outputs",
            "Iterative refinement and evaluation",
          ],
        },
        {
          title: "Day 4: AI Productivity",
          topics: [
            "Research, writing, summarization, and documentation",
            "Professional workflows and responsible use",
          ],
        },
        {
          title: "Day 5: AI-Assisted Software Engineering",
          topics: [
            "Coding, debugging, refactoring, and testing",
            "Code review and human verification",
          ],
        },
        {
          title: "Day 6: AI in Testing and Quality",
          topics: [
            "Test planning and test cases",
            "Failure analysis and QA workflows",
          ],
        },
        {
          title: "Day 7: AI in IT Support and Operations",
          topics: [
            "Knowledge assistants and troubleshooting",
            "Log analysis and incident summaries",
          ],
        },
        {
          title: "Day 8: Workflow Automation",
          topics: [
            "Workflow mapping, triggers, and actions",
            "Exceptions and approval steps",
          ],
        },
        {
          title: "Day 9: AI Tools and Integrations",
          topics: [
            "AI APIs and structured outputs",
            "Integrations and configuration",
          ],
        },
        {
          title: "Day 10: AI for Business and Data Analysis",
          topics: [
            "Summarization and insight generation",
            "Data interpretation and validation",
          ],
        },
        {
          title: "Day 11: Human-AI Collaboration",
          topics: [
            "Task allocation, judgment, and accountability",
            "Organizational adoption",
          ],
        },
        {
          title: "Day 12: Responsible AI",
          topics: [
            "Privacy, bias, hallucinations, and intellectual property",
            "Human oversight",
          ],
        },
        {
          title: "Day 13: Project Planning",
          topics: [
            "Define a problem and success criteria",
            "Plan architecture and safeguards",
          ],
          deliverable: "A capstone plan with measurable acceptance criteria.",
        },
        {
          title: "Day 14: Capstone Implementation",
          topics: [
            "Build and test an AI-assisted workflow or application",
            "Document behavior and limitations",
          ],
          activity:
            "Implement the planned project and review representative cases.",
        },
        {
          title: "Day 15: Presentation and Career Planning",
          topics: [
            "Project demonstration, assessment, feedback, and improvements",
            "Role-specific career roadmap",
          ],
          deliverable: "A documented capstone and next-step learning plan.",
        },
      ],
    }),
  },
  {
    slug: "generative-ai-prompt-engineering",
    title: programTitles["generative-ai-prompt-engineering"],
    category: "Generative AI",
    summary:
      "Learn how generative AI works and how to create, test, and improve prompts for professional and technical tasks.",
    description:
      "Learn how generative AI works, how to communicate with AI systems effectively, and how to use them for technical and professional tasks.",
    icon: "sparkles",
    audience: [
      "Students and educators",
      "Professionals using AI for research or communication",
      "Developers, analysts, and content teams",
      "Teams exploring responsible generative AI use",
    ],
    prerequisites: [
      "No programming or prior AI experience is required.",
      "Participants should bring a non-sensitive task they would like to improve.",
    ],
    outcomes: [
      "Describe LLMs, context, tokens, and common generative AI limitations.",
      "Design prompts with clear tasks, context, constraints, examples, and output formats.",
      "Evaluate and refine generated responses against explicit criteria.",
      "Create a reusable prompt workflow with appropriate privacy and review practices.",
    ],
    tools: [
      "Generative AI text assistants",
      "Prompt templates and structured-output patterns",
      "Sample documents and evaluation checklists",
    ],
    practicalActivities: [
      "Rewrite weak prompts and compare resulting responses.",
      "Use prompts for research, document extraction, coding, and data tasks.",
      "Build and evaluate a reusable prompt library or assistant workflow.",
    ],
    assessment: [
      "Daily practice tasks and short assessments in the longer formats.",
      "Capstone review based on relevance, accuracy, consistency, privacy, and clear limitations.",
    ],
    related: [
      "ai-future-it-professionals",
      "generative-ai-application-development",
      "ai-powered-software-development",
    ],
    formats: createFormats({
      seminar: [
        {
          title: "Module 1: Generative AI Fundamentals",
          topics: [
            "Generative AI, LLMs, tokens, and context",
            "Text, image, and code generation",
            "Strengths and limitations",
          ],
        },
        {
          title: "Module 2: Prompt Engineering",
          topics: [
            "Instructions, context, constraints, and examples",
            "Prompt refinement and structured output",
            "Common prompting mistakes",
          ],
        },
        {
          title: "Module 3: Real-World Applications",
          topics: [
            "Research, reports, presentations, and documentation",
            "Coding and technical troubleshooting",
            "Validation, privacy, and responsible use",
          ],
        },
        {
          title: "Module 4: Live Demonstration",
          topics: [
            "Improve a weak prompt and compare outputs",
            "Evaluate accuracy and usefulness",
            "Questions and answers",
          ],
        },
      ],
      workshop1: [
        {
          title: "Module 1: How Generative AI Works",
          topics: [
            "LLM fundamentals and context windows",
            "Response generation, hallucinations, and uncertainty",
          ],
        },
        {
          title: "Module 2: Prompt Design",
          topics: [
            "Role, task, context, constraints, and output format",
            "Few-shot examples and task decomposition",
            "Iterative prompting",
          ],
          activity: "Improve a prompt through multiple test-and-refine cycles.",
        },
        {
          title: "Module 3: Practical Applications",
          topics: [
            "Research, summarization, writing, and document analysis",
            "Coding, debugging, structured tables, and extraction",
          ],
          activity: "Apply prompts to two different sample tasks.",
        },
        {
          title: "Module 4: Prompt Evaluation",
          topics: [
            "Accuracy, relevance, completeness, and consistency",
            "Fact-checking and privacy",
          ],
          deliverable: "A reusable prompt library with review notes.",
        },
      ],
      workshop2: [
        {
          title: "Day 1: Prompt Engineering Foundations",
          topics: [
            "Generative AI and LLM concepts",
            "Prompt structure, context, examples, and constraints",
            "Structured output and multi-step prompting",
          ],
          activity: "Test and refine prompts against representative examples.",
        },
        {
          title: "Day 2: Applied Generative AI",
          topics: [
            "Prompts for software, data analysis, and documentation",
            "Summarization and knowledge extraction",
            "Compare outputs across tasks",
          ],
          deliverable:
            "A task-specific prompt workflow with evaluation criteria.",
        },
      ],
      workshop3: [
        {
          title: "Day 1: LLM Fundamentals and Prompt Design",
          topics: [
            "LLMs, tokens, context, and limitations",
            "Prompt components and examples",
            "Structured output and task decomposition",
          ],
        },
        {
          title: "Day 2: Advanced Prompting Applications",
          topics: [
            "Multi-step workflows and reusable prompt templates",
            "Document analysis and extraction",
            "Coding, technical research, and systematic prompt tests",
          ],
          activity: "Create prompt tests for a set of representative tasks.",
        },
        {
          title: "Day 3: Evaluation and Mini-Project",
          topics: [
            "Develop a prompt-based assistant workflow",
            "Measure relevance, accuracy, and consistency",
            "Add validation and human review",
          ],
          deliverable: "Present the workflow, test results, and limitations.",
        },
      ],
      training7: [
        {
          title: "Day 1: Generative AI Fundamentals",
          topics: [
            "Generative AI, LLMs, tokens, context, and response generation",
            "Capabilities, limitations, and uncertainty",
          ],
          activity: "Compare generated and verified answers.",
        },
        {
          title: "Day 2: Prompt Structure and Context",
          topics: [
            "Instructions, role, context, constraints, and examples",
            "Output formats and iterative refinement",
          ],
          deliverable: "A prompt template for a defined task.",
        },
        {
          title: "Day 3: Advanced Prompting Patterns",
          topics: [
            "Task decomposition and multi-step workflows",
            "Few-shot examples and structured outputs",
            "Reusable prompt patterns",
          ],
          activity: "Test prompt variations against a small task set.",
        },
        {
          title: "Day 4: AI for Writing, Research, and Documentation",
          topics: [
            "Research and summarization",
            "Writing, communication, and document analysis",
            "Source and claim review",
          ],
          deliverable: "A reviewed research or documentation workflow.",
        },
        {
          title: "Day 5: AI for Coding, Testing, and Data Tasks",
          topics: [
            "Coding and debugging prompts",
            "Test generation and structured data analysis",
            "Human verification",
          ],
          activity: "Validate generated output using known examples.",
        },
        {
          title: "Day 6: Output Evaluation, Safety, and Prompt Workflows",
          topics: [
            "Accuracy, relevance, and consistency checks",
            "Privacy, bias, and hallucinations",
            "Prompt workflow documentation",
          ],
          deliverable: "An evaluation checklist and tested prompt set.",
        },
        {
          title: "Day 7: Capstone Prompt-Based Assistant",
          topics: [
            "Build and test an assistant workflow",
            "Assess outputs and document limitations",
          ],
          deliverable:
            "Demonstration, short assessment, and personal prompt library.",
        },
      ],
      training15: [
        {
          title: "Day 1: AI and Generative AI Overview",
          topics: [
            "AI concepts and generative systems",
            "Common professional use cases and limitations",
          ],
        },
        {
          title: "Day 2: LLMs, Tokens, Context, and Model Limitations",
          topics: [
            "Tokens, context windows, and responses",
            "Hallucinations and uncertainty",
          ],
        },
        {
          title: "Day 3: Prompt Structure and Instruction Design",
          topics: [
            "Clear tasks, roles, and context",
            "Instruction hierarchy and measurable requirements",
          ],
          activity: "Rewrite ambiguous prompts for clarity.",
        },
        {
          title: "Day 4: Examples, Constraints, and Structured Output",
          topics: [
            "Few-shot examples and constraints",
            "Structured formats and output validation",
          ],
        },
        {
          title: "Day 5: Prompt Decomposition and Multi-Step Workflows",
          topics: [
            "Break complex tasks into stages",
            "Connect steps with review checkpoints",
          ],
        },
        {
          title: "Day 6: Research, Summarization, and Document Extraction",
          topics: [
            "Summarize and extract information from sample documents",
            "Check claims against provided sources",
          ],
        },
        {
          title: "Day 7: Writing, Communication, and Knowledge Management",
          topics: [
            "Draft and revise professional communication",
            "Organize reusable knowledge and prompts",
          ],
        },
        {
          title: "Day 8: Coding, Debugging, and Documentation Prompts",
          topics: [
            "Explain, generate, and debug code",
            "Review and verify technical documentation",
          ],
        },
        {
          title: "Day 9: Data Analysis and Structured Results",
          topics: [
            "Ask structured questions about sample data",
            "Validate calculations and extracted results",
          ],
        },
        {
          title: "Day 10: Reusable Prompt Templates and Workflow Design",
          topics: [
            "Create reusable templates",
            "Design workflow inputs, outputs, and review steps",
          ],
          deliverable: "A reusable prompt workflow specification.",
        },
        {
          title: "Day 11: Tool-Connected AI and API Fundamentals",
          topics: [
            "Understand model APIs and connected tools",
            "Review safe integration boundaries",
          ],
        },
        {
          title: "Day 12: Prompt Testing and Evaluation",
          topics: [
            "Build representative test cases",
            "Measure relevance, accuracy, and consistency",
          ],
        },
        {
          title: "Day 13: Privacy, Security, Bias, and Hallucinations",
          topics: [
            "Protect sensitive information",
            "Identify bias and unreliable claims",
            "Apply human review",
          ],
        },
        {
          title: "Day 14: Capstone Development and Testing",
          topics: [
            "Develop a prompt-based assistant",
            "Test failure cases and refine behavior",
          ],
          activity: "Complete capstone tests and document limitations.",
        },
        {
          title:
            "Day 15: Presentation, Assessment, and Personal Prompt Library",
          topics: [
            "Demonstrate and assess the capstone",
            "Reflect and improve the prompt library",
          ],
          deliverable:
            "A presented assistant workflow and personal prompt library.",
        },
      ],
    }),
  },
  {
    slug: "ai-powered-software-development",
    title: programTitles["ai-powered-software-development"],
    category: "Software Engineering",
    summary:
      "Apply coding assistants to planning, implementation, debugging, testing, and software maintenance with human review.",
    description:
      "Learn how AI coding assistants and modern development workflows can support planning, implementation, debugging, testing, and maintenance.",
    icon: "code",
    audience: [
      "Software developers and engineering students",
      "Quality engineers and testers",
      "Technical leads and engineering teams",
      "Professionals familiar with a programming language",
    ],
    prerequisites: [
      "Basic programming experience is recommended for hands-on exercises.",
      "Bring a development environment or use the provided sample repository.",
    ],
    outcomes: [
      "Break engineering tasks into clear, verifiable steps for AI-assisted work.",
      "Use coding assistants to explain, implement, refactor, and document code.",
      "Generate and run tests while reviewing edge cases and errors.",
      "Identify security, dependency, and correctness risks in generated code.",
    ],
    tools: [
      "AI coding assistants and IDE integrations",
      "Git and a sample code repository",
      "Test runners, linters, and code review checklists",
    ],
    practicalActivities: [
      "Implement a small feature with AI support and review every change.",
      "Generate tests, run them, and add missing edge cases.",
      "Build and present a verified application feature or capstone.",
    ],
    assessment: [
      "Review code changes, test results, and security considerations.",
      "Longer options include a demonstrated capstone and a final code review.",
    ],
    related: [
      "generative-ai-prompt-engineering",
      "generative-ai-application-development",
      "mern-full-stack-ai",
    ],
    formats: createFormats({
      seminar: [
        {
          title: "Module 1: AI in Software Engineering",
          topics: [
            "AI coding assistants and IDE integration",
            "Code completion, generation, debugging, and explanation",
          ],
        },
        {
          title: "Module 2: Modern Development Workflow",
          topics: [
            "AI-assisted planning and requirements",
            "Test generation, documentation, code review, and refactoring",
          ],
        },
        {
          title: "Module 3: Risks and Best Practices",
          topics: [
            "Incorrect code and hallucinations",
            "Dependency and security risks",
            "Human review and verification",
          ],
        },
        {
          title: "Module 4: Live Coding Demonstration",
          topics: [
            "Build or modify a small feature",
            "Test the output and discuss workflow improvements",
          ],
          activity: "Review each proposed change before accepting it.",
        },
      ],
      workshop1: [
        {
          title: "Module 1: AI Coding Assistant Fundamentals",
          topics: [
            "Development environment and tool selection",
            "Prompting for coding tasks",
            "Context and repository awareness",
          ],
        },
        {
          title: "Module 2: AI-Assisted Implementation",
          topics: [
            "Generate and explain functions",
            "Refactor existing code",
            "Debug errors and generate documentation",
          ],
          activity: "Implement a bounded feature from a written requirement.",
        },
        {
          title: "Module 3: Testing and Quality",
          topics: [
            "Unit test generation and edge cases",
            "Review dependencies and security",
            "Verify generated code",
          ],
        },
        {
          title: "Module 4: Mini-Project",
          topics: [
            "Implement a small feature",
            "Run tests and review the output",
          ],
          deliverable: "Present the completed, tested work.",
        },
      ],
      workshop2: [
        {
          title: "Day 1: AI-Assisted Coding",
          topics: [
            "Requirements and task decomposition",
            "Code generation and explanation",
            "Debugging, refactoring, documentation, and test validation",
          ],
          activity:
            "Use a sample repository to implement and verify a small change.",
        },
        {
          title: "Day 2: AI-Assisted Application Development",
          topics: [
            "Build a small web application or feature",
            "Generate and review API handlers",
            "Write and execute tests",
            "Review errors, dependencies, and security",
          ],
          deliverable:
            "Demonstrate a verified solution and explain review decisions.",
        },
      ],
      workshop3: [
        {
          title: "Day 1: AI-Enhanced Development Workflow",
          topics: [
            "Requirements, planning, and code generation",
            "Repository context and prompting",
            "Human review and source control",
          ],
        },
        {
          title: "Day 2: Testing, Debugging, and Quality",
          topics: [
            "Unit and integration test generation",
            "Debugging and log analysis",
            "Refactoring, code review, and security checks",
          ],
          activity: "Find and fix issues in a sample AI-assisted change.",
        },
        {
          title: "Day 3: End-to-End Project",
          topics: [
            "Plan an application and implement frontend and backend features",
            "Use AI to support testing and documentation",
            "Conduct human review",
          ],
          deliverable: "Present and assess a tested project.",
        },
      ],
      training7: [
        {
          title: "Day 1: Software Engineering Foundations and AI Tools",
          topics: [
            "Development workflow and version control",
            "AI coding assistant capabilities and boundaries",
          ],
          activity: "Configure a safe, sample coding workflow.",
        },
        {
          title: "Day 2: AI-Assisted Requirements and Architecture",
          topics: [
            "User stories, acceptance criteria, and task decomposition",
            "Architecture options and trade-offs",
          ],
          deliverable: "A reviewed technical plan.",
        },
        {
          title: "Day 3: Code Generation, Refactoring, and Debugging",
          topics: [
            "Contextual code generation and explanation",
            "Refactoring and error analysis",
          ],
          activity: "Implement and review a bounded code change.",
        },
        {
          title: "Day 4: Testing, Test Automation, and Quality",
          topics: [
            "Test design and edge cases",
            "AI-assisted test generation and execution",
            "Quality review",
          ],
          deliverable: "A test suite with documented gaps.",
        },
        {
          title: "Day 5: AI-Assisted Full-Stack Development",
          topics: [
            "Frontend and backend implementation",
            "API integration and data validation",
          ],
          activity: "Build an application feature with human review.",
        },
        {
          title: "Day 6: Security, Review, Documentation, and Collaboration",
          topics: [
            "Secure coding and dependency review",
            "Code review, documentation, and team workflow",
          ],
          deliverable: "Reviewed code and concise implementation notes.",
        },
        {
          title: "Day 7: Capstone Application and Evaluation",
          topics: [
            "Complete and test an application",
            "Evaluate correctness, maintainability, and safety",
          ],
          deliverable: "Capstone demonstration and assessment.",
        },
      ],
      training15: [
        {
          title: "Day 1: Development Environment, Git, and AI Tooling",
          topics: [
            "Development setup and source control",
            "AI assistant configuration and safe use",
          ],
        },
        {
          title: "Day 2: Requirements, User Stories, and Task Decomposition",
          topics: [
            "Translate needs into acceptance criteria",
            "Break work into reviewable tasks",
          ],
        },
        {
          title: "Day 3: AI-Assisted Architecture and Design",
          topics: [
            "Explore architecture options",
            "Review trade-offs and document decisions",
          ],
        },
        {
          title: "Day 4: Code Generation and Explanation",
          topics: [
            "Provide relevant code context",
            "Generate and verify implementation",
          ],
        },
        {
          title: "Day 5: Refactoring and Maintainability",
          topics: [
            "Refactor safely in small steps",
            "Review readability, behavior, and maintainability",
          ],
        },
        {
          title: "Day 6: Debugging and Error Analysis",
          topics: [
            "Analyze errors and logs",
            "Form and test debugging hypotheses",
          ],
        },
        {
          title: "Day 7: Unit Testing and Test Design",
          topics: [
            "Identify boundaries and edge cases",
            "Generate, run, and improve unit tests",
          ],
        },
        {
          title: "Day 8: Integration Testing and Quality Assurance",
          topics: [
            "Test component and API interactions",
            "Review quality signals and failure cases",
          ],
        },
        {
          title: "Day 9: AI-Assisted Frontend Development",
          topics: [
            "Build accessible interface components",
            "Review state, validation, and responsive behavior",
          ],
        },
        {
          title: "Day 10: AI-Assisted Backend and API Development",
          topics: [
            "Design and implement API handlers",
            "Validate inputs and review error handling",
          ],
        },
        {
          title: "Day 11: Database Integration and Data Validation",
          topics: [
            "Model and validate application data",
            "Test persistence and integration paths",
          ],
        },
        {
          title: "Day 12: Secure Coding and Dependency Review",
          topics: [
            "Review generated code for security issues",
            "Check dependencies and secrets handling",
          ],
        },
        {
          title: "Day 13: Documentation and Team Workflows",
          topics: [
            "Generate and review technical documentation",
            "Collaborate with change and review practices",
          ],
        },
        {
          title: "Day 14: End-to-End Capstone Implementation",
          topics: [
            "Implement a scoped application",
            "Integrate frontend, backend, and tests",
          ],
          deliverable: "A working capstone draft.",
        },
        {
          title: "Day 15: Testing, Code Review, Demonstration, and Assessment",
          topics: [
            "Run acceptance tests and conduct code review",
            "Document limitations and present the solution",
          ],
          deliverable: "A tested and documented capstone.",
        },
      ],
    }),
  },
  {
    slug: "generative-ai-application-development",
    title: programTitles["generative-ai-application-development"],
    category: "AI Engineering",
    summary:
      "Integrate language models into secure, reliable applications, from model APIs and prompts to retrieval and evaluation.",
    description:
      "Learn to integrate language models into software applications and build practical AI-powered experiences.",
    icon: "layers",
    audience: [
      "Software developers and technical students",
      "Product teams prototyping AI features",
      "Full-stack engineers and solution architects",
      "Teams exploring document assistants or AI interfaces",
    ],
    prerequisites: [
      "Basic programming and HTTP/API familiarity are recommended.",
      "Hands-on sessions use sample data and configured development environments.",
    ],
    outcomes: [
      "Explain model API request-response patterns and application architecture.",
      "Integrate model services through a backend while protecting credentials.",
      "Handle structured outputs, errors, timeouts, and validation.",
      "Prototype grounded AI experiences and evaluate quality, cost, and reliability.",
    ],
    tools: [
      "LLM model APIs and server-side application endpoints",
      "Environment variables and structured response validation",
      "Embeddings, retrieval, and sample document collections",
    ],
    practicalActivities: [
      "Build a chatbot or text assistant with a backend-mediated model request.",
      "Add document retrieval or a small grounded question-answering experience.",
      "Evaluate output quality, error behavior, and security assumptions.",
    ],
    assessment: [
      "Review secure configuration, output handling, and representative test cases.",
      "Capstone presentation includes behavior, limitations, and deployment planning.",
    ],
    related: [
      "ai-powered-software-development",
      "ai-agents-intelligent-automation",
      "mern-full-stack-ai",
    ],
    formats: createFormats({
      seminar: [
        {
          title: "Module 1: LLM Application Fundamentals",
          topics: [
            "LLMs, model APIs, and tokens",
            "How AI applications send and receive requests",
            "Common business and developer use cases",
          ],
        },
        {
          title: "Module 2: AI Application Architecture",
          topics: [
            "Frontend, backend, and model services",
            "API keys and secure server-side integration",
            "Output validation and error handling",
          ],
        },
        {
          title: "Module 3: Advanced Concepts Overview",
          topics: [
            "Embeddings and semantic search",
            "RAG and document assistants",
            "AI agents and tool calling",
          ],
        },
        {
          title: "Module 4: Demonstration",
          topics: [
            "Demonstrate an AI chatbot or document assistant",
            "Discuss cost, latency, and reliability",
          ],
        },
      ],
      workshop1: [
        {
          title: "Module 1: AI API Fundamentals",
          topics: [
            "Model APIs, request-response patterns, and structured output",
            "API keys, environment variables, and safe configuration",
          ],
        },
        {
          title: "Module 2: Build an AI Feature",
          topics: [
            "Create a basic chatbot or text assistant",
            "Connect a frontend to a backend endpoint",
            "Integrate a model API",
          ],
          activity:
            "Build a small application feature using a configured sample service.",
        },
        {
          title: "Module 3: Validation and Reliability",
          topics: [
            "Handle errors and timeouts",
            "Validate outputs and protect sensitive information",
          ],
        },
        {
          title: "Module 4: Mini-Project",
          topics: [
            "Demonstrate the feature",
            "Document limitations and potential improvements",
          ],
          deliverable: "A working feature prototype with review notes.",
        },
      ],
      workshop2: [
        {
          title: "Day 1: AI API Integration",
          topics: [
            "LLM fundamentals and API requests",
            "Prompt construction and context",
            "Backend integration and output validation",
          ],
          activity: "Build a basic assistant behind a server endpoint.",
        },
        {
          title: "Day 2: Practical AI Application",
          topics: [
            "Conversation state and user interface",
            "Error handling and usage limits",
            "Basic document assistance, security, and evaluation",
          ],
          deliverable: "Demonstrate an evaluated application.",
        },
      ],
      workshop3: [
        {
          title: "Day 1: LLMs, APIs, and Application Architecture",
          topics: [
            "Model API behavior and application boundaries",
            "Secure configuration and request handling",
          ],
          activity: "Design and test a minimal model-service integration.",
        },
        {
          title: "Day 2: AI Features, Embeddings, and Introduction to RAG",
          topics: [
            "Build AI features and structured responses",
            "Embeddings, retrieval, and grounding fundamentals",
          ],
          activity: "Retrieve relevant passages from a sample collection.",
        },
        {
          title: "Day 3: Build, Evaluate, and Demonstrate an AI Application",
          topics: [
            "Integrate and test a grounded AI feature",
            "Handle errors and evaluate outputs",
          ],
          deliverable:
            "Present an application with reliability and limitation notes.",
        },
      ],
      training7: [
        {
          title: "Day 1: LLM Fundamentals and Application Design",
          topics: [
            "LLMs, model capabilities, and use-case selection",
            "Application boundaries and success criteria",
          ],
        },
        {
          title: "Day 2: AI APIs, Prompts, and Structured Outputs",
          topics: [
            "API requests and prompt construction",
            "Structured responses and validation",
          ],
          activity: "Build a request-response prototype.",
        },
        {
          title: "Day 3: Backend Integration and Security",
          topics: [
            "Server-side model integration",
            "Secrets, input validation, and access boundaries",
          ],
        },
        {
          title: "Day 4: Conversational Interfaces and Application State",
          topics: [
            "Chat interfaces and conversation state",
            "Loading, error, and retry states",
          ],
          deliverable: "A usable conversational feature.",
        },
        {
          title: "Day 5: Embeddings, Retrieval, and RAG Fundamentals",
          topics: [
            "Embeddings and similarity search",
            "Document retrieval and grounded responses",
          ],
          activity: "Build a sample retrieval workflow.",
        },
        {
          title: "Day 6: Evaluation, Reliability, Cost, and Error Handling",
          topics: [
            "Representative test cases and output evaluation",
            "Latency, cost, errors, and operational limits",
          ],
        },
        {
          title: "Day 7: Capstone AI Application",
          topics: [
            "Complete and demonstrate an AI application",
            "Review quality, security, and limitations",
          ],
          deliverable: "Capstone application and evaluation summary.",
        },
      ],
      training15: [
        {
          title: "Day 1: AI Application Concepts and Architecture",
          topics: [
            "Use cases and application boundaries",
            "Frontend, backend, and model service responsibilities",
          ],
        },
        {
          title: "Day 2: LLMs, Tokens, Context, and Model Selection",
          topics: [
            "Model inputs, context, and responses",
            "Selection considerations and limitations",
          ],
        },
        {
          title: "Day 3: Prompt Design and Structured Outputs",
          topics: [
            "Prompt construction and task context",
            "Structured formats and output validation",
          ],
        },
        {
          title: "Day 4: AI API Integration",
          topics: [
            "Request-response integration patterns",
            "Timeouts, retries, and provider errors",
          ],
        },
        {
          title: "Day 5: Backend Services and Secure Configuration",
          topics: [
            "Backend routes and secrets management",
            "Input validation and access control",
          ],
        },
        {
          title: "Day 6: Frontend Interfaces and Conversation State",
          topics: [
            "Conversational user interface patterns",
            "State, loading, error, and retry experiences",
          ],
        },
        {
          title: "Day 7: Data Handling and Output Validation",
          topics: [
            "Safe handling of user and model data",
            "Validate outputs before display or downstream use",
          ],
        },
        {
          title: "Day 8: Embeddings and Semantic Similarity",
          topics: [
            "Embedding concepts and similarity",
            "Choose and inspect retrieval results",
          ],
        },
        {
          title: "Day 9: Document Processing and Retrieval",
          topics: [
            "Prepare sample documents for retrieval",
            "Retrieve relevant content and show source context",
          ],
        },
        {
          title: "Day 10: RAG Architecture and Grounded Responses",
          topics: [
            "Connect retrieval context to model prompts",
            "Evaluate grounding and unsupported claims",
          ],
        },
        {
          title: "Day 11: Tool Calling and Introductory Agent Patterns",
          topics: [
            "Structured tool requests and safe execution",
            "Keep permissions narrow and actions reviewable",
          ],
        },
        {
          title: "Day 12: Evaluation, Testing, and Observability",
          topics: [
            "Build representative quality tests",
            "Track errors, latency, and usage",
          ],
        },
        {
          title: "Day 13: Security, Privacy, and Prompt Injection",
          topics: [
            "Protect data and credentials",
            "Handle untrusted content and prompt injection",
          ],
        },
        {
          title: "Day 14: Capstone Implementation",
          topics: [
            "Implement and integrate the selected AI application",
            "Test security, quality, and failure paths",
          ],
          deliverable: "A documented application candidate.",
        },
        {
          title: "Day 15: Demonstration, Evaluation, and Deployment Planning",
          topics: [
            "Present results and limitations",
            "Review reliability and plan responsible deployment",
          ],
          deliverable: "Capstone presentation and evaluation report.",
        },
      ],
    }),
  },
  {
    slug: "ai-agents-intelligent-automation",
    title: programTitles["ai-agents-intelligent-automation"],
    category: "Automation",
    summary:
      "Design controlled AI workflows that use tools, retrieve information, and support multi-step work with human oversight.",
    description:
      "Explore how AI systems can use tools, follow workflows, retrieve information, and assist with multi-step tasks under appropriate controls.",
    icon: "workflow",
    audience: [
      "Developers and automation engineers",
      "Business analysts and operations teams",
      "Technical leads and product teams",
      "Organizations exploring controlled workflow automation",
    ],
    prerequisites: [
      "No agent-building experience is required for introductory formats.",
      "Basic API familiarity is helpful for implementation-focused workshops.",
    ],
    outcomes: [
      "Distinguish AI assistants, workflow automation, and tool-using agents.",
      "Decompose tasks into bounded steps with approved tools and data.",
      "Add validation, human approvals, logging, and recovery paths.",
      "Evaluate workflow behavior and document permissions and limitations.",
    ],
    tools: [
      "LLM tool calling and structured outputs",
      "Mock APIs and sample knowledge sources",
      "Workflow diagrams, logs, and evaluation cases",
    ],
    practicalActivities: [
      "Map a repetitive task and identify safe automation boundaries.",
      "Build a controlled assistant using a mock or approved data source.",
      "Test failed actions, approval gates, permissions, and recovery paths.",
    ],
    assessment: [
      "Review workflow boundaries, permissions, failure handling, and audit notes.",
      "Capstone demonstrations use sandboxed or mock integrations.",
    ],
    related: [
      "generative-ai-application-development",
      "ai-cybersecurity-responsible-ai",
      "ai-future-it-professionals",
    ],
    formats: createFormats({
      seminar: [
        {
          title: "Module 1: Introduction to AI Agents",
          topics: [
            "Assistants, workflows, and agents",
            "Tools, instructions, and context",
            "Business and IT applications",
          ],
        },
        {
          title: "Module 2: Intelligent Automation",
          topics: [
            "Identify repetitive workflows",
            "AI-assisted task execution",
            "Human review and approval",
          ],
        },
        {
          title: "Module 3: Risks and Governance",
          topics: [
            "Unreliable actions and incorrect outputs",
            "Permissions, data security, monitoring, and escalation",
          ],
        },
        {
          title: "Module 4: Demonstration",
          topics: [
            "Demonstrate a simple controlled workflow",
            "Discuss practical applications and limits",
          ],
          activity: "Review where human approval is required.",
        },
      ],
      workshop1: [
        {
          title: "Module 1: Agent Fundamentals",
          topics: [
            "Agent architecture and tool calling",
            "Workflow design and task decomposition",
          ],
        },
        {
          title: "Module 2: Build a Simple Workflow",
          topics: [
            "Define a task and allowed tools",
            "Connect approved sample data or a mock API",
            "Validate outputs",
          ],
          activity: "Build a bounded workflow assistant.",
        },
        {
          title: "Module 3: Control and Evaluation",
          topics: [
            "Permissions and human approval",
            "Failure handling and logging",
            "Evaluate successful and unsuccessful cases",
          ],
        },
        {
          title: "Module 4: Mini-Project",
          topics: ["Demonstrate a controlled workflow assistant"],
          deliverable: "A documented prototype and its limitations.",
        },
      ],
      workshop2: [
        {
          title: "Day 1: AI Agent Design and Tool Calling",
          topics: [
            "Agent concepts, architecture, tools, and context",
            "Workflow decomposition",
          ],
          activity: "Build a basic tool-using assistant in a safe environment.",
        },
        {
          title: "Day 2: Workflow Automation and Safety",
          topics: [
            "Connect a sample API or data source",
            "Add validation and approval steps",
            "Handle errors and unsuccessful actions",
          ],
          deliverable:
            "Test, document, and demonstrate the controlled workflow.",
        },
      ],
      workshop3: [
        {
          title: "Day 1: Agents, Tools, and Workflow Architecture",
          topics: [
            "Agent patterns and boundaries",
            "Design tool schemas and workflow steps",
          ],
        },
        {
          title: "Day 2: Build a Multi-Step Workflow",
          topics: [
            "Connect mock data and approved tools",
            "Add state, validation, and step-level checks",
          ],
          activity: "Implement a multi-step workflow with safe defaults.",
        },
        {
          title:
            "Day 3: Evaluation, Permissions, Monitoring, and Project Presentation",
          topics: [
            "Test failure and recovery cases",
            "Review permissions, monitoring, and human approvals",
          ],
          deliverable: "Present a sandboxed workflow and its risk controls.",
        },
      ],
      training7: [
        {
          title: "Day 1: AI Agents and Automation Fundamentals",
          topics: [
            "Assistants, workflows, and agents",
            "Identify suitable bounded tasks",
          ],
        },
        {
          title: "Day 2: Tool Calling and Structured Outputs",
          topics: [
            "Tool schemas and model requests",
            "Validate structured responses",
          ],
          activity: "Define and test a safe mock tool.",
        },
        {
          title: "Day 3: Workflow Design and Task Decomposition",
          topics: [
            "Break tasks into steps and decision points",
            "Define completion criteria and exceptions",
          ],
        },
        {
          title: "Day 4: APIs, Data Retrieval, and Integrations",
          topics: [
            "Connect approved sample data",
            "Retrieve information and constrain tool access",
          ],
        },
        {
          title: "Day 5: State, Memory Concepts, and Error Handling",
          topics: [
            "Manage workflow state",
            "Handle timeouts, failures, and recovery",
          ],
          deliverable: "A documented workflow state diagram.",
        },
        {
          title:
            "Day 6: Evaluation, Permissions, Monitoring, and Human Oversight",
          topics: [
            "Test representative cases and failures",
            "Review permissions, logs, and approval gates",
          ],
        },
        {
          title: "Day 7: Capstone Intelligent Workflow",
          topics: [
            "Implement a controlled workflow",
            "Demonstrate safeguards and limitations",
          ],
          deliverable: "Sandboxed workflow capstone and assessment.",
        },
      ],
      training15: [
        {
          title: "Day 1: AI Automation Fundamentals",
          topics: [
            "Automation concepts and task suitability",
            "Risks of unbounded actions",
          ],
        },
        {
          title: "Day 2: LLMs and Agent Architectures",
          topics: [
            "Model roles in agent systems",
            "Workflow and agent architecture patterns",
          ],
        },
        {
          title: "Day 3: Tool Calling and Function Schemas",
          topics: [
            "Define tools and input schemas",
            "Validate requests and tool results",
          ],
        },
        {
          title: "Day 4: Prompting and Structured Outputs",
          topics: [
            "Instructions, context, and constraints",
            "Structured outputs and validation",
          ],
        },
        {
          title: "Day 5: Workflow Design and Task Decomposition",
          topics: [
            "Decompose multi-step tasks",
            "Define state, branching, and completion criteria",
          ],
        },
        {
          title: "Day 6: API Integration",
          topics: [
            "Connect sandbox APIs",
            "Apply timeouts, validation, and narrow permissions",
          ],
        },
        {
          title: "Day 7: Data Retrieval and Knowledge Sources",
          topics: [
            "Select approved data sources",
            "Retrieve and cite relevant information",
          ],
        },
        {
          title: "Day 8: State and Memory Concepts",
          topics: [
            "Manage short-lived workflow state",
            "Consider retention and data boundaries",
          ],
        },
        {
          title: "Day 9: Multi-Step Workflow Implementation",
          topics: [
            "Connect tools and workflow stages",
            "Add checkpoints and traceable outputs",
          ],
          activity: "Implement a bounded multi-step workflow.",
        },
        {
          title: "Day 10: Failure Handling and Recovery",
          topics: [
            "Handle tool errors and incomplete results",
            "Design safe stopping and recovery paths",
          ],
        },
        {
          title: "Day 11: Evaluation and Observability",
          topics: [
            "Test success, edge, and failure cases",
            "Review logs, traces, and outcome measures",
          ],
        },
        {
          title: "Day 12: Permissions, Privacy, and Security",
          topics: [
            "Least-privilege access and data minimization",
            "Protect tools, credentials, and information",
          ],
        },
        {
          title: "Day 13: Human Approval and Governance",
          topics: [
            "Require approval for consequential actions",
            "Define ownership, escalation, and auditability",
          ],
        },
        {
          title: "Day 14: Capstone Implementation and Testing",
          topics: [
            "Build and test the controlled workflow",
            "Document boundaries and known failure modes",
          ],
          deliverable: "A tested sandbox capstone.",
        },
        {
          title: "Day 15: Project Demonstration and Assessment",
          topics: [
            "Present workflow behavior and safeguards",
            "Review outcomes and next steps",
          ],
          deliverable: "Project demonstration and assessment.",
        },
      ],
    }),
  },
  {
    slug: "ai-cybersecurity-responsible-ai",
    title: programTitles["ai-cybersecurity-responsible-ai"],
    category: "Cybersecurity & Responsible AI",
    summary:
      "Understand AI-specific security risks and apply defensive practices for privacy, evaluation, governance, and oversight.",
    description:
      "Understand the security risks of AI systems and learn responsible approaches to privacy, evaluation, governance, and secure application design.",
    icon: "shield",
    audience: [
      "Security professionals and software developers",
      "AI product owners and technology leaders",
      "Risk, compliance, and governance teams",
      "Students exploring defensive AI security",
    ],
    prerequisites: [
      "No AI security experience is required for introductory formats.",
      "Exercises use sample applications and controlled, authorized environments.",
    ],
    outcomes: [
      "Identify common AI application risks, including prompt injection and data exposure.",
      "Apply defensive design practices for secrets, permissions, input, and output.",
      "Assess privacy, fairness, reliability, and human oversight concerns.",
      "Document mitigations and communicate residual risk responsibly.",
    ],
    tools: [
      "Sample AI applications and threat-model templates",
      "Input/output validation and access-control patterns",
      "Evaluation checklists and incident scenarios",
    ],
    practicalActivities: [
      "Threat-model a sample AI assistant in a controlled setting.",
      "Review prompt injection, data handling, tool permissions, and output risks.",
      "Prepare a concise risk assessment with defensive mitigations.",
    ],
    assessment: [
      "Assess threat models, proposed mitigations, and documentation quality.",
      "Longer formats conclude with a defensive security review presentation.",
    ],
    related: [
      "ai-agents-intelligent-automation",
      "generative-ai-application-development",
      "data-analytics-ai",
    ],
    formats: createFormats({
      seminar: [
        {
          title: "Module 1: AI Security Landscape",
          topics: [
            "AI adoption and security implications",
            "AI-assisted defense and threat detection",
            "AI-enabled phishing and social engineering",
          ],
        },
        {
          title: "Module 2: AI Application Risks",
          topics: [
            "Prompt injection and sensitive data exposure",
            "Insecure tool use and excessive permissions",
            "Unreliable or misleading output",
          ],
        },
        {
          title: "Module 3: Responsible AI",
          topics: [
            "Privacy, fairness, transparency, and accountability",
            "Human oversight and output verification",
          ],
        },
        {
          title: "Module 4: Case Studies",
          topics: [
            "Review example AI security failures",
            "Discuss safer implementation patterns",
          ],
          activity: "Identify defensive lessons from a sample scenario.",
        },
      ],
      workshop1: [
        {
          title: "Module 1: AI Security Fundamentals",
          topics: [
            "Threat modelling for AI applications",
            "Prompt injection and untrusted input",
            "Data leakage and access control",
          ],
        },
        {
          title: "Module 2: Secure AI Application Design",
          topics: [
            "Server-side secrets and permissions",
            "Input validation and output handling",
            "Safe retrieval and tool access",
          ],
        },
        {
          title: "Module 3: Responsible AI Assessment",
          topics: [
            "Accuracy and bias checks",
            "Privacy review and risk assessment",
            "Human approval and incident response",
          ],
        },
        {
          title: "Module 4: Practical Exercise",
          topics: [
            "Threat-model a sample AI assistant",
            "Identify risks and propose mitigations",
          ],
          deliverable: "A prioritized defensive risk assessment.",
        },
      ],
      workshop2: [
        {
          title: "Day 1: AI Threats and Vulnerabilities",
          topics: [
            "Prompt injection and data leakage",
            "Insecure output handling and excessive permissions",
            "Model limitations and misuse",
          ],
          activity: "Analyze a sample application in a controlled environment.",
        },
        {
          title: "Day 2: Security and Responsible AI Controls",
          topics: [
            "Threat modelling and validation",
            "Access controls, privacy, and governance",
            "Test and document mitigations",
          ],
          deliverable: "A risk-and-control review for the sample application.",
        },
      ],
      workshop3: [
        {
          title: "Day 1: AI Security and Threat Modelling",
          topics: [
            "Map data flows and trust boundaries",
            "Identify prompt, retrieval, and tool risks",
          ],
          activity: "Create a threat model for an authorized sample app.",
        },
        {
          title: "Day 2: Secure AI Integration and Application Controls",
          topics: [
            "Secure API configuration and access",
            "Validate inputs, outputs, and retrieved content",
          ],
          activity: "Apply and review defensive controls.",
        },
        {
          title:
            "Day 3: Evaluation, Governance, Incident Scenarios, and Risk Reporting",
          topics: [
            "Test risk scenarios and mitigations",
            "Review oversight, incident response, and governance",
          ],
          deliverable: "Present a documented defensive risk report.",
        },
      ],
      training7: [
        {
          title: "Day 1: AI Security Fundamentals",
          topics: [
            "AI application components and trust boundaries",
            "Security and responsible-use concepts",
          ],
        },
        {
          title: "Day 2: Threat Modelling and Prompt Injection",
          topics: [
            "Threat-model AI workflows",
            "Handle untrusted input and prompt injection",
          ],
          activity: "Analyze a safe sample scenario.",
        },
        {
          title: "Day 3: Privacy, Data Leakage, and Access Control",
          topics: [
            "Data classification and minimization",
            "Access control and exposure paths",
          ],
        },
        {
          title: "Day 4: Secure AI APIs and Tool Integrations",
          topics: [
            "Secrets and server-side integration",
            "Constrain tools and validate requests",
          ],
        },
        {
          title: "Day 5: Evaluation, Bias, and Reliability",
          topics: [
            "Accuracy, bias, and reliability checks",
            "Human review and safe fallback design",
          ],
        },
        {
          title: "Day 6: Governance, Monitoring, and Incident Response",
          topics: [
            "Documentation, monitoring, and escalation",
            "Incident handling and accountability",
          ],
          deliverable: "A sample monitoring and response plan.",
        },
        {
          title: "Day 7: Security Assessment Capstone",
          topics: [
            "Review an authorized sample AI application",
            "Prioritize and communicate mitigations",
          ],
          deliverable: "A defensive assessment and presentation.",
        },
      ],
      training15: [
        {
          title: "Day 1: AI Security Landscape",
          topics: [
            "AI systems and security implications",
            "Defensive use cases and threats",
          ],
        },
        {
          title: "Day 2: AI Threat Modelling",
          topics: [
            "Assets, data flows, and trust boundaries",
            "Threat scenarios and risk prioritization",
          ],
        },
        {
          title: "Day 3: Prompt Injection and Untrusted Input",
          topics: [
            "Untrusted content and instruction boundaries",
            "Defensive handling and testing",
          ],
        },
        {
          title: "Day 4: Data Privacy and Leakage",
          topics: [
            "Sensitive data and data minimization",
            "Exposure risks in prompts, logs, and outputs",
          ],
        },
        {
          title: "Day 5: Identity, Permissions, and Access Control",
          topics: [
            "Least privilege and role boundaries",
            "Access review for models and tools",
          ],
        },
        {
          title: "Day 6: Secure AI API Design",
          topics: [
            "Server-side secrets and request controls",
            "Validate inputs, outputs, and errors",
          ],
        },
        {
          title: "Day 7: Secure Retrieval and Document Handling",
          topics: [
            "Access-aware retrieval from sample documents",
            "Handle untrusted or sensitive source content",
          ],
        },
        {
          title: "Day 8: AI Agent Safety and Tool Permissions",
          topics: [
            "Constrain tool capabilities",
            "Add approval gates and safe stopping",
          ],
        },
        {
          title: "Day 9: Output Validation and Reliability",
          topics: [
            "Validate generated output",
            "Design uncertainty handling and human review",
          ],
        },
        {
          title: "Day 10: Bias, Fairness, and Responsible AI",
          topics: [
            "Review potential bias and impacts",
            "Document accountability and oversight",
          ],
        },
        {
          title: "Day 11: Evaluation and Red-Team Concepts",
          topics: [
            "Build defensive test cases",
            "Evaluate controls in a controlled and authorized setting",
          ],
        },
        {
          title: "Day 12: Logging, Monitoring, and Incident Handling",
          topics: [
            "Monitor behavior and errors",
            "Plan escalation and incident response",
          ],
        },
        {
          title: "Day 13: Governance, Documentation, and Risk Management",
          topics: [
            "Document ownership, decisions, and residual risks",
            "Review governance practices",
          ],
        },
        {
          title: "Day 14: Capstone Security Review",
          topics: [
            "Review a sample application against a threat model",
            "Propose and validate mitigations",
          ],
          deliverable: "A structured defensive security review.",
        },
        {
          title: "Day 15: Presentation and Risk Assessment",
          topics: [
            "Present findings and mitigations",
            "Discuss residual risk and accountable next steps",
          ],
          deliverable: "A risk assessment presentation.",
        },
      ],
    }),
  },
  {
    slug: "data-analytics-ai",
    title: programTitles["data-analytics-ai"],
    category: "Data & Analytics",
    summary:
      "Turn sample data into useful insights with analytical methods, AI assistance, visualization, and careful validation.",
    description:
      "Learn how data analysis and AI can help transform raw information into meaningful insights while understanding data quality, limitations, and responsible interpretation.",
    icon: "chart",
    audience: [
      "Students and early-career analysts",
      "Business analysts and operations teams",
      "Managers who work with reports and dashboards",
      "Professionals exploring AI-assisted data work",
    ],
    prerequisites: [
      "No advanced statistics or programming is required for introductory formats.",
      "Exercises use sample or approved datasets; do not bring confidential data.",
    ],
    outcomes: [
      "Prepare and assess the quality of a structured dataset.",
      "Use exploratory analysis, summaries, and visualizations to investigate questions.",
      "Apply AI assistance while independently verifying calculations and interpretations.",
      "Communicate insights, uncertainty, and limitations responsibly.",
    ],
    tools: [
      "Sample tabular datasets and spreadsheet or analysis tools",
      "Basic charts, summary statistics, and SQL concepts",
      "AI-assisted querying, summarization, and reporting techniques",
    ],
    practicalActivities: [
      "Clean and validate a sample dataset with missing values or duplicates.",
      "Compare trends and create a visualization for a business question.",
      "Produce a concise report with verified insights and limitations.",
    ],
    assessment: [
      "Review data preparation, calculations, visualizations, and reasoning.",
      "Capstone presentations include evidence, recommendations, and limitations.",
    ],
    related: [
      "generative-ai-prompt-engineering",
      "generative-ai-application-development",
      "ai-cybersecurity-responsible-ai",
    ],
    formats: createFormats({
      seminar: [
        {
          title: "Module 1: Data and AI Fundamentals",
          topics: [
            "Data analytics, business intelligence, and AI",
            "Structured and unstructured data",
            "Data quality and interpretation",
          ],
        },
        {
          title: "Module 2: AI-Assisted Analysis",
          topics: [
            "Ask questions about datasets",
            "Generate summaries and visualizations",
            "Identify patterns and verify AI-generated calculations",
          ],
        },
        {
          title: "Module 3: Applications",
          topics: [
            "Business dashboards and reporting",
            "Forecasting fundamentals",
            "Decision support and limitations",
          ],
        },
        {
          title: "Module 4: Demonstration and Q&A",
          topics: [
            "Explore a sample dataset and discuss findings",
            "Questions and answers",
          ],
        },
      ],
      workshop1: [
        {
          title: "Module 1: Data Preparation",
          topics: [
            "Data types, missing values, and duplicates",
            "Clean and organize sample data",
          ],
          activity: "Prepare a small provided dataset.",
        },
        {
          title: "Module 2: Exploratory Analysis",
          topics: [
            "Summary statistics and grouping",
            "Trends, comparisons, and basic charts",
          ],
        },
        {
          title: "Module 3: AI-Assisted Insights",
          topics: [
            "Generate hypotheses and summaries",
            "Verify calculations and identify misleading interpretations",
          ],
          activity: "Check AI-generated observations against the dataset.",
        },
        {
          title: "Module 4: Mini-Project",
          topics: ["Analyze a sample business dataset"],
          deliverable: "Present findings, evidence, and limitations.",
        },
      ],
      workshop2: [
        {
          title: "Day 1: Data Preparation and Analysis",
          topics: [
            "Data cleaning and validation",
            "Exploratory data analysis and basic statistics",
            "Visualizations and AI-assisted querying",
          ],
          activity: "Explore and summarize a sample dataset.",
        },
        {
          title: "Day 2: Insights and Reporting",
          topics: [
            "Trend analysis and comparisons",
            "Introductory forecasting concepts",
            "AI-generated report drafting and insight verification",
          ],
          deliverable: "Present a verified report and recommendations.",
        },
      ],
      workshop3: [
        {
          title: "Day 1: Data Foundations and Cleaning",
          topics: [
            "Understand data types, sources, and quality",
            "Clean, validate, and organize a sample dataset",
          ],
          activity: "Prepare a data-quality summary.",
        },
        {
          title: "Day 2: Analysis, Visualization, and AI-Assisted Insights",
          topics: [
            "Explore patterns and comparisons",
            "Build clear visualizations",
            "Use AI to generate hypotheses and validate calculations",
          ],
        },
        {
          title:
            "Day 3: Reporting, Forecasting Fundamentals, and Capstone Presentation",
          topics: [
            "Explain trends and introductory forecast assumptions",
            "Draft recommendations and note limitations",
          ],
          deliverable: "Present a capstone analysis with evidence.",
        },
      ],
      training7: [
        {
          title: "Day 1: Data Analytics Fundamentals",
          topics: [
            "Analytics, business intelligence, and AI",
            "Questions, metrics, and data quality",
          ],
        },
        {
          title: "Day 2: Data Cleaning and Preparation",
          topics: [
            "Data types, missing values, and duplicates",
            "Clean and validate sample data",
          ],
          activity: "Submit a prepared dataset and quality notes.",
        },
        {
          title: "Day 3: Exploratory Data Analysis and Statistics",
          topics: [
            "Summary statistics and grouping",
            "Compare distributions and trends",
          ],
        },
        {
          title: "Day 4: Visualization and Reporting",
          topics: [
            "Select charts for common questions",
            "Create readable reports and explain evidence",
          ],
          deliverable: "A short evidence-based report.",
        },
        {
          title: "Day 5: AI-Assisted Analysis and Querying",
          topics: [
            "Ask structured questions about sample data",
            "Use AI for summaries and query support",
            "Verify calculations and interpretations",
          ],
        },
        {
          title: "Day 6: Trends, Forecasting Concepts, and Validation",
          topics: [
            "Compare trends and introduce forecasting assumptions",
            "Check reliability, bias, and data limitations",
          ],
        },
        {
          title: "Day 7: Capstone Data Analysis Project",
          topics: [
            "Analyze an approved sample dataset",
            "Develop and present findings",
          ],
          deliverable: "Capstone analysis, visualization, and assessment.",
        },
      ],
      training15: [
        {
          title: "Day 1: Data Analytics and AI Overview",
          topics: [
            "Analytics, business intelligence, and AI",
            "Common applications and limitations",
          ],
        },
        {
          title: "Day 2: Data Types, Sources, and Quality",
          topics: [
            "Structured and unstructured data",
            "Assess provenance, quality, and suitability",
          ],
        },
        {
          title: "Day 3: Data Cleaning and Preparation",
          topics: [
            "Missing values, duplicates, and inconsistent records",
            "Prepare sample data for analysis",
          ],
        },
        {
          title: "Day 4: Descriptive Statistics",
          topics: [
            "Measures of center and spread",
            "Summarize data and interpret statistics",
          ],
        },
        {
          title: "Day 5: Exploratory Data Analysis",
          topics: [
            "Grouping, comparisons, and distributions",
            "Investigate patterns and anomalies",
          ],
        },
        {
          title: "Day 6: Data Visualization",
          topics: [
            "Choose charts for analytical questions",
            "Create and critique clear visualizations",
          ],
        },
        {
          title: "Day 7: SQL and Structured Data Fundamentals",
          topics: [
            "Tables, fields, and basic queries",
            "Filter, group, and summarize approved data",
          ],
        },
        {
          title: "Day 8: AI-Assisted Queries and Analysis",
          topics: [
            "Ask structured questions of sample data",
            "Review generated query logic and calculations",
          ],
        },
        {
          title: "Day 9: Hypothesis Generation and Validation",
          topics: [
            "Generate testable hypotheses",
            "Check evidence and avoid misleading conclusions",
          ],
        },
        {
          title: "Day 10: Business Intelligence and Dashboards",
          topics: [
            "Select useful measures and dashboard views",
            "Connect visual summaries to business questions",
          ],
        },
        {
          title: "Day 11: Trend Analysis and Forecasting Fundamentals",
          topics: [
            "Explore trends and seasonality concepts",
            "Understand assumptions and uncertainty",
          ],
        },
        {
          title: "Day 12: AI-Assisted Reporting and Narrative",
          topics: [
            "Draft summaries and recommendations with AI assistance",
            "Verify claims and keep evidence visible",
          ],
        },
        {
          title: "Day 13: Data Privacy, Bias, and Reliability",
          topics: [
            "Use approved data and protect privacy",
            "Consider bias, reliability, and interpretation risks",
          ],
        },
        {
          title: "Day 14: Capstone Analysis and Visualization",
          topics: [
            "Analyze a sample dataset and create a visual summary",
            "Validate findings and prepare recommendations",
          ],
          deliverable: "A documented capstone draft.",
        },
        {
          title: "Day 15: Presentation, Assessment, and Recommendations",
          topics: [
            "Present evidence and recommendations",
            "Reflect on limitations and next steps",
          ],
          deliverable: "Final analysis presentation and assessment.",
        },
      ],
    }),
  },
  {
    slug: "mern-full-stack-ai",
    title: programTitles["mern-full-stack-ai"],
    category: "Full-Stack Development",
    summary:
      "Build working full-stack web applications with MongoDB, Express, React, and Node.js, then add a practical AI feature.",
    description:
      "Develop full-stack web applications using MongoDB, Express.js, React.js, and Node.js, then learn how to add practical AI capabilities.",
    icon: "fullstack",
    audience: [
      "Students and aspiring full-stack developers",
      "Frontend or backend developers learning MERN",
      "IT professionals building web applications",
      "Teams exploring AI features in web products",
    ],
    prerequisites: [
      "Basic computer and web-browser skills are recommended.",
      "Programming experience helps with longer formats; introductory workshops provide a guided starting point.",
    ],
    outcomes: [
      "Describe how React, Node.js, Express, and MongoDB work together.",
      "Build frontend components and connect them to REST APIs and data models.",
      "Integrate an AI model through a backend while protecting credentials.",
      "Test and demonstrate a working full-stack application with an AI-assisted feature.",
    ],
    tools: [
      "JavaScript, React, Node.js, and Express",
      "MongoDB and Mongoose",
      "REST APIs, Git, and a model API for AI integration",
    ],
    practicalActivities: [
      "Build responsive React interfaces and backend API endpoints.",
      "Connect application data to MongoDB and test core workflows.",
      "Add an AI chatbot, summarizer, text assistant, or introductory semantic search feature.",
    ],
    assessment: [
      "Review functioning user workflows, code, tests, and integration behavior.",
      "The longer options conclude with a capstone demonstration and assessment.",
    ],
    related: [
      "ai-powered-software-development",
      "generative-ai-application-development",
      "generative-ai-prompt-engineering",
    ],
    formats: createFormats({
      seminar: [
        {
          title: "Module 1: MERN Fundamentals",
          topics: [
            "Full-stack architecture",
            "React, Node.js, Express, and MongoDB",
            "Frontend-backend communication",
          ],
        },
        {
          title: "Module 2: AI in Modern Web Applications",
          topics: [
            "AI APIs and LLM integration",
            "Chatbots, intelligent search, and AI-assisted development",
          ],
        },
        {
          title: "Module 3: Demonstration",
          topics: [
            "Show a basic MERN application with an AI-powered feature",
            "Discuss secure API integration and limitations",
          ],
        },
        {
          title: "Module 4: Questions and Discussion",
          topics: [
            "Discuss learning paths and project scope",
            "Questions and answers",
          ],
        },
      ],
      workshop1: [
        {
          title: "Module 1: JavaScript and React Essentials",
          topics: ["ES6+, components, props, state, and hooks"],
          activity: "Build a small interactive React view.",
        },
        {
          title: "Module 2: Backend Fundamentals",
          topics: [
            "Node.js, Express, and REST APIs",
            "MongoDB and CRUD concepts",
          ],
        },
        {
          title: "Module 3: AI Integration Overview",
          topics: [
            "How AI model APIs work",
            "Server-side integration and API key safety",
          ],
        },
        {
          title: "Module 4: Mini-Project",
          topics: [
            "Build a basic application or prototype with an AI-assisted feature",
          ],
          deliverable: "Demonstrate the feature and its data flow.",
        },
      ],
      workshop2: [
        {
          title: "Day 1: MERN Development",
          topics: [
            "React and component-based UI",
            "Node.js and Express APIs",
            "MongoDB and basic CRUD",
            "Frontend-backend integration",
          ],
          activity: "Build and connect a core application workflow.",
        },
        {
          title: "Day 2: AI Integration",
          topics: [
            "Integrate an AI model API through the backend",
            "Build a chatbot, summarizer, or text assistant",
            "Validate responses, handle errors, and protect credentials",
          ],
          deliverable: "Demonstrate the working project and safeguards.",
        },
      ],
      workshop3: [
        {
          title: "Day 1: Frontend Development",
          topics: [
            "JavaScript and React",
            "Components, hooks, forms, and routing",
          ],
          activity: "Build a responsive interface for the project.",
        },
        {
          title: "Day 2: Backend and Database",
          topics: [
            "Node.js, Express, and REST APIs",
            "MongoDB, Mongoose, and CRUD",
          ],
          deliverable: "Connect the interface to persisted application data.",
        },
        {
          title: "Day 3: AI-Powered Full-Stack Application",
          topics: [
            "AI API integration and backend-mediated model requests",
            "Prompt and response handling",
            "Validation, error handling, and security",
          ],
          deliverable: "Present a working AI-enabled application.",
        },
      ],
      training7: [
        {
          title: "Day 1: HTML, CSS, JavaScript, and Git",
          topics: [
            "Semantic HTML and responsive styles",
            "JavaScript foundations and version control",
          ],
          activity: "Create a simple responsive page.",
        },
        {
          title: "Day 2: React Components, Hooks, Forms, and Routing",
          topics: [
            "Components, props, state, and hooks",
            "Forms, events, and client-side routing",
          ],
          deliverable: "A multi-view frontend prototype.",
        },
        {
          title: "Day 3: Node.js, Express, and REST APIs",
          topics: [
            "Node runtime and Express routes",
            "HTTP methods, validation, and error handling",
          ],
          activity: "Create and test a small API.",
        },
        {
          title: "Day 4: MongoDB, Mongoose, and CRUD",
          topics: [
            "Collections, documents, schemas, and models",
            "Create, read, update, and delete data",
          ],
          deliverable: "Persist application data through the API.",
        },
        {
          title: "Day 5: Full-Stack Integration, Testing, and Debugging",
          topics: [
            "Connect React to backend APIs",
            "Test user workflows and debug integration issues",
          ],
        },
        {
          title:
            "Day 6: AI APIs, Secure Integration, and an AI-Powered Feature",
          topics: [
            "Call a model through a protected backend endpoint",
            "Handle prompts, responses, and errors",
          ],
          activity: "Add an AI feature with safe configuration.",
        },
        {
          title: "Day 7: Capstone Project, Evaluation, and Presentation",
          topics: [
            "Complete and test a working application",
            "Review behavior, code, and limitations",
          ],
          deliverable: "Present and assess the MERN + AI capstone.",
        },
      ],
      training15: [
        {
          title: "Day 1: HTML, CSS, Responsive Design, and Git",
          topics: [
            "Semantic markup and responsive layouts",
            "Version control and project setup",
          ],
        },
        {
          title: "Day 2: JavaScript and ES6+",
          topics: [
            "Variables, functions, arrays, and objects",
            "Modern syntax and modules",
          ],
        },
        {
          title: "Day 3: Asynchronous JavaScript and API Requests",
          topics: [
            "Promises and async/await",
            "HTTP requests and error handling",
          ],
        },
        {
          title: "Day 4: React Fundamentals",
          topics: [
            "Project structure, JSX, and components",
            "Props, state, and composition",
          ],
        },
        {
          title: "Day 5: React Hooks, Forms, and Routing",
          topics: [
            "Hooks, events, and form validation",
            "Client-side routing and reusable views",
          ],
        },
        {
          title: "Day 6: Node.js and Express",
          topics: [
            "Node runtime and npm",
            "Express servers, routes, and middleware",
          ],
        },
        {
          title: "Day 7: REST API Design and Backend Validation",
          topics: [
            "HTTP methods and API patterns",
            "Request validation and consistent error responses",
          ],
        },
        {
          title: "Day 8: MongoDB, Mongoose, and Data Modelling",
          topics: [
            "Documents, collections, schemas, and models",
            "CRUD, relationships, and validation",
          ],
        },
        {
          title: "Day 9: Full-Stack Integration and Testing",
          topics: [
            "Connect frontend, APIs, and database",
            "Test core workflows and debug failures",
          ],
        },
        {
          title: "Day 10: Authentication Concepts and Application Security",
          topics: [
            "Authentication concepts and protected routes",
            "Input validation and common security practices",
          ],
        },
        {
          title: "Day 11: AI API Fundamentals and Prompt Design",
          topics: [
            "Model API patterns and prompt context",
            "Secure server-side integration",
          ],
        },
        {
          title: "Day 12: Integrate AI into a MERN Application",
          topics: [
            "Build an AI-powered application feature",
            "Validate responses and handle errors",
          ],
          activity: "Integrate and test a model-backed feature.",
        },
        {
          title: "Day 13: Embeddings, Semantic Search, and RAG Fundamentals",
          topics: [
            "Embeddings and semantic similarity",
            "Retrieve context for grounded responses",
          ],
        },
        {
          title: "Day 14: Capstone Development, Testing, and Documentation",
          topics: [
            "Complete the MERN application and AI feature",
            "Test, document, and review limitations",
          ],
          deliverable: "A tested and documented capstone.",
        },
        {
          title:
            "Day 15: Deployment Introduction, Project Presentation, and Assessment",
          topics: [
            "Review deployment concepts and environment configuration",
            "Present and assess the working project",
          ],
          deliverable: "Final demonstration and assessment.",
        },
      ],
    }),
  },
];

export function getProgram(slug: string): Program | undefined {
  return programs.find((program) => program.slug === slug);
}
