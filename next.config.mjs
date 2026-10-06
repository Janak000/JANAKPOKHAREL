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

      // Deleted service page Google still has queued as "Discovered". No
      // rebuild planned: seo-services-nepal covers the same intent.
      {
        source: "/services/ecommerce-seo-nepal",
        destination: "/services/seo-services-nepal",
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
  async rewrites() {
    // Browsers request /favicon.ico on their own; serve the existing PNG there
    // instead of returning a 404 on every first visit.
    return [{ source: "/favicon.ico", destination: "/image/favicon.png" }];
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
        // Brand and photo files keep stable names, so let browsers and the CDN
        // hold them for 30 days instead of revalidating on every visit.
        source: "/image/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=2592000, stale-while-revalidate=86400",
          },
        ],
      },
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
