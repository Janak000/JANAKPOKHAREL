import type { Metadata } from "next";
import Link from "next/link";

import { getSiteContent } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { blog } = await getSiteContent();

  return {
    title: "Blogs",
    description: blog.description
  };
}

export default async function BlogPage() {
  const { blog } = await getSiteContent();

  return (
    <section className="section-block page-offset">
      <div className="shell">
        <div className="section-heading">
          <p className="section-kicker">Blogs</p>
          <h1>{blog.title}</h1>
          <p className="section-copy">{blog.description}</p>
        </div>

        <div className="cards-grid">
          {blog.posts.map((post) => (
            <article key={post.slug} className="panel blog-card blog-card-full">
              <p className="blog-meta">
                {post.category} - {post.date} - {post.readTime}
              </p>
              <h2>{post.title}</h2>
              <p>{post.excerpt}</p>
              <Link className="text-link" href={`/blog/${post.slug}`}>
                Open blog
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
