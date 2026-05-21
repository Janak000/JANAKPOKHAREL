import type { MetadataRoute } from "next";

import { getBlogPosts, getSiteContent } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { site } = await getSiteContent();
  const posts = await getBlogPosts();
  const now = new Date().toISOString();

  return [
    {
      url: site.url,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1
    },
    {
      url: `${site.url}/blog`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8
    },
    ...posts.map((post) => ({
      url: `${site.url}/blog/${post.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7
    }))
  ];
}import type { MetadataRoute } from "next";

import { getBlogPosts, getSiteContent } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { site } = await getSiteContent();
  const posts = await getBlogPosts();

  return [
    {
      url: site.url,
      priority: 1
    },
    {
      url: `${site.url}/blog`,
      priority: 0.8
    },
    {
      url: `${site.url}/admin`,
      priority: 0.3
    },
    ...posts.map((post) => ({
      url: `${site.url}/blog/${post.slug}`,
      priority: 0.7
    }))
  ];
}
