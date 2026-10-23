import { notFound } from "next/navigation";
import { PageHero } from "@/components/sections/shared";
import { ServiceCatalog } from "@/components/sections/service-catalog";
import { serviceCategories, services } from "@/data/services";
import { slugify } from "@/lib/formatting";
import { pageMetadata } from "@/lib/metadata";

export const dynamicParams = false;

const serviceCapabilities = serviceCategories.flatMap((category) => {
  const categorySlug = slugify(category);
  const capabilities = [
    ...new Set(
      services
        .filter((service) => service.category === category)
        .flatMap((service) => service.capabilities),
    ),
  ];
  return capabilities.map((capability) => ({
    slug: categorySlug,
    capabilitySlug: slugify(capability),
  }));
});

export const generateStaticParams = () => serviceCapabilities;

async function getCapability({
  slug,
  capabilitySlug,
}: {
  slug: string;
  capabilitySlug: string;
}) {
  const category = serviceCategories.find((item) => slugify(item) === slug);
  if (!category) return null;
  const capability = [
    ...new Set(
      services
        .filter((service) => service.category === category)
        .flatMap((service) => service.capabilities),
    ),
  ].find((item) => slugify(item) === capabilitySlug);
  return capability ? { category, capability } : null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; capabilitySlug: string }>;
}) {
  const resolved = await getCapability(await params);
  return resolved
    ? pageMetadata(
        `${resolved.capability} Services`,
        `Services related to ${resolved.capability} in ${resolved.category}.`,
        `/services/category/${slugify(resolved.category)}/capability/${slugify(resolved.capability)}`,
      )
    : {};
}

export default async function ServiceCapabilityPage({
  params,
}: {
  params: Promise<{ slug: string; capabilitySlug: string }>;
}) {
  const resolved = await getCapability(await params);
  if (!resolved) notFound();

  return (
    <>
      <PageHero
        title={resolved.capability}
        description={`Explore ${resolved.category} services related to ${resolved.capability}.`}
        eyebrow={`${resolved.category} subcategory`}
        path={`/services/category/${slugify(resolved.category)}/capability/${slugify(resolved.capability)}`}
        breadcrumbs={[
          { label: "Services", href: "/services" },
          {
            label: resolved.category,
            href: `/services/category/${slugify(resolved.category)}`,
          },
          { label: "Subcategory" },
          { label: resolved.capability },
        ]}
      />
      <section className="section">
        <div className="container">
          <ServiceCatalog
            key={`${resolved.category}-${resolved.capability}`}
            services={services}
            categories={serviceCategories}
            initialCategory={resolved.category}
            initialCapability={resolved.capability}
          />
        </div>
      </section>
    </>
  );
}
