import Link from "next/link";
import { aboutNavigation } from "@/data/navigation";
import { Container } from "@/components/ui/primitives";
import type { ReactNode } from "react";
export default function AboutLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Container>
        <nav className="subnav" aria-label="About sections">
          {aboutNavigation.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
      </Container>
      {children}
    </>
  );
}
