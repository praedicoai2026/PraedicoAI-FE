import { notFound } from "next/navigation";
import { courses, getCourseBySlug } from "@/data/courses";
import { CourseDetailLayout } from "@/components/sections/detail-layouts";
import { pageMetadata } from "@/lib/metadata";
export const dynamicParams = false;
export const generateStaticParams = () => courses.map(({ slug }) => ({ slug }));
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const item = getCourseBySlug((await params).slug);
  return item
    ? pageMetadata(
        item.title,
        item.summary,
        `/training/courses/${item.slug}`,
        item.image,
      )
    : {};
}
export default async function CoursePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const course = getCourseBySlug((await params).slug);
  if (!course) notFound();
  return <CourseDetailLayout course={course} />;
}
