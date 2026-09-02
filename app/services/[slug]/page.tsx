import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getService, getServices, getSettings, absoluteUrl } from "@/lib/cms";
import { Icon } from "@/components/icon";
import { JsonLd } from "@/components/json-ld";
import { Markdown } from "@/components/markdown";

export const revalidate = 120;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const services = await getServices();
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const [settings, service] = await Promise.all([getSettings(), getService(slug)]);
  if (!service) return { title: "Service not found" };
  return {
    title: service.metaTitle || `${service.title} Services`,
    description: service.metaDescription || service.shortDescription,
    alternates: { canonical: `/services/${service.slug}` },
    openGraph: {
      title: `${service.title} | ${settings.name}`,
      description: service.shortDescription,
      url: absoluteUrl(`/services/${service.slug}`),
    },
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const [settings, service, allServices] = await Promise.all([
    getSettings(),
    getService(slug),
    getServices(),
  ]);
  if (!service) notFound();

  const otherServices = allServices.filter((s) => s.slug !== slug).slice(0, 3);

  const serviceLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.shortDescription,
    url: absoluteUrl(`/services/${service.slug}`),
    provider: {
      "@type": "Person",
      name: settings.name,
      url: absoluteUrl("/"),
    },
    areaServed: "Worldwide",
    serviceType: service.title,
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "Services", item: absoluteUrl("/services") },
      {
        "@type": "ListItem",
        position: 3,
        name: service.title,
        item: absoluteUrl(`/services/${service.slug}`),
      },
    ],
  };

  return (
    <>
      <JsonLd data={serviceLd} />
      <JsonLd data={breadcrumbLd} />
      <section className="page-hero">
        <div className="container">
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span className="sep">/</span>
            <Link href="/services">Services</Link>
            <span className="sep">/</span>
            <span>{service.title}</span>
          </nav>
          <div className="card-icon" style={{ marginBottom: 22 }}>
            <Icon name={service.icon} size={26} />
          </div>
          <h1>{service.title}</h1>
          <p>{service.shortDescription}</p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 12 }}>
        <div className="container">
          <div className="article-layout">
            <Markdown content={service.body} />
            <aside className="article-sidebar">
              <div className="sidebar-card">
                <h3>Start with this service</h3>
                <p style={{ marginBottom: 18 }}>
                  Get a free, honest assessment of whether {service.title.toLowerCase()}{" "}
                  is the right investment for your business right now.
                </p>
                <Link href="/contact" className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }}>
                  Request a Proposal
                </Link>
              </div>
              <div className="sidebar-card">
                <h3>Other services</h3>
                <div className="post-list">
                  {otherServices.map((s) => (
                    <Link key={s.slug} href={`/services/${s.slug}`}>
                      {s.title} →
                    </Link>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
