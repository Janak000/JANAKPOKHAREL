import Link from "next/link";
import Image from "next/image";
import {
  absoluteUrl,
  getAbout,
  getHero,
  getHome,
  getPosts,
  getProjects,
  getServices,
  getSettings,
} from "@/lib/cms";
import { Icon } from "@/components/icon";
import { PostCard } from "@/components/post-card";
import { FaqSection } from "@/components/faq-section";
import { CtaBand } from "@/components/sections";

export const revalidate = 120;

export default async function HomePage() {
  const [settings, hero, home, about, services, projects, posts] = await Promise.all([
    getSettings(),
    getHero(),
    getHome(),
    getAbout(),
    getServices(),
    getProjects(),
    getPosts(),
  ]);

  const latestPosts = posts.slice(0, 6);
  const featuredProjects = projects.slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <span className="hero-availability">
              <span className="dot" />
              {hero.availability}
            </span>
            <p className="hero-eyebrow">{hero.eyebrow}</p>
            <h1>
              <span className="gradient-text">{hero.headline.split(" ").slice(0, 3).join(" ")}</span>{" "}
              {hero.headline.split(" ").slice(3).join(" ")}
            </h1>
            <p className="hero-description">{hero.description}</p>
            <div className="hero-actions">
              <Link href={hero.primaryCtaHref} className="btn btn-primary btn-lg">
                {hero.primaryCtaLabel} <Icon name="arrow-right" size={18} />
              </Link>
              <Link href={hero.secondaryCtaHref} className="btn btn-ghost btn-lg">
                {hero.secondaryCtaLabel}
              </Link>
            </div>
          </div>
          <div className="hero-figure">
            <div className="hero-photo-wrap">
              <Image
                src={hero.imageSrc}
                alt={hero.imageAlt}
                width={380}
                height={475}
                priority
              />
            </div>
            <div className="hero-stat">
              <strong>{hero.statValue}</strong>
              <span>{hero.statLabel}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="section" style={{ paddingTop: 20 }}>
        <div className="container">
          <div className="stats-band">
            {about.stats.map((s) => (
              <div key={s.label} className="stat-item">
                <strong>{s.value}</strong>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Organizations marquee */}
      <section style={{ padding: "10px 0 60px" }}>
        <div className="container">
          <div className="logo-marquee">
            <div className="logo-track">
              {[...about.organizations, ...about.organizations].map((org, i) => (
                <div key={`${org.name}-${i}`} className="logo-item">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={org.logo} alt={org.alt} width={44} height={44} loading="lazy" />
                  <span>{org.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-head section-head-row">
            <div>
              <p className="kicker">{home.servicesKicker}</p>
              <h2>{home.servicesTitle}</h2>
            </div>
            <Link href="/services" className="text-link">
              {home.servicesLinkLabel} <Icon name="arrow-right" size={16} />
            </Link>
          </div>
          <div className="card-grid">
            {services.map((service) => (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className="card"
              >
                <div className="card-icon">
                  <Icon name={service.icon} size={24} />
                </div>
                <h3>{service.title}</h3>
                <p>{service.shortDescription}</p>
                <span className="text-link">
                  Learn more <Icon name="arrow-right" size={15} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured work */}
      <section className="section">
        <div className="container">
          <div className="section-head section-head-row">
            <div>
              <p className="kicker">{home.workKicker}</p>
              <h2>{home.workTitle}</h2>
            </div>
            <Link href="/portfolio" className="text-link">
              {home.workLinkLabel} <Icon name="arrow-right" size={16} />
            </Link>
          </div>
          <div className="card-grid">
            {featuredProjects.map((project) => (
              <article key={project.title} className="project-card">
                <div className="project-media">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={project.imageSrc}
                    alt={project.imageAlt}
                    width={88}
                    height={88}
                    loading="lazy"
                  />
                </div>
                <div className="project-body">
                  <span className="project-category">{project.category}</span>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <div className="project-tags">
                    {project.tags.map((tag) => (
                      <span key={tag} className="chip">
                        {tag}
                      </span>
                    ))}
                  </div>
                  {project.result && (
                    <span className="project-result">
                      <Icon name="check" size={15} /> {project.result}
                    </span>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Behind the work */}
      <section className="section">
        <div className="container">
          <div className="photo-split">
            <div className="photo-frame">
              <Image
                src="/image/janak-life-2.webp"
                alt="Janak Pokharel working on a laptop"
                width={800}
                height={1067}
                sizes="(max-width: 900px) 100vw, 520px"
                style={{ width: "100%", height: "auto" }}
              />
              <span className="photo-caption">
                <Icon name="sparkles" size={14} /> Deep work mode
              </span>
            </div>
            <div>
              <p className="kicker">{home.behindKicker}</p>
              <h2 style={{ fontSize: "clamp(26px, 3.4vw, 38px)", marginBottom: 16 }}>
                {home.behindTitle}
              </h2>
              <p style={{ color: "var(--text-muted)", fontSize: 16.5 }}>{home.behindBody}</p>
              <ul className="checklist">
                {(home.behindPoints ?? []).map((point) => (
                  <li key={point.text}>
                    <Icon name="check" size={18} />
                    {point.text}
                  </li>
                ))}
              </ul>
              <div className="hero-actions" style={{ marginTop: 30 }}>
                <Link href="/about" className="btn btn-ghost">
                  {home.behindLinkLabel} <Icon name="arrow-right" size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest posts */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-head section-head-row">
            <div>
              <p className="kicker">{home.blogKicker}</p>
              <h2>{home.blogTitle}</h2>
            </div>
            <Link href="/blog" className="text-link">
              {home.blogLinkLabel} <Icon name="arrow-right" size={16} />
            </Link>
          </div>
          <div className="post-grid">
            {latestPosts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ: real content plus FAQPage schema for search and AI answers. Editable in the CMS. */}
      <FaqSection
        kicker={home.faqKicker}
        title={home.faqTitle}
        intro={home.faqIntro}
        faqs={home.faqs}
        pageUrl={absoluteUrl("/")}
        ctaHref="/contact"
      />

      <CtaBand
        kicker={home.ctaKicker}
        title={home.ctaTitle}
        text={home.ctaText}
        primaryLabel={home.ctaPrimaryLabel}
        primaryHref="/contact"
        secondaryLabel={home.ctaSecondaryLabel}
        secondaryHref={`https://wa.me/${settings.whatsapp}`}
        flush={false}
      />
    </>
  );
}
