import { site } from "@/data/site";
import { formDefinitions } from "@/data/forms";
import type {
  ContactFormData,
  ProposalFormData,
  TrainingRequestData,
  ConsultationRequestData,
  FormKind,
  InquiryValues,
} from "@/types/contact";

function kindOf(values: InquiryValues): FormKind {
  if ("firstName" in values) return "contact";
  if ("projectSummary" in values) return "proposal";
  if ("learningGoals" in values) return "training";
  return "consultation";
}
export function formatInquiry(values: InquiryValues): {
  subject: string;
  body: string;
} {
  const kind = kindOf(values);
  const definition = formDefinitions[kind];
  const name =
    "firstName" in values
      ? `${values.firstName} ${values.lastName}`
      : "fullName" in values
        ? values.fullName
        : values.name;
  const topic =
    "inquiryType" in values
      ? values.inquiryType
      : "trainingTopic" in values
        ? values.trainingTopic
        : "consultationTopic" in values
          ? values.consultationTopic
          : values.requiredServices;
  const subject = `${definition.subjectPrefix} - ${topic.replace(/[\r\n]+/g, " ")} - ${name.replace(/[\r\n]+/g, " ")}`;
  const entries = new Map(Object.entries(values));
  const details = definition.fields.map(
    (field) =>
      `${field.label}: ${String(entries.get(field.name) || "Not provided")}`,
  );
  const body = [
    definition.subjectPrefix,
    "",
    ...details,
    "",
    "Privacy agreement: acknowledged",
    ...(kind === "consultation"
      ? ["Requested dates are preferences only and are not confirmed."]
      : []),
    "",
    "Prepared from the PraedicoAI website. The visitor must review and send this email manually.",
  ].join("\r\n");
  return { subject, body };
}
export function createMailtoUrl(values: InquiryValues): string {
  const { subject, body } = formatInquiry(values);
  return `mailto:${encodeURIComponent(site.contactEmail)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
export function readInquiryValues(
  form: HTMLFormElement,
  kind: FormKind,
): InquiryValues {
  const formData = new FormData(form);
  const fields = Object.fromEntries(
    formDefinitions[kind].fields.map((field) => [
      field.name,
      String(formData.get(field.name) ?? "").trim(),
    ]),
  );
  const common = {
    ...fields,
    email: fields.email,
    country: fields.country,
    privacy: formData.get("privacy") === "on",
  };
  switch (kind) {
    case "contact":
      return {
        ...common,
        firstName: fields.firstName,
        lastName: fields.lastName,
        inquiryType: fields.inquiryType,
        subject: fields.subject,
        message: fields.message,
      } satisfies ContactFormData;
    case "proposal":
      return {
        ...common,
        name: fields.name,
        requiredServices: fields.requiredServices,
        projectSummary: fields.projectSummary,
      } satisfies ProposalFormData;
    case "training":
      return {
        ...common,
        fullName: fields.fullName,
        audienceCategory: fields.audienceCategory,
        trainingTopic: fields.trainingTopic,
        learningGoals: fields.learningGoals,
      } satisfies TrainingRequestData;
    case "consultation":
      return {
        ...common,
        name: fields.name,
        consultationTopic: fields.consultationTopic,
        problemSummary: fields.problemSummary,
        timeZone: fields.timeZone,
      } satisfies ConsultationRequestData;
  }
}
