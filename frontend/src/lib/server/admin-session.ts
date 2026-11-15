import "server-only";

export type AdminSession = {
  role: string;
  permissions: string[];
};

function getBackendApiUrl() {
  const value = process.env.BACKEND_API_URL?.trim();
  if (!value) throw new Error("BACKEND_API_URL is not configured.");
  return value.replace(/\/+$/, "");
}

export async function getAdminSession(token: string | undefined) {
  if (!token) return null;

  const response = await fetch(`${getBackendApiUrl()}/api/v1/auth/me`, {
    headers: { Cookie: `praedicoai_session=${encodeURIComponent(token)}` },
    cache: "no-store",
    signal: AbortSignal.timeout(10_000),
  });
  if (response.status === 401) return null;
  if (!response.ok) {
    throw new Error(`Admin session verification failed (${response.status}).`);
  }

  const result: unknown = await response.json();
  if (typeof result !== "object" || result === null || !("data" in result)) {
    return null;
  }
  const data = result.data;
  if (typeof data !== "object" || data === null || !("user" in data)) {
    return null;
  }
  const user = data.user;
  if (
    typeof user !== "object" ||
    user === null ||
    !("role" in user) ||
    typeof user.role !== "string" ||
    !("permissions" in user) ||
    !Array.isArray(user.permissions) ||
    !user.permissions.every((permission) => typeof permission === "string")
  ) {
    return null;
  }
  return { role: user.role, permissions: user.permissions } satisfies AdminSession;
}

export async function getAdminSessionStatus(
  token: string | undefined,
  requiredPermission?: string,
) {
  const session = await getAdminSession(token);
  if (!session) return false;
  return hasAdminPortalAccess(session, requiredPermission);
}

export function hasAdminPortalAccess(
  session: AdminSession | null,
  requiredPermission?: string,
) {
  if (!session) return false;
  return requiredPermission
    ? session.permissions.includes(requiredPermission)
    : session.permissions.some((permission) =>
      [
        "leads:read",
        "demos:read",
        "admins:manage",
        "employees:read",
        "employees:manage",
        "employees:self:read",
        "projects:read",
        "projects:manage",
        "projects:self:read",
        "reports:read",
        "content:read",
        "content:manage",
      ].includes(permission),
      );
}
