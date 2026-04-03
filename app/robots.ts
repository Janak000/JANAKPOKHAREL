import type { MetadataRoute } from "next";

import { getSiteContent } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const { site } = await getSiteContent();

  return {
    rules: {
      userAgent: "*",
      allow: "/"
    },
    sitemap: `${site.url}/sitemap.xml`
  };
}
