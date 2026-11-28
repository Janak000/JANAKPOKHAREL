/**
 * Authority sources shown at the end of an article or service page.
 * Every URL here was fetched and returned 200 when it was added, and each is a
 * primary Google document, so the links back up claims instead of padding.
 * Pages with no entry simply show no Sources block.
 */
export type Source = { label: string; url: string };

const G = "https://developers.google.com/search/docs";
const starter: Source = { label: "SEO Starter Guide, Google Search Central", url: `${G}/fundamentals/seo-starter-guide` };
const helpful: Source = { label: "Creating helpful, reliable, people-first content, Google Search Central", url: `${G}/fundamentals/creating-helpful-content` };
const structured: Source = { label: "Intro to structured data, Google Search Central", url: `${G}/appearance/structured-data/intro-structured-data` };
const sitemaps: Source = { label: "Build and submit a sitemap, Google Search Central", url: `${G}/crawling-indexing/sitemaps/overview` };
const robots: Source = { label: "Introduction to robots.txt, Google Search Central", url: `${G}/crawling-indexing/robots/intro` };
const vitals: Source = { label: "Understanding Core Web Vitals, Google Search Central", url: `${G}/appearance/core-web-vitals` };
const crawl: Source = { label: "Crawl budget management, Google Search Central", url: `${G}/crawling-indexing/large-site-managing-crawl-budget` };
const aiFeatures: Source = { label: "AI features and your website, Google Search Central", url: `${G}/appearance/ai-features` };
const qualityScore: Source = { label: "About Quality Score for Search campaigns, Google Ads Help", url: "https://support.google.com/google-ads/answer/6167118" };
const gbp: Source = { label: "Tips to improve your local ranking on Google, Business Profile Help", url: "https://support.google.com/business/answer/7091" };

export const SOURCES_FOR_SERVICE: Record<string, Source[]> = {
  "seo-services-nepal": [starter, helpful, sitemaps],
  "technical-seo": [sitemaps, robots, vitals, crawl],
  "advanced-seo": [helpful, structured, aiFeatures],
  "google-ads-ppc": [qualityScore],
  "digital-marketing-nepal": [starter, helpful],
  "digital-marketing-agency-nepal": [starter, helpful],
};

export const SOURCES_FOR_POST: Record<string, Source[]> = {
  "google-business-profile-nepal": [gbp, starter],
  "seo-price-nepal": [starter, helpful],
  "best-seo-company-nepal": [starter, helpful],
  "seo-expert-in-nepal": [starter, helpful],
  "hire-seo-consultant-uk": [starter, helpful],
  "choose-digital-marketing-agency-nepal": [starter, helpful],
  "seo-audit-service-small-business": [starter, sitemaps, robots],
  "seo-for-colleges-nepal": [starter, helpful],
  "seo-vs-meta-ads": [starter, qualityScore],
  "technical-seo-audit-cost": [sitemaps, robots, vitals, crawl],
  "shopify-seo-nepal": [sitemaps, vitals, structured],
  "google-ads-cost-nepal": [qualityScore],
  "hire-seo-ads-freelancer": [starter, qualityScore],
};
