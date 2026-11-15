import { z } from "zod";

const objectIdSchema = z
  .string()
  .regex(/^[a-f\d]{24}$/i, "Invalid account ID.");
const workStatusSchema = z.enum(["active", "on_leave", "inactive"]);

export const employeeProfileUpsertSchema = z
  .object({
    userId: objectIdSchema,
    department: z.string().trim().min(1).max(100),
    jobTitle: z.string().trim().min(1).max(100),
    managerId: objectIdSchema.nullable().optional(),
    workStatus: workStatusSchema.default("active"),
  })
  .strict();

export const employeeProfileUpdateSchema = employeeProfileUpsertSchema
  .omit({ userId: true })
  .partial()
  .strict()
  .refine((value) => Object.keys(value).length > 0, {
    message: "Add at least one profile change.",
  });

const projectFields = {
  name: z.string().trim().min(1).max(120),
  description: z.string().trim().max(1000).default(""),
  status: z.enum(["planned", "in_progress", "on_hold", "completed"]),
  ownerId: objectIdSchema,
  memberIds: z.array(objectIdSchema).max(100).default([]),
  startDate: z.coerce.date().nullable().optional(),
  endDate: z.coerce.date().nullable().optional(),
};

function hasOrderedDates(value: {
  startDate?: Date | null;
  endDate?: Date | null;
}) {
  return !value.startDate || !value.endDate || value.endDate >= value.startDate;
}

export const projectCreateSchema = z
  .object({
    ...projectFields,
    ownerId: projectFields.ownerId.optional(),
  })
  .strict()
  .refine((value) => new Set(value.memberIds).size === value.memberIds.length, {
    path: ["memberIds"],
    message: "Project members must be unique.",
  })
  .refine(hasOrderedDates, {
    path: ["endDate"],
    message: "The end date must be on or after the start date.",
  });

export const projectUpdateSchema = z
  .object({
    ...projectFields,
    name: projectFields.name.optional(),
    description: projectFields.description.optional(),
    status: projectFields.status.optional(),
    ownerId: projectFields.ownerId.optional(),
    memberIds: projectFields.memberIds.optional(),
    startDate: projectFields.startDate,
    endDate: projectFields.endDate,
  })
  .strict()
  .refine((value) => Object.keys(value).length > 0, {
    message: "Add at least one project change.",
  })
  .refine(
    (value) =>
      new Set(value.memberIds ?? []).size === (value.memberIds ?? []).length,
    {
      path: ["memberIds"],
      message: "Project members must be unique.",
    },
  )
  .refine(hasOrderedDates, {
    path: ["endDate"],
    message: "The end date must be on or after the start date.",
  });

export type EmployeeProfileUpsert = z.infer<typeof employeeProfileUpsertSchema>;
export type EmployeeProfileUpdate = z.infer<typeof employeeProfileUpdateSchema>;
export type ProjectCreate = z.infer<typeof projectCreateSchema>;
export type ProjectUpdate = z.infer<typeof projectUpdateSchema>;
