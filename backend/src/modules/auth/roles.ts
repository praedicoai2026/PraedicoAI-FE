export const userRoles = [
  "member",
  "staff",
  "employee",
  "super_admin",
  "admin",
  "hr_manager",
  "project_manager",
  "content_manager",
  "training_manager",
  "demo_manager",
] as const;

export type UserRole = (typeof userRoles)[number];

export const assignableUserRoles = [
  "member",
  "staff",
  "employee",
  "admin",
  "hr_manager",
  "project_manager",
  "content_manager",
  "training_manager",
  "demo_manager",
] as const satisfies readonly Exclude<UserRole, "super_admin">[];

export const adminPermissions = [
  "leads:read",
  "leads:write",
  "leads:assign",
  "leads:export",
  "demos:read",
  "demos:manage",
  "employees:read",
  "employees:manage",
  "employees:self:read",
  "employees:self:write",
  "projects:read",
  "projects:manage",
  "projects:self:read",
  "content:read",
  "content:manage",
  "content:publish",
  "training:read",
  "training:manage",
  "reports:read",
  "settings:manage",
  "admins:manage",
] as const;

export type AdminPermission = (typeof adminPermissions)[number];

export const superAdminOnlyPermissions = [
  "settings:manage",
  "admins:manage",
] as const satisfies readonly AdminPermission[];
const superAdminOnlyPermissionSet = new Set<string>(
  superAdminOnlyPermissions,
);

const rolePermissions: Record<UserRole, readonly AdminPermission[]> = {
  member: [],
  staff: [],
  employee: ["employees:self:read", "employees:self:write", "projects:self:read"],
  super_admin: adminPermissions,
  admin: [
    "leads:read",
    "leads:write",
    "leads:assign",
    "leads:export",
    "demos:read",
    "demos:manage",
    "employees:read",
    "employees:manage",
    "projects:read",
    "projects:manage",
    "content:read",
    "content:manage",
    "content:publish",
    "training:read",
    "training:manage",
    "reports:read",
  ],
  hr_manager: ["employees:read", "employees:manage", "reports:read"],
  project_manager: ["projects:read", "projects:manage", "employees:read"],
  content_manager: ["content:read", "content:manage"],
  training_manager: [
    "leads:read",
    "leads:write",
    "leads:assign",
    "leads:export",
    "training:read",
    "training:manage",
    "reports:read",
  ],
  demo_manager: ["demos:read", "demos:manage", "reports:read"],
};

const validPermissions = new Set<string>(adminPermissions);

export function isUserRole(value: unknown): value is UserRole {
  return typeof value === "string" && userRoles.includes(value as UserRole);
}

export function isAdminPermission(value: unknown): value is AdminPermission {
  return typeof value === "string" && validPermissions.has(value);
}

export function isSuperAdminOnlyPermission(value: string) {
  return superAdminOnlyPermissionSet.has(value);
}

export function getRolePermissions(role: UserRole) {
  return [...rolePermissions[role]];
}

export function getEffectivePermissions(
  role: UserRole,
  customPermissions?: readonly string[] | null,
): AdminPermission[] {
  if (role === "super_admin") return [...adminPermissions];
  if (customPermissions == null) return getRolePermissions(role);
  return customPermissions.filter(isAdminPermission);
}

export function hasPermission(
  user: { role: UserRole; permissions?: readonly string[] },
  permission: AdminPermission,
) {
  if (
    isSuperAdminOnlyPermission(permission) &&
    user.role !== "super_admin"
  ) {
    return false;
  }
  return getEffectivePermissions(user.role, user.permissions).includes(
    permission,
  );
}
