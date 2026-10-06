import type { MetadataRoute } from "next";
import { getPosts, getServices, absoluteUrl } from "@/lib/cms";

export const revalidate = 3600;

/**
 * lastModified is emitted ONLY where a real content date exists.
 * Service rows use services.updated_at, set by a DB trigger on every edit.
 * Category pages are noindex (thin listings) and are left out entirely.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, services] = await Promise.all([getPosts(), getServices()]);

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
    ...(s.updatedAt ? { lastModified: new Date(s.updatedAt) } : {}),
  }));

  const postPages: MetadataRoute.Sitemap = posts.map((p) => ({
    url: absoluteUrl(`/blog/${p.slug}`),
    lastModified: new Date(p.updatedAt),
  }));

  return [...staticPages, ...servicePages, ...postPages];
}
