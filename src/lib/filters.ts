import type { BlogPost, CatalogItem, PortfolioProject } from "@/types/content";
export interface CatalogFilters {
  query: string;
  selected: Record<string, string>;
}
export function filterItems<T extends CatalogItem>(
  items: T[],
  filters: CatalogFilters,
): T[] {
  const query = filters.query.trim().toLowerCase();
  return items.filter((item) => {
    const searchable =
      `${item.title} ${item.summary} ${item.category} ${item.tags.join(" ")}`.toLowerCase();
    return (
      searchable.includes(query) &&
      Object.entries(filters.selected).every(([key, value]) => {
        if (!value) return true;
        const field =
          key === "technology" || key === "tag"
            ? item.tags
            : item[key as keyof T];
        return Array.isArray(field) ? field.includes(value) : field === value;
      })
    );
  });
}
export const filterPortfolioProjects = (
  items: PortfolioProject[],
  filters: CatalogFilters,
) => filterItems(items, filters);
export const filterBlogPosts = (items: BlogPost[], filters: CatalogFilters) =>
  filterItems(items, filters);
