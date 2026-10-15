import { courses } from "@/data/courses";
import { CatalogPage, optionsFor } from "@/components/sections/catalog-page";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "Course Outlines",
  "Browse sample course outlines by audience, level, topic, format, and duration.",
  "/training/courses",
);
export default function CoursesPage() {
  return (
    <CatalogPage
      title="Find your next learning step."
      description="Sample outlines, transparent prerequisites, and practical learning objectives. No registration, payment, or confirmed scheduling."
      eyebrow="Course collection"
      basePath="/training/courses"
      items={courses}
      filters={[
        { key: "audience", label: "Audiences" },
        { key: "level", label: "Skill levels" },
        { key: "topic", label: "Topics" },
        { key: "format", label: "Formats" },
        { key: "duration", label: "Durations" },
      ].map((filter) => ({
        ...filter,
        options: optionsFor(courses, filter.key),
      }))}
    />
  );
}
