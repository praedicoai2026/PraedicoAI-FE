import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { PortalDashboard } from "@/components/portals/portal-app";
import { portalCookieName, verifyPortalSession } from "@/lib/portal-auth";

export const metadata: Metadata = {
  title: "Demo Dashboard",
  robots: { index: false, follow: false },
};

export default async function DemoDashboardPage() {
  const cookieStore = await cookies();
  if (
    !verifyPortalSession(
      cookieStore.get(portalCookieName("demo"))?.value,
      "demo",
    )
  ) {
    redirect("/demo/login");
  }
  return <PortalDashboard portal="demo" />;
}
