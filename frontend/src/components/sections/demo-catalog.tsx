"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { demos, demoCategories, type DemoCategory } from "@/data/demos";
import { Badge, EmptyState } from "@/components/ui/primitives";
import { Entrance } from "@/components/ui/entrance";

type RuntimeStatus = {
  available: boolean;
  status:
    | "Coming Soon"
    | "Beta Demo"
    | "Live Demo"
    | "Checking availability"
    | "Unavailable";
  reason?: "region-restricted" | "region-unavailable";
};

function isRuntimeStatus(value: unknown): value is RuntimeStatus {
  return (
    typeof value === "object" &&
    value !== null &&
    "available" in value &&
    typeof value.available === "boolean" &&
    "status" in value &&
    (value.status === "Coming Soon" ||
      value.status === "Beta Demo" ||
      value.status === "Live Demo" ||
      value.status === "Unavailable")
  );
}

export function DemoCatalog() {
  const [runtimeStatus, setRuntimeStatus] = useState<RuntimeStatus>({
    available: false,
    status: "Checking availability",
  });

  useEffect(() => {
    let active = true;
    async function loadStatus() {
      try {
        const response = await fetch("/api/demos/status", {
          cache: "no-store",
        });
        const result: unknown = await response.json();
        if (!response.ok || !isRuntimeStatus(result)) {
          throw new Error("The demo status could not be verified.");
        }
        if (active) setRuntimeStatus(result);
      } catch (error) {
        console.error(
          "Unable to load public demo status:",
          error instanceof Error ? error.message : "Unknown status error",
        );
        if (active) {
          setRuntimeStatus({ available: false, status: "Unavailable" });
        }
      }
    }
    void loadStatus();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="demo-category-groups">
      {runtimeStatus.reason === "region-restricted" && (
        <p className="demo-region-note" role="note">
          Gemini free-tier demos are not available in your region.
        </p>
      )}
      {runtimeStatus.reason === "region-unavailable" && (
        <p className="demo-region-note" role="note">
          Demo availability could not be confirmed for this region.
        </p>
      )}
      {demoCategories.map((category) => {
        const categoryDemos = demos.filter(
          (demo) => demo.category === category,
        );
        return (
          <Entrance key={category}>
            <section
              className="demo-category-group"
              id={`${category.toLowerCase().replaceAll(" ", "-")}-demos`}
              aria-labelledby={`${category.toLowerCase().replaceAll(" ", "-")}-heading`}
            >
              <div className="demo-category-heading">
                <div>
                  <p className="eyebrow">{category}</p>
                  <h3
                    id={`${category.toLowerCase().replaceAll(" ", "-")}-heading`}
                  >
                    {category}
                  </h3>
                </div>
                <span className="muted">
                  {categoryDemos.length
                    ? `${categoryDemos.length} preview${categoryDemos.length === 1 ? "" : "s"}`
                    : "No available demos"}
                </span>
              </div>
              {categoryDemos.length ? (
                <div className="grid-three ecosystem-card-grid">
                  {categoryDemos.map((demo) => (
                    <article className="service-card demo-card" key={demo.slug}>
                      <div className="demo-card-topline">
                        <Badge>{runtimeStatus.status}</Badge>
                        <span className="demo-usage-time">
                          {demo.estimatedUsageTime}
                        </span>
                      </div>
                      <p className="eyebrow small">
                        {demo.industry} · {demo.category}
                      </p>
                      <h4>
                        <Link href={`/demos/${demo.slug}`}>{demo.title}</Link>
                      </h4>
                      <p className="muted">{demo.summary}</p>
                      <ul className="demo-feature-list">
                        {demo.highlights.slice(0, 2).map((highlight) => (
                          <li key={highlight}>{highlight}</li>
                        ))}
                      </ul>
                      <p className="demo-technology">
                        Technology: {demo.technology}
                      </p>
                      <Link className="text-link" href={`/demos/${demo.slug}`}>
                        {runtimeStatus.available
                          ? "Launch Demo"
                          : "View Preview"}
                        <ArrowRight size={15} aria-hidden="true" />
                      </Link>
                    </article>
                  ))}
                </div>
              ) : (
                <EmptyState
                  title={
                    category === "AI Products"
                      ? "No product demos are available"
                      : `No ${category.toLowerCase()} are available yet`
                  }
                  description={
                    category === "AI Products"
                      ? "Current product entries are early ideas, not available products or interactive demos."
                      : "We will add a demo only after its functionality and status are verified."
                  }
                >
                  {category === "AI Products" && (
                    <Link className="text-link" href="/products">
                      Explore product ideas{" "}
                      <ArrowRight size={15} aria-hidden="true" />
                    </Link>
                  )}
                </EmptyState>
              )}
            </section>
          </Entrance>
        );
      })}
      {runtimeStatus.status === "Unavailable" && !runtimeStatus.reason && (
        <p className="demo-region-note" role="alert">
          Demo availability could not be verified. No demo can be launched until
          the status service is available.
        </p>
      )}
    </div>
  );
}

export function DemoCategoryBadge({ category }: { category: DemoCategory }) {
  return <Badge>{category}</Badge>;
}
