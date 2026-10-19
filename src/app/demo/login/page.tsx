import type { Metadata } from "next";
import { PortalLogin } from "@/components/portals/portal-app";

export const metadata: Metadata = {
  title: "Demo Portal",
  robots: { index: false, follow: false },
};

export default function DemoLoginPage() {
  return <PortalLogin portal="demo" />;
}
