import type { MetadataRoute } from "next";

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
