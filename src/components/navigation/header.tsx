"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { Menu, X, Sun, Moon, Monitor, ArrowUpRight } from "lucide-react";
import { navigation } from "@/data/navigation";
import { services } from "@/data/services";
import { site } from "@/data/site";
import { useTheme, type Theme } from "@/hooks/useTheme";
import { IconButton } from "@/components/ui/primitives";

function ThemeToggle() {
  const { theme, changeTheme } = useTheme();
  const options = [
    { value: "light", label: "Light theme", icon: Sun },
    { value: "dark", label: "Dark theme", icon: Moon },
    { value: "system", label: "System theme", icon: Monitor },
  ];
  return (
    <div className="theme-toggle" role="group" aria-label="Color theme">
      {options.map(({ value, label, icon: Icon }) => (
        <IconButton
          key={value}
          label={label}
          aria-pressed={theme === value}
          onClick={() => changeTheme(value as Theme)}
        >
          <Icon size={15} aria-hidden="true" />
        </IconButton>
      ))}
    </div>
  );
}
export function Header() {
  const pathname = usePathname();
  const drawer = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const dropdown = useRef<HTMLDetailsElement>(null);
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
    if (dropdown.current) dropdown.current.open = false;
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
            item.href === "/services" ? (
              <details
                ref={dropdown}
                className="nav-dropdown"
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
                <div className="dropdown-content">
                  <Link href="/services" onClick={closeNavigation}>
                    All services <ArrowUpRight size={14} />
                  </Link>
                  {services.map((service) => (
                    <Link
                      key={service.slug}
                      onClick={closeNavigation}
                      href={`/services/${service.slug}`}
                    >
                      {service.title}
                    </Link>
                  ))}
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
          <ThemeToggle />
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
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active(item.href) ? "page" : undefined}
                  onClick={closeNavigation}
                >
                  {item.label}
                  <ArrowUpRight size={18} />
                </Link>
              ))}
            </nav>
            <Link
              href="/request-proposal"
              className="button button-primary"
              onClick={closeNavigation}
            >
              Let&apos;s work together
              <ArrowUpRight size={16} />
            </Link>
            <p className="muted text-sm">
              Global perspective. Personal collaboration.
            </p>
          </div>
        </dialog>
      </div>
    </header>
  );
}
