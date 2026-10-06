import type { Metadata } from "next";
import Link from "next/link";
import {
  getBlogSettings,
  getSettings,
  getCategories,
  getPosts,
  absoluteUrl,
  categorySlug,
} from "@/lib/cms";
import { PostCard } from "@/components/post-card";
import { JsonLd } from "@/components/json-ld";

export const revalidate = 120;

export async function generateMetadata(): Promise<Metadata> {
  const [blog, settings] = await Promise.all([getBlogSettings(), getSettings()]);
  return {
    title: blog.metaTitle || blog.title,
    description: blog.metaDescription || blog.description,
    alternates: {
      canonical: "/blog",
      types: { "application/rss+xml": absoluteUrl("/feed.xml") },
    },
    openGraph: {
      images: [{ url: settings.ogImage, width: 1200, height: 630, alt: settings.name }],
      title: blog.metaTitle || blog.title,
      description: blog.metaDescription || blog.description,
      url: absoluteUrl("/blog"),
    },
  };
}

export default async function BlogPage() {
  const [blog, posts, categories] = await Promise.all([
    getBlogSettings(),
    getPosts(),
    getCategories(),
  ]);

  const [first, ...rest] = posts;

  const blogLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": absoluteUrl("/blog"),
    name: blog.title,
    description: blog.metaDescription || blog.description,
    url: absoluteUrl("/blog"),
    author: { "@id": `${absoluteUrl("/")}#person` },
    blogPost: posts.map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      url: absoluteUrl(`/blog/${p.slug}`),
      datePublished: p.publishedAt,
      description: p.excerpt,
    })),
  };

  return (
    <>
      <JsonLd data={blogLd} />
      <section className="page-hero">
        <div className="container">
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span className="sep">/</span>
            <span>Blog</span>
          </nav>
          <p className="kicker">The Blog</p>
          <h1>{blog.title}</h1>
          {blog.description
            .split(/\n{2,}/)
            .map((para) => para.replace(/\s+/g, " ").trim())
            .filter(Boolean)
            .map((para) => (
              <p key={para.slice(0, 40)}>{para}</p>
            ))}
        </div>
      </section>

      <section className="section" style={{ paddingTop: 12 }}>
        <div className="container">
          <div className="category-filter">
            <Link href="/blog" className="chip chip-accent">
              All posts
            </Link>
            {categories.map((c) => (
              <Link
                key={c}
                href={`/blog/category/${categorySlug(c)}`}
                className="chip"
              >
                {c}
              </Link>
            ))}
          </div>

          <h2 className="sr-only">All articles</h2>
          <div className="post-grid">
            {first && <PostCard post={first} featured />}
            {rest.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
