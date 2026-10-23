import { events, eventTypes } from "@/data/events";
import { CatalogPage, optionsFor } from "@/components/sections/catalog-page";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "Events",
  "Explore proposed conversations and workshop concepts on applied AI, responsible adoption, workflow design, and software architecture.",
  "/events",
);
export default function EventsPage() {
  return (
    <CatalogPage
      title="A space for shared ideas."
      description="Illustrative event concepts only. Dates and formats are not scheduled, and no registration or recording is available."
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
