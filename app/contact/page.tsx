import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getContact, getSettings, absoluteUrl } from "@/lib/cms";
import { Icon } from "@/components/icon";
import { JsonLd } from "@/components/json-ld";
import { ContactForm } from "@/components/contact-form";
import { FaqSection } from "@/components/faq-section";
import { SectionNote } from "@/components/sections";

export const revalidate = 120;

export async function generateMetadata(): Promise<Metadata> {
  const [settings, contact] = await Promise.all([getSettings(), getContact()]);
  return {
    title: contact.metaTitle || "Contact an SEO & Ads Manager in Nepal",
    description:
      contact.metaDescription ||
      `Contact ${settings.name} for SEO, Meta Ads, and Google Ads projects. Based in ${settings.location}, working worldwide. Reply within 24 hours.`,
    alternates: { canonical: "/contact" },
    openGraph: {
      images: [{ url: settings.ogImage, width: 1200, height: 630, alt: settings.name }],
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
          <h2 className="sr-only">Ways to contact me</h2>
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
                <Image
                  src="/image/janak-life-3.webp"
                  alt="Janak Pokharel seated in traditional Nepali carved-wood architecture in Kathmandu"
                  width={800}
                  height={1067}
                  sizes="(max-width: 900px) 100vw, 480px"
                  style={{ width: "100%", height: "auto" }}
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

      {/* What to expect: sets expectations and aids conversion. Editable in the CMS. */}
      {(contact.steps?.length ?? 0) > 0 && (
        <section className="section section-alt">
          <div className="container">
            <div className="section-head section-head-center">
              {contact.nextKicker && <p className="kicker">{contact.nextKicker}</p>}
              {contact.nextTitle && <h2>{contact.nextTitle}</h2>}
              {contact.nextIntro && <p>{contact.nextIntro}</p>}
            </div>
            <div className="card-grid card-grid-auto">
              {(contact.steps ?? []).map((step) => (
                <div key={step.title} className="card">
                  {step.icon && (
                    <div className="card-icon">
                      <Icon name={step.icon} size={22} />
                    </div>
                  )}
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              ))}
            </div>
            <SectionNote note={contact.nextNote} />
          </div>
        </section>
      )}

      <FaqSection
        kicker={contact.faqKicker}
        title={contact.faqTitle || "Contact FAQs"}
        intro={contact.faqIntro}
        faqs={contact.faqs}
        pageUrl={absoluteUrl("/contact")}
      />
    </>
  );
}
