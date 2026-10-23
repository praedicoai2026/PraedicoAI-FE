"use client";
import { useDeferredValue, useState } from "react";
import { Search, RotateCcw } from "lucide-react";
import type { CatalogItem } from "@/types/content";
import { filterItems } from "@/lib/filters";
import { ContentCard } from "@/components/cards/content-card";
import { NoResults } from "./primitives";
export interface FilterDefinition {
  key: string;
  label: string;
  options: string[];
}
export function Catalog({
  items,
  basePath,
  filters,
  searchLabel = "Search",
  initialFilters = {},
}: {
  items: CatalogItem[];
  basePath: string;
  filters: FilterDefinition[];
  searchLabel?: string;
  initialFilters?: Record<string, string>;
}) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] =
    useState<Record<string, string>>(initialFilters);
  const deferredQuery = useDeferredValue(query);
  const results = filterItems(items, { query: deferredQuery, selected });
  function reset() {
    setQuery("");
    setSelected({});
  }
  return (
    <div>
      <div className="filter-toolbar">
        <div className="search-field">
          <label htmlFor="catalog-search">{searchLabel}</label>
          <div>
            <Search size={17} aria-hidden="true" />
            <input
              id="catalog-search"
              type="search"
              placeholder="Type a keyword..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
        </div>
        {filters.map((filter) => (
          <div className="filter-field" key={filter.key}>
            <label htmlFor={`filter-${filter.key}`}>{filter.label}</label>
            <select
              id={`filter-${filter.key}`}
              value={selected[filter.key] ?? ""}
              onChange={(event) =>
                setSelected({ ...selected, [filter.key]: event.target.value })
              }
            >
              <option value="">All {filter.label.toLowerCase()}</option>
              {filter.options.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>
        ))}
        <button
          className="icon-button reset-filters"
          onClick={reset}
          title="Reset filters"
          aria-label="Reset filters"
        >
          <RotateCcw size={18} />
        </button>
      </div>
      <p className="result-count" role="status" aria-live="polite">
        {results.length} {results.length === 1 ? "result" : "results"}
        {query !== deferredQuery ? " · Updating" : ""}
      </p>
      {results.length ? (
        <div className="grid-three">
          {results.map((item) => (
            <ContentCard key={item.slug} item={item} basePath={basePath} />
          ))}
        </div>
      ) : (
        <NoResults reset={reset} />
      )}
    </div>
  );
}
