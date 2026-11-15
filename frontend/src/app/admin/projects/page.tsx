import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ProjectDashboard } from "@/components/portals/workforce-dashboard";
import {
  getAdminSession,
  hasAdminPortalAccess,
} from "@/lib/server/admin-session";
import { portalCookieName } from "@/lib/portal-auth";

export const metadata: Metadata = {
  title: "Project Workspace",
  robots: { index: false, follow: false },
};

export default async function AdminProjectsPage() {
  const cookieStore = await cookies();
  const session = await getAdminSession(
    cookieStore.get(portalCookieName("admin"))?.value,
  );
  if (
    !hasAdminPortalAccess(session, "projects:read") &&
    !hasAdminPortalAccess(session, "projects:manage") &&
    !hasAdminPortalAccess(session, "projects:self:read")
  ) {
    redirect("/admin/login");
  }
  return <ProjectDashboard permissions={session?.permissions ?? []} />;
}
