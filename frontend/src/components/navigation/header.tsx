"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Menu, X, Sun, Moon, ArrowUpRight } from "lucide-react";
import { navigation } from "@/data/navigation";
import { blogCategories } from "@/data/blogPosts";
import { serviceCategories, services } from "@/data/services";
import { sectors } from "@/data/sectors";
import { site } from "@/data/site";
import { useTheme } from "@/hooks/useTheme";
import { IconButton } from "@/components/ui/primitives";
import { slugify } from "@/lib/formatting";
import { AuthModal } from "@/components/auth/auth-modal";

function ThemeToggle() {
  const { resolvedTheme, toggleTheme } = useTheme();
  const nextTheme = resolvedTheme === "dark" ? "light" : "dark";
  const NextThemeIcon = nextTheme === "dark" ? Moon : Sun;
  return (
    <IconButton
      className="theme-toggle"
      label="Dark theme"
      title={`Switch to ${nextTheme} theme`}
      aria-pressed={resolvedTheme === "dark"}
      onClick={toggleTheme}
    >
      <NextThemeIcon size={18} aria-hidden="true" />
    </IconButton>
  );
}
export function Header() {
  const pathname = usePathname();
  const [authView, setAuthView] = useState<"login" | "register" | null>(null);
  const drawer = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const programsDropdown = useRef<HTMLDetailsElement>(null);
  const servicesDropdown = useRef<HTMLDetailsElement>(null);
  const blogDropdown = useRef<HTMLDetailsElement>(null);
  const mobileProgramsDropdown = useRef<HTMLDetailsElement>(null);
  const mobileServicesDropdown = useRef<HTMLDetailsElement>(null);
  const mobileBlogDropdown = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    const dialog = drawer.current;
    const handleClose = () => {
      document.body.style.overflow = "";
      trigger.current?.focus();
    };
    dialog?.addEventListener("close", handleClose);
    return () => {
      dialog?.removeEventListener("close", handleClose);
      document.body.style.overflow = "";
    };
  }, []);
  function closeNavigation() {
    drawer.current?.close();
    if (programsDropdown.current) programsDropdown.current.open = false;
    if (servicesDropdown.current) servicesDropdown.current.open = false;
    if (blogDropdown.current) blogDropdown.current.open = false;
    if (mobileProgramsDropdown.current)
      mobileProgramsDropdown.current.open = false;
    if (mobileServicesDropdown.current)
      mobileServicesDropdown.current.open = false;
    if (mobileBlogDropdown.current) mobileBlogDropdown.current.open = false;
  }
  const active = (href: string) =>
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`);
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link className="brand" href="/" aria-label={`${site.name}, home`}>
          <Image
            className="brand-logo"
            src="/images/PAI.png"
            alt=""
            width={502}
            height={198}
            priority
          />
          <span className="brand-name">
            {site.name}
            <small>{site.title}</small>
          </span>
        </Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          {navigation.map((item) =>
            item.href === "/programs" ? (
              <details
                ref={programsDropdown}
                className="nav-dropdown programs-nav-dropdown"
                key={item.href}
                onKeyDown={(event) => {
                  if (event.key === "Escape") {
                    event.currentTarget.open = false;
                    event.currentTarget.querySelector("summary")?.focus();
                  }
                }}
                onBlur={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget))
                    event.currentTarget.open = false;
                }}
              >
                <summary className={active(item.href) ? "active" : ""}>
                  Programs
                </summary>
                <div className="dropdown-content programs-mega-menu">
                  <Link
                    className="programs-mega-all"
                    href="/programs"
                    onClick={closeNavigation}
                  >
                    All Programs <ArrowUpRight size={14} aria-hidden="true" />
                  </Link>
                  <div className="programs-mega-grid">
                    {sectors.map((sector) => (
                      <Link
                        href={`/programs/${sector.slug}`}
                        key={sector.id}
                        onClick={closeNavigation}
                      >
                        <span>{sector.name}</span>
                        <small>{sector.subjects.length} subjects</small>
                      </Link>
                    ))}
                  </div>
                </div>
              </details>
            ) : item.href === "/services" ? (
              <details
                ref={servicesDropdown}
                className="nav-dropdown services-nav-dropdown"
                key={item.href}
                onKeyDown={(event) => {
                  if (event.key === "Escape") {
                    event.currentTarget.open = false;
                    event.currentTarget.querySelector("summary")?.focus();
                  }
                }}
                onBlur={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget))
                    event.currentTarget.open = false;
                }}
              >
                <summary className={active(item.href) ? "active" : ""}>
                  Services
                </summary>
                <div className="dropdown-content programs-mega-menu services-mega-menu">
                  <Link
                    className="programs-mega-all"
                    href="/services"
                    onClick={closeNavigation}
                  >
                    All Services <ArrowUpRight size={14} aria-hidden="true" />
                  </Link>
                  <div className="services-mega-grid">
                    {serviceCategories.map((category) => (
                      <Link
                        key={category}
                        onClick={closeNavigation}
                        href={`/services/category/${slugify(category)}`}
                      >
                        <small>
                          {
                            services.filter(
                              (service) => service.category === category,
                            ).length
                          }{" "}
                          services
                        </small>
                        <span>{category}</span>
                        <p>Explore services in {category.toLowerCase()}.</p>
                      </Link>
                    ))}
                  </div>
                </div>
              </details>
            ) : item.href === "/blog" ? (
              <details
                ref={blogDropdown}
                className="nav-dropdown blog-nav-dropdown"
                key={item.href}
                onKeyDown={(event) => {
                  if (event.key === "Escape") {
                    event.currentTarget.open = false;
                    event.currentTarget.querySelector("summary")?.focus();
                  }
                }}
                onBlur={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget))
                    event.currentTarget.open = false;
                }}
              >
                <summary className={active(item.href) ? "active" : ""}>
                  Blog
                </summary>
                <div className="dropdown-content programs-mega-menu blog-mega-menu">
                  <Link
                    className="programs-mega-all"
                    href="/blog"
                    onClick={closeNavigation}
                  >
                    All articles <ArrowUpRight size={14} aria-hidden="true" />
                  </Link>
                  <div className="blog-mega-grid">
                    {blogCategories.map((category) => (
                      <Link
                        href={`/blog/category/${slugify(category)}`}
                        key={category}
                        onClick={closeNavigation}
                      >
                        <span>{category}</span>
                        <small>Explore articles</small>
                      </Link>
                    ))}
                  </div>
                </div>
              </details>
            ) : (
              <Link
                aria-current={active(item.href) ? "page" : undefined}
                className={active(item.href) ? "active" : ""}
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>
        <div className="header-actions">
          <a
            className="portal-nav-link"
            href={process.env.NEXT_PUBLIC_DEMO_PORTAL_URL || "/demo/login"}
            target="_blank"
            rel="noopener noreferrer"
          >
            Demo
          </a>
          <ThemeToggle />
          <button
            className="auth-header-link"
            type="button"
            onClick={() => setAuthView("login")}
          >
            Sign in
          </button>
          <Link className="header-cta" href="/request-proposal">
            Let&apos;s work together
            <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
          <button
            ref={trigger}
            className="icon-button mobile-trigger"
            aria-label="Open navigation"
            aria-haspopup="dialog"
            onClick={() => {
              drawer.current?.showModal();
              document.body.style.overflow = "hidden";
            }}
          >
            <Menu size={23} />
          </button>
        </div>
        <dialog
          ref={drawer}
          className="mobile-drawer"
          aria-labelledby="mobile-title"
          onClick={(event) => {
            if (event.target === event.currentTarget) closeNavigation();
          }}
        >
          <div className="drawer-inner">
            <div className="row-between">
              <h2 id="mobile-title">Navigation</h2>
              <IconButton label="Close navigation" onClick={closeNavigation}>
                <X size={22} />
              </IconButton>
            </div>
            <nav aria-label="Mobile navigation">
              {navigation.map((item) =>
                item.href === "/programs" ? (
                  <details
                    className="mobile-sector-list"
                    key={item.href}
                    ref={mobileProgramsDropdown}
                  >
                    <summary
                      aria-current={active(item.href) ? "page" : undefined}
                    >
                      {item.label}
                    </summary>
                    <div>
                      <Link href="/programs" onClick={closeNavigation}>
                        All Programs
                        <ArrowUpRight size={16} aria-hidden="true" />
                      </Link>
                      {sectors.map((sector) => (
                        <Link
                          href={`/programs/${sector.slug}`}
                          key={sector.id}
                          onClick={closeNavigation}
                        >
                          {sector.name}
                          <span>{sector.subjects.length} subjects</span>
                        </Link>
                      ))}
                    </div>
                  </details>
                ) : item.href === "/services" ? (
                  <details
                    className="mobile-sector-list"
                    key={item.href}
                    ref={mobileServicesDropdown}
                  >
                    <summary
                      aria-current={active(item.href) ? "page" : undefined}
                    >
                      {item.label}
                    </summary>
                    <div>
                      <Link href="/services" onClick={closeNavigation}>
                        All Services
                        <ArrowUpRight size={16} aria-hidden="true" />
                      </Link>
                      {serviceCategories.map((category) => (
                        <Link
                          href={`/services/category/${slugify(category)}`}
                          key={category}
                          onClick={closeNavigation}
                        >
                          {category}
                          <span>
                            {
                              services.filter(
                                (service) => service.category === category,
                              ).length
                            }{" "}
                            services
                          </span>
                        </Link>
                      ))}
                    </div>
                  </details>
                ) : item.href === "/blog" ? (
                  <details
                    className="mobile-sector-list"
                    key={item.href}
                    ref={mobileBlogDropdown}
                  >
                    <summary
                      aria-current={active(item.href) ? "page" : undefined}
                    >
                      {item.label}
                    </summary>
                    <div>
                      <Link href="/blog" onClick={closeNavigation}>
                        All Articles
                        <ArrowUpRight size={16} aria-hidden="true" />
                      </Link>
                      {blogCategories.map((category) => (
                        <Link
                          href={`/blog/category/${slugify(category)}`}
                          key={category}
                          onClick={closeNavigation}
                        >
                          {category}
                          <span>Explore</span>
                        </Link>
                      ))}
                    </div>
                  </details>
                ) : (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active(item.href) ? "page" : undefined}
                    onClick={closeNavigation}
                  >
                    {item.label}
                    <ArrowUpRight size={18} />
                  </Link>
                ),
              )}
              <a
                href={process.env.NEXT_PUBLIC_DEMO_PORTAL_URL || "/demo/login"}
                target="_blank"
                rel="noopener noreferrer"
                onClick={closeNavigation}
              >
                Demo <ArrowUpRight size={18} />
              </a>
            </nav>
            <Link
              href="/request-proposal"
              className="button button-primary"
              onClick={closeNavigation}
            >
              Let&apos;s work together
              <ArrowUpRight size={16} />
            </Link>
            <div className="auth-mobile-actions">
              <button
                className="button button-secondary"
                type="button"
                onClick={() => {
                  closeNavigation();
                  setAuthView("login");
                }}
              >
                Sign in
              </button>
              <button
                className="button button-primary"
                type="button"
                onClick={() => {
                  closeNavigation();
                  setAuthView("register");
                }}
              >
                Create account
              </button>
            </div>
            <p className="muted text-sm">
              Global perspective. Personal collaboration.
            </p>
          </div>
        </dialog>
      </div>
      {authView && (
        <AuthModal
          open
          initialView={authView}
          onClose={() => setAuthView(null)}
        />
      )}
    </header>
  );
}
