import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getCategories,
  getPostsByCategory,
  absoluteUrl,
  categorySlug,
} from "@/lib/cms";
import { PostCard } from "@/components/post-card";
import { JsonLd } from "@/components/json-ld";

export const revalidate = 120;

type Props = { params: Promise<{ category: string }> };

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((c) => ({ category: categorySlug(c) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const result = await getPostsByCategory(category);
  if (!result) return { title: "Category not found" };
  return {
    title: `${result.category} Articles`,
    description: `All articles about ${result.category.toLowerCase()}, practical strategies and guides by Janak Pokharel.`,
    alternates: { canonical: `/blog/category/${category}` },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const [result, categories] = await Promise.all([
    getPostsByCategory(category),
    getCategories(),
  ]);
  if (!result) notFound();

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "Blog", item: absoluteUrl("/blog") },
      {
        "@type": "ListItem",
        position: 3,
        name: result.category,
        item: absoluteUrl(`/blog/category/${category}`),
      },
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
            <Link href="/blog">Blog</Link>
            <span className="sep">/</span>
            <span>{result.category}</span>
          </nav>
          <p className="kicker">Category</p>
          <h1>{result.category}</h1>
          <p>
            {result.posts.length} article{result.posts.length === 1 ? "" : "s"} in
            this category.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 12 }}>
        <div className="container">
          <div className="category-filter">
            <Link href="/blog" className="chip">
              All posts
            </Link>
            {categories.map((c) => (
              <Link
                key={c}
                href={`/blog/category/${categorySlug(c)}`}
                className={`chip ${categorySlug(c) === category ? "chip-accent" : ""}`}
              >
                {c}
              </Link>
            ))}
          </div>
          <div className="post-grid">
            {result.posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
