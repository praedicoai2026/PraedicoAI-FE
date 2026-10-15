import type { NavigationItem, SocialLink } from "@/types/content";
export const navigation: NavigationItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Solutions", href: "/solutions" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Training", href: "/training" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];
export const aboutNavigation: NavigationItem[] = [
  { label: "Overview", href: "/about" },
  { label: "Experience", href: "/about/experience" },
  { label: "Education", href: "/about/education" },
  { label: "Certifications", href: "/about/certifications" },
  { label: "Speaking", href: "/about/speaking" },
];
export const socialLinks: SocialLink[] = [
  { label: "LinkedIn" },
  { label: "YouTube" },
  { label: "Instagram" },
];
