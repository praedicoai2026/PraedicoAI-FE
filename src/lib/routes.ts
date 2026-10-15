import { services } from "@/data/services";
import { solutions } from "@/data/solutions";
import { portfolioProjects } from "@/data/portfolio";
import { caseStudies } from "@/data/caseStudies";
import { courses } from "@/data/courses";
import { events } from "@/data/events";
import { blogPosts, blogCategories } from "@/data/blogPosts";
import { legalPages } from "@/data/legal";
import { slugify } from "./formatting";
export const staticRoutes = [
  "/",
  "/about",
  "/about/experience",
  "/about/education",
  "/about/certifications",
  "/about/speaking",
  "/services",
  "/solutions",
  "/portfolio",
  "/case-studies",
  "/training",
  "/training/courses",
  "/training/workshops",
  "/training/corporate-training",
  "/training/request-training",
  "/events",
  "/blog",
  "/resources",
  "/testimonials",
  "/faq",
  "/contact",
  "/request-proposal",
  "/book-consultation",
  ...Object.keys(legalPages).map((slug) => `/${slug}`),
];
export const allRoutes = [
  ...staticRoutes,
  ...services.map((item) => `/services/${item.slug}`),
  ...solutions.map((item) => `/solutions/${item.slug}`),
  ...portfolioProjects.map((item) => `/portfolio/${item.slug}`),
  ...caseStudies.map((item) => `/case-studies/${item.slug}`),
  ...courses.map((item) => `/training/courses/${item.slug}`),
  ...events.map((item) => `/events/${item.slug}`),
  ...blogPosts.map((item) => `/blog/${item.slug}`),
  ...blogCategories.map((category) => `/blog/category/${slugify(category)}`),
];
