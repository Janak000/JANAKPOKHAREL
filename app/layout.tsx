import type { Metadata } from "next";
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
