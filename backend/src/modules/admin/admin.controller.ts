import type { RequestHandler } from "express";
import { requirePermission } from "../auth/authorization.js";
import {
  adminAccountListSchema,
  adminAccountUpdateSchema,
} from "./admin.schema.js";
import { listAdminAccounts, updateAdminAccount } from "./admin.service.js";

type SuperAdmin = { id: string; email: string };

export const requireAdminManagement = requirePermission("admins:manage");

export const listAdminAccountsController: RequestHandler = async (
  request,
  response,
  next,
) => {
  const parsed = adminAccountListSchema.safeParse(request.query);
  if (!parsed.success) {
    response.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "The requested account filters are invalid.",
      },
    });
    return;
  }
  try {
    response.status(200).json({ data: await listAdminAccounts(parsed.data) });
  } catch (error) {
    next(error);
  }
};

export const updateAdminAccountController: RequestHandler = async (
  request,
  response,
  next,
) => {
  const parsed = adminAccountUpdateSchema.safeParse(request.body);
  if (!parsed.success) {
    response.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "Check the account changes and try again.",
        fields: parsed.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      },
    });
    return;
  }
  const id = request.params.id;
  if (typeof id !== "string") {
    response.status(404).json({
      error: { code: "ACCOUNT_NOT_FOUND", message: "This account was not found." },
    });
    return;
  }
  try {
    const actor = response.locals.adminUser as SuperAdmin;
    const account = await updateAdminAccount(id, parsed.data, actor);
    response.status(200).json({ data: { account } });
  } catch (error) {
    next(error);
  }
};
