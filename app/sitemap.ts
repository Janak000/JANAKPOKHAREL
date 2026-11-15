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

  // Static pages take the newest real content date instead of a hardcoded one.
  const latest = new Date(
    Math.max(
      0,
      ...posts.map((p) => +new Date(p.updatedAt)),
      ...services.map((s) => (s.updatedAt ? +new Date(s.updatedAt) : 0))
    )
  );

  const staticPages: MetadataRoute.Sitemap = [
    "/",
    "/about",
    "/services",
    "/portfolio",
    "/blog",
    "/contact",
  ].map((path) => ({ url: absoluteUrl(path), lastModified: latest }));

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
