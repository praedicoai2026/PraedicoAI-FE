import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { EmployeeSelfDashboard } from "@/components/portals/workforce-dashboard";
import {
  getAdminSession,
  hasAdminPortalAccess,
} from "@/lib/server/admin-session";
import { portalCookieName } from "@/lib/portal-auth";

export const metadata: Metadata = {
  title: "My Work Profile",
  robots: { index: false, follow: false },
};

export default async function EmployeeProfilePage() {
  const cookieStore = await cookies();
  const session = await getAdminSession(
    cookieStore.get(portalCookieName("admin"))?.value,
  );
  if (!hasAdminPortalAccess(session, "employees:self:read")) {
    redirect("/admin/login");
  }
  return <EmployeeSelfDashboard permissions={session?.permissions ?? []} />;
}
