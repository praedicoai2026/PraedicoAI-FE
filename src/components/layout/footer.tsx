import Link from "next/link";
import { ArrowUp, Globe2, ArrowUpRight } from "lucide-react";
import { site } from "@/data/site";
import { socialLinks } from "@/data/navigation";
import { Container, ButtonLink } from "@/components/ui/primitives";

export function SocialLinks() {
  return (
    <div className="social-links">
      {socialLinks.map((social) =>
        social.href ? (
          <a
            key={social.label}
            href={social.href}
            target="_blank"
            rel="noreferrer"
          >
            {social.label}
            <ArrowUpRight size={14} />
          </a>
        ) : (
          <span key={social.label} title="Add verified profile URL">
            {social.label} <small>(coming soon)</small>
          </span>
        ),
      )}
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
          <ButtonLink href="/training/request-training" secondary>
            Request training
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
      ["Course outlines", "/training/courses"],
      ["Workshops", "/training/workshops"],
      ["Corporate training", "/training/corporate-training"],
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
      ["Sample feedback", "/testimonials"],
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
            <Link href="/" className="footer-brand">
              {site.name}
              <span>.</span>
            </Link>
            <p className="muted">
              Architecture with perspective.
              <br />
              Technology with purpose.
            </p>
            <p className="global-note">
              <Globe2 size={16} aria-hidden="true" />
              Worldwide remote services
            </p>
            <SocialLinks />
            <p className="text-sm break-anywhere">
              Contact: {site.contactEmail}
            </p>
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
            © {new Date().getFullYear()} {site.name}. Applied AI, thoughtfully.
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
