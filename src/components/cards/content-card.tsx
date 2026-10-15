import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Code2,
  Globe2,
  BrainCircuit,
  Workflow,
  ChartNoAxesCombined,
  Video,
  Users,
  Layers3,
  RefreshCw,
  GraduationCap,
} from "lucide-react";
import type {
  CatalogItem,
  Service,
  Solution,
  Testimonial,
} from "@/types/content";
import { Badge, TechnologyTags } from "@/components/ui/primitives";
const icons = {
  code: Code2,
  globe: Globe2,
  brain: BrainCircuit,
  workflow: Workflow,
  chart: ChartNoAxesCombined,
  video: Video,
  users: Users,
  layers: Layers3,
  refresh: RefreshCw,
  graduation: GraduationCap,
};
export function ServiceCard({ service }: { service: Service }) {
  const Icon = icons[service.icon as keyof typeof icons] ?? Code2;
  return (
    <article className="service-card">
      <div className="row-between">
        <span className="service-icon">
          <Icon size={23} aria-hidden="true" />
        </span>
        <span className="eyebrow small">{service.category}</span>
      </div>
      <h3>
        <Link href={`/services/${service.slug}`}>{service.title}</Link>
      </h3>
      <p className="muted">{service.summary}</p>
      <ul className="service-benefits">
        {service.benefits.map((benefit) => (
          <li key={benefit}>{benefit}</li>
        ))}
      </ul>
      <p className="card-audience">For {service.audience.join(" · ")}</p>
      <Link className="text-link" href={`/services/${service.slug}`}>
        Explore service
        <ArrowUpRight size={16} />
      </Link>
    </article>
  );
}
export function SolutionCard({
  solution,
  index = 0,
}: {
  solution: Solution;
  index?: number;
}) {
  return (
    <article className="solution-card">
      <span className="eyebrow">0{index + 1}</span>
      <h3>
        <Link href={`/solutions/${solution.slug}`}>
          {solution.title}
          <ArrowUpRight size={17} />
        </Link>
      </h3>
      <p className="muted">{solution.summary}</p>
    </article>
  );
}
export function ContentCard({
  item,
  basePath,
}: {
  item: CatalogItem;
  basePath: string;
}) {
  return (
    <article className="content-card">
      <Link
        className="card-image"
        href={`${basePath}/${item.slug}`}
        tabIndex={-1}
        aria-hidden="true"
      >
        <Image
          src={item.image}
          alt=""
          width={1200}
          height={720}
          sizes="(max-width: 600px) 100vw, (max-width: 1000px) 50vw, 33vw"
        />
      </Link>
      <div className="card-body">
        <Badge>{item.label}</Badge>
        <p className="eyebrow small">{item.category}</p>
        <h3>
          <Link href={`${basePath}/${item.slug}`}>{item.title}</Link>
        </h3>
        <p className="muted">{item.summary}</p>
        <TechnologyTags tags={item.tags} />
        <Link href={`${basePath}/${item.slug}`} className="text-link">
          Read more
          <ArrowUpRight size={16} />
        </Link>
      </div>
    </article>
  );
}
export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <figure className="testimonial">
      <Badge>Placeholder feedback</Badge>
      <blockquote>{testimonial.quote}</blockquote>
      <figcaption>
        {testimonial.attribution}
        <small>{testimonial.note}</small>
      </figcaption>
    </figure>
  );
}
