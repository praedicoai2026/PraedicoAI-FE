import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { UnifiedDashboard } from "@/components/portals/unified-dashboard";
import {
  getAdminSession,
  hasAdminPortalAccess,
} from "@/lib/server/admin-session";
import { portalCookieName } from "@/lib/portal-auth";

export const metadata: Metadata = {
  title: "Workspace Overview",
  robots: { index: false, follow: false },
};

export default async function AdminReportsPage() {
  const cookieStore = await cookies();
  const session = await getAdminSession(
    cookieStore.get(portalCookieName("admin"))?.value,
  );
  if (!hasAdminPortalAccess(session, "reports:read")) {
    redirect("/admin/login");
  }
  return <UnifiedDashboard permissions={session?.permissions ?? []} />;
}
