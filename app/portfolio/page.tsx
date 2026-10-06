import type { Metadata } from "next";
import Link from "next/link";
import { getPortfolioPage, getProjects, getSettings, absoluteUrl } from "@/lib/cms";
import { Icon } from "@/components/icon";
import { JsonLd } from "@/components/json-ld";
import { FaqSection } from "@/components/faq-section";
import { CtaBand, SectionNote } from "@/components/sections";

export const revalidate = 120;

export async function generateMetadata(): Promise<Metadata> {
  const [settings, page] = await Promise.all([getSettings(), getPortfolioPage()]);
  return {
    title: page.metaTitle,
    description: page.metaDescription,
    alternates: { canonical: "/portfolio" },
    openGraph: {
      images: [{ url: settings.ogImage, width: 1200, height: 630, alt: settings.name }],
      title: `Portfolio | ${settings.name}`,
      description: `SEO and ads work across brands and campaigns by ${settings.name}.`,
      url: absoluteUrl("/portfolio"),
    },
  };
}

export default async function PortfolioPage() {
  const [page, projects] = await Promise.all([getPortfolioPage(), getProjects()]);

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
          <p className="kicker">{page.kicker}</p>
          <h1>{page.title}</h1>
          <p>{page.intro}</p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 24 }}>
        <div className="container">
          <h2 className="sr-only">Featured projects</h2>
          <div className="card-grid">
            {projects.map((project) => (
              <article key={project.title} className="project-card">
                <div className="project-media">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={project.imageSrc}
                    alt={project.imageAlt}
                    width={88}
                    height={88}
                    loading="lazy"
                  />
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

      {/* Context and capabilities: real content and keyword coverage. Editable in the CMS. */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-head section-head-center">
            <p className="kicker">{page.approachKicker}</p>
            <h2>{page.approachTitle}</h2>
            <p>{page.approachIntro}</p>
          </div>
          <div className="card-grid card-grid-auto">
            {(page.approachCards ?? []).map((card) => (
              <div key={card.title} className="card">
                {card.icon && (
                  <div className="card-icon">
                    <Icon name={card.icon} size={22} />
                  </div>
                )}
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </div>
            ))}
          </div>
          <SectionNote note={page.approachNote} />
        </div>
      </section>

      <FaqSection
        kicker={page.faqKicker}
        title={page.faqTitle || "Frequently asked questions"}
        intro={page.faqIntro}
        faqs={page.faqs}
        pageUrl={absoluteUrl("/portfolio")}
        ctaHref="/contact"
      />

      <CtaBand
        kicker={page.ctaKicker}
        title={page.ctaTitle}
        text={page.ctaText}
        primaryLabel={page.ctaLabel}
        primaryHref="/contact"
      />
    </>
  );
}
