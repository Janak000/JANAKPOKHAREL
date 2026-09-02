import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getPost,
  getPosts,
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
      images: post.coverImage ? [{ url: post.coverImage }] : undefined,
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
  const [settings, post, allPosts] = await Promise.all([
    getSettings(),
    getPost(slug),
    getPosts(),
  ]);
  if (!post) notFound();

  const related = allPosts.filter((p) => p.slug !== slug).slice(0, 4);

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
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/image/janak.webp" alt={settings.name} />
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
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/image/janak.webp" alt={settings.name} />
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
