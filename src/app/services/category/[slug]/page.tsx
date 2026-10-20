import { notFound } from "next/navigation";
import { PageHero } from "@/components/sections/shared";
import { ServiceCatalog } from "@/components/sections/service-catalog";
import { services, serviceCategories } from "@/data/services";
import { slugify } from "@/lib/formatting";
import { pageMetadata } from "@/lib/metadata";

export const dynamicParams = false;

export const generateStaticParams = () =>
  serviceCategories.map((category) => ({ slug: slugify(category) }));

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = serviceCategories.find((item) => slugify(item) === slug);
  return category
    ? pageMetadata(
        `${category} Services`,
        `Explore services and practical support across ${category.toLowerCase()}.`,
        `/services/category/${slug}`,
      )
    : {};
}

export default async function ServiceCategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = serviceCategories.find((item) => slugify(item) === slug);
  if (!category) notFound();

  return (
    <>
      <PageHero
        title={`${category} Services`}
        description={`Explore our ${category.toLowerCase()} services, then narrow the collection by capability or audience.`}
        eyebrow="Services by category"
        path={`/services/category/${slug}`}
      />
      <section className="section">
        <div className="container">
          <ServiceCatalog
            key={category}
            services={services}
            categories={serviceCategories}
            initialCategory={category}
          />
        </div>
      </section>
    </>
  );
}
