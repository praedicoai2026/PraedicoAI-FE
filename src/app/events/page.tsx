import { events, eventTypes } from "@/data/events";
import { CatalogPage, optionsFor } from "@/components/sections/catalog-page";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "Events",
  "Sample upcoming and past webinars, workshops, speaking sessions, and learning events.",
  "/events",
);
export default function EventsPage() {
  return (
    <CatalogPage
      title="A space for shared ideas."
      description="Sample upcoming and past event entries. Dates, formats, and recording availability are placeholders, not confirmed announcements."
      eyebrow="Events & speaking"
      basePath="/events"
      items={events}
      filters={[
        { key: "status", label: "Periods", options: ["Upcoming", "Past"] },
        { key: "type", label: "Event types", options: eventTypes },
        { key: "topic", label: "Topics", options: optionsFor(events, "topic") },
        {
          key: "mode",
          label: "Delivery modes",
          options: ["Online", "In-person"],
        },
      ]}
    />
  );
}
