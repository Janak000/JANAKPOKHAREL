import type { Route } from "next";
import Link from "next/link";

import { getSiteContent } from "@/lib/site-content";

export async function SiteFooter() {
  const { contact, navigation, site } = await getSiteContent();

  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div className="footer-brand">
          <Link className="brand-mark" href="/">
            {site.shortName}
            <span>.</span>
          </Link>
          <p>{site.tagline}</p>
        </div>

        <div>
          <h3>Explore</h3>
          <ul className="footer-links">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link href={item.href as Route}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3>Contact</h3>
          <ul className="footer-links">
            <li>
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </li>
            <li>
              <a href={`tel:${site.phone}`}>{site.phone}</a>
            </li>
            <li>{site.location}</li>
          </ul>
        </div>
      </div>

      <div className="shell footer-meta">
        <p>{site.name}. All rights reserved.</p>
        <p>{contact.footerNote}</p>
      </div>
    </footer>
  );
}
