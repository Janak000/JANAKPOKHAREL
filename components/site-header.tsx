import type { Route } from "next";
import Link from "next/link";

import { getSiteContent } from "@/lib/site-content";

export async function SiteHeader() {
  const { navigation, site } = await getSiteContent();

  return (
    <header className="site-header">
      <div className="shell nav-shell">
        <Link className="brand-mark" href="/">
          {site.shortName}
          <span>.</span>
        </Link>

        <nav className="site-nav" aria-label="Primary">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href as Route}>
              {item.label}
            </Link>
          ))}
        </nav>

        <Link className="header-cta" href="/#contact">
          Let&apos;s Talk
        </Link>
      </div>
    </header>
  );
}
