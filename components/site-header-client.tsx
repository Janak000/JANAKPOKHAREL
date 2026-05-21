"use client";

import type { Route } from "next";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

interface NavItem {
  href: string;
  label: string;
}

interface SiteHeaderClientProps {
  navigation: NavItem[];
  siteName: string;
  ctaHref: string;
  ctaLabel: string;
}

export function SiteHeaderClient({ navigation, siteName, ctaHref, ctaLabel }: SiteHeaderClientProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setMenuOpen(false);
        buttonRef.current?.focus();
      }
    }
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <header className="site-header">
      <div className="shell nav-shell">
        <Link className="brand-mark" href="/" aria-label={`${siteName} – Home`}>
          {siteName}
          <span aria-hidden="true">.</span>
        </Link>

        <nav className="site-nav" aria-label="Primary navigation">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href as Route}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="nav-actions">
          <Link className="header-cta" href={ctaHref as Route}>
            {ctaLabel}
          </Link>

          <button
            ref={buttonRef}
            className="mobile-menu-btn"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span className="hamburger-line" aria-hidden="true" />
            <span className="hamburger-line" aria-hidden="true" />
            <span className="hamburger-line" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div
        id="mobile-nav"
        ref={menuRef}
        className={`mobile-nav${menuOpen ? " is-open" : ""}`}
        aria-hidden={!menuOpen}
        role="navigation"
        aria-label="Mobile navigation"
      >
        {navigation.map((item) => (
          <Link
            key={item.href}
            href={item.href as Route}
            onClick={() => setMenuOpen(false)}
            tabIndex={menuOpen ? 0 : -1}
          >
            {item.label}
          </Link>
        ))}
        <Link
          className="button button-primary mobile-cta"
          href={ctaHref as Route}
          onClick={() => setMenuOpen(false)}
          tabIndex={menuOpen ? 0 : -1}
        >
          {ctaLabel}
        </Link>
      </div>
    </header>
  );
              }
