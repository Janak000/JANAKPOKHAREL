import type { Metadata } from "next";
import Link from "next/link";
import { getServices, getSettings, absoluteUrl } from "@/lib/cms";
import { Icon } from "@/components/icon";
import { JsonLd } from "@/components/json-ld";

export const revalidate = 120;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    title: "SEO & Digital Marketing Services",
    description: `Explore ${settings.name}'s services: advanced SEO, Meta Ads, Google Ads, technical SEO, CRO, and programmatic advertising for growing businesses.`,
    alternates: { canonical: "/services" },
    openGraph: {
      title: `Services | ${settings.name}`,
      url: absoluteUrl("/services"),
    },
  };
}

export default async function ServicesPage() {
  const [settings, services] = await Promise.all([getSettings(), getServices()]);

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "Services", item: absoluteUrl("/services") },
    ],
  };

  const servicesLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: services.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Service",
        name: s.title,
        description: s.shortDescription,
        url: absoluteUrl(`/services/${s.slug}`),
        provider: { "@id": `${absoluteUrl("/")}#person` },
        areaServed: "Worldwide",
      },
    })),
  };

  return (
    <>
      <JsonLd data={breadcrumbLd} />
      <JsonLd data={servicesLd} />
      <section className="page-hero">
        <div className="container">
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span className="sep">/</span>
            <span>Services</span>
          </nav>
          <p className="kicker">Services</p>
          <h1>Growth services that pay for themselves</h1>
          <p>
            Every service below is built around one goal: turning search visibility
            and paid traffic into measurable revenue for your business.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 24 }}>
        <div className="container">
          <div className="card-grid">
            {services.map((service) => (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className="card"
              >
                <div className="card-icon">
                  <Icon name={service.icon} size={24} />
                </div>
                <h3>{service.title}</h3>
                <p>{service.shortDescription}</p>
                <span className="text-link">
                  View details <Icon name="arrow-right" size={15} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="cta-band">
            <h2>Not sure which service you need?</h2>
            <p>
              Tell me about your business and goals, I&apos;ll recommend the channel mix
              with the fastest path to results, honestly.
            </p>
            <div className="hero-actions" style={{ justifyContent: "center" }}>
              <Link href="/contact" className="btn btn-primary btn-lg">
                Get a Free Recommendation <Icon name="arrow-right" size={18} />
              </Link>
              <a
                href={`https://wa.me/${settings.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost btn-lg"
              >
                <Icon name="message-circle" size={18} /> WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
