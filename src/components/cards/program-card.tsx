import Link from "next/link";
import {
  ArrowUpRight,
  BrainCircuit,
  Braces,
  ChartNoAxesCombined,
  Code2,
  Layers3,
  ShieldCheck,
  Sparkles,
  Workflow,
} from "lucide-react";
import type { Program } from "@/data/programs";
import { ButtonLink } from "@/components/ui/primitives";

const programIcons = {
  brain: BrainCircuit,
  sparkles: Sparkles,
  code: Code2,
  layers: Layers3,
  workflow: Workflow,
  shield: ShieldCheck,
  chart: ChartNoAxesCombined,
  fullstack: Braces,
} as const;

export function ProgramCard({ program }: { program: Program }) {
  const Icon = programIcons[program.icon as keyof typeof programIcons] ?? Code2;
  const durations = [
    ...new Set(program.formats.map(({ duration }) => duration)),
  ];
  const enquiryHref = `/contact?program=${program.slug}`;

  return (
    <article className="program-card">
      <div className="row-between">
        <span className="program-card-icon">
          <Icon size={23} aria-hidden="true" />
        </span>
        <span className="eyebrow small">{program.category}</span>
      </div>
      <h3>
        <Link href={`/programs/${program.slug}`}>{program.title}</Link>
      </h3>
      <p className="muted">{program.summary}</p>
      <div className="program-card-detail">
        <h4>Key learning outcomes</h4>
        <ul>
          {program.outcomes.slice(0, 3).map((outcome) => (
            <li key={outcome}>{outcome}</li>
          ))}
        </ul>
      </div>
      <p className="program-card-formats">
        Formats:{" "}
        {[...new Set(program.formats.map(({ category }) => category))].join(
          " · ",
        )}
      </p>
      <div className="program-duration-list" aria-label="Available durations">
        {durations.map((duration) => (
          <span className="program-duration-chip" key={duration}>
            {duration}
          </span>
        ))}
      </div>
      <div className="program-card-actions">
        <Link className="text-link" href={`/programs/${program.slug}`}>
          View syllabus <ArrowUpRight size={16} aria-hidden="true" />
        </Link>
        <ButtonLink href={enquiryHref} secondary>
          Enquire about program
        </ButtonLink>
      </div>
    </article>
  );
}

export function ProgramPreviewCard({ program }: { program: Program }) {
  const firstFormat = program.formats[0];

  return (
    <article className="program-preview-card">
      <p className="eyebrow small">{program.category}</p>
      <h3>
        <Link href={`/programs/${program.slug}`}>{program.title}</Link>
      </h3>
      <p className="muted">{program.summary}</p>
      <ul>
        {firstFormat.modules.slice(0, 3).map((module) => (
          <li key={module.title}>{module.title}</li>
        ))}
      </ul>
      <Link className="text-link" href={`/programs/${program.slug}`}>
        Explore syllabus <ArrowUpRight size={16} aria-hidden="true" />
      </Link>
    </article>
  );
}
