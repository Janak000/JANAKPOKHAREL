import Link from "next/link";
import Image from "next/image";
import {
  getAbout,
  getHero,
  getPosts,
  getProjects,
  getServices,
  getSettings,
} from "@/lib/cms";
import { Icon } from "@/components/icon";
import { PostCard } from "@/components/post-card";
import { JsonLd } from "@/components/json-ld";

export const revalidate = 120;

const homeFaqs = [
  {
    question: "What does an SEO and Ads manager actually do?",
    answer:
      "I combine search engine optimization and paid advertising into one growth system. That means technical SEO audits, keyword and content strategy, and hands-on management of Meta Ads and Google Ads campaigns, all measured against real business results like leads and revenue rather than vanity metrics.",
  },
  {
    question: "Do you work with businesses outside Nepal?",
    answer:
      "Yes. I am based in Kathmandu, Nepal and work with startups and growing businesses worldwide. Search and paid advertising are global channels, so most of my work is delivered remotely with clear reporting and direct communication over email or WhatsApp.",
  },
  {
    question: "How long does SEO take to show results?",
    answer:
      "SEO is a compounding investment. Technical fixes can help within weeks, but durable ranking and organic traffic growth usually take three to six months of consistent optimization and content. Paid ads, by contrast, can generate leads within days, which is why I often pair the two.",
  },
  {
    question: "Should I invest in SEO or paid ads first?",
    answer:
      "It depends on your timeline and budget. If you need leads quickly, start with Meta Ads or Google Ads for speed. If you want lower long-term acquisition costs, invest in SEO. The strongest strategy usually sequences both so paid traffic funds growth while organic visibility compounds.",
  },
];

export default async function HomePage() {
  const [settings, hero, about, services, projects, posts] = await Promise.all([
    getSettings(),
    getHero(),
    getAbout(),
    getServices(),
    getProjects(),
    getPosts(),
  ]);

  const latestPosts = posts.slice(0, 3);
  const featuredProjects = projects.slice(0, 3);

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: homeFaqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

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
                  <img src={org.logo} alt={org.alt} loading="lazy" />
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
              <p className="kicker">What I Do</p>
              <h2>Services built around measurable growth</h2>
            </div>
            <Link href="/services" className="text-link">
              All services <Icon name="arrow-right" size={16} />
            </Link>
          </div>
          <div className="card-grid">
            {services.slice(0, 6).map((service) => (
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
              <p className="kicker">Selected Work</p>
              <h2>Brands and campaigns I&apos;ve supported</h2>
            </div>
            <Link href="/portfolio" className="text-link">
              Full portfolio <Icon name="arrow-right" size={16} />
            </Link>
          </div>
          <div className="card-grid">
            {featuredProjects.map((project) => (
              <article key={project.title} className="project-card">
                <div className="project-media">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={project.imageSrc} alt={project.imageAlt} loading="lazy" />
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
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/image/janak-life-2.webp"
                alt="Janak Pokharel working on a laptop"
                loading="lazy"
              />
              <span className="photo-caption">
                <Icon name="sparkles" size={14} /> Deep work mode
              </span>
            </div>
            <div>
              <p className="kicker">Behind the Work</p>
              <h2 style={{ fontSize: "clamp(26px, 3.4vw, 38px)", marginBottom: 16 }}>
                No account layers. No recycled playbooks. Just focused execution.
              </h2>
              <p style={{ color: "var(--text-muted)", fontSize: 16.5 }}>
                When you work with me, the person building your strategy is the same
                person executing it. That means faster decisions, honest reporting,
                and campaigns shaped around your actual business, not a template.
              </p>
              <ul className="checklist">
                <li>
                  <Icon name="check" size={18} />
                  Strategy, execution, and reporting handled by one accountable person
                </li>
                <li>
                  <Icon name="check" size={18} />
                  Weekly progress you can actually see, rankings, leads, and revenue
                </li>
                <li>
                  <Icon name="check" size={18} />
                  Direct communication on WhatsApp or email, no ticket queues
                </li>
              </ul>
              <div className="hero-actions" style={{ marginTop: 30 }}>
                <Link href="/about" className="btn btn-ghost">
                  More about me <Icon name="arrow-right" size={16} />
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
              <p className="kicker">From the Blog</p>
              <h2>Latest digital marketing insights</h2>
            </div>
            <Link href="/blog" className="text-link">
              All articles <Icon name="arrow-right" size={16} />
            </Link>
          </div>
          <div className="post-grid">
            {latestPosts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ — real content + FAQ schema for search & AI answers */}
      <section className="section">
        <div className="container">
          <JsonLd data={faqLd} />
          <div className="section-head" style={{ maxWidth: 720 }}>
            <p className="kicker">Common Questions</p>
            <h2>SEO, Meta Ads &amp; Google Ads, answered</h2>
            <p>
              A few things business owners ask before starting a search and paid
              advertising project with a dedicated SEO and Ads manager.
            </p>
          </div>
          <div className="faq-list" style={{ maxWidth: 820 }}>
            {homeFaqs.map((faq, i) => (
              <details key={faq.question} className="faq-item" open={i === 0}>
                <summary>{faq.question}</summary>
                <div>{faq.answer}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="container">
          <div className="cta-band">
            <p className="kicker" style={{ justifyContent: "center" }}>
              Ready When You Are
            </p>
            <h2>Let&apos;s build your next growth system</h2>
            <p>
              Whether it&apos;s SEO, paid ads, or a full-funnel strategy, tell me about
              your business and I&apos;ll show you exactly where the opportunity is.
            </p>
            <div className="hero-actions" style={{ justifyContent: "center" }}>
              <Link href="/contact" className="btn btn-primary btn-lg">
                Start a Project <Icon name="arrow-right" size={18} />
              </Link>
              <a
                href={`https://wa.me/${settings.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost btn-lg"
              >
                <Icon name="message-circle" size={18} /> WhatsApp Me
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
