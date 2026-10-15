"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type KeyboardEvent } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import {
  ArrowDown,
  ArrowUpRight,
  BrainCircuit,
  Globe2,
  GraduationCap,
  Layers3,
} from "lucide-react";
import { focusAreas } from "@/data/home";
import { site } from "@/data/site";
import { Container } from "@/components/ui/primitives";

const focusIcons = [Layers3, BrainCircuit, GraduationCap];

export function InteractiveHero() {
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();
  const horizontal = useMotionValue(0);
  const vertical = useMotionValue(0);
  const translateX = useSpring(horizontal, { stiffness: 65, damping: 25 });
  const translateY = useSpring(vertical, { stiffness: 65, damping: 25 });
  const focus = focusAreas[active];

  function navigateTabs(
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) {
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % focusAreas.length;
    else if (event.key === "ArrowLeft")
      next = (index - 1 + focusAreas.length) % focusAreas.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = focusAreas.length - 1;
    else return;
    event.preventDefault();
    setActive(next);
    document.getElementById(`focus-tab-${next}`)?.focus();
  }

  return (
    <section
      className="home-hero"
      aria-labelledby="hero-heading"
      onPointerMove={(event) => {
        if (reduced || event.pointerType !== "mouse") return;
        const bounds = event.currentTarget.getBoundingClientRect();
        horizontal.set(
          ((event.clientX - bounds.left) / bounds.width - 0.5) * 22,
        );
        vertical.set(((event.clientY - bounds.top) / bounds.height - 0.5) * 16);
      }}
      onPointerLeave={() => {
        horizontal.set(0);
        vertical.set(0);
      }}
    >
      <motion.div
        className="hero-art"
        aria-hidden="true"
        style={{ x: reduced ? 0 : translateX, y: reduced ? 0 : translateY }}
      >
        {focusAreas.map((area, index) => (
          <Image
            key={area.id}
            src={area.image}
            alt=""
            fill
            priority={index === 0}
            sizes="100vw"
            className={active === index ? "is-visible" : ""}
          />
        ))}
      </motion.div>
      <Container>
        <div className="hero-topline">
          <p className="availability">Open to meaningful collaborations</p>
          <span className="hero-location">
            <Globe2 size={14} /> Worldwide / Remote
          </span>
        </div>
        <div className="hero-main">
          <p className="hero-kicker">
            Independent thinking. Connected solutions.
          </p>
          <h1 id="hero-heading">{site.name}</h1>
          <div className="hero-intro">
            <span className="hero-intro-line" aria-hidden="true" />
            <p>
              {site.title}
              <br />
              <span>Technology. Strategy. Learning.</span>
            </p>
          </div>
        </div>
        <div className="hero-focus">
          <div
            className="focus-tabs"
            role="tablist"
            aria-label="Explore our focus areas"
          >
            {focusAreas.map((area, index) => {
              const Icon = focusIcons[index];
              return (
                <button
                  key={area.id}
                  id={`focus-tab-${index}`}
                  type="button"
                  role="tab"
                  aria-selected={active === index}
                  aria-controls="focus-panel"
                  tabIndex={active === index ? 0 : -1}
                  onClick={() => setActive(index)}
                  onKeyDown={(event) => navigateTabs(event, index)}
                >
                  <Icon size={16} aria-hidden="true" />
                  {area.label}
                </button>
              );
            })}
          </div>
          <div
            id="focus-panel"
            className="focus-panel"
            role="tabpanel"
            aria-labelledby={`focus-tab-${active}`}
            tabIndex={0}
          >
            <motion.div
              key={focus.id}
              initial={false}
              animate={
                reduced
                  ? { opacity: 1, y: 0 }
                  : { opacity: [0.4, 1], y: [10, 0] }
              }
              transition={{ duration: reduced ? 0 : 0.35 }}
            >
              <h2>{focus.title}</h2>
              <p>{focus.description}</p>
              <Link href={focus.href} className="hero-focus-link">
                {focus.action}
                <ArrowUpRight size={18} />
              </Link>
            </motion.div>
          </div>
        </div>
        <div className="hero-bottom">
          <div className="hero-actions">
            <Link className="button button-primary" href="/contact">
              Let&apos;s talk
              <ArrowUpRight size={18} />
            </Link>
            <Link className="hero-work-link" href="/portfolio">
              Selected work
              <ArrowUpRight size={18} />
            </Link>
          </div>
          <div className="hero-experience">
            <strong>AI</strong>
            <span>
              Made practical.
              <br />
              Kept accountable.
            </span>
          </div>
          <a
            className="hero-scroll"
            href="#expertise"
            aria-label="Explore expertise"
            title="Explore expertise"
          >
            <ArrowDown size={20} />
          </a>
        </div>
      </Container>
    </section>
  );
}
