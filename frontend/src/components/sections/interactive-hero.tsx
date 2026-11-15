import Link from "next/link";
import {
  ArrowUpRight,
  BrainCircuit,
  GraduationCap,
  Network,
  Sparkles,
  Workflow,
} from "lucide-react";
import { Container } from "@/components/ui/primitives";

export function InteractiveHero() {
  return (
    <section className="home-hero" aria-labelledby="hero-heading">
      <Container className="home-hero-layout">
        <div className="home-hero-copy">
          <p className="hero-kicker">
            AI Solutions · AI Learning · Internships
          </p>
          <h1 id="hero-heading">
            Transform Your Business. Empower Your Future with AI.
          </h1>
          <p className="home-hero-description">
            From intelligent business automation to practical AI education,
            PraedicoAI helps organizations, professionals and students unlock
            the power of artificial intelligence.
          </p>
          <div className="home-hero-actions">
            <Link className="button button-primary" href="/services">
              Explore AI Solutions
              <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
            <Link className="button button-secondary" href="/programs">
              Explore AI Training
              <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
          </div>
          <p className="home-hero-note">
            Practical business solutions. Hands-on learning for what comes next.
          </p>
        </div>

        <div className="hero-visual" aria-hidden="true">
          <div className="hero-visual-glow" />
          <div className="hero-visual-orbit hero-visual-orbit-outer" />
          <div className="hero-visual-orbit hero-visual-orbit-inner" />
          <div className="hero-visual-node hero-visual-node-top">
            <Sparkles size={17} />
          </div>
          <div className="hero-visual-node hero-visual-node-right">
            <Network size={17} />
          </div>
          <div className="hero-visual-node hero-visual-node-bottom">
            <Workflow size={17} />
          </div>
          <div className="hero-visual-core">
            <BrainCircuit size={45} strokeWidth={1.5} />
            <span>Applied AI</span>
          </div>
          <div className="hero-visual-card hero-visual-card-solutions">
            <span className="hero-visual-card-icon">
              <Workflow size={18} />
            </span>
            <span>
              <strong>AI Solutions</strong>
              <small>Automate · Analyze · Build</small>
            </span>
          </div>
          <div className="hero-visual-card hero-visual-card-learning">
            <span className="hero-visual-card-icon">
              <GraduationCap size={19} />
            </span>
            <span>
              <strong>AI Learning</strong>
              <small>Learn · Practice · Grow</small>
            </span>
          </div>
          <div className="hero-visual-caption">
            <span />
            People at the center of progress
          </div>
        </div>
      </Container>
    </section>
  );
}
