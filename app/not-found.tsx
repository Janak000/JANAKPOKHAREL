import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/icon";

/**
 * The 404 must be noindex and must NOT canonicalise to "/".
 * Without this export the route inherited the root layout's metadata, so every
 * missing URL claimed to be a duplicate of the homepage - textbook soft-404
 * signalling, which can suppress the homepage itself.
 */
export const metadata: Metadata = {
  title: "Page not found",
  // Next already emits <meta name="robots" content="noindex"> here, so we do
  // NOT set a top-level robots value - doing so produced two robots tags.
  // We only negate the inherited googleBot directives: Google gives its own
  // googlebot tag precedence, so leaving index/follow there would have told
  // Googlebot to index every 404 despite the generic noindex.
  robots: { googleBot: { index: false, follow: false } },
  // Must not canonicalise to "/" - that is soft-404 signalling and can
  // suppress the homepage.
  alternates: { canonical: null },
};

export default function NotFound() {
  return (
    <section className="page-hero" style={{ minHeight: "60vh" }}>
      <div className="container" style={{ textAlign: "center", paddingTop: 60 }}>
        <p className="kicker" style={{ justifyContent: "center" }}>
          404
        </p>
        <h1 style={{ margin: "0 auto 16px" }}>This page went off the map</h1>
        <p style={{ margin: "0 auto 32px" }}>
          The page you&apos;re looking for doesn&apos;t exist or was moved.
        </p>
        <Link href="/" className="btn btn-primary btn-lg">
          Back to Home <Icon name="arrow-right" size={18} />
        </Link>
      </div>
    </section>
  );
}
