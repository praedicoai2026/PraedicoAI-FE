export interface SiteConfiguration {
  name: string;
  title: string;
  description: string;
  contactEmail: string;
  url: string;
  availability: string;
}
export interface NavigationItem {
  label: string;
  href: string;
}
export interface SocialLink {
  label: string;
  href?: string;
}
export interface FAQ {
  question: string;
  answer: string;
}
export interface ContentSection {
  title: string;
  paragraphs: string[];
  bullets?: string[];
  code?: string;
  callout?: string;
}
export interface CatalogItem {
  slug: string;
  title: string;
  summary: string;
  category: string;
  tags: string[];
  image: string;
  imageAlt: string;
  label: string;
  featured?: boolean;
  sections: ContentSection[];
}
export interface Service extends CatalogItem {
  icon: string;
  audience: string[];
  capabilities: string[];
  challenges: string[];
  deliverables: string[];
  benefits: string[];
  faqs: FAQ[];
}
export interface Solution extends CatalogItem {
  needs: string[];
  serviceSlugs: string[];
}
export interface PortfolioProject extends CatalogItem {
  projectType: string;
  service: string;
  industry: string;
  challenge: string;
}
export interface CaseStudy extends PortfolioProject {
  relatedServices: string[];
}
export interface Experience {
  organization: string;
  role: string;
  dates: string;
  description: string;
}
export interface Education {
  degree: string;
  institution: string;
  subject: string;
  startDate: string;
  completionDate: string;
  description: string;
}
export interface Certification {
  name: string;
  issuer: string;
  date: string;
  credentialId: string;
  credentialLink?: string;
  skills: string[];
  image: string;
}
export interface TrainingCourse extends CatalogItem {
  audience: string;
  level: string;
  topic: string;
  format: string;
  duration: string;
  prerequisites: string[];
  objectives: string[];
  language: string;
  resources: string[];
  faqs: FAQ[];
}
export interface Event extends CatalogItem {
  type: string;
  topic: string;
  mode: string;
  status: "Upcoming" | "Past";
  date: string;
  time: string;
  timeZone: string;
  audience: string[];
  agenda: string[];
  outcomes: string[];
  faqs: FAQ[];
}
export interface BlogPost extends CatalogItem {
  author: string;
  published: string;
  updated: string;
}
export interface Testimonial {
  id: string;
  quote: string;
  attribution: string;
  note: string;
}
export interface Resource extends CatalogItem {
  type: string;
  audience: string;
  download?: string;
}
