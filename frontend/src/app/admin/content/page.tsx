import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ContentManagementDashboard } from "@/components/portals/content-management-dashboard";
import {
  getAdminSession,
  hasAdminPortalAccess,
} from "@/lib/server/admin-session";
import { portalCookieName } from "@/lib/portal-auth";

export const metadata: Metadata = {
  title: "Content Workflow",
  robots: { index: false, follow: false },
};

export default async function AdminContentPage() {
  const cookieStore = await cookies();
  const session = await getAdminSession(
    cookieStore.get(portalCookieName("admin"))?.value,
  );
  if (
    !hasAdminPortalAccess(session, "content:read") &&
    !hasAdminPortalAccess(session, "content:manage")
  ) {
    redirect("/admin/login");
  }
  return <ContentManagementDashboard permissions={session?.permissions ?? []} />;
}
