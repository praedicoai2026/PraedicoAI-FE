import { services, serviceCategories } from "@/data/services";
import { industries } from "@/data/industries";
import { solutions } from "@/data/solutions";
import { portfolioProjects } from "@/data/portfolio";
import { caseStudies } from "@/data/caseStudies";
import { programs } from "@/data/programs";
import { learningAudiences } from "@/data/learning-audiences";
import { internshipPrograms } from "@/data/internship-programs";
import { allSectorRoutes, sectors } from "@/data/sectors";
import { events } from "@/data/events";
import { productIdeas } from "@/data/products";
import { demos } from "@/data/demos";
import { blogPosts, blogCategories } from "@/data/blogPosts";
import { legalPages } from "@/data/legal";
import { leadCategories } from "@/data/lead-categories";
import { isNoIndexPath } from "@/data/seo-pages";
import { slugify } from "./formatting";
export const staticRoutes = [
  "/",
  "/about",
  "/about/experience",
  "/about/education",
  "/about/certifications",
  "/about/speaking",
  "/services",
  "/industries",
  "/solutions",
  "/portfolio",
  "/case-studies",
  "/programs",
  "/internships",
  "/products",
  "/research",
  "/community",
  "/demos",
  "/events",
  "/blog",
  "/resources",
  "/updates",
  "/testimonials",
  "/faq",
  "/enquiry",
  "/contact",
  "/request-proposal",
  "/book-consultation",
  ...Object.keys(legalPages).map((slug) => `/${slug}`),
];
export const allRoutes = [
  ...staticRoutes,
  ...services.map((item) => `/services/${item.slug}`),
  ...industries.map((industry) => `/industries/${industry.slug}`),
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
  ...learningAudiences.map((audience) => `/learning/${audience.slug}`),
  ...internshipPrograms.map((program) => `/internships/${program.slug}`),
  ...productIdeas.map((product) => `/products/${product.slug}`),
  ...demos.map((demo) => `/demos/${demo.slug}`),
  ...leadCategories.map((item) => `/enquiry/${item.slug}`),
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

export const sitemapRoutes = [...new Set(allRoutes)].filter(
  (path) => !isNoIndexPath(path),
);
