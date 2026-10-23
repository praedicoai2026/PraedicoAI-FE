import Link from "next/link";
import Image from "next/image";
import { ArrowUp, ArrowUpRight, Linkedin } from "lucide-react";
import { site } from "@/data/site";
import { socialLinks } from "@/data/navigation";
import { Container, ButtonLink } from "@/components/ui/primitives";

export function SocialLinks() {
  const verifiedLinks = socialLinks.filter((social) => social.href);
  if (!verifiedLinks.length) return null;

  return (
    <div className="social-links">
      {verifiedLinks.map((social) => (
        <a
          key={social.label}
          href={social.href}
          target="_blank"
          rel="noreferrer"
        >
          {social.label === "LinkedIn" && (
            <Linkedin size={15} aria-hidden="true" />
          )}
          {social.label}
          <ArrowUpRight size={14} />
        </a>
      ))}
    </div>
  );
}
export function PreFooterCTA() {
  return (
    <section className="prefooter">
      <Container>
        <div>
          <p className="eyebrow">Make the next step a thoughtful one</p>
          <h2>
            Have something in mind?
            <br />
            Let&apos;s talk it through.
          </h2>
          <p>
            Technology, learning, or a new digital direction. Start with a
            conversation.
          </p>
        </div>
        <div className="cta-stack">
          <ButtonLink href="/contact">Start a conversation</ButtonLink>
          <ButtonLink href="/programs" secondary>
            Browse programs
          </ButtonLink>
          <ButtonLink href="/portfolio" secondary>
            View portfolio
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
const groups = [
  {
    title: "Expertise",
    links: [
      ["All services", "/services"],
      ["Software development", "/services/software-development"],
      ["AI & workflows", "/services/ai-agents"],
      ["Technology consulting", "/services/technology-consulting"],
      ["Digital growth", "/services/digital-marketing"],
    ],
  },
  {
    title: "Solutions",
    links: [
      ["Startups", "/solutions/startups"],
      ["Enterprises", "/solutions/enterprises"],
      ["Professionals", "/solutions/professionals"],
      ["Students", "/solutions/students"],
      ["Institutions", "/solutions/educational-institutions"],
      ["Manufacturing", "/solutions/manufacturing"],
    ],
  },
  {
    title: "Learn & explore",
    links: [
      ["Programs", "/programs"],
      ["Journal", "/blog"],
      ["Resources", "/resources"],
      ["Events", "/events"],
    ],
  },
  {
    title: "Connect",
    links: [
      ["About PraedicoAI", "/about"],
      ["Portfolio", "/portfolio"],
      ["Case studies", "/case-studies"],
      ["Speaking", "/about/speaking"],
      ["Customer stories", "/testimonials"],
      ["Contact", "/contact"],
      ["FAQ", "/faq"],
    ],
  },
];
export function Footer() {
  return (
    <footer className="site-footer">
      <Container>
        <div className="footer-top">
          <div>
            <Link
              href="/"
              className="footer-brand"
              aria-label={`${site.name}, home`}
            >
              <Image
                className="footer-brand-logo"
                src="/images/PAI.png"
                alt={site.name}
                width={502}
                height={198}
              />
            </Link>
            <p className="muted">{site.title}</p>
            <p className="global-note">
              Project scope and timing are agreed individually.
            </p>
            <SocialLinks />
            {site.contactEmailConfigured && (
              <p className="text-sm break-anywhere">
                Contact: {site.contactEmail}
              </p>
            )}
          </div>
          {groups.map((group) => (
            <nav key={group.title} aria-label={group.title}>
              <h3>{group.title}</h3>
              {group.links.map(([label, href]) => (
                <Link key={href} href={href}>
                  {label}
                </Link>
              ))}
            </nav>
          ))}
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} {site.name}. {site.title}
          </span>
          <nav aria-label="Legal">
            {["Privacy", "Terms", "Cookies", "Accessibility"].map((label) => (
              <Link key={label} href={`/${label.toLowerCase()}`}>
                {label}
              </Link>
            ))}
          </nav>
          <a
            href="#top"
            className="icon-button"
            aria-label="Back to top"
            title="Back to top"
          >
            <ArrowUp size={18} />
          </a>
        </div>
      </Container>
    </footer>
  );
}
