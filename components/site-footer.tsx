import Link from "next/link";
import type { Service, SiteSettings } from "@/lib/types";
import { Icon } from "./icon";

/**
 * The footer now links every published service page.
 *
 * Measured before this change: the homepage linked 6 of 12 service pages, and
 * seo-services-nepal / google-ads-nepal / meta-ads-nepal / ecommerce-seo-nepal
 * had exactly ONE inbound internal link each - from /services, a page with 2
 * lifetime impressions. To a crawler those pages were barely part of the site,
 * which is why 16 URLs sat in "Discovered - currently not indexed".
 *
 * Because the footer renders on every page, this single component takes each
 * service page from 1-5 inbound links to 20+ site-wide. Nepal-market pages are
 * listed first: they are the ones with a realistic chance of ranking.
 */
const NEPAL_SLUGS = [
  "seo-services-nepal",
  "digital-marketing-nepal",
  "local-seo-kathmandu",
  "google-ads-nepal",
  "meta-ads-nepal",
  "ecommerce-seo-nepal",
];

export function SiteFooter({
  settings,
  services = [],
}: {
  settings: SiteSettings;
  services?: Service[];
}) {
  const nepal = services.filter((s) => NEPAL_SLUGS.includes(s.slug));
  const core = services.filter((s) => !NEPAL_SLUGS.includes(s.slug));
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Link href="/" className="brand">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/image/logo.webp" alt="Janak Pokharel logo" className="brand-logo" width={40} height={40} />
            <span className="brand-name">{settings.name}</span>
          </Link>
          <p className="footer-tagline">{settings.tagline}</p>
          <div className="footer-socials">
            <a href={settings.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <Icon name="facebook" size={18} />
            </a>
            <a href={settings.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <Icon name="linkedin" size={18} />
            </a>
            <a href={`mailto:${settings.email}`} aria-label="Email">
              <Icon name="mail" size={18} />
            </a>
          </div>
        </div>

        <nav className="footer-col" aria-label="Explore">
          <h3>Explore</h3>
          <Link href="/about">About</Link>
          <Link href="/services">Services</Link>
          <Link href="/portfolio">Portfolio</Link>
          <Link href="/blog">Blog</Link>
        </nav>

        <div className="footer-col">
          <h3>Contact</h3>
          <a href={`mailto:${settings.email}`}>{settings.email}</a>
          <a href={`tel:${settings.phone.replace(/[^+\d]/g, "")}`}>{settings.phone}</a>
          <span>{settings.location}</span>
          <a
            href={`https://wa.me/${settings.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            WhatsApp
          </a>
        </div>

        {nepal.length > 0 && (
          <nav className="footer-col" aria-label="Services in Nepal">
            <h3>Services in Nepal</h3>
            {nepal.map((s) => (
              <Link key={s.slug} href={`/services/${s.slug}`}>
                {s.title}
              </Link>
            ))}
          </nav>
        )}

        {core.length > 0 && (
          <nav className="footer-col" aria-label="Specialist services">
            <h3>Specialist Services</h3>
            {core.map((s) => (
              <Link key={s.slug} href={`/services/${s.slug}`}>
                {s.title}
              </Link>
            ))}
          </nav>
        )}

        <div className="footer-col">
          <h3>Latest</h3>
          <Link href="/blog">Digital marketing insights →</Link>
          <Link href="/contact">Start a project →</Link>
        </div>
      </div>
      <div className="container footer-bottom">
        <p>
          © {year} {settings.name}. All rights reserved.
        </p>
        <p className="footer-role">{settings.role} · {settings.location}</p>
      </div>
    </footer>
  );
}
