import { cache } from "react";

import { defaultSiteContent } from "@/data/site-content";
import { readGithubSiteContent } from "@/lib/github-cms";

const loadSiteContent = cache(async () => {
  return (await readGithubSiteContent()) ?? defaultSiteContent;
});

export async function getSiteContent() {
  return loadSiteContent();
}

export async function getBlogPosts() {
  const siteContent = await getSiteContent();
  return [...siteContent.blog.posts];
}

export async function getPostBySlug(slug: string) {
  const siteContent = await getSiteContent();
  return siteContent.blog.posts.find((post) => post.slug === slug) ?? null;
}
