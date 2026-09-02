import {
  getPosts,
  getServices,
  getSettings,
  absoluteUrl,
  formatDate,
} from "@/lib/cms";

export const revalidate = 3600;

// llms.txt, a machine-readable site summary for AI models and answer engines.
// See https://llmstxt.org/
export async function GET() {
  const [settings, services, posts] = await Promise.all([
    getSettings(),
    getServices(),
    getPosts(),
  ]);

  const body = `# ${settings.name}

> ${settings.description}

${settings.name} is a ${settings.role} based in ${settings.location}, working with clients worldwide. Core expertise: technical SEO, content strategy, Meta Ads, Google Ads, CRO, and analytics.

Contact: ${settings.email} · ${absoluteUrl("/contact")}

## Services

${services.map((s) => `- [${s.title}](${absoluteUrl(`/services/${s.slug}`)}): ${s.shortDescription}`).join("\n")}

## Blog Articles

${posts.map((p) => `- [${p.title}](${absoluteUrl(`/blog/${p.slug}`)}) (${formatDate(p.publishedAt)}): ${p.excerpt}`).join("\n")}

## Key Pages

- [About](${absoluteUrl("/about")}): Background, experience, education, and certifications
- [Portfolio](${absoluteUrl("/portfolio")}): Brands and campaigns supported
- [Blog](${absoluteUrl("/blog")}): Digital marketing insights on SEO, Meta Ads, and growth
- [Contact](${absoluteUrl("/contact")}): Start a project
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
