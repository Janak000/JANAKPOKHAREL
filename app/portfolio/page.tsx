import type { Metadata } from "next";
import Link from "next/link";
import { getProjects, getSettings, absoluteUrl } from "@/lib/cms";
import { Icon } from "@/components/icon";
import { JsonLd } from "@/components/json-ld";

export const revalidate = 120;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    title: "SEO & Ads Portfolio, Brands & Campaigns",
    description: `Brands and campaigns ${settings.name} has supported across SEO, Meta Ads, Google Ads, content, and growth, from local businesses to clients worldwide.`,
    alternates: { canonical: "/portfolio" },
    openGraph: {
      title: `Portfolio | ${settings.name}`,
      description: `SEO and ads work across brands and campaigns by ${settings.name}.`,
      url: absoluteUrl("/portfolio"),
    },
  };
}

export default async function PortfolioPage() {
  const projects = await getProjects();

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "Portfolio", item: absoluteUrl("/portfolio") },
    ],
  };

  const collectionLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Portfolio, Brands & Campaigns",
    url: absoluteUrl("/portfolio"),
    about: { "@id": `${absoluteUrl("/")}#person` },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: projects.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "CreativeWork",
          name: p.title,
          about: p.category,
          description: p.description,
          keywords: p.tags.join(", "),
        },
      })),
    },
  };

  return (
    <>
      <JsonLd data={breadcrumbLd} />
      <JsonLd data={collectionLd} />
      <section className="page-hero">
        <div className="container">
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span className="sep">/</span>
            <span>Portfolio</span>
          </nav>
          <p className="kicker">Selected Work</p>
          <h1>Featured brands and campaigns</h1>
          <p>
            Brands and projects I have supported across SEO, paid media, content,
            and growth execution.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 24 }}>
        <div className="container">
          <div className="card-grid">
            {projects.map((project) => (
              <article key={project.title} className="project-card">
                <div className="project-media">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={project.imageSrc} alt={project.imageAlt} loading="lazy" />
                </div>
                <div className="project-body">
                  <span className="project-category">{project.category}</span>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <div className="project-tags">
                    {project.tags.map((tag) => (
                      <span key={tag} className="chip">
                        {tag}
                      </span>
                    ))}
                  </div>
                  {project.result && (
                    <span className="project-result">
                      <Icon name="check" size={15} /> {project.result}
                    </span>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Context + capabilities — adds real content and keyword coverage */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-head" style={{ maxWidth: 720 }}>
            <p className="kicker">How I Work With Brands</p>
            <h2>Search and paid growth across industries</h2>
            <p>
              Every brand above came to me with a different goal, more qualified
              traffic, lower ad costs, stronger local visibility, or a cleaner path
              from click to customer. My role is the same each time: connect
              technical SEO, content, and paid advertising into one system measured
              against real business results.
            </p>
          </div>
          <div className="card-grid">
            <div className="card">
              <div className="card-icon"><Icon name="search" size={22} /></div>
              <h3>SEO &amp; content</h3>
              <p>
                Technical audits, intent-mapped keywords, and content that earns
                rankings and links, so brands compound organic traffic over time.
              </p>
            </div>
            <div className="card">
              <div className="card-icon"><Icon name="target" size={22} /></div>
              <h3>Meta &amp; Google Ads</h3>
              <p>
                Full-funnel paid campaigns with sharp targeting, creative testing,
                and landing pages aligned to the offer, built for profitable scale.
              </p>
            </div>
            <div className="card">
              <div className="card-icon"><Icon name="bar-chart" size={22} /></div>
              <h3>Tracking &amp; growth</h3>
              <p>
                Clean analytics, conversion tracking, and honest reporting tied to
                leads and revenue, from local service brands to worldwide clients.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="cta-band">
            <p className="kicker" style={{ justifyContent: "center" }}>
              Confidential Portfolio
            </p>
            <h2>Detailed case studies available on request</h2>
            <p>
              Many campaigns are protected by client agreements, so detailed case
              studies and reporting snapshots are shared privately.
            </p>
            <Link href="/contact" className="btn btn-primary btn-lg">
              Request Access <Icon name="arrow-right" size={18} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
