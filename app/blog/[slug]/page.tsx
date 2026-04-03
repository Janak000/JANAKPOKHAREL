import type { Metadata } from "next";
import type { Route } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getPostBySlug, getSiteContent } from "@/lib/site-content";

export const dynamic = "force-dynamic";

type PostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  const content = await getSiteContent();
  const { site } = content;

  if (!post) {
    return {
      title: "Blog not found"
    };
  }

  return {
    title: post.title,
    description: post.metaDescription,
    alternates: {
      canonical: `${site.url}/blog/${post.slug}`
    },
    openGraph: {
      title: post.title,
      description: post.metaDescription,
      url: `${site.url}/blog/${post.slug}`,
      type: "article",
      images: [
        {
          url: site.ogImage,
          width: 1200,
          height: 630,
          alt: post.title
        }
      ]
    }
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const content = await getSiteContent();
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <section className="section-block page-offset">
      <article className="shell article-shell">
        <Link className="back-link" href="/blog">
          {content.blog.backToBlogLabel}
        </Link>

        <header className="article-header">
          <p className="section-kicker">{post.category}</p>
          <h1>{post.title}</h1>
          <p className="blog-meta">
            {post.date} - {post.readTime}
          </p>
          <p className="article-intro">{post.heroIntro}</p>
        </header>

        <div className="article-body rich-copy" dangerouslySetInnerHTML={{ __html: post.contentHtml }} />

        <section className="faq-block">
          <h2>{content.blog.faqTitle}</h2>
          <div className="faq-list">
            {post.faqs.map((faq) => (
              <article key={faq.question} className="faq-item">
                <h3>{faq.question}</h3>
                <p>{faq.answer}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="article-cta">
          <h2>{post.cta.title}</h2>
          <Link className="button button-primary" href={post.cta.buttonHref as Route}>
            {post.cta.buttonLabel}
          </Link>
        </section>
      </article>
    </section>
  );
}
