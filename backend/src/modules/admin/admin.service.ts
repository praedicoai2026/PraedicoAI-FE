import { Types } from "mongoose";
import { HttpError } from "../../errors/http-error.js";
import { Session } from "../auth/session.model.js";
import { User } from "../auth/user.model.js";
import {
  adminPermissions,
  assignableUserRoles,
  getEffectivePermissions,
  getRolePermissions,
  isSuperAdminOnlyPermission,
  isUserRole,
} from "../auth/roles.js";
import { AdminAudit } from "./admin-audit.model.js";
import type {
  AdminAccountListQuery,
  AdminAccountUpdate,
} from "./admin.schema.js";

function accountView(user: {
  _id: { toString(): string };
  fullName: string;
  email: string;
  role: string;
  isActive?: boolean;
  permissions?: string[] | null;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    id: user._id.toString(),
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    isActive: user.isActive !== false,
    permissions: getEffectivePermissions(
      isUserRole(user.role) ? user.role : "member",
      user.permissions,
    ).filter(
      (permission) =>
        user.role === "super_admin" ||
        !isSuperAdminOnlyPermission(permission),
    ),
    customizedPermissions: user.permissions != null,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export async function listAdminAccounts(query: AdminAccountListQuery) {
  const filter: Record<string, unknown> = {
    role: { $ne: "super_admin" },
  };
  if (query.search) {
    const escapedSearch = query.search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const expression = new RegExp(escapedSearch, "i");
    filter.$or = [
      { fullName: expression },
      { email: expression },
      { role: expression },
    ];
  }
  const skip = (query.page - 1) * query.limit;
  const [accounts, total] = await Promise.all([
    User.find(filter)
      .select("fullName email role permissions isActive createdAt updatedAt")
      .sort({ updatedAt: -1, _id: -1 })
      .skip(skip)
      .limit(query.limit)
      .lean(),
    User.countDocuments(filter),
  ]);
  return {
    accounts: accounts.map(accountView),
    total,
    page: query.page,
    limit: query.limit,
    roles: assignableUserRoles,
    permissions: adminPermissions.filter(
      (permission) => !isSuperAdminOnlyPermission(permission),
    ),
    rolePermissions: Object.fromEntries(
      assignableUserRoles.map((role) => [role, getRolePermissions(role)]),
    ),
  };
}

export async function updateAdminAccount(
  targetId: string,
  update: AdminAccountUpdate,
  actor: { id: string; email: string },
) {
  if (!Types.ObjectId.isValid(targetId)) {
    throw new HttpError(404, "ACCOUNT_NOT_FOUND", "This account was not found.");
  }
  if (targetId === actor.id) {
    throw new HttpError(
      400,
      "SELF_UPDATE_NOT_ALLOWED",
      "Use a different Super Admin account to change administrator access.",
    );
  }

  const target = await User.findById(targetId).select(
    "fullName email role permissions isActive createdAt updatedAt",
  );
  if (!target || target.role === "super_admin") {
    throw new HttpError(404, "ACCOUNT_NOT_FOUND", "This account was not found.");
  }

  const previousRole = target.role ?? "member";
  const previousActive = target.isActive !== false;
  const previousPermissions = getEffectivePermissions(
    isUserRole(previousRole) ? previousRole : "member",
    target.permissions,
  );
  if (update.role !== undefined) target.role = update.role;
  if (update.isActive !== undefined) target.isActive = update.isActive;
  if (update.permissions !== undefined) {
    target.permissions = update.permissions ?? undefined;
  } else if (update.role !== undefined && update.role !== previousRole) {
    target.permissions = undefined;
  }
  await target.save();

  if (target.isActive === false) {
    await Session.deleteMany({ userId: target._id });
  }

  const nextRole = isUserRole(target.role) ? target.role : "member";
  const nextPermissions = getEffectivePermissions(nextRole, target.permissions);
  try {
    await AdminAudit.create({
      actorId: new Types.ObjectId(actor.id),
      actorEmail: actor.email,
      targetId: target._id,
      targetEmail: target.email,
      action: "admin-account-updated",
      beforeRole: previousRole,
      afterRole: target.role,
      beforeActive: previousActive,
      afterActive: target.isActive !== false,
      permissionsChanged:
        previousPermissions.join("|") !== nextPermissions.join("|"),
      beforePermissions: previousPermissions,
      afterPermissions: nextPermissions,
    });
  } catch {
    throw new HttpError(
      500,
      "ADMIN_AUDIT_FAILED",
      "The account was updated, but the audit record could not be saved. Contact an operator.",
    );
  }

  return accountView(target);
}
