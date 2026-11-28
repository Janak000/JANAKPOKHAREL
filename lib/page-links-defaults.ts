/**
 * Authority sources shown at the end of an article or service page.
 * Every URL here was fetched and returned 200 when it was added, and each is a
 * primary Google document, so the links back up claims instead of padding.
 * Pages with no entry simply show no Sources block.
 * These are only the starting rows: after the first save in Sanchalan the list is
 * edited there (Page Content -> Page links and sources).
 */
export type Source = { label: string; url: string };
export type SourceRow = Source & { page: string };

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


export const defaultSourceRows: SourceRow[] = [
  { page: "seo-services-nepal", ...starter },
  { page: "seo-services-nepal", ...helpful },
  { page: "seo-services-nepal", ...sitemaps },
  { page: "technical-seo", ...sitemaps },
  { page: "technical-seo", ...robots },
  { page: "technical-seo", ...vitals },
  { page: "technical-seo", ...crawl },
  { page: "advanced-seo", ...helpful },
  { page: "advanced-seo", ...structured },
  { page: "advanced-seo", ...aiFeatures },
  { page: "google-ads-ppc", ...qualityScore },
  { page: "digital-marketing-nepal", ...starter },
  { page: "digital-marketing-nepal", ...helpful },
  { page: "digital-marketing-agency-nepal", ...starter },
  { page: "digital-marketing-agency-nepal", ...helpful },
  { page: "google-business-profile-nepal", ...gbp },
  { page: "google-business-profile-nepal", ...starter },
  { page: "seo-price-nepal", ...starter },
  { page: "seo-price-nepal", ...helpful },
  { page: "best-seo-company-nepal", ...starter },
  { page: "best-seo-company-nepal", ...helpful },
  { page: "seo-expert-in-nepal", ...starter },
  { page: "seo-expert-in-nepal", ...helpful },
  { page: "hire-seo-consultant-uk", ...starter },
  { page: "hire-seo-consultant-uk", ...helpful },
  { page: "choose-digital-marketing-agency-nepal", ...starter },
  { page: "choose-digital-marketing-agency-nepal", ...helpful },
  { page: "seo-audit-service-small-business", ...starter },
  { page: "seo-audit-service-small-business", ...sitemaps },
  { page: "seo-audit-service-small-business", ...robots },
  { page: "seo-for-colleges-nepal", ...starter },
  { page: "seo-for-colleges-nepal", ...helpful },
  { page: "seo-vs-meta-ads", ...starter },
  { page: "seo-vs-meta-ads", ...qualityScore },
  { page: "technical-seo-audit-cost", ...sitemaps },
  { page: "technical-seo-audit-cost", ...robots },
  { page: "technical-seo-audit-cost", ...vitals },
  { page: "technical-seo-audit-cost", ...crawl },
  { page: "shopify-seo-nepal", ...sitemaps },
  { page: "shopify-seo-nepal", ...vitals },
  { page: "shopify-seo-nepal", ...structured },
  { page: "google-ads-cost-nepal", ...qualityScore },
  { page: "hire-seo-ads-freelancer", ...starter },
  { page: "hire-seo-ads-freelancer", ...qualityScore },
];

export const defaultRelatedServices: { post: string; services: string }[] = [
  { post: "google-business-profile-nepal", services: "seo-services-nepal, digital-marketing-nepal" },
  { post: "seo-price-nepal", services: "seo-services-nepal, technical-seo, digital-marketing-agency-nepal" },
  { post: "best-seo-company-nepal", services: "seo-services-nepal, digital-marketing-agency-nepal" },
  { post: "facebook-boosting-nepal", services: "meta-ads, digital-marketing-nepal" },
  { post: "seo-vs-meta-ads", services: "seo-services-nepal, meta-ads, advanced-seo" },
  { post: "google-ads-cost-nepal", services: "google-ads-ppc, digital-marketing-agency-nepal" },
  { post: "hire-seo-ads-freelancer", services: "digital-marketing-agency-nepal, seo-services-nepal, google-ads-ppc" },
  { post: "are-meta-ads-worth-it-2026", services: "meta-ads, google-ads-ppc" },
  { post: "choose-digital-marketing-agency-nepal", services: "digital-marketing-agency-nepal, digital-marketing-nepal, seo-services-nepal" },
  { post: "facebook-ads-cost-nepal", services: "meta-ads, digital-marketing-nepal, google-ads-ppc" },
  { post: "hire-seo-consultant-uk", services: "advanced-seo, technical-seo, seo-services-nepal" },
  { post: "seo-audit-service-small-business", services: "technical-seo, advanced-seo, seo-services-nepal" },
  { post: "seo-for-colleges-nepal", services: "seo-services-nepal, google-ads-ppc, digital-marketing-nepal" },
  { post: "shopify-seo-nepal", services: "technical-seo, seo-services-nepal, advanced-seo" },
  { post: "technical-seo-audit-cost", services: "technical-seo, advanced-seo, seo-services-nepal" },
];
