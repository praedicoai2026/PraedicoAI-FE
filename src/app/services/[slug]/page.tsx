import { notFound } from "next/navigation";
import { services, getServiceBySlug } from "@/data/services";
import { ServiceDetailLayout } from "@/components/sections/detail-layouts";
import { pageMetadata } from "@/lib/metadata";
export const dynamicParams = false;
export const generateStaticParams = () =>
  services.map(({ slug }) => ({ slug }));
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const service = getServiceBySlug((await params).slug);
  return service
    ? pageMetadata(service.title, service.summary, `/services/${service.slug}`)
    : {};
}
export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const service = getServiceBySlug((await params).slug);
  if (!service) notFound();
  return <ServiceDetailLayout service={service} />;
}
