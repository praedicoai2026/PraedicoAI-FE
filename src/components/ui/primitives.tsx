import Link from "next/link";
import { ArrowRight, SearchX, ChevronDown, Check } from "lucide-react";
import type { ReactNode, ButtonHTMLAttributes } from "react";
import type { FAQ } from "@/types/content";
import { Entrance } from "@/components/ui/entrance";

export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`container ${className}`}>{children}</div>;
}
export function Section({
  children,
  className = "",
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={`section ${className}`}>
      <Container>
        <Entrance>{children}</Entrance>
      </Container>
    </section>
  );
}
export function SectionHeader({
  eyebrow,
  title,
  description,
  href,
  linkLabel = "Explore more",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="section-heading">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2>{title}</h2>
        {description && <p className="muted measure">{description}</p>}
      </div>
      {href && (
        <Link className="text-link" href={href}>
          {linkLabel}
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      )}
    </div>
  );
}
export function ButtonLink({
  href,
  children,
  secondary = false,
}: {
  href: string;
  children: ReactNode;
  secondary?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`button ${secondary ? "button-secondary" : "button-primary"}`}
    >
      {children}
      <ArrowRight size={16} aria-hidden="true" />
    </Link>
  );
}
export function Button({
  children,
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={`button button-primary ${className}`} {...props}>
      {children}
    </button>
  );
}
export function IconButton({
  label,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { label: string }) {
  return (
    <button className="icon-button" aria-label={label} title={label} {...props}>
      {children}
    </button>
  );
}
export function Badge({ children }: { children: ReactNode }) {
  return <span className="badge">{children}</span>;
}
export function TechnologyTags({ tags }: { tags: string[] }) {
  return (
    <ul className="tags" aria-label="Topics and technologies">
      {tags.map((tag) => (
        <li key={tag}>{tag}</li>
      ))}
    </ul>
  );
}
export function Alert({
  children,
  warning = false,
}: {
  children: ReactNode;
  warning?: boolean;
}) {
  return (
    <div className={`alert ${warning ? "alert-warning" : ""}`}>{children}</div>
  );
}
export function EmptyState({
  title = "Nothing here yet",
  description = "New content will be added after it has been reviewed.",
  children,
}: {
  title?: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <div className="empty-state">
      <SearchX size={28} aria-hidden="true" />
      <h3>{title}</h3>
      <p className="muted">{description}</p>
      {children}
    </div>
  );
}
export function NoResults({ reset }: { reset: () => void }) {
  return (
    <EmptyState
      title="No matching results"
      description="Try another keyword or clear a filter."
    >
      <Button type="button" onClick={reset}>
        Reset filters
      </Button>
    </EmptyState>
  );
}
export function FAQList({ items }: { items: FAQ[] }) {
  return (
    <div className="accordion">
      {items.map((item) => (
        <details key={item.question}>
          <summary>
            {item.question}
            <ChevronDown size={18} aria-hidden="true" />
          </summary>
          <p>{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
export function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="check-list">
      {items.map((item) => (
        <li key={item}>
          <Check size={16} aria-hidden="true" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
