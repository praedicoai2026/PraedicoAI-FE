import type { NavigationItem, SocialLink } from "@/types/content";
export const navigation: NavigationItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Solutions", href: "/solutions" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Programs", href: "/programs" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];
export const aboutNavigation: NavigationItem[] = [
  { label: "Overview", href: "/about" },
  { label: "How We Work", href: "/about/experience" },
  { label: "Learning", href: "/about/education" },
  { label: "Responsible AI", href: "/about/certifications" },
  { label: "Speaking", href: "/about/speaking" },
];
export const socialLinks: SocialLink[] = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/priyank-gupta-586764244/",
  },
  { label: "YouTube" },
  { label: "Instagram" },
];
