import type { Metadata } from "next";
import type { ReactNode } from "react";
import Script from "next/script";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getSiteContent } from "@/lib/site-content";

import "./globals.css";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { site } = await getSiteContent();

  return {
    metadataBase: new URL(site.url),
    title: {
      default: `${site.name} | ${site.role}`,
      template: `%s | ${site.name}`
    },
    description: site.description,
    keywords: site.keywords,
    alternates: {
      canonical: site.url
    },
    openGraph: {
      title: `${site.name} | ${site.role}`,
      description: site.description,
      url: site.url,
      siteName: site.name,
      images: [
        {
          url: site.ogImage,
          width: 1200,
          height: 630,
          alt: `${site.name} – SEO & Ads Manager portfolio`
        }
      ],
      locale: "en_US",
      type: "website"
    },
    twitter: {
      card: "summary_large_image",
      title: `${site.name} | ${site.role}`,
      description: site.description,
      images: [site.ogImage]
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-snippet": -1,
        "max-image-preview": "large",
        "max-video-preview": -1
      }
    },
    icons: {
      icon: "/image/favicon.webp",
      shortcut: "/image/favicon.webp"
    }
  };
}

export default async function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  const { site } = await getSiteContent();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${site.url}/#person`,
        name: site.name,
        url: site.url,
        image: {
          "@type": "ImageObject",
          url: `${site.url}/image/janak.webp`,
          width: 1066,
          height: 1600
        },
        jobTitle: site.role,
        description: site.description,
        email: site.email,
        telephone: site.phone,
        address: {
          "@type": "PostalAddress",
          addressLocality: "Kathmandu",
          addressCountry: "NP"
        },
        sameAs: [
          site.linkedin ?? "https://www.linkedin.com/in/janak-pokharel",
          site.facebook ?? "https://www.facebook.com/janak.pokharel7788"
        ].filter(Boolean)
      },
      {
        "@type": "WebSite",
        "@id": `${site.url}/#website`,
        url: site.url,
        name: site.name,
        description: site.description,
        publisher: { "@id": `${site.url}/#person` }
      }
    ]
  };

  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#08111d" />
        <link rel="preconnect" href="https://atjlewpmixrtvenkrvnb.supabase.co" />
        <Script
          id="json-ld-person"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          strategy="beforeInteractive"
        />
      </head>
      <body>
        <a className="skip-link" href="#main-content">
          Skip to main content
        </a>
        <SiteHeader />
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}import type { Metadata } from "next";
import type { ReactNode } from "react";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getSiteContent } from "@/lib/site-content";

import "./globals.css";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { site } = await getSiteContent();

  return {
    metadataBase: new URL(site.url),
    title: {
      default: `${site.name} | ${site.role}`,
      template: `%s | ${site.name}`
    },
    description: site.description,
    keywords: site.keywords,
    alternates: {
      canonical: site.url
    },
    openGraph: {
      title: `${site.name} | ${site.role}`,
      description: site.description,
      url: site.url,
      siteName: site.name,
      images: [
        {
          url: site.ogImage,
          width: 1200,
          height: 630,
          alt: `${site.name} portfolio`
        }
      ],
      locale: "en_US",
      type: "website"
    },
    twitter: {
      card: "summary_large_image",
      title: `${site.name} | ${site.role}`,
      description: site.description,
      images: [site.ogImage]
    },
    robots: {
      index: true,
      follow: true
    },
    icons: {
      icon: "/image/favicon.webp"
    }
  };
}

export default async function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
