import { Schema, model } from "mongoose";
import type { LeadCategory, LeadStatus, LeadVertical } from "./lead.schema.js";

const statusHistorySchema = new Schema(
  {
    status: {
      type: String,
      enum: [
        "New",
        "Contacted",
        "Qualified",
        "Proposal/Enrollment",
        "Converted",
        "Closed",
      ],
      required: true,
    },
    changedAt: { type: Date, required: true },
    changedBy: { type: String, required: true, maxlength: 254 },
  },
  { _id: false },
);

const noteSchema = new Schema(
  {
    text: { type: String, required: true, maxlength: 2000 },
    authorName: { type: String, required: true, maxlength: 100 },
    authorEmail: { type: String, required: true, maxlength: 254 },
    createdAt: { type: Date, required: true },
  },
  { _id: false },
);

const leadSchema = new Schema(
  {
    category: {
      type: String,
      enum: [
        "AI Business Solutions",
        "AI Consulting",
        "AI Automation",
        "AI Application Development",
        "Student AI Training",
        "Professional AI Training",
        "AI Internships",
        "Corporate Training",
        "College Partnerships",
        "AI Product Interest",
        "AI Community",
        "AI Research Interest",
      ],
      required: true,
      index: true,
    },
    vertical: {
      type: String,
      enum: ["AI Business Solutions", "AI Learning"],
      required: true,
      index: true,
    },
    recordType: {
      type: String,
      enum: ["business", "registration", "application", "partnership"],
      required: true,
      index: true,
    },
    name: { type: String, required: true, maxlength: 100 },
    email: { type: String, required: true, maxlength: 254, index: true },
    phone: { type: String, required: true, maxlength: 30 },
    company: { type: String, maxlength: 150 },
    designation: { type: String, maxlength: 120 },
    industry: { type: String, maxlength: 120 },
    businessProblem: { type: String, maxlength: 3000 },
    requiredAISolution: { type: String, maxlength: 2000 },
    budgetRange: { type: String, maxlength: 80 },
    preferredContactMethod: {
      type: String,
      enum: ["email", "phone", "whatsapp"],
    },
    college: { type: String, maxlength: 150 },
    courseDegree: { type: String, maxlength: 150 },
    currentYear: { type: String, maxlength: 80 },
    interestedAIProgram: { type: String, maxlength: 200 },
    internshipInterest: {
      type: String,
      enum: ["yes", "no", "exploring"],
    },
    learningObjectives: { type: String, maxlength: 3000 },
    interestArea: { type: String, maxlength: 200 },
    currentProfession: { type: String, maxlength: 150 },
    experience: { type: String, maxlength: 80 },
    institution: { type: String, maxlength: 150 },
    partnershipGoal: { type: String, maxlength: 2000 },
    targetAudience: { type: String, maxlength: 200 },
    estimatedParticipants: { type: String, maxlength: 80 },
    sourcePath: { type: String, maxlength: 300 },
    consentedAt: { type: Date, required: true },
    status: {
      type: String,
      enum: [
        "New",
        "Contacted",
        "Qualified",
        "Proposal/Enrollment",
        "Converted",
        "Closed",
      ],
      required: true,
      default: "New",
      index: true,
    },
    statusHistory: { type: [statusHistorySchema], default: [] },
    assignee: {
      name: { type: String, maxlength: 100 },
      email: { type: String, maxlength: 254 },
    },
    followUpAt: { type: Date },
    notes: { type: [noteSchema], default: [] },
  },
  {
    timestamps: true,
    collection: "leads",
  },
);

leadSchema.index({ createdAt: -1, _id: -1 });
leadSchema.index({ vertical: 1, status: 1, createdAt: -1 });

export interface LeadDocument {
  _id: { toString(): string };
  category: LeadCategory;
  vertical: LeadVertical;
  recordType: "business" | "registration" | "application" | "partnership";
  name: string;
  email: string;
  phone: string;
  status: LeadStatus;
  createdAt: Date;
  updatedAt: Date;
  statusHistory: Array<{
    status: LeadStatus;
    changedAt: Date;
    changedBy: string;
  }>;
  notes: Array<{
    text: string;
    authorName: string;
    authorEmail: string;
    createdAt: Date;
  }>;
  [key: string]: unknown;
}

export const Lead = model("Lead", leadSchema);
