import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { DemoAnalyticsDashboard } from "@/components/portals/demo-analytics-dashboard";
import {
  getAdminSession,
  hasAdminPortalAccess,
} from "@/lib/server/admin-session";
import { portalCookieName } from "@/lib/portal-auth";

export const metadata: Metadata = {
  title: "Demo Analytics",
  robots: { index: false, follow: false },
};

export default async function AdminDemoAnalyticsPage() {
  const cookieStore = await cookies();
  const session = await getAdminSession(
    cookieStore.get(portalCookieName("admin"))?.value,
  );
  if (!hasAdminPortalAccess(session, "demos:read")) redirect("/admin/login");
  return (
    <DemoAnalyticsDashboard permissions={session?.permissions ?? []} />
  );
}
