"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowUpRight, Search, X } from "lucide-react";
import type { SectorProgram } from "@/data/sectors";

type CatalogItem = Pick<
  SectorProgram,
  "href" | "status" | "availabilityStatus" | "sector" | "subject"
> & {
  formats: { category: string; duration: string }[];
};

export function ProgramCatalog({
  items,
  initialSector = "",
  initialFocusArea = "",
  showSectorFilter = true,
}: {
  items: CatalogItem[];
  initialSector?: string;
  initialFocusArea?: string;
  showSectorFilter?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [sector, setSector] = useState(initialSector);
  const [format, setFormat] = useState("");
  const [focusArea, setFocusArea] = useState(initialFocusArea);
  const [duration, setDuration] = useState("");
  const [audience, setAudience] = useState("");

  const options = useMemo(
    () => ({
      formats: [
        ...new Set(
          items.flatMap((item) => item.formats.map((f) => f.category)),
        ),
      ],
      focusAreas: [
        ...new Set(items.flatMap((item) => item.subject.focusAreas)),
      ],
      durations: [
        ...new Set(
          items.flatMap((item) => item.formats.map((f) => f.duration)),
        ),
      ],
      audiences: [
        ...new Set(items.flatMap((item) => item.sector.audience)),
      ].sort(),
    }),
    [items],
  );
  const results = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return items.filter((item) => {
      const searchable = [
        item.subject.title,
        item.subject.summary,
        item.sector.name,
        ...item.sector.audience,
        ...item.subject.focusAreas,
      ]
        .join(" ")
        .toLowerCase();
      return (
        (!normalizedQuery || searchable.includes(normalizedQuery)) &&
        (!sector || item.sector.slug === sector) &&
        (!focusArea || item.subject.focusAreas.includes(focusArea)) &&
        (!format || item.formats.some((entry) => entry.category === format)) &&
        (!duration ||
          item.formats.some((entry) => entry.duration === duration)) &&
        (!audience || item.sector.audience.includes(audience))
      );
    });
  }, [audience, duration, focusArea, format, items, query, sector]);

  function clearFilters() {
    setQuery("");
    setSector(initialSector);
    setFormat("");
    setFocusArea(initialFocusArea);
    setDuration("");
    setAudience("");
  }

  return (
    <div className="program-catalog">
      <div
        className={`program-filter-grid${showSectorFilter ? "" : " program-filter-grid-sector"}`}
        aria-label="Filter programs"
      >
        <label className="program-search-field">
          <span>Search programs</span>
          <span className="program-search-input">
            <Search size={18} aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by subject, skill, or sector"
            />
          </span>
        </label>
        {showSectorFilter && (
          <label>
            <span>Sector</span>
            <select
              value={sector}
              onChange={(event) => setSector(event.target.value)}
            >
              <option value="">All sectors</option>
              {items
                .filter(
                  (item, index, list) =>
                    list.findIndex(
                      ({ sector: entry }) => entry.slug === item.sector.slug,
                    ) === index,
                )
                .map(({ sector: entry }) => (
                  <option value={entry.slug} key={entry.slug}>
                    {entry.name}
                  </option>
                ))}
            </select>
          </label>
        )}
        <label>
          <span>Subcategory</span>
          <select
            value={focusArea}
            onChange={(event) => setFocusArea(event.target.value)}
          >
            <option value="">All learning topics</option>
            {options.focusAreas.map((entry) => (
              <option key={entry}>{entry}</option>
            ))}
          </select>
        </label>
        <label>
          <span>Format</span>
          <select
            value={format}
            onChange={(event) => setFormat(event.target.value)}
          >
            <option value="">All formats</option>
            {options.formats.map((entry) => (
              <option key={entry}>{entry}</option>
            ))}
          </select>
        </label>
        <label>
          <span>Duration</span>
          <select
            value={duration}
            onChange={(event) => setDuration(event.target.value)}
          >
            <option value="">All durations</option>
            {options.durations.map((entry) => (
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
            {options.audiences.map((entry) => (
              <option key={entry}>{entry}</option>
            ))}
          </select>
        </label>
      </div>
      <div className="program-catalog-results">
        <p className="result-count" role="status">
          {results.length} {results.length === 1 ? "program" : "programs"} found
        </p>
        <button
          className="program-filter-clear"
          type="button"
          onClick={clearFilters}
        >
          <X size={15} aria-hidden="true" /> Clear filters
        </button>
      </div>
      {results.length ? (
        <div className="program-card-grid">
          {results.map(
            ({
              href,
              status,
              availabilityStatus,
              sector: entry,
              subject,
              formats,
            }) => (
              <article className="program-card" key={href}>
                <div className="row-between">
                  <span className="eyebrow small">{entry.name}</span>
                  <span className="program-status">{status}</span>
                </div>
                <h3>
                  <Link href={href}>{subject.title}</Link>
                </h3>
                <p className="muted">{subject.summary}</p>
                <div className="program-card-detail">
                  <h4>Learning focus</h4>
                  <ul>
                    {subject.focusAreas.slice(0, 3).map((focus) => (
                      <li key={focus}>{focus}</li>
                    ))}
                  </ul>
                </div>
                <p className="program-card-formats">
                  Formats:{" "}
                  {[...new Set(formats.map(({ category }) => category))].join(
                    " · ",
                  )}
                </p>
                <p className="program-status">
                  Availability: {availabilityStatus}; confirm by enquiry
                </p>
                <div
                  className="program-duration-list"
                  aria-label="Available durations"
                >
                  {[...new Set(formats.map(({ duration }) => duration))].map(
                    (entry) => (
                      <span className="program-duration-chip" key={entry}>
                        {entry}
                      </span>
                    ),
                  )}
                </div>
                <Link className="text-link" href={href}>
                  View syllabus <ArrowUpRight size={16} aria-hidden="true" />
                </Link>
              </article>
            ),
          )}
        </div>
      ) : (
        <p className="program-empty-state">
          No programs match these filters. Try a broader search or clear the
          filters.
        </p>
      )}
    </div>
  );
}
