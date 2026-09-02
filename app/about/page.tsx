import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getAbout, getHero, getResume, getSettings, absoluteUrl } from "@/lib/cms";
import { Icon } from "@/components/icon";
import { JsonLd } from "@/components/json-ld";

export const revalidate = 120;

export async function generateMetadata(): Promise<Metadata> {
  const [settings, about] = await Promise.all([getSettings(), getAbout()]);
  return {
    title: `About ${settings.name}, ${settings.role}`,
    description: about.intro,
    alternates: { canonical: "/about" },
    openGraph: {
      title: `About ${settings.name}`,
      description: about.intro,
      url: absoluteUrl("/about"),
    },
  };
}

const kindMeta = {
  experience: { title: "Experience", icon: "briefcase" },
  education: { title: "Education", icon: "graduation-cap" },
  certification: { title: "Certifications", icon: "award" },
} as const;

export default async function AboutPage() {
  const [settings, hero, about, resume] = await Promise.all([
    getSettings(),
    getHero(),
    getAbout(),
    getResume(),
  ]);

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "About", item: absoluteUrl("/about") },
    ],
  };

  return (
    <>
      <JsonLd data={breadcrumbLd} />
      <section className="page-hero">
        <div className="container">
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span className="sep">/</span>
            <span>About</span>
          </nav>
          <p className="kicker">{about.kicker}</p>
          <h1>{about.title}</h1>
          <p>{about.intro}</p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 24 }}>
        <div className="container">
          <div className="hero-grid" style={{ alignItems: "start" }}>
            <div>
              <p className="prose" style={{ marginBottom: 32 }}>
                {about.body}
              </p>
              <div className="card-grid card-grid-2">
                {about.highlights.map((h) => (
                  <div key={h.title} className="card">
                    <div className="card-icon">
                      <Icon name={h.icon} size={22} />
                    </div>
                    <h3>{h.title}</h3>
                    <p>{h.description}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="hero-figure">
              <div className="photo-frame" style={{ width: "min(420px, 88vw)" }}>
                <Image
                  src="/image/janak-life-1.webp"
                  alt="Janak Pokharel in front of a wall of handwritten notes"
                  width={420}
                  height={480}
                  style={{ width: "100%", height: "auto" }}
                />
                <span className="photo-caption">Every idea starts on paper</span>
              </div>
              <div className="hero-stat">
                <strong>{settings.role}</strong>
                <span>{settings.location}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="section-head">
            <p className="kicker">My Journey</p>
            <h2>Experience, education &amp; credentials</h2>
          </div>
          <div className="timeline-columns">
            {(["experience", "education", "certification"] as const).map((kind) => {
              const entries = resume
                .filter((r) => r.kind === kind)
                .sort((a, b) => a.sortOrder - b.sortOrder);
              const meta = kindMeta[kind];
              return (
                <div key={kind} className="timeline-col">
                  <h3>
                    <Icon name={meta.icon} size={20} /> {meta.title}
                  </h3>
                  {entries.map((entry) => (
                    <div key={`${entry.title}-${entry.subtitle}`} className="timeline-entry">
                      <h4>{entry.title}</h4>
                      {entry.href ? (
                        <a
                          className="subtitle"
                          href={entry.href}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {entry.subtitle}
                        </a>
                      ) : (
                        <span className="subtitle">{entry.subtitle}</span>
                      )}
                      <ul>
                        {entry.points.map((p) => (
                          <li key={p}>{p}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <p className="kicker">Trusted By</p>
            <h2>{about.organizationsTitle}</h2>
          </div>
          <div className="logo-marquee">
            <div className="logo-track">
              {[...about.organizations, ...about.organizations].map((org, i) => (
                <div key={`${org.name}-${i}`} className="logo-item">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={org.logo} alt={org.alt} loading="lazy" />
                  <span>{org.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="cta-band">
            <h2>Want to work together?</h2>
            <p>
              I&apos;m currently available for new SEO and ads projects. Let&apos;s talk
              about what growth looks like for your business.
            </p>
            <Link href="/contact" className="btn btn-primary btn-lg">
              Get in Touch <Icon name="arrow-right" size={18} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
