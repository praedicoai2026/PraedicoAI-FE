import { notFound } from "next/navigation";
import { ProductIdeaPage } from "@/components/sections/ecosystem-pages";
import { getProductIdea, productIdeas } from "@/data/products";
import { pageMetadata } from "@/lib/metadata";

export const dynamicParams = false;
export const generateStaticParams = () =>
  productIdeas.map(({ slug }) => ({ slug }));

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const product = getProductIdea((await params).slug);
  return product
    ? pageMetadata(product.title, product.summary, `/products/${product.slug}`)
    : {};
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const product = getProductIdea((await params).slug);
  if (!product) notFound();
  return <ProductIdeaPage product={product} />;
}
