import { notFound } from "next/navigation";
import { events, getEventBySlug } from "@/data/events";
import { EventDetailLayout } from "@/components/sections/detail-layouts";
import { pageMetadata } from "@/lib/metadata";
export const dynamicParams = false;
export const generateStaticParams = () => events.map(({ slug }) => ({ slug }));
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const item = getEventBySlug((await params).slug);
  return item
    ? pageMetadata(item.title, item.summary, `/events/${item.slug}`, item.image)
    : {};
}
export default async function EventPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const event = getEventBySlug((await params).slug);
  if (!event) notFound();
  return <EventDetailLayout event={event} />;
}
