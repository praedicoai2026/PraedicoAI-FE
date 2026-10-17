import type { FieldDefinition, FormKind } from "@/types/contact";
import { services } from "./services";
import { learningAudiences } from "./site";
import { trainingTopics } from "./courses";
export const inquiryTypes = [
  "General Inquiry",
  "AI Readiness & Use-case Discovery",
  "AI Knowledge Assistant",
  "Software Development",
  "Web Application Development",
  "AI Agent & Copilot Design",
  "AI Evaluation & Responsible Adoption",
  "Workflow Automation",
  "Technology Consulting",
  "Application Modernization",
  "Digital Marketing",
  "AI Video",
  "Social Media Growth",
  "Training",
  "Speaking Invitation",
  "Partnership",
  "Other",
];
const field = (
  name: string,
  label: string,
  type: FieldDefinition["type"] = "text",
  required = false,
  options?: string[],
): FieldDefinition => ({ name, label, type, required, options });
const email: FieldDefinition = {
  ...field("email", "Email address", "email", true),
  autoComplete: "email",
};
const country: FieldDefinition = {
  ...field("country", "Country", "text", true),
  autoComplete: "country-name",
  hint: "Enter your country or territory.",
};
const phone: FieldDefinition = {
  ...field("phone", "Phone with country code", "tel"),
  autoComplete: "tel",
  hint: "Include an international dialing code, for example +91.",
};
const company = field("company", "Company");
const website = field("website", "Website", "url");
const budget: FieldDefinition = {
  ...field("budgetRange", "Budget range"),
  hint: "Include a currency, or write 'To discuss'.",
};
const name: FieldDefinition = {
  ...field("name", "Full name", "text", true),
  autoComplete: "name",
};
const timeZone: FieldDefinition = {
  ...field("timeZone", "Time zone"),
  hint: "For example Asia/Kolkata or UTC+05:30.",
};
export interface FormDefinition {
  title: string;
  description: string;
  path: string;
  subjectPrefix: string;
  fields: FieldDefinition[];
}
export const formDefinitions: Record<FormKind, FormDefinition> = {
  contact: {
    title: "Start a conversation.",
    description:
      "Tell us about the challenge you are exploring, the people it affects, and what a useful next step might look like. Please omit sensitive information.",
    path: "/contact",
    subjectPrefix: "Website Inquiry",
    fields: [
      {
        ...field("firstName", "First name", "text", true),
        autoComplete: "given-name",
      },
      {
        ...field("lastName", "Last name", "text", true),
        autoComplete: "family-name",
      },
      email,
      country,
      field("inquiryType", "Inquiry type", "select", true, inquiryTypes),
      field("subject", "Subject", "text", true),
      field("message", "Message", "textarea", true),
      phone,
      company,
      field("jobTitle", "Job title"),
      website,
      field("city", "City"),
      field(
        "preferredContactMethod",
        "Preferred contact method",
        "select",
        false,
        ["Email", "Phone", "To discuss"],
      ),
      field(
        "serviceInterest",
        "Service interest",
        "select",
        false,
        services.map((service) => service.title),
      ),
      field("projectType", "Project type"),
      budget,
      field("expectedStartDate", "Expected start date", "date"),
      field("preferredContactTime", "Preferred contact time"),
      timeZone,
      field("referral", "How did you hear about PraedicoAI?"),
    ],
  },
  proposal: {
    title: "Shape a practical project brief.",
    description:
      "Describe the problem, intended users, current workflow, and constraints. An inquiry is a starting point for discussion, not a commitment or confirmed proposal.",
    path: "/request-proposal",
    subjectPrefix: "Proposal Request",
    fields: [
      name,
      email,
      phone,
      company,
      country,
      field("industry", "Industry"),
      website,
      field("requiredServices", "Required services", "textarea", true),
      field("projectSummary", "Project summary", "textarea", true),
      field("existingApplication", "Existing application", "textarea"),
      field("targetUsers", "Target users"),
      field("importantFeatures", "Important features", "textarea"),
      field("expectedTimeline", "Expected timeline"),
      budget,
      field(
        "preferredWorkingModel",
        "Preferred working model",
        "select",
        false,
        ["Project-based", "Consulting", "Ongoing collaboration", "To discuss"],
      ),
      field("additionalInformation", "Additional information", "textarea"),
    ],
  },
  consultation: {
    title: "Request a focused discovery conversation.",
    description:
      "Request a consultation about a technology decision, an application challenge, or a learning goal.",
    path: "/book-consultation",
    subjectPrefix: "Consultation Request",
    fields: [
      name,
      email,
      company,
      country,
      field("consultationTopic", "Consultation topic", "text", true),
      field("problemSummary", "Problem summary", "textarea", true),
      field("preferredDate", "Preferred date", "date"),
      field("alternativeDate", "Alternative date", "date"),
      { ...timeZone, required: true },
      field("preferredDuration", "Preferred duration", "select", false, [
        "30 minutes",
        "60 minutes",
        "90 minutes",
        "To discuss",
      ]),
      field(
        "preferredMeetingMethod",
        "Preferred meeting method",
        "select",
        false,
        ["Online video conversation", "Phone", "To discuss"],
      ),
      field("additionalInformation", "Additional information", "textarea"),
    ],
  },
  training: {
    title: "Shape a learning experience.",
    description:
      "Share your audience, their starting point, and what you want them to take away.",
    path: "/training/request-training",
    subjectPrefix: "Training Request",
    fields: [
      { ...field("fullName", "Full name", "text", true), autoComplete: "name" },
      email,
      phone,
      field("organization", "Organization"),
      field("jobTitle", "Job title"),
      country,
      field("city", "City"),
      field(
        "audienceCategory",
        "Audience category",
        "select",
        true,
        learningAudiences,
      ),
      field("trainingTopic", "Training topic", "select", true, [
        ...trainingTopics,
        "Customized topic",
      ]),
      field("skillLevel", "Skill level", "select", false, [
        "Beginner",
        "Intermediate",
        "Advanced",
        "Mixed group",
      ]),
      field("numberOfParticipants", "Number of participants", "number"),
      field(
        "deliveryPreference",
        "Online or in-person preference",
        "select",
        false,
        ["Online", "In-person", "To discuss"],
      ),
      field("preferredDates", "Preferred dates"),
      field("preferredDuration", "Preferred duration"),
      budget,
      field("learningGoals", "Learning goals", "textarea", true),
      field("additionalRequirements", "Additional requirements", "textarea"),
    ],
  },
};
