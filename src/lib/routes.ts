import { services, serviceCategories } from "@/data/services";
import { solutions } from "@/data/solutions";
import { portfolioProjects } from "@/data/portfolio";
import { caseStudies } from "@/data/caseStudies";
import { programs } from "@/data/programs";
import { allSectorRoutes, sectors } from "@/data/sectors";
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
  "/programs",
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
  ...serviceCategories.map(
    (category) => `/services/category/${slugify(category)}`,
  ),
  ...serviceCategories.flatMap((category) =>
    [
      ...new Set(
        services
          .filter((service) => service.category === category)
          .flatMap((service) => service.capabilities),
      ),
    ].map(
      (capability) =>
        `/services/category/${slugify(category)}/capability/${slugify(capability)}`,
    ),
  ),
  ...solutions.map((item) => `/solutions/${item.slug}`),
  ...portfolioProjects.map((item) => `/portfolio/${item.slug}`),
  ...caseStudies.map((item) => `/case-studies/${item.slug}`),
  ...programs.map((program) => `/programs/${program.slug}`),
  ...allSectorRoutes(),
  ...sectors.flatMap((sector) =>
    [...new Set(sector.subjects.flatMap((subject) => subject.focusAreas))].map(
      (topic) => `/programs/${sector.slug}/topic/${slugify(topic)}`,
    ),
  ),
  ...events.map((item) => `/events/${item.slug}`),
  ...blogPosts.map((item) => `/blog/${item.slug}`),
  ...blogCategories.map((category) => `/blog/category/${slugify(category)}`),
  ...blogCategories.flatMap((category) =>
    [
      ...new Set(
        blogPosts
          .filter((post) => post.category === category)
          .flatMap((post) => post.tags),
      ),
    ].map(
      (topic) => `/blog/category/${slugify(category)}/topic/${slugify(topic)}`,
    ),
  ),
];
