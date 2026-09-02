import type { MetadataRoute } from "next";
import {
  getCategories,
  getPosts,
  getServices,
  absoluteUrl,
  categorySlug,
} from "@/lib/cms";

export const revalidate = 3600;

/**
 * lastModified is emitted ONLY where a real content date exists.
 *
 * Previously every entry used `new Date()`, so the whole file changed on each
 * regeneration. Google discards lastmod it detects as unreliable, which meant
 * the sitemap contributed nothing to crawl scheduling. An absent lastmod is
 * strictly better than a false one.
 *
 * Service rows carry no updatedAt column, so they intentionally omit it too.
 * changeFrequency and priority are gone: Google has ignored both for years.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, services, categories] = await Promise.all([
    getPosts(),
    getServices(),
    getCategories(),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    "/",
    "/about",
    "/services",
    "/portfolio",
    "/blog",
    "/contact",
  ].map((path) => ({ url: absoluteUrl(path) }));

  const servicePages: MetadataRoute.Sitemap = services.map((s) => ({
    url: absoluteUrl(`/services/${s.slug}`),
  }));

  const postPages: MetadataRoute.Sitemap = posts.map((p) => ({
    url: absoluteUrl(`/blog/${p.slug}`),
    lastModified: new Date(p.updatedAt),
  }));

  // Newest post in the category is the only honest date available here.
  const categoryPages: MetadataRoute.Sitemap = categories.map((c) => {
    const slug = categorySlug(c);
    const newest = posts
      .filter((p) => categorySlug(p.category) === slug)
      .map((p) => new Date(p.updatedAt).getTime())
      .sort((a, b) => b - a)[0];

    return {
      url: absoluteUrl(`/blog/category/${slug}`),
      ...(newest ? { lastModified: new Date(newest) } : {}),
    };
  });

  return [...staticPages, ...servicePages, ...postPages, ...categoryPages];
}
