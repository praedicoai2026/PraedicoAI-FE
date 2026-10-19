import type { Metadata } from "next";
import { PortalLogin } from "@/components/portals/portal-app";

export const metadata: Metadata = {
  title: "Admin Portal",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return <PortalLogin portal="admin" />;
}
