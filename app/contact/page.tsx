import type { Metadata } from "next";
import Link from "next/link";
import { getContact, getSettings, absoluteUrl } from "@/lib/cms";
import { Icon } from "@/components/icon";
import { JsonLd } from "@/components/json-ld";
import { ContactForm } from "@/components/contact-form";

export const revalidate = 120;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    title: "Contact an SEO & Ads Manager in Nepal",
    description: `Contact ${settings.name} for SEO, Meta Ads, and Google Ads projects. Based in ${settings.location}, working worldwide. Reply within 24 hours.`,
    alternates: { canonical: "/contact" },
    openGraph: {
      title: `Contact ${settings.name} | SEO & Ads Manager`,
      description: `Start an SEO, Meta Ads, or Google Ads project with ${settings.name}. Based in ${settings.location}, working worldwide.`,
      url: absoluteUrl("/contact"),
    },
  };
}

export default async function ContactPage() {
  const [settings, contact] = await Promise.all([getSettings(), getContact()]);

  const phoneDigits = settings.phone.replace(/[^+\d]/g, "");

  const contactLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: `Contact ${settings.name}`,
    url: absoluteUrl("/contact"),
    about: { "@id": `${absoluteUrl("/")}#person` },
    mainEntity: {
      "@type": "Person",
      "@id": `${absoluteUrl("/")}#person`,
      name: settings.name,
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "Sales",
        email: settings.email,
        telephone: phoneDigits,
        areaServed: "Worldwide",
        availableLanguage: ["English", "Nepali"],
      },
    },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "Contact", item: absoluteUrl("/contact") },
    ],
  };

  return (
    <>
      <JsonLd data={contactLd} />
      <JsonLd data={breadcrumbLd} />
      <section className="page-hero">
        <div className="container">
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span className="sep">/</span>
            <span>Contact</span>
          </nav>
          <p className="kicker">Contact</p>
          <h1>{contact.title}</h1>
          <p>{contact.intro}</p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 24 }}>
        <div className="container">
          <div className="contact-layout">
            <div className="contact-channels">
              <a
                href={`https://wa.me/${settings.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-channel"
              >
                <div className="card-icon">
                  <Icon name="message-circle" size={20} />
                </div>
                <div>
                  <h3>{contact.whatsappTitle}</h3>
                  <p>{contact.whatsappDescription}</p>
                </div>
              </a>
              <a href={`mailto:${settings.email}`} className="contact-channel">
                <div className="card-icon">
                  <Icon name="mail" size={20} />
                </div>
                <div>
                  <h3>Email</h3>
                  <p className="value">{settings.email}</p>
                </div>
              </a>
              <a
                href={`tel:${settings.phone.replace(/[^+\d]/g, "")}`}
                className="contact-channel"
              >
                <div className="card-icon">
                  <Icon name="phone" size={20} />
                </div>
                <div>
                  <h3>Phone</h3>
                  <p className="value">{settings.phone}</p>
                </div>
              </a>
              <div className="contact-channel">
                <div className="card-icon">
                  <Icon name="map-pin" size={20} />
                </div>
                <div>
                  <h3>Location</h3>
                  <p>{settings.location}, working with clients worldwide</p>
                </div>
              </div>

              <div className="photo-frame">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/image/janak-life-3.webp"
                  alt="Janak Pokharel seated in traditional Nepali carved-wood architecture in Kathmandu"
                  loading="lazy"
                />
                <span className="photo-caption">
                  <Icon name="map-pin" size={13} /> Rooted in Kathmandu, working worldwide
                </span>
              </div>
            </div>

            <div className="contact-form-col">
              <ContactForm />
              <div className="photo-frame contact-desk-photo">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/image/janak-desk.webp"
                  alt="Janak Pokharel working at a dual-monitor desk reviewing an SEO dashboard in Kathmandu, Nepal"
                  title="Janak Pokharel managing SEO and ads campaigns"
                  width={900}
                  height={1050}
                  loading="lazy"
                  decoding="async"
                />
                <span className="photo-caption">
                  <Icon name="bar-chart" size={13} /> Hands on your SEO and ads, every week
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What to expect — adds real content, sets expectations, aids conversion */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-head" style={{ maxWidth: 680 }}>
            <p className="kicker">What Happens Next</p>
            <h2>From first message to a clear plan</h2>
            <p>
              Reaching out costs nothing and there is no obligation. Here is
              exactly how the first conversation works.
            </p>
          </div>
          <div className="card-grid">
            <div className="card">
              <div className="card-icon"><Icon name="message-circle" size={22} /></div>
              <h3>1. You get in touch</h3>
              <p>
                Send a message with your website and goals. The more context you
                share about your business, the sharper my first response can be.
              </p>
            </div>
            <div className="card">
              <div className="card-icon"><Icon name="search" size={22} /></div>
              <h3>2. I review your situation</h3>
              <p>
                I look at your site, search visibility, and current ads, then reply
                within 24 hours with honest, specific direction, not a generic pitch.
              </p>
            </div>
            <div className="card">
              <div className="card-icon"><Icon name="target" size={22} /></div>
              <h3>3. We map the opportunity</h3>
              <p>
                On a short call we agree where the fastest wins are across SEO,
                Meta Ads, and Google Ads, and what a realistic plan and budget look like.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <JsonLd data={contactFaqLd} />
          <div className="section-head" style={{ maxWidth: 680 }}>
            <p className="kicker">Before You Reach Out</p>
            <h2>Contact FAQs</h2>
          </div>
          <div className="faq-list" style={{ maxWidth: 820 }}>
            {contactFaqs.map((faq, i) => (
              <details key={faq.question} className="faq-item" open={i === 0}>
                <summary>{faq.question}</summary>
                <div>{faq.answer}</div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

const contactFaqs = [
  {
    question: "How quickly will you respond?",
    answer:
      "I reply to every genuine enquiry within 24 hours, usually much sooner. For quick questions, WhatsApp is the fastest way to reach me.",
  },
  {
    question: "How much do your SEO and ads services cost?",
    answer:
      "Pricing depends on scope, competition, and goals. After a short conversation I give you a clear, honest quote with no long lock-in contracts, so you always know what you are paying for.",
  },
  {
    question: "Do you work with small businesses and startups?",
    answer:
      "Yes. Most of my clients are small and growing businesses that want focused execution and direct communication rather than a large agency retainer.",
  },
  {
    question: "Which locations do you serve?",
    answer:
      "I am based in Kathmandu, Nepal and work with clients worldwide. Search and paid advertising are delivered remotely, with clear reporting throughout.",
  },
];

const contactFaqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: contactFaqs.map((f) => ({
    "@type": "Question",
    name: f.question,
    acceptedAnswer: { "@type": "Answer", text: f.answer },
  })),
};
