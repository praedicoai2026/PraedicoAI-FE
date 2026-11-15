import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { LeadManagementDashboard } from "@/components/portals/lead-management-dashboard";
import {
  getAdminSession,
  hasAdminPortalAccess,
} from "@/lib/server/admin-session";
import { portalCookieName } from "@/lib/portal-auth";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  robots: { index: false, follow: false },
};

export default async function AdminDashboardPage() {
  const cookieStore = await cookies();
  const session = await getAdminSession(
    cookieStore.get(portalCookieName("admin"))?.value,
  );
  if (!hasAdminPortalAccess(session, "leads:read")) {
    redirect("/admin/login");
  }
  return <LeadManagementDashboard permissions={session?.permissions ?? []} />;
}
