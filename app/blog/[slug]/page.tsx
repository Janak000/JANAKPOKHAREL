import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  getPost,
  getPosts,
  getServices,
  getSettings,
  absoluteUrl,
  categorySlug,
  formatDate,
} from "@/lib/cms";
import { Icon } from "@/components/icon";
import { JsonLd } from "@/components/json-ld";
import { Markdown } from "@/components/markdown";

export const revalidate = 120;

type Props = { params: Promise<{ slug: string }> };

/**
 * Which service pages each article should point at. Post bodies carry no
 * internal links of their own, so without this an article was a dead end that
 * never passed anything to the pages that actually sell. Unknown slugs fall
 * back to the category list, and anything missing from the CMS is dropped.
 */
const SERVICES_FOR_POST: Record<string, string[]> = {
  "google-business-profile-nepal": ["seo-services-nepal", "digital-marketing-nepal"],
  "seo-price-nepal": ["seo-services-nepal", "technical-seo", "digital-marketing-agency-nepal"],
  "best-seo-company-nepal": ["seo-services-nepal", "digital-marketing-agency-nepal"],
  "facebook-boosting-nepal": ["meta-ads", "digital-marketing-nepal"],
  "seo-vs-meta-ads": ["seo-services-nepal", "meta-ads", "advanced-seo"],
  "google-ads-cost-nepal": ["google-ads-ppc", "digital-marketing-agency-nepal"],
  "hire-seo-ads-freelancer": ["digital-marketing-agency-nepal", "seo-services-nepal", "google-ads-ppc"],
  "are-meta-ads-worth-it-2026": ["meta-ads", "google-ads-ppc"],
};

const SERVICES_FOR_CATEGORY: Record<string, string[]> = {
  "SEO Strategy": ["seo-services-nepal", "technical-seo", "advanced-seo"],
  "Paid Media": ["meta-ads", "google-ads-ppc", "digital-marketing-nepal"],
  "Google Ads": ["google-ads-ppc", "meta-ads", "digital-marketing-nepal"],
};

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const [settings, post] = await Promise.all([getSettings(), getPost(slug)]);
  if (!post) return { title: "Article not found" };
  return {
    title: post.metaTitle || post.title,
    description: post.metaDescription,
    keywords: post.tags,
    authors: [{ name: settings.name, url: absoluteUrl("/") }],
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.metaTitle || post.title,
      description: post.metaDescription,
      url: absoluteUrl(`/blog/${post.slug}`),
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [settings.name],
      tags: post.tags,
      // Fall back to the site OG image: no post has a cover yet, and an
      // undefined images array meant every shared post rendered a blank card.
      images: post.coverImage
        ? [{ url: post.coverImage }]
        : [{ url: settings.ogImage, width: 1200, height: 630, alt: settings.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.metaTitle || post.title,
      description: post.metaDescription,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const [settings, post, allPosts, services] = await Promise.all([
    getSettings(),
    getPost(slug),
    getPosts(),
    getServices(),
  ]);
  if (!post) notFound();

  // Rotate the list so every article is linked from the ones around it, rather
  // than the same four newest posts collecting all the inbound links. Posts in
  // the same category come first because they are the most relevant next read.
  const idx = allPosts.findIndex((p) => p.slug === slug);
  const rotated = [...allPosts.slice(idx + 1), ...allPosts.slice(0, Math.max(idx, 0))];
  const related = [
    ...rotated.filter((p) => p.category === post.category),
    ...rotated.filter((p) => p.category !== post.category),
  ].slice(0, 4);

  const relatedServices = (
    SERVICES_FOR_POST[slug] ?? SERVICES_FOR_CATEGORY[post.category] ?? []
  )
    .map((s) => services.find((svc) => svc.slug === s))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": absoluteUrl(`/blog/${post.slug}`),
    headline: post.title,
    description: post.metaDescription,
    url: absoluteUrl(`/blog/${post.slug}`),
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    inLanguage: "en",
    image: post.coverImage
      ? absoluteUrl(post.coverImage)
      : absoluteUrl(settings.ogImage),
    author: {
      "@type": "Person",
      "@id": `${absoluteUrl("/")}#person`,
      name: settings.name,
      url: absoluteUrl("/"),
      jobTitle: settings.role,
    },
    publisher: {
      "@type": "Person",
      name: settings.name,
      url: absoluteUrl("/"),
    },
    keywords: post.tags.join(", "),
    articleSection: post.category,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": absoluteUrl(`/blog/${post.slug}`),
    },
  };

  const faqLd =
    post.faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: post.faqs.map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: { "@type": "Answer", text: f.answer },
          })),
        }
      : null;

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "Blog", item: absoluteUrl("/blog") },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: absoluteUrl(`/blog/${post.slug}`),
      },
    ],
  };

  return (
    <>
      <JsonLd data={articleLd} />
      {faqLd && <JsonLd data={faqLd} />}
      <JsonLd data={breadcrumbLd} />

      <article>
        <section className="page-hero" style={{ paddingBottom: 8 }}>
          <div className="container">
            <nav className="breadcrumbs" aria-label="Breadcrumb">
              <Link href="/">Home</Link>
              <span className="sep">/</span>
              <Link href="/blog">Blog</Link>
              <span className="sep">/</span>
              <span>{post.title}</span>
            </nav>
            <header className="article-header">
              <Link
                href={`/blog/category/${categorySlug(post.category)}`}
                className="chip chip-accent"
              >
                {post.category}
              </Link>
              <h1>{post.title}</h1>
              <div className="article-meta">
                <span className="author">
                  <Image src="/image/janak.webp" alt={settings.name} width={34} height={34} />
                  {settings.name}
                </span>
                <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                <span>
                  <Icon name="clock" size={14} /> {post.readTime}
                </span>
              </div>
            </header>
          </div>
        </section>

        <section className="section" style={{ paddingTop: 12 }}>
          <div className="container">
            <div className="article-layout">
              <div>
                <p className="article-intro">{post.heroIntro}</p>
                <Markdown content={post.body} />

                {post.tags.length > 0 && (
                  <div className="article-tags">
                    {post.tags.map((tag) => (
                      <span key={tag} className="chip">
                        <Icon name="tag" size={13} /> {tag}
                      </span>
                    ))}
                  </div>
                )}

                {relatedServices.length > 0 && (
                  <section aria-labelledby="related-services-heading">
                    <h2 id="related-services-heading" style={{ fontSize: 26, marginTop: 48 }}>
                      Related services
                    </h2>
                    <div className="prose">
                      <p>
                        If you would rather have this handled than read about it, these are
                        the services closest to this article:{" "}
                        {relatedServices.map((s, i) => (
                          <span key={s.slug}>
                            {i > 0 && (i === relatedServices.length - 1 ? " and " : ", ")}
                            <Link href={`/services/${s.slug}`}>{s.title}</Link>
                          </span>
                        ))}
                        .
                      </p>
                    </div>
                  </section>
                )}

                {post.faqs.length > 0 && (
                  <section aria-labelledby="faq-heading">
                    <h2 id="faq-heading" style={{ fontSize: 26, marginTop: 48 }}>
                      Frequently asked questions
                    </h2>
                    <div className="faq-list">
                      {post.faqs.map((faq, i) => (
                        <details key={faq.question} className="faq-item" open={i === 0}>
                          <summary>{faq.question}</summary>
                          <div>{faq.answer}</div>
                        </details>
                      ))}
                    </div>
                  </section>
                )}

                <div className="cta-band" style={{ marginTop: 56, padding: "48px 28px" }}>
                  <h2 style={{ fontSize: 28 }}>Want results like this for your business?</h2>
                  <p>
                    I help businesses grow with SEO, Meta Ads, and conversion-focused
                    strategy. Let&apos;s talk about your goals.
                  </p>
                  <Link href="/contact" className="btn btn-primary btn-lg">
                    Work With Me <Icon name="arrow-right" size={18} />
                  </Link>
                </div>
              </div>

              <aside className="article-sidebar">
                <div className="sidebar-card">
                  <div className="author-block">
                    <Image src="/image/janak.webp" alt={settings.name} width={52} height={52} />
                    <div>
                      <h3 style={{ marginBottom: 2 }}>{settings.name}</h3>
                      <p style={{ fontSize: 13 }}>{settings.role}</p>
                    </div>
                  </div>
                  <p>{settings.tagline}</p>
                  <Link
                    href="/about"
                    className="text-link"
                    style={{ marginTop: 12, display: "inline-flex" }}
                  >
                    About me <Icon name="arrow-right" size={15} />
                  </Link>
                </div>

                {related.length > 0 && (
                  <div className="sidebar-card">
                    <h3>Keep reading</h3>
                    <div className="post-list">
                      {related.map((p) => (
                        <Link key={p.slug} href={`/blog/${p.slug}`}>
                          {p.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </aside>
            </div>
          </div>
        </section>
      </article>
    </>
  );
}
