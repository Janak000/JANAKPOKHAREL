import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/cms";

/**
 * Welcomes search engines AND AI/LLM crawlers (GEO): content here is meant to
 * be discoverable and citable.
 *
 * Deliberately does NOT name /sanchalan. robots.txt is public and is the first
 * file any scanner fetches, so listing the admin path only advertises it.
 * That route is kept out of the index with an X-Robots-Tag header set in
 * next.config.mjs instead, which crawlers obey and scanners never read.
 *
 * The 12 identical per-agent blocks were collapsed into one: they differed in
 * no way, so they were 12x the maintenance for zero behavioural change.
 * `host` was dropped as well - it is a Yandex directive Google ignores.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/"] }],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
