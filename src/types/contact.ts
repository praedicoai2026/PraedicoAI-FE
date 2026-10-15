export interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  inquiryType: string;
  subject: string;
  message: string;
  privacy: boolean;
  phone?: string;
  company?: string;
  jobTitle?: string;
  website?: string;
  city?: string;
  preferredContactMethod?: string;
  serviceInterest?: string;
  projectType?: string;
  budgetRange?: string;
  expectedStartDate?: string;
  preferredContactTime?: string;
  timeZone?: string;
  referral?: string;
}
export interface ProposalFormData {
  name: string;
  email: string;
  country: string;
  requiredServices: string;
  projectSummary: string;
  privacy: boolean;
  phone?: string;
  company?: string;
  industry?: string;
  website?: string;
  existingApplication?: string;
  targetUsers?: string;
  importantFeatures?: string;
  expectedTimeline?: string;
  budgetRange?: string;
  preferredWorkingModel?: string;
  additionalInformation?: string;
}
export interface TrainingRequestData {
  fullName: string;
  email: string;
  country: string;
  audienceCategory: string;
  trainingTopic: string;
  learningGoals: string;
  privacy: boolean;
  phone?: string;
  organization?: string;
  jobTitle?: string;
  city?: string;
  skillLevel?: string;
  numberOfParticipants?: string;
  deliveryPreference?: string;
  preferredDates?: string;
  preferredDuration?: string;
  budgetRange?: string;
  additionalRequirements?: string;
}
export interface ConsultationRequestData {
  name: string;
  email: string;
  country: string;
  consultationTopic: string;
  problemSummary: string;
  timeZone: string;
  privacy: boolean;
  company?: string;
  preferredDate?: string;
  alternativeDate?: string;
  preferredDuration?: string;
  preferredMeetingMethod?: string;
  additionalInformation?: string;
}
export type InquiryValues =
  | ContactFormData
  | ProposalFormData
  | TrainingRequestData
  | ConsultationRequestData;
export type FormKind = "contact" | "proposal" | "training" | "consultation";
export interface FieldDefinition {
  name: string;
  label: string;
  type?:
    | "text"
    | "email"
    | "tel"
    | "url"
    | "date"
    | "number"
    | "textarea"
    | "select";
  required?: boolean;
  options?: string[];
  autoComplete?: string;
  hint?: string;
}
