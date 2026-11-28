import type { Metadata } from "next";
import Link from "next/link";
import { getSocialFeed, getSettings, absoluteUrl } from "@/lib/cms";
import { VIDEOS_PATH, parseSocialUrl, usefulTitle } from "@/lib/social-embed";
import { SocialCard } from "@/components/social-card";
import { JsonLd } from "@/components/json-ld";
import { Markdown } from "@/components/markdown";
import { FaqSection } from "@/components/faq-section";

export const revalidate = 120;

export async function generateMetadata(): Promise<Metadata> {
  const [settings, page] = await Promise.all([getSettings(), getSocialFeed()]);
  return {
    title: page.metaTitle,
    description: page.metaDescription,
    alternates: { canonical: VIDEOS_PATH },
    // An empty page is thin content: keep it out of the index until posts exist.
    robots: page.items.length === 0 ? { index: false, follow: true } : undefined,
    openGraph: {
      type: "website",
      title: page.metaTitle,
      description: page.metaDescription,
      url: absoluteUrl(VIDEOS_PATH),
      images: [{ url: settings.ogImage, width: 1200, height: 630, alt: settings.name }],
    },
    twitter: { card: "summary_large_image", title: page.metaTitle, description: page.metaDescription },
  };
}

export default async function SeoVideosPage() {
  const [page, settings] = await Promise.all([getSocialFeed(), getSettings()]);
  const url = absoluteUrl(VIDEOS_PATH);

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "SEO videos", item: url },
    ],
  };

  // One VideoObject per YouTube post. Google only shows video results when a
  // real upload date is present, so a date is added only if the owner typed one.
  const videos = page.items.flatMap((item) => {
    const e = parseSocialUrl(item.url);
    if (!e || e.kind !== "embed" || e.platform !== "youtube" || !e.thumb) return [];
    const name = usefulTitle(item.title) || "SEO and ads video by " + settings.name;
    return [
      {
        "@type": "VideoObject",
        name,
        description: item.description?.trim() || name,
        thumbnailUrl: e.thumb,
        embedUrl: e.src,
        url: e.href,
        ...(item.date ? { uploadDate: item.date } : {}),
        author: { "@id": `${absoluteUrl("/")}#person` },
      },
    ];
  });

  const pageLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${url}#page`,
    name: page.title,
    description: page.metaDescription,
    url,
    inLanguage: "en",
    about: { "@id": `${absoluteUrl("/")}#person` },
    isPartOf: { "@type": "WebSite", url: absoluteUrl("/"), name: settings.name },
    ...(videos.length > 0
      ? {
          mainEntity: {
            "@type": "ItemList",
            itemListElement: videos.map((v, i) => ({ "@type": "ListItem", position: i + 1, item: v })),
          },
        }
      : {}),
  };

  return (
    <>
      <JsonLd data={breadcrumbLd} />
      <JsonLd data={pageLd} />
      <section className="page-hero">
        <div className="container">
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span className="sep">/</span>
            <span>SEO videos</span>
          </nav>
          <p className="kicker">{page.kicker}</p>
          <h1>{page.title}</h1>
          <p>{page.intro}</p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 24 }}>
        <div className="container">
          {page.items.length === 0 ? (
            <p>New posts and videos are coming soon.</p>
          ) : (
            <div className="social-grid">
              {page.items.map((item, i) => (
                <SocialCard
                  key={item.url + i}
                  url={item.url}
                  title={usefulTitle(item.title)}
                  description={item.description}
                  level={2}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {page.body.trim() && (
        <section className="section section-alt">
          <div className="container">
            <div className="article-main videos-copy">
              <Markdown content={page.body} />
            </div>
          </div>
        </section>
      )}

      <FaqSection faqs={page.faqs} title={page.faqTitle} pageUrl={url} />
    </>
  );
}
