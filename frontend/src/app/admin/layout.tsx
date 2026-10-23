import type { ReactNode } from "react";
import "../portals.css";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <div className="portal-route admin-theme">{children}</div>;
}
