import Link from "next/link";
import { ArrowUpRight, BriefcaseBusiness, GraduationCap } from "lucide-react";
import { Section, SectionHeader } from "@/components/ui/primitives";

const pathways = [
  {
    eyebrow: "AI Solutions for Businesses",
    title: "Turn AI potential into practical progress.",
    description:
      "We help businesses automate operations, improve decision-making and build intelligent applications using AI.",
    points: [
      "AI consulting and strategy",
      "Agents, automation, and integrations",
      "Custom applications and predictive insights",
    ],
    href: "/services",
    label: "Discover Business Solutions",
    Icon: BriefcaseBusiness,
  },
  {
    eyebrow: "AI Learning & Careers",
    title: "Build skills for the future with AI.",
    description:
      "We empower students and professionals with practical AI skills, hands-on projects and internship opportunities.",
    points: [
      "AI training for students and professionals",
      "Industry-specific programs and corporate training",
      "Internship learning and project experience",
    ],
    href: "/programs",
    label: "Explore Learning Programs",
    Icon: GraduationCap,
  },
];

export function HomePathways() {
  return (
    <Section className="home-pathways" id="pathways">
      <SectionHeader
        eyebrow="What we do"
        title="Two ways to move forward with AI."
        description="Whether you are building with AI or building your AI skills, start with the path that matches your goals."
      />
      <div className="home-pathway-grid">
        {pathways.map(
          ({ eyebrow, title, description, points, href, label, Icon }) => (
            <article className="home-pathway-card" key={href}>
              <Icon
                className="home-pathway-icon"
                size={27}
                aria-hidden="true"
              />
              <p className="eyebrow">{eyebrow}</p>
              <h3>{title}</h3>
              <p className="muted">{description}</p>
              <ul>
                {points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
              <Link className="text-link" href={href}>
                {label}
                <ArrowUpRight size={17} aria-hidden="true" />
              </Link>
            </article>
          ),
        )}
      </div>
    </Section>
  );
}
