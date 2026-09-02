/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "**.supabase.in" },
    ],
  },
  async redirects() {
    return [
      { source: "/admin", destination: "/sanchalan", permanent: true },
      { source: "/blog.html", destination: "/blog", permanent: true },
      { source: "/index.html", destination: "/", permanent: true },

      // Legacy static site: best CTR on the whole property (18.2%), 44 impressions.
      {
        source: "/hire-seo-ads-manager/hire-ads-SEO-manager.html",
        destination: "/contact",
        permanent: true,
      },
      { source: "/hire-seo-ads-manager/seo-service.html", destination: "/services", permanent: true },

      // Deleted post Google still has indexed. 301 rather than restore: only 3 impressions.
      {
        source: "/blog/are-meta-ads-worth-it-2026",
        destination: "/blog",
        permanent: true,
      },

      // Never existed, but /services/advanced-seo links to it. Point at the hub
      // until a real GEO service page is written, then remove this rule.
      {
        source: "/services/geo-ai-search-optimization",
        destination: "/services/advanced-seo",
        permanent: true,
      },
      // Canonicalize: 301 www -> apex so there is one indexable host.
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.janakpokharel.com.np" }],
        destination: "https://janakpokharel.com.np/:path*",
        permanent: true,
      },
    ];
  },
  async headers() {
    // Security headers applied to every route. The CSP intentionally omits
    // default-src so it hardens the risky vectors (clickjacking, base-tag
    // hijacking, plugins, mixed content) without blocking GTM, GA, Supabase,
    // or self-hosted fonts/images.
    const securityHeaders = [
      {
        key: "Strict-Transport-Security",
        value: "max-age=63072000; includeSubDomains; preload",
      },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "SAMEORIGIN" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      {
        key: "Permissions-Policy",
        value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
      },
      { key: "X-DNS-Prefetch-Control", value: "on" },
      {
        key: "Content-Security-Policy",
        value:
          "frame-ancestors 'self'; object-src 'none'; base-uri 'self'; upgrade-insecure-requests",
      },
    ];
    return [
      { source: "/:path*", headers: securityHeaders },
      {
        // Admin panel: noindex via header, so robots.txt no longer has to
        // publish the path to every scanner that reads it.
        source: "/sanchalan/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
      {
        source: "/sanchalan",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
};

export default nextConfig;
