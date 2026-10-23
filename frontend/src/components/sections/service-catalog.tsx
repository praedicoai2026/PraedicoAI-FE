"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { ServiceCard } from "@/components/cards/content-card";
import { EmptyState } from "@/components/ui/primitives";
import type { Service } from "@/types/content";
import { slugify } from "@/lib/formatting";

export function ServiceCatalog({
  services,
  categories,
  initialCategory = "",
  initialCapability = "",
}: {
  services: Service[];
  categories: string[];
  initialCategory?: string;
  initialCapability?: string;
}) {
  const [query, setQuery] = useState("");
  const [capability, setCapability] = useState(initialCapability);
  const [audience, setAudience] = useState("");
  const [technology, setTechnology] = useState("");
  const normalizedQuery = query.trim().toLowerCase();
  const scopedServices = useMemo(
    () =>
      services.filter(
        (service) => !initialCategory || service.category === initialCategory,
      ),
    [initialCategory, services],
  );
  const capabilities = useMemo(
    () =>
      [
        ...new Set(scopedServices.flatMap((service) => service.capabilities)),
      ].sort(),
    [scopedServices],
  );
  const audiences = useMemo(
    () =>
      [
        ...new Set(scopedServices.flatMap((service) => service.audience)),
      ].sort(),
    [scopedServices],
  );
  const technologies = useMemo(
    () =>
      [...new Set(scopedServices.flatMap((service) => service.tags))].sort(),
    [scopedServices],
  );
  const results = scopedServices.filter((service) => {
    const searchable = [
      service.title,
      service.summary,
      service.category,
      ...service.capabilities,
      ...service.audience,
      ...service.challenges,
      ...service.deliverables,
      ...service.tags,
    ]
      .join(" ")
      .toLowerCase();
    return (
      (!normalizedQuery || searchable.includes(normalizedQuery)) &&
      (!capability || service.capabilities.includes(capability)) &&
      (!audience || service.audience.includes(audience)) &&
      (!technology || service.tags.includes(technology))
    );
  });

  function clearFilters() {
    setQuery("");
    setCapability(initialCapability);
    setAudience("");
    setTechnology("");
  }

  return (
    <div className="service-catalog">
      <nav className="service-category-list" aria-label="Service categories">
        <Link
          className={!initialCategory ? "active" : ""}
          href="/services"
          aria-current={!initialCategory ? "page" : undefined}
        >
          All services
        </Link>
        {categories.map((category) => (
          <Link
            className={initialCategory === category ? "active" : ""}
            href={`/services/category/${slugify(category)}`}
            aria-current={initialCategory === category ? "page" : undefined}
            key={category}
          >
            {category}
          </Link>
        ))}
      </nav>
      {initialCategory && (
        <nav
          className="service-category-list"
          aria-label={`${initialCategory} subcategories`}
        >
          {capabilities.map((entry) => (
            <Link
              className={initialCapability === entry ? "active" : ""}
              href={`/services/category/${slugify(initialCategory)}/capability/${slugify(entry)}`}
              aria-current={initialCapability === entry ? "page" : undefined}
              key={entry}
            >
              {entry}
            </Link>
          ))}
        </nav>
      )}
      <div className="service-filter-grid" aria-label="Filter services">
        <label className="service-search-field">
          <span>Search services</span>
          <span className="service-search-input">
            <Search size={18} aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by service, capability, or audience"
            />
          </span>
        </label>
        <label>
          <span>Subcategory</span>
          <select
            value={capability}
            onChange={(event) => setCapability(event.target.value)}
          >
            <option value="">All subcategories</option>
            {capabilities.map((entry) => (
              <option key={entry}>{entry}</option>
            ))}
          </select>
        </label>
        <label>
          <span>Audience</span>
          <select
            value={audience}
            onChange={(event) => setAudience(event.target.value)}
          >
            <option value="">All audiences</option>
            {audiences.map((entry) => (
              <option key={entry}>{entry}</option>
            ))}
          </select>
        </label>
        <label>
          <span>Technology</span>
          <select
            value={technology}
            onChange={(event) => setTechnology(event.target.value)}
          >
            <option value="">All technologies</option>
            {technologies.map((entry) => (
              <option key={entry}>{entry}</option>
            ))}
          </select>
        </label>
      </div>
      <div className="service-catalog-results">
        <p className="result-count" role="status" aria-live="polite">
          {results.length} {results.length === 1 ? "service" : "services"} found
          {initialCategory ? ` in ${initialCategory}` : ""}
        </p>
        <button
          className="service-filter-clear"
          type="button"
          onClick={clearFilters}
        >
          Clear filters
        </button>
      </div>
      {results.length ? (
        <div className="grid-three service-catalog-grid">
          {results.map((service) => (
            <ServiceCard service={service} key={service.slug} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No matching services"
          description="Try another search or clear one or more filters."
        >
          <button className="text-link" type="button" onClick={clearFilters}>
            Clear filters
          </button>
        </EmptyState>
      )}
    </div>
  );
}
