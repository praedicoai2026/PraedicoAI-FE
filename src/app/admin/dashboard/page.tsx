import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { PortalDashboard } from "@/components/portals/portal-app";
import { portalCookieName, verifyPortalSession } from "@/lib/portal-auth";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  robots: { index: false, follow: false },
};

export default async function AdminDashboardPage() {
  const cookieStore = await cookies();
  if (
    !verifyPortalSession(
      cookieStore.get(portalCookieName("admin"))?.value,
      "admin",
    )
  ) {
    redirect("/admin/login");
  }
  return <PortalDashboard portal="admin" />;
}
