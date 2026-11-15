import { z } from "zod";

const categories = [
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
] as const;

const name = z.string().trim().min(2).max(100);
const email = z
  .string()
  .trim()
  .email()
  .max(254)
  .transform((value) => value.toLowerCase());
const phone = z.string().trim().min(7).max(30);
const requiredText = (maxLength: number) =>
  z.string().trim().min(1).max(maxLength);

const commonFields = {
  name,
  email,
  phone,
  consent: z.literal(true),
  sourcePath: z.string().trim().max(300).optional(),
  website: z.string().max(200).optional(),
};

const businessLead = z
  .object({
    ...commonFields,
    category: z.enum([
      "AI Business Solutions",
      "AI Consulting",
      "AI Automation",
      "AI Application Development",
      "Corporate Training",
    ]),
    company: requiredText(150),
    designation: requiredText(120),
    industry: requiredText(120),
    businessProblem: requiredText(3000),
    requiredAISolution: requiredText(2000),
    budgetRange: z.string().trim().max(80).optional(),
    preferredContactMethod: z.enum(["email", "phone", "whatsapp"]),
  })
  .strict();

const studentLead = z
  .object({
    ...commonFields,
    category: z.enum(["Student AI Training", "AI Internships"]),
    college: requiredText(150),
    courseDegree: requiredText(150),
    currentYear: requiredText(80),
    interestedAIProgram: requiredText(200),
    internshipInterest: z.enum(["yes", "no", "exploring"]),
    learningObjectives: requiredText(3000),
  })
  .strict();

const professionalLead = z
  .object({
    ...commonFields,
    category: z.literal("Professional AI Training"),
    currentProfession: requiredText(150),
    industry: requiredText(120),
    experience: requiredText(80),
    interestedAIProgram: requiredText(200),
    learningObjectives: requiredText(3000),
  })
  .strict();

const institutionLead = z
  .object({
    ...commonFields,
    category: z.literal("College Partnerships"),
    institution: requiredText(150),
    designation: requiredText(120),
    partnershipGoal: requiredText(2000),
    targetAudience: requiredText(200),
    learningObjectives: requiredText(3000),
    estimatedParticipants: z.string().trim().max(80).optional(),
    preferredContactMethod: z.enum(["email", "phone", "whatsapp"]),
  })
  .strict();

const ecosystemInterestLead = z
  .object({
    ...commonFields,
    category: z.enum([
      "AI Product Interest",
      "AI Community",
      "AI Research Interest",
    ]),
    company: z.string().trim().max(150).optional(),
    interestArea: requiredText(200),
    learningObjectives: requiredText(3000),
  })
  .strict();

export const leadSubmissionSchema = z.discriminatedUnion("category", [
  businessLead,
  studentLead,
  professionalLead,
  institutionLead,
  ecosystemInterestLead,
]);

export const leadCategorySchema = z.enum(categories);
export type LeadCategory = z.infer<typeof leadCategorySchema>;
export type LeadSubmission = z.infer<typeof leadSubmissionSchema>;

export const leadStatuses = [
  "New",
  "Contacted",
  "Qualified",
  "Proposal/Enrollment",
  "Converted",
  "Closed",
] as const;

export const leadStatusSchema = z.enum(leadStatuses);
export type LeadStatus = z.infer<typeof leadStatusSchema>;

export const leadVerticalSchema = z.enum([
  "AI Business Solutions",
  "AI Learning",
]);
export type LeadVertical = z.infer<typeof leadVerticalSchema>;

export const leadListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).max(100_000).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(25),
  category: leadCategorySchema.optional(),
  vertical: leadVerticalSchema.optional(),
  status: leadStatusSchema.optional(),
  search: z.string().trim().max(100).optional(),
});

export const leadUpdateSchema = z
  .object({
    status: leadStatusSchema.optional(),
    assignee: z
      .object({
        name: requiredText(100),
        email,
      })
      .strict()
      .nullable()
      .optional(),
    followUpAt: z.string().datetime().nullable().optional(),
    note: z.string().trim().min(1).max(2000).optional(),
  })
  .strict()
  .refine((value) => Object.keys(value).length > 0, {
    message: "Add at least one lead update.",
  });

export type LeadListQuery = z.infer<typeof leadListQuerySchema>;
export type LeadUpdate = z.infer<typeof leadUpdateSchema>;
