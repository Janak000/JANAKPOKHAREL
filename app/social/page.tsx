import type { Metadata } from "next";
import Link from "next/link";
import { getSocialFeed, getSettings, absoluteUrl } from "@/lib/cms";
import { SocialCard } from "@/components/social-card";
import { JsonLd } from "@/components/json-ld";

export const revalidate = 120;

export async function generateMetadata(): Promise<Metadata> {
  const [settings, page] = await Promise.all([getSettings(), getSocialFeed()]);
  return {
    title: page.metaTitle,
    description: page.metaDescription,
    alternates: { canonical: "/social" },
    // An empty page is thin content: keep it out of the index until posts exist.
    robots: page.items.length === 0 ? { index: false, follow: true } : undefined,
    openGraph: {
      title: page.metaTitle,
      description: page.metaDescription,
      url: absoluteUrl("/social"),
      images: [{ url: settings.ogImage, width: 1200, height: 630, alt: settings.name }],
    },
  };
}

export default async function SocialPage() {
  const page = await getSocialFeed();

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "Videos and social", item: absoluteUrl("/social") },
    ],
  };

  return (
    <>
      <JsonLd data={breadcrumbLd} />
      <section className="page-hero">
        <div className="container">
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span className="sep">/</span>
            <span>Videos and social</span>
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
                <SocialCard key={item.url + i} url={item.url} title={item.title} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
