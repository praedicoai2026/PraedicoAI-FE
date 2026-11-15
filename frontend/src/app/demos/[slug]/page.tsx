import { notFound } from "next/navigation";
import { DemoDetailPage } from "@/components/sections/demo-center-pages";
import { demos, getDemo } from "@/data/demos";
import { pageMetadata } from "@/lib/metadata";

export const dynamicParams = false;
export const generateStaticParams = () => demos.map(({ slug }) => ({ slug }));

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const demo = getDemo((await params).slug);
  return demo
    ? pageMetadata(demo.title, demo.summary, `/demos/${demo.slug}`)
    : {};
}

export default async function DemoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const demo = getDemo((await params).slug);
  if (!demo) notFound();
  return <DemoDetailPage demo={demo} />;
}
