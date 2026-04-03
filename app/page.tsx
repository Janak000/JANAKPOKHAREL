import type { Route } from "next";
import Link from "next/link";

import { AppIcon } from "@/components/icon";
import { getSiteContent } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const content = await getSiteContent();
  const latestPosts = content.blog.posts.slice(0, 3);

  return (
    <>
      <section className="hero-section" id="home">
        <div className="shell hero-grid">
          <div className="hero-copy">
            <div className="availability-pill">{content.hero.availability}</div>
            <p className="eyebrow">{content.hero.eyebrow}</p>
            <h1>{content.hero.headline}</h1>
            <p className="lede">{content.hero.description}</p>

            <div className="cta-row">
              <Link className="button button-primary" href={content.hero.primaryCta.href as Route}>
                {content.hero.primaryCta.label}
              </Link>
              <Link className="button button-secondary" href={content.hero.secondaryCta.href as Route}>
                {content.hero.secondaryCta.label}
              </Link>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-image-card">
              <img alt={content.hero.image.alt} className="hero-image" src={content.hero.image.src} />
            </div>
            <div className="floating-stat">
              <AppIcon className="stat-icon" name="trending-up" />
              <div>
                <strong>{content.hero.stat.value}</strong>
                <span>{content.hero.stat.label}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-block" id="about">
        <div className="shell">
          <div className="bento-grid about-grid">
            <article className="panel panel-large">
              <p className="section-kicker">About</p>
              <h2>{content.about.title}</h2>
              <p className="section-copy">{content.about.intro}</p>
              <p className="section-copy">{content.about.body}</p>

              <div className="stat-grid">
                {content.about.stats.map((item) => (
                  <div key={item.label} className="mini-stat">
                    <strong>{item.value}</strong>
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </article>

            <div className="stacked-cards">
              {content.about.highlightCards.map((item) => (
                <article key={item.title} className="panel panel-tall">
                  <AppIcon className="card-icon" name={item.icon} />
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="section-heading">
            <p className="section-kicker">Brands</p>
            <h2>{content.about.organizationsTitle}</h2>
          </div>

          <div className="logo-grid">
            {content.about.organizations.map((org) => (
              <article key={org.name} className="logo-card">
                <img alt={org.alt} src={org.logo} />
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-block" id="services">
        <div className="shell">
          <div className="section-heading">
            <p className="section-kicker">Services</p>
            <h2>Core expertise built for growth</h2>
          </div>

          <div className="cards-grid">
            {content.services.map((service) => (
              <article key={service.title} className="panel">
                <div className="service-icon">
                  <AppIcon name={service.icon} />
                </div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-block" id="projects">
        <div className="shell">
          <div className="section-heading">
            <p className="section-kicker">Portfolio</p>
            <h2>{content.projects.title}</h2>
            <p className="section-copy">{content.projects.intro}</p>
          </div>

          <div className="project-showcase">
            {content.projects.items.map((project) => (
              <article key={project.title} className="panel project-card">
                <div className="project-image-wrap">
                  <img alt={project.image.alt} src={project.image.src} />
                </div>

                <div className="project-card-body">
                  <p className="project-meta">{project.category}</p>

                  <div className="project-heading">
                    <h3>{project.title}</h3>
                    {project.result ? <span className="project-result">{project.result}</span> : null}
                  </div>

                  <p>{project.description}</p>

                  <div className="project-tags">
                    {project.tags.map((tag) => (
                      <span key={tag} className="project-tag">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {project.href ? (
                    <Link className="text-link" href={project.href as Route}>
                      {project.ctaLabel ?? "View project"}
                    </Link>
                  ) : null}
                </div>
              </article>
            ))}
          </div>

          <article className="panel project-note">
            <div className="project-note-copy">
              <AppIcon className="lock-icon" name="lock" />
              <div>
                <h3>{content.projects.lockedTitle}</h3>
                <p>{content.projects.lockedDescription}</p>
              </div>
            </div>

            <Link className="button button-primary" href={content.projects.lockedCtaHref as Route}>
              {content.projects.lockedCtaLabel}
            </Link>
          </article>
        </div>
      </section>

      <section className="section-block">
        <div className="shell resume-grid">
          <div>
            <p className="section-kicker">Experience</p>
            <div className="timeline-list">
              {content.resume.experience.map((item) => (
                <article key={`${item.title}-${item.subtitle}`} className="timeline-item">
                  <h3>{item.title}</h3>
                  <p className="timeline-meta">
                    {item.href ? (
                      <a href={item.href} rel="noreferrer" target="_blank">
                        {item.subtitle}
                      </a>
                    ) : (
                      item.subtitle
                    )}
                  </p>
                  <ul>
                    {item.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>

          <div>
            <p className="section-kicker">Education</p>
            <div className="timeline-list">
              {content.resume.education.map((item) => (
                <article key={`${item.title}-${item.subtitle}`} className="timeline-item">
                  <h3>{item.title}</h3>
                  <p className="timeline-meta">{item.subtitle}</p>
                  <ul>
                    {item.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>

          <div>
            <p className="section-kicker">Certifications</p>
            <div className="timeline-list">
              {content.resume.certifications.map((item) => (
                <article key={`${item.title}-${item.subtitle}`} className="timeline-item">
                  <h3>{item.title}</h3>
                  <p className="timeline-meta">{item.subtitle}</p>
                  <ul>
                    {item.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-block" id="blog">
        <div className="shell">
          <div className="section-heading section-heading-inline">
            <div>
              <p className="section-kicker">Blogs</p>
              <h2>Latest insights</h2>
            </div>
            <Link className="button button-secondary" href="/blog">
              View All
            </Link>
          </div>

          <div className="cards-grid">
            {latestPosts.map((post) => (
              <article key={post.slug} className="panel blog-card">
                <p className="blog-meta">
                  {post.date} - {post.readTime}
                </p>
                <h3>{post.title}</h3>
                <p>{post.excerpt}</p>
                <Link className="text-link" href={`/blog/${post.slug}`}>
                  Read blog
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-block" id="contact">
        <div className="shell contact-grid">
          <div>
            <p className="section-kicker">Contact</p>
            <h2>{content.contact.title}</h2>
            <p className="section-copy">{content.contact.intro}</p>

            <div className="contact-list">
              <a href={`mailto:${content.site.email}`}>
                <AppIcon name="mail" />
                <span>{content.site.email}</span>
              </a>
              <a href={`tel:${content.site.phone}`}>
                <AppIcon name="phone" />
                <span>{content.site.phone}</span>
              </a>
              <div>
                <AppIcon name="map-pin" />
                <span>{content.site.location}</span>
              </div>
            </div>
          </div>

          <article className="panel whatsapp-panel">
            <AppIcon className="whatsapp-icon" name="message-circle" />
            <h3>{content.contact.whatsappTitle}</h3>
            <p>{content.contact.whatsappDescription}</p>
            <a
              className="button button-primary"
              href={`https://wa.me/${content.site.whatsapp}`}
              rel="noreferrer"
              target="_blank"
            >
              Message on WhatsApp
            </a>
          </article>
        </div>
      </section>
    </>
  );
}
