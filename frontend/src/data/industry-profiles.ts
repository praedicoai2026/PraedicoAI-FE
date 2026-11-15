export interface IndustryWorkflow {
  title: string;
  steps: string[];
}

export interface IndustryProfile {
  challenges: string[];
  solutionApproaches: string[];
  useCases: string[];
  workflows: IndustryWorkflow[];
  technologies: string[];
  potentialBenefits: string[];
  prototype: {
    title: string;
    description: string;
  };
}

export const industryProfiles: Record<string, IndustryProfile> = {
  "human-resources": {
    challenges: [
      "Recruiting teams spend time sorting applications and coordinating interview steps.",
      "Employees may struggle to find current policy and onboarding information.",
      "Feedback and workforce information can be difficult to summarize consistently.",
    ],
    solutionApproaches: [
      "Use AI to organize approved information, draft summaries, and route routine work for human review.",
      "Keep candidate assessment, employee decisions, and sensitive people matters with accountable HR professionals.",
    ],
    useCases: [
      "Resume screening and candidate matching against human-approved role criteria",
      "Recruitment workflow automation and application status summaries",
      "Interview scheduling assistants with candidate and recruiter confirmation",
      "Employee onboarding assistants and HR policy chatbots grounded in approved sources",
      "Employee feedback theme analysis using appropriately aggregated information",
      "Workforce analytics and reporting with validated metrics",
    ],
    workflows: [
      {
        title: "Recruitment intake and coordination",
        steps: [
          "Receive an application through an approved channel",
          "Extract role-relevant fields and compare them with stated criteria",
          "Route a structured summary to a recruiter for review",
          "Offer available interview times only after recruiter approval",
        ],
      },
      {
        title: "Employee policy assistant",
        steps: [
          "An employee asks a question in the internal portal",
          "Retrieve relevant passages from approved HR policies",
          "Present a source-linked draft answer with clear limitations",
          "Escalate unclear, sensitive, or personal cases to HR",
        ],
      },
    ],
    technologies: [
      "Document parsing and optical character recognition for application files",
      "Search and retrieval over approved HR policies with role-based access",
      "Language models for draft summaries and conversational interfaces",
      "Scheduling and HR system APIs with explicit approval checkpoints",
      "Aggregated analytics tools with privacy-conscious reporting",
    ],
    potentialBenefits: [
      "Opportunity to reduce repetitive application handling and coordination.",
      "Faster access to approved onboarding and policy information may be possible.",
      "More consistent reporting can support HR review when source data is validated.",
    ],
    prototype: {
      title: "Recruitment coordination workspace",
      description:
        "An illustrative prototype could show structured application summaries, recruiter review, and interview coordination. It is a concept only, not a deployed client solution or an automated hiring decision system.",
    },
  },
  sales: {
    challenges: [
      "Sales teams spend time researching accounts and preparing for conversations.",
      "CRM records and follow-up tasks may be incomplete or delayed.",
      "Forecasts and customer signals can be difficult to interpret across sources.",
    ],
    solutionApproaches: [
      "Assist with research, drafting, and CRM updates using approved sources and reviewable recommendations.",
      "Keep customer commitments, pricing, forecasts, and relationship decisions with sales owners.",
    ],
    useCases: [
      "Lead qualification against sales-approved criteria",
      "CRM activity summaries and data-entry automation",
      "AI sales assistants for account research and meeting preparation",
      "Automated follow-up drafts with salesperson approval",
      "Sales forecasting support with assumptions and uncertainty visible",
      "Customer behavior analysis from authorized, relevant data",
    ],
    workflows: [
      {
        title: "Lead intake and qualification",
        steps: [
          "Receive a lead from an approved source",
          "Check the record for completeness and permitted firmographic context",
          "Suggest a qualification summary against agreed criteria",
          "Route the recommendation to a sales owner for confirmation",
        ],
      },
      {
        title: "Meeting follow-up",
        steps: [
          "Capture notes from an authorized meeting record",
          "Draft a summary, follow-up, and proposed CRM updates",
          "Let the salesperson verify claims, owners, and next steps",
          "Send the message and update CRM only after approval",
        ],
      },
    ],
    technologies: [
      "CRM APIs and workflow automation connectors",
      "Language models for research summaries and draft communications",
      "Retrieval from approved product, pricing, and account materials",
      "Analytics and forecasting tools with uncertainty reporting",
      "Identity, access, and audit controls for customer information",
    ],
    potentialBenefits: [
      "Less manual effort may be needed for research and routine CRM updates.",
      "More timely follow-up can be supported with salesperson review.",
      "Forecast discussions may gain clearer visibility into assumptions and data gaps.",
    ],
    prototype: {
      title: "Sales opportunity briefing assistant",
      description:
        "An illustrative prototype could assemble approved account context, draft meeting questions, and prepare CRM updates for review. It does not represent a deployed customer system or guarantee sales outcomes.",
    },
  },
  marketing: {
    challenges: [
      "Teams need to create relevant content across channels while maintaining brand consistency.",
      "Campaign planning and performance review can be spread across tools and documents.",
      "Generated claims, audience assumptions, or creative assets need careful review.",
    ],
    solutionApproaches: [
      "Use generative AI to support research, ideation, and draft production under editorial control.",
      "Connect campaign data to validated measures without treating attribution or model output as certainty.",
    ],
    useCases: [
      "Campaign briefs and content calendars based on approved brand guidance",
      "Drafting and adapting copy for editorial review",
      "Search and audience research summaries from permitted sources",
      "Creative variation planning and experiment design",
      "Campaign reporting and performance trend summaries",
    ],
    workflows: [
      {
        title: "Campaign content preparation",
        steps: [
          "Select an approved campaign brief, audience, and brand source",
          "Generate draft content options with source and claim notes",
          "Route drafts through marketing and legal review",
          "Publish only after human approval and channel checks",
        ],
      },
      {
        title: "Campaign reporting",
        steps: [
          "Collect agreed campaign metrics from authorized systems",
          "Validate reporting windows, definitions, and missing values",
          "Generate a draft summary and comparison for analyst review",
          "Share approved findings with limitations and context",
        ],
      },
    ],
    technologies: [
      "Language models for ideation, drafting, and summarization",
      "Brand knowledge retrieval with source links and access controls",
      "Marketing platform APIs and content management integrations",
      "Analytics and experimentation tools for validated measurement",
      "Human editorial, legal, and accessibility review steps",
    ],
    potentialBenefits: [
      "Content teams may spend less time on repetitive first drafts.",
      "Shared brand sources can support more consistent review workflows.",
      "Reporting preparation may become easier to repeat and audit.",
    ],
    prototype: {
      title: "Brand-aware campaign workspace",
      description:
        "An illustrative prototype could turn an approved campaign brief into editable content drafts and a review checklist. It is not a deployed client platform, and all content would require human verification.",
    },
  },
  "finance-accounting": {
    challenges: [
      "Finance teams handle recurring invoices, receipts, and supporting documents.",
      "Preparing reports and reconciling source information can involve repetitive steps.",
      "Errors in amounts, assumptions, or classifications can have material consequences.",
    ],
    solutionApproaches: [
      "Use document extraction and AI-assisted categorization to prepare items for verification.",
      "Keep calculations, reconciliations, approvals, and financial decisions under qualified human control.",
    ],
    useCases: [
      "Invoice extraction and validation",
      "Expense categorization suggestions against approved policies",
      "Financial reporting automation and variance summaries",
      "Document processing and exception routing",
      "Financial data analysis using validated sources and assumptions",
      "Audit preparation and supporting-document retrieval",
    ],
    workflows: [
      {
        title: "Invoice intake and review",
        steps: [
          "Receive an invoice through an authorized intake channel",
          "Extract supplier, dates, totals, and line items",
          "Compare fields with purchase records and flag discrepancies",
          "Route the document to an authorized reviewer for approval",
        ],
      },
      {
        title: "Monthly reporting preparation",
        steps: [
          "Load approved period data from finance systems",
          "Validate totals, reporting definitions, and missing records",
          "Prepare draft variance explanations and report sections",
          "Require finance review before publication or decisions",
        ],
      },
    ],
    technologies: [
      "Optical character recognition and document extraction",
      "Rules-based validation alongside AI-assisted classification",
      "Accounting system APIs and approval workflow integration",
      "Analytics and reporting tools with traceable source data",
      "Role-based access, audit logs, and retention controls",
    ],
    potentialBenefits: [
      "Routine document handling may require fewer manual steps.",
      "Exceptions can be routed for review with relevant context attached.",
      "Report preparation may become more repeatable when source data is reliable.",
    ],
    prototype: {
      title: "Invoice review queue",
      description:
        "An illustrative prototype could extract invoice fields, show validation checks, and route exceptions for approval. It is a concept, not a deployed finance system or a substitute for accounting controls.",
    },
  },
  "retail-ecommerce": {
    challenges: [
      "Product information and customer questions may be distributed across channels.",
      "Service teams handle recurring requests alongside exceptions that need care.",
      "Demand, inventory, and customer signals require timely interpretation.",
    ],
    solutionApproaches: [
      "Connect customer-facing assistance to approved catalog and policy information with human escalation.",
      "Use analytics to summarize operational signals for review rather than making unapproved decisions.",
    ],
    useCases: [
      "Product discovery and catalog question assistants",
      "Customer support response drafts and order-status summaries",
      "Product description preparation from approved specifications",
      "Demand and inventory trend analysis",
      "Returns and service-request classification",
      "Customer feedback theme summaries",
    ],
    workflows: [
      {
        title: "Product question support",
        steps: [
          "A shopper asks about a product or policy",
          "Retrieve current details from the approved catalog",
          "Prepare a grounded answer and show relevant source information",
          "Escalate availability, policy, or account exceptions to staff",
        ],
      },
      {
        title: "Returns request routing",
        steps: [
          "Receive a return request through an approved channel",
          "Classify the request and collect required non-sensitive details",
          "Check policy rules and flag missing information",
          "Route exceptions or refund approvals to an authorized employee",
        ],
      },
    ],
    technologies: [
      "Catalog search and retrieval over approved product data",
      "E-commerce, order-management, and support platform APIs",
      "Language models for response drafting and summarization",
      "Demand analytics and forecasting with uncertainty measures",
      "Identity, payment, and customer-data access protections",
    ],
    potentialBenefits: [
      "Customers may find product information with fewer search steps.",
      "Service teams may receive more structured requests and summaries.",
      "Operational teams can explore clearer views of demand signals and exceptions.",
    ],
    prototype: {
      title: "Product discovery assistant",
      description:
        "An illustrative prototype could answer product questions from a sample catalog and hand off unsupported requests to staff. It is not a live retail integration or a deployed customer solution.",
    },
  },
  healthcare: {
    challenges: [
      "Staff need timely access to current operational guidance and procedures.",
      "Administrative records and requests can require repeated classification and routing.",
      "Health information is sensitive, and clinical decisions require qualified professionals.",
    ],
    solutionApproaches: [
      "Start with bounded administrative or internal-knowledge workflows using authorized information.",
      "Exclude autonomous diagnosis or treatment decisions; maintain privacy, clinical governance, and human ownership.",
    ],
    useCases: [
      "Internal search for approved procedures and operational guidance",
      "Administrative document classification and routing",
      "Appointment and service-information assistants with clear escalation",
      "Non-clinical correspondence and report drafting for staff review",
      "Operational service trend summaries using appropriately governed data",
    ],
    workflows: [
      {
        title: "Operational guidance lookup",
        steps: [
          "An authorized staff member asks about an operational procedure",
          "Retrieve current guidance from an approved source repository",
          "Show source references and document version information",
          "Escalate clinical or ambiguous questions to the appropriate professional",
        ],
      },
      {
        title: "Administrative request routing",
        steps: [
          "Receive a non-clinical service request",
          "Classify its category and identify missing administrative details",
          "Route the request to the authorized team",
          "Keep staff responsible for sensitive or urgent decisions",
        ],
      },
    ],
    technologies: [
      "Secure document retrieval with role-based access",
      "Optical character recognition for approved administrative documents",
      "Workflow and case-management system integrations",
      "Language models restricted to bounded administrative assistance",
      "Audit, monitoring, privacy, and data-retention controls",
    ],
    potentialBenefits: [
      "Staff may locate approved operational information more efficiently.",
      "Administrative requests may arrive with clearer classification and context.",
      "Service patterns may be easier to review when data use is appropriately governed.",
    ],
    prototype: {
      title: "Operational knowledge assistant",
      description:
        "An illustrative prototype could retrieve source-linked operational guidance for authorized staff. It is not a clinical decision tool or a deployed healthcare client solution.",
    },
  },
  "legal-compliance": {
    challenges: [
      "Teams review large collections of agreements, policies, and regulatory material.",
      "Finding relevant clauses and tracking obligations can be time-consuming.",
      "Confidentiality, provenance, and professional judgment are essential.",
    ],
    solutionApproaches: [
      "Use controlled retrieval and extraction to help professionals locate and organize approved documents.",
      "Treat summaries and flags as review aids only; legal interpretation and compliance decisions stay with accountable professionals.",
    ],
    useCases: [
      "Clause and obligation search across approved document collections",
      "Contract intake, classification, and metadata extraction",
      "Policy and regulatory change summaries for qualified review",
      "Matter and compliance workflow tracking",
      "Drafting comparison tables with linked source passages",
    ],
    workflows: [
      {
        title: "Contract intake and triage",
        steps: [
          "Receive a document in an access-controlled workspace",
          "Extract agreed metadata and identify relevant clause sections",
          "Prepare a source-linked summary and flag missing items",
          "Route the document to a legal professional for review and action",
        ],
      },
      {
        title: "Policy change review",
        steps: [
          "Add an approved updated policy or regulatory source",
          "Compare it with the current internal policy collection",
          "Prepare a change summary with source references",
          "Let counsel or compliance owners determine required actions",
        ],
      },
    ],
    technologies: [
      "Document parsing, OCR, and clause-level indexing",
      "Secure retrieval with matter-level permissions",
      "Language models for source-linked summaries and comparison drafts",
      "Document-management and matter-workflow integrations",
      "Audit trails, retention policies, and access monitoring",
    ],
    potentialBenefits: [
      "Professionals may locate relevant material with fewer manual search steps.",
      "Document intake and metadata preparation may become more consistent.",
      "Reviewers may gain clearer visibility into source passages and exceptions.",
    ],
    prototype: {
      title: "Source-linked contract review workspace",
      description:
        "An illustrative prototype could surface selected clauses, metadata, and source-linked summaries for lawyer review. It is not a deployed legal product or legal advice.",
    },
  },
  education: {
    challenges: [
      "Educators prepare learning materials for varied needs and time constraints.",
      "Learners need support without undermining independent thinking or academic integrity.",
      "Institutions need consistent, accessible information for students and faculty.",
    ],
    solutionApproaches: [
      "Support educator-led drafting, study guidance, and institutional knowledge retrieval.",
      "Make academic integrity, accessibility, learner privacy, and educator oversight explicit.",
    ],
    useCases: [
      "Lesson plans, practice questions, and rubric drafts for educator review",
      "Personalized study planning and concept explanations",
      "Research organization and source discovery with citation verification",
      "Student-service and policy information assistants",
      "Learning feedback theme summaries for educators",
    ],
    workflows: [
      {
        title: "Educator material preparation",
        steps: [
          "Choose an approved curriculum goal and learner context",
          "Draft lesson activities or practice questions",
          "Review for accuracy, accessibility, bias, and level",
          "Publish only after educator approval",
        ],
      },
      {
        title: "Student services assistant",
        steps: [
          "A learner asks an administrative question",
          "Retrieve current information from approved institutional sources",
          "Provide a cited answer and link to the authoritative page",
          "Escalate personal, high-impact, or unresolved questions to staff",
        ],
      },
    ],
    technologies: [
      "Learning-management and student-service system integrations",
      "Search and retrieval over approved curriculum and policy material",
      "Language models for draft learning content and explanations",
      "Accessibility review and content-quality evaluation tools",
      "Privacy controls, age-appropriate safeguards, and educator approvals",
    ],
    potentialBenefits: [
      "Educators may spend less time preparing routine first drafts.",
      "Learners may get clearer pathways to approved resources and support.",
      "Institutions may make recurring information easier to locate and maintain.",
    ],
    prototype: {
      title: "Course companion and educator workspace",
      description:
        "An illustrative prototype could help educators prepare practice material and guide learners to approved course sources. It is a concept, not a deployed institutional system or a replacement for educators.",
    },
  },
  manufacturing: {
    challenges: [
      "Operational and maintenance knowledge can be spread across manuals and systems.",
      "Quality issues require timely context while preserving traceability.",
      "Production and safety processes cannot be changed without accountable review.",
    ],
    solutionApproaches: [
      "Make approved procedures easier to find and summarize for authorized staff.",
      "Use AI for decision support and document routing, not autonomous control of machinery or safety-critical actions.",
    ],
    useCases: [
      "Search across approved maintenance manuals and operating procedures",
      "Work-order intake, categorization, and summary preparation",
      "Quality-document extraction and exception routing",
      "Production and downtime report summaries",
      "Inventory and supply signal analysis for human review",
    ],
    workflows: [
      {
        title: "Maintenance knowledge lookup",
        steps: [
          "An authorized technician selects equipment and describes an issue",
          "Retrieve matching approved manual sections and maintenance records",
          "Show source references, revision, and uncertainty",
          "Keep diagnosis, repair, and safety actions with qualified staff",
        ],
      },
      {
        title: "Quality exception routing",
        steps: [
          "Receive a quality report or inspection document",
          "Extract fields and match them to approved quality categories",
          "Flag incomplete records or out-of-range values for review",
          "Route the case to the responsible quality owner",
        ],
      },
    ],
    technologies: [
      "Document search and retrieval over revision-controlled procedures",
      "Computer vision or OCR for approved inspection documents",
      "Manufacturing execution and maintenance system integrations",
      "Analytics for quality, downtime, and inventory trends",
      "Industrial identity, network segmentation, and audit controls",
    ],
    potentialBenefits: [
      "Technicians may find relevant approved guidance with fewer searches.",
      "Quality exceptions may reach responsible owners with more context.",
      "Reporting preparation may be more consistent across shifts or sites.",
    ],
    prototype: {
      title: "Maintenance knowledge navigator",
      description:
        "An illustrative prototype could search a sample manual collection and present source-linked guidance. It is not connected to production equipment or a deployed manufacturing client solution.",
    },
  },
  "logistics-supply-chain": {
    challenges: [
      "Shipment and inventory information is distributed across teams and systems.",
      "Exceptions need timely coordination and clear ownership.",
      "Plans rely on uncertain data, changing conditions, and external dependencies.",
    ],
    solutionApproaches: [
      "Summarize approved operational information and route exceptions to the right owner.",
      "Use forecasts as decision support with uncertainty and human planning responsibility visible.",
    ],
    useCases: [
      "Shipment status summaries and exception classification",
      "Document intake for orders, bills of lading, and delivery records",
      "Inventory and demand analysis with scenario comparisons",
      "Supplier communication drafts for review",
      "Cross-system handoff and delay reporting",
    ],
    workflows: [
      {
        title: "Shipment exception coordination",
        steps: [
          "Receive a delay or status exception from an approved source",
          "Gather related shipment, route, and order references",
          "Prepare a concise summary and suggested owner",
          "Let an operations coordinator confirm priorities and communications",
        ],
      },
      {
        title: "Supply document processing",
        steps: [
          "Receive a logistics document through a controlled channel",
          "Extract identifiers, dates, and shipment details",
          "Validate fields against authorized order records",
          "Route mismatches to a planner for resolution",
        ],
      },
    ],
    technologies: [
      "OCR and document extraction for logistics records",
      "Transportation, warehouse, and ERP system APIs",
      "Workflow orchestration with ownership and exception queues",
      "Forecasting and scenario-analysis tools with uncertainty measures",
      "Geospatial and event data integrations subject to data agreements",
    ],
    potentialBenefits: [
      "Teams may spend less time assembling shipment context across systems.",
      "Exceptions may be routed more consistently with ownership visible.",
      "Planners may compare scenarios using clearer assumptions and data freshness.",
    ],
    prototype: {
      title: "Shipment exception coordination board",
      description:
        "An illustrative prototype could combine sample status events, summarize exceptions, and suggest routing for staff review. It is not a live carrier integration or a deployed logistics solution.",
    },
  },
  "customer-support": {
    challenges: [
      "Agents search multiple sources while responding to customer requests.",
      "Ticket volume and repeated questions can make timely triage difficult.",
      "Sensitive, frustrated, or unusual cases need empathetic human attention.",
    ],
    solutionApproaches: [
      "Assist agents with approved knowledge retrieval, summaries, and response drafts.",
      "Make uncertainty visible and route sensitive or unresolved cases to people.",
    ],
    useCases: [
      "Source-grounded FAQ and product support assistants",
      "Ticket classification, prioritization suggestions, and routing",
      "Conversation summaries and suggested reply drafts",
      "Knowledge article gap analysis and content maintenance",
      "Customer feedback theme reporting",
    ],
    workflows: [
      {
        title: "Agent response assistance",
        steps: [
          "Open a support ticket in the authorized workspace",
          "Retrieve relevant guidance from approved knowledge sources",
          "Draft a concise response with source links and uncertainty cues",
          "Let the agent edit, approve, send, or escalate the response",
        ],
      },
      {
        title: "Ticket triage",
        steps: [
          "Receive a new customer request",
          "Suggest a category and route based on approved rules",
          "Flag missing information or sensitive indicators",
          "Allow an agent to confirm priority and ownership",
        ],
      },
    ],
    technologies: [
      "Helpdesk APIs and event-driven workflow connectors",
      "Search and retrieval over approved support knowledge",
      "Language models for summaries and response drafts",
      "Rules, escalation queues, and agent review controls",
      "Quality, privacy, and response-grounding evaluation",
    ],
    potentialBenefits: [
      "Agents may find approved answers with fewer context switches.",
      "Ticket handoffs may carry clearer summaries and routing context.",
      "Recurring knowledge gaps may become easier to identify and address.",
    ],
    prototype: {
      title: "Human-reviewed support copilot",
      description:
        "An illustrative prototype could retrieve sample help content and draft responses inside an agent review flow. It is not a deployed support system or an autonomous customer-service agent.",
    },
  },
  "business-operations": {
    challenges: [
      "Manual intake and re-entry create delays across routine business processes.",
      "Approvals, exceptions, and handoffs can be difficult to track.",
      "Teams may not know which tasks are suitable for automation or AI.",
    ],
    solutionApproaches: [
      "Map the process first, then combine rules, integration, and AI only where useful.",
      "Keep ownership, approval checkpoints, error handling, and auditability in the workflow.",
    ],
    useCases: [
      "Document intake, extraction, and routing",
      "Internal knowledge search and process guidance",
      "Request triage and status communication",
      "Recurring report and meeting-summary preparation",
      "Approval, exception, and handoff automation",
    ],
    workflows: [
      {
        title: "Business request intake",
        steps: [
          "Receive a request through a monitored channel",
          "Classify its type and check for required information",
          "Route it to the correct team with a summary",
          "Track approval, exception, and completion status",
        ],
      },
      {
        title: "Document approval workflow",
        steps: [
          "Ingest a document and identify its type",
          "Extract approved fields and validate required content",
          "Assign reviewers based on policy and document category",
          "Escalate exceptions and retain an auditable decision record",
        ],
      },
    ],
    technologies: [
      "Workflow orchestration and business process management tools",
      "APIs and integration connectors for existing business systems",
      "Document extraction and language models for bounded tasks",
      "Rules engines for deterministic validation and routing",
      "Identity, permissions, audit logs, and operational monitoring",
    ],
    potentialBenefits: [
      "Repeatable handoffs may require fewer manual coordination steps.",
      "Process owners may gain clearer visibility into status and exceptions.",
      "Teams may identify simpler software or process changes before adopting AI.",
    ],
    prototype: {
      title: "Operations intake and routing workspace",
      description:
        "An illustrative prototype could classify sample requests, show required information, and route work for approval. It is not a deployed operations platform or proof of achieved business results.",
    },
  },
  "it-software-development": {
    challenges: [
      "Engineering teams balance delivery speed with reliability and maintainability.",
      "Technical knowledge and system context can be hard to locate across repositories.",
      "AI-generated code and changes require security, quality, and license review.",
    ],
    solutionApproaches: [
      "Assist developers with bounded coding, testing, documentation, and knowledge tasks.",
      "Keep code ownership, review, security assessment, and release decisions with engineers.",
    ],
    useCases: [
      "Code and test drafting for developer review",
      "Repository and architecture knowledge retrieval",
      "Issue triage and pull-request summary preparation",
      "Documentation and migration planning assistance",
      "Build and deployment workflow automation with explicit controls",
    ],
    workflows: [
      {
        title: "Issue-to-test assistance",
        steps: [
          "Read an approved work item and repository context",
          "Suggest affected components and candidate test cases",
          "Prepare a draft change or test plan in a branch",
          "Require engineer review, tests, and security checks before merge",
        ],
      },
      {
        title: "Engineering knowledge search",
        steps: [
          "Ask a question against authorized repositories and documents",
          "Retrieve source-linked technical context",
          "Summarize relevant design decisions and open questions",
          "Verify details with maintainers before changing production systems",
        ],
      },
    ],
    technologies: [
      "Repository-aware language models and code assistants",
      "Search and retrieval over authorized technical documentation",
      "CI/CD APIs and test automation",
      "Static analysis, dependency review, and secret scanning tools",
      "Role-based access, audit logging, and sandboxed execution",
    ],
    potentialBenefits: [
      "Developers may spend less time on repetitive drafting and lookup tasks.",
      "Teams may improve consistency in test and documentation preparation.",
      "Technical decisions can remain reviewable when generated suggestions cite their context.",
    ],
    prototype: {
      title: "Repository-aware engineering assistant",
      description:
        "An illustrative prototype could answer questions from a sample codebase and draft a test plan. It is not a deployed client application or a substitute for code review and security validation.",
    },
  },
  "real-estate": {
    challenges: [
      "Property information and documents may be spread across listings and internal systems.",
      "Teams handle recurring inquiries while needing accurate, current details.",
      "Financial, legal, and tenant decisions require authorized professional judgment.",
    ],
    solutionApproaches: [
      "Organize and retrieve approved property information for staff and customer support.",
      "Use analytics and draft assistance without making autonomous valuation or eligibility decisions.",
    ],
    useCases: [
      "Property and portfolio document search",
      "Draft responses to routine property inquiries",
      "Listing information preparation from verified sources",
      "Maintenance request classification and routing",
      "Market and portfolio reporting for professional review",
    ],
    workflows: [
      {
        title: "Property inquiry assistance",
        steps: [
          "Receive an inquiry through an authorized channel",
          "Retrieve current, approved property details",
          "Prepare a response draft and identify unavailable information",
          "Have a property professional verify details before sending",
        ],
      },
      {
        title: "Maintenance request routing",
        steps: [
          "Capture a maintenance request and location reference",
          "Classify the issue and identify urgency indicators",
          "Route it to the responsible property team",
          "Require staff review for safety, access, or emergency decisions",
        ],
      },
    ],
    technologies: [
      "Property management and listing system APIs",
      "Document search and extraction for approved property records",
      "Language models for inquiry summaries and response drafts",
      "Geospatial and analytics tools for authorized datasets",
      "Access controls and audit logs for tenant and property information",
    ],
    potentialBenefits: [
      "Property teams may locate verified information more quickly.",
      "Routine inquiries may arrive with clearer summaries and context.",
      "Maintenance and reporting workflows may become easier to monitor.",
    ],
    prototype: {
      title: "Property information assistant",
      description:
        "An illustrative prototype could retrieve sample property records and prepare a response draft for staff review. It is not a deployed real-estate service or a source of legal or financial advice.",
    },
  },
};

export function getIndustryProfile(slug: string) {
  const profile = industryProfiles[slug];
  if (!profile) {
    throw new Error(`Industry solution profile is missing for: ${slug}`);
  }
  return profile;
}
