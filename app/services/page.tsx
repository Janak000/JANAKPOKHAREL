import type { Metadata } from "next";
import Link from "next/link";
import { getServices, getServicesPage, getSettings, absoluteUrl } from "@/lib/cms";
import { Icon } from "@/components/icon";
import { JsonLd } from "@/components/json-ld";
import { FaqSection } from "@/components/faq-section";
import { CtaBand, GuideGrid } from "@/components/sections";

export const revalidate = 120;

export async function generateMetadata(): Promise<Metadata> {
  const [settings, page] = await Promise.all([getSettings(), getServicesPage()]);
  return {
    title: page.metaTitle,
    description: page.metaDescription,
    alternates: { canonical: "/services" },
    openGraph: {
      images: [{ url: settings.ogImage, width: 1200, height: 630, alt: settings.name }],
      title: `Services | ${settings.name}`,
      url: absoluteUrl("/services"),
    },
  };
}

export default async function ServicesPage() {
  const [settings, page, services] = await Promise.all([
    getSettings(),
    getServicesPage(),
    getServices(),
  ]);

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
          <p className="kicker">{page.kicker}</p>
          <h1>{page.title}</h1>
          <p>{page.intro}</p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 24 }}>
        <div className="container">
          <h2 className="sr-only">All services</h2>
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

      <GuideGrid
        kicker={page.guideKicker}
        title={page.guideTitle}
        intro={page.guideIntro}
        items={page.guideItems ?? []}
        note={page.guideNote}
      />

      <FaqSection
        kicker={page.faqKicker}
        title={page.faqTitle || "Frequently asked questions"}
        intro={page.faqIntro}
        faqs={page.faqs}
        pageUrl={absoluteUrl("/services")}
        ctaHref="/contact"
      />

      <CtaBand
        title={page.ctaTitle}
        text={page.ctaText}
        primaryLabel={page.ctaPrimaryLabel}
        primaryHref="/contact"
        secondaryLabel={page.ctaSecondaryLabel}
        secondaryHref={`https://wa.me/${settings.whatsapp}`}
      />
    </>
  );
}
