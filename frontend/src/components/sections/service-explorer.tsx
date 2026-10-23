"use client";

import Link from "next/link";
import { useState, type KeyboardEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  BrainCircuit,
  Code2,
  GraduationCap,
  Layers3,
  TrendingUp,
} from "lucide-react";
import type { Service } from "@/types/content";
import { serviceGroups } from "@/data/home";

const groupIcons = [Code2, BrainCircuit, Layers3, TrendingUp, GraduationCap];
type ServiceSummary = Pick<
  Service,
  "slug" | "title" | "summary" | "category" | "tags"
>;

export function ServiceExplorer({ services }: { services: ServiceSummary[] }) {
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();
  const group = serviceGroups[active];
  const visible = services.filter(
    (service) => service.category === group.category,
  );
  const Icon = groupIcons[active];

  function navigateTabs(
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) {
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % serviceGroups.length;
    else if (event.key === "ArrowLeft")
      next = (index - 1 + serviceGroups.length) % serviceGroups.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = serviceGroups.length - 1;
    else return;
    event.preventDefault();
    setActive(next);
    document.getElementById(`expertise-tab-${next}`)?.focus();
  }

  return (
    <div className="service-explorer">
      <div
        className="expertise-tabs"
        role="tablist"
        aria-label="Service categories"
      >
        {serviceGroups.map((item, index) => {
          const TabIcon = groupIcons[index];
          return (
            <button
              type="button"
              role="tab"
              id={`expertise-tab-${index}`}
              aria-selected={active === index}
              aria-controls="expertise-panel"
              tabIndex={active === index ? 0 : -1}
              key={item.category}
              onClick={() => setActive(index)}
              onKeyDown={(event) => navigateTabs(event, index)}
            >
              <TabIcon size={18} aria-hidden="true" />
              <span>{item.category}</span>
            </button>
          );
        })}
      </div>
      <div
        id="expertise-panel"
        className="expertise-panel"
        role="tabpanel"
        aria-labelledby={`expertise-tab-${active}`}
        tabIndex={0}
      >
        <motion.div
          key={group.category}
          className="expertise-content"
          initial={false}
          animate={
            reduced ? { opacity: 1, y: 0 } : { opacity: [0.4, 1], y: [12, 0] }
          }
          transition={{ duration: reduced ? 0 : 0.35 }}
        >
          <div className="expertise-intro">
            <span className="expertise-icon">
              <Icon size={34} strokeWidth={1.3} />
            </span>
            <p className="eyebrow">
              0{active + 1} / {group.category}
            </p>
            <h3>{group.title}</h3>
            <p className="muted">{group.description}</p>
            <Link className="text-link" href="/request-proposal">
              Discuss your idea
              <ArrowUpRight size={18} />
            </Link>
          </div>
          <div className="expertise-services">
            {visible.map((service, index) => (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className="expertise-service"
              >
                <span className="expertise-service-number">0{index + 1}</span>
                <div>
                  <h4>{service.title}</h4>
                  <p>{service.summary}</p>
                  <span className="expertise-service-tags">
                    {service.tags.join(" / ")}
                  </span>
                </div>
                <ArrowUpRight size={22} />
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
