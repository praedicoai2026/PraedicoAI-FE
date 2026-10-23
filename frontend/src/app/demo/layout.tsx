import type { ReactNode } from "react";
import "../portals.css";

export default function DemoLayout({ children }: { children: ReactNode }) {
  return <div className="portal-route demo-theme">{children}</div>;
}
