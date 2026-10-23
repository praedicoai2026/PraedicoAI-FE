"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export function SiteChrome({
  header,
  footer,
  children,
}: {
  header: ReactNode;
  footer: ReactNode;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const isPortal =
    pathname.startsWith("/admin") || pathname.startsWith("/demo");

  return (
    <>
      {!isPortal && header}
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
      {!isPortal && footer}
    </>
  );
}
