import { z } from "zod";
import {
  adminPermissions,
  assignableUserRoles,
  isSuperAdminOnlyPermission,
} from "../auth/roles.js";

export const adminAccountListSchema = z
  .object({
    page: z.coerce.number().int().min(1).max(10_000).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(50),
    search: z.string().trim().max(100).optional(),
  })
  .strict();

export const adminAccountUpdateSchema = z
  .object({
    role: z.enum(assignableUserRoles).optional(),
    isActive: z.boolean().optional(),
    permissions: z
      .array(z.enum(adminPermissions))
      .max(adminPermissions.length)
      .refine((value) => new Set(value).size === value.length, {
        message: "Permissions must not contain duplicates.",
      })
      .nullable()
      .optional(),
  })
  .strict()
  .refine((value) => Object.keys(value).length > 0, {
    message: "Add at least one account change.",
  })
  .refine(
    (value) =>
      value.permissions == null ||
      value.permissions.every(
        (permission) => !isSuperAdminOnlyPermission(permission),
      ),
    {
      path: ["permissions"],
      message: "Only Super Admin can receive these permissions.",
    },
  );

export type AdminAccountListQuery = z.infer<typeof adminAccountListSchema>;
export type AdminAccountUpdate = z.infer<typeof adminAccountUpdateSchema>;
