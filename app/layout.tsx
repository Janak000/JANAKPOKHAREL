import type { Metadata, Viewport } from "next";
import { Inter, Sora } from "next/font/google";
import Script from "next/script";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ChromeGate } from "@/components/chrome-gate";
import { JsonLd } from "@/components/json-ld";
import { getSettings, getServices, siteUrl, absoluteUrl } from "@/lib/cms";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const sora = Sora({ subsets: ["latin"], variable: "--font-sora", display: "swap" });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#06080f" },
    { media: "(prefers-color-scheme: light)", color: "#d54835" },
  ],
};

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    metadataBase: new URL(siteUrl()),
    title: {
      // Homepage title lengthened to the 50-60 char sweet spot with a local keyword.
      default: `${settings.name} | ${settings.role} in Nepal`,
      template: `%s | ${settings.name}`,
    },
    description: settings.description,
    keywords: settings.keywords,
    authors: [{ name: settings.name, url: siteUrl() }],
    creator: settings.name,
    openGraph: {
      type: "website",
      locale: "en_US",
      url: siteUrl(),
      siteName: settings.name,
      title: `${settings.name} | ${settings.role}`,
      description: settings.description,
      images: [{ url: settings.ogImage, width: 1200, height: 630, alt: settings.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${settings.name} | ${settings.role}`,
      description: settings.description,
      images: [settings.ogImage],
    },
    // Only googleBot directives here. A top-level index/follow emitted a
    // <meta name="robots" content="index, follow"> that was inherited by
    // not-found, colliding with the noindex Next emits there - two conflicting
    // robots tags on the most-crawled error surface. Indexing is the default
    // when no robots tag is present, so the tag bought nothing.
    robots: {
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    alternates: {
      canonical: "/",
      // hreflang removed: it was emitted only on the homepage and only ever
      // pointed at "/", so on a single-language site it said nothing while
      // being inconsistent across pages - worse than absent.
      // NOTE: this `alternates` block is replaced, not merged, by any route
      // that sets its own alternates (the service and blog routes do), so the
      // RSS link below still only reaches routes that do not override it.
      types: { "application/rss+xml": absoluteUrl("/feed.xml") },
    },
    icons: {
      icon: [
        { url: "/image/favicon.png", type: "image/png", sizes: "64x64" },
        { url: "/image/logo.webp", type: "image/webp" },
      ],
      apple: "/image/apple-icon.png",
      shortcut: "/image/favicon.png",
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, services] = await Promise.all([getSettings(), getServices()]);

  const personLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${siteUrl()}/#person`,
    name: settings.name,
    jobTitle: settings.role,
    description: settings.description,
    url: siteUrl(),
    image: absoluteUrl("/image/logo.webp"),
    logo: absoluteUrl("/image/logo.webp"),
    email: `mailto:${settings.email}`,
    telephone: settings.phone,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Kathmandu",
      addressCountry: "NP",
    },
    sameAs: [settings.facebook, settings.linkedin],
    knowsAbout: [
      "Search Engine Optimization",
      "Meta Ads",
      "Google Ads",
      "Technical SEO",
      "Conversion Rate Optimization",
      "Digital Marketing",
    ],
  };

  const websiteLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl()}/#website`,
    name: settings.name,
    url: siteUrl(),
    description: settings.description,
    publisher: { "@id": `${siteUrl()}/#person` },
    inLanguage: "en",
  };

  // Local / professional-service schema — improves local search visibility
  // for queries like "SEO expert Kathmandu / Nepal".
  const businessLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${siteUrl()}/#business`,
    name: `${settings.name} — ${settings.role}`,
    image: absoluteUrl("/image/logo.webp"),
    url: siteUrl(),
    telephone: settings.phone,
    email: settings.email,
    priceRange: "$$",
    founder: { "@id": `${siteUrl()}/#person` },
    areaServed: "Worldwide",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Kathmandu",
      addressRegion: "Bagmati",
      addressCountry: "NP",
    },
    sameAs: [settings.facebook, settings.linkedin],
  };

  const supabaseOrigin = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();

  return (
    <html lang="en" className={`${inter.variable} ${sora.variable}`}>
      <body>
        {/* React hoists these resource hints into <head> */}
        {supabaseOrigin && (
          <>
            <link rel="preconnect" href={supabaseOrigin} crossOrigin="anonymous" />
            <link rel="dns-prefetch" href={supabaseOrigin} />
          </>
        )}
        {settings.gtmId && (
          <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        )}
        {settings.gtmId && (
          <>
            <Script id="gtm" strategy="afterInteractive">
              {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${settings.gtmId}');`}
            </Script>
            <noscript>
              <iframe
                src={`https://www.googletagmanager.com/ns.html?id=${settings.gtmId}`}
                height="0"
                width="0"
                style={{ display: "none", visibility: "hidden" }}
              />
            </noscript>
          </>
        )}
        <JsonLd data={personLd} />
        <JsonLd data={websiteLd} />
        <JsonLd data={businessLd} />
        <div className="bg-ambient" />
        <div className="bg-grid" />
        <SiteHeader name={settings.name} />
        <main>{children}</main>
        <ChromeGate>
          <SiteFooter settings={settings} services={services} />
        </ChromeGate>
      </body>
    </html>
  );
}
