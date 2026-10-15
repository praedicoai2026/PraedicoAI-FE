import type { CatalogItem } from "@/types/content";
import { Section, SectionHeader } from "@/components/ui/primitives";
import { PageHero } from "./shared";
import { Catalog, type FilterDefinition } from "@/components/ui/catalog";
import { ContentCard } from "@/components/cards/content-card";
export function CatalogPage({
  title,
  description,
  eyebrow,
  basePath,
  items,
  filters,
  featured = false,
}: {
  title: string;
  description: string;
  eyebrow: string;
  basePath: string;
  items: CatalogItem[];
  filters: FilterDefinition[];
  featured?: boolean;
}) {
  return (
    <>
      <PageHero
        title={title}
        description={description}
        eyebrow={eyebrow}
        path={basePath}
      />
      {featured && (
        <Section>
          <SectionHeader
            title="Featured perspectives"
            description="A few starting points from the local collection."
          />
          <div className="grid-three">
            {items
              .filter((item) => item.featured)
              .slice(0, 3)
              .map((item) => (
                <ContentCard key={item.slug} item={item} basePath={basePath} />
              ))}
          </div>
        </Section>
      )}
      <Section className={featured ? "section-tinted" : ""}>
        <SectionHeader title="Explore the collection" />
        <Catalog
          items={items}
          basePath={basePath}
          filters={filters}
          searchLabel={`Search ${title.toLowerCase()}`}
        />
      </Section>
    </>
  );
}
export function optionsFor(items: CatalogItem[], key: string): string[] {
  return [
    ...new Set(
      items.flatMap((item) => {
        const value =
          key === "technology" || key === "tag"
            ? item.tags
            : (item as unknown as Record<string, unknown>)[key];
        return Array.isArray(value)
          ? (value as string[])
          : typeof value === "string"
            ? [value]
            : [];
      }),
    ),
  ].sort();
}
