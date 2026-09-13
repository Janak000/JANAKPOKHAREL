import type { Metadata } from "next";
import Link from "next/link";
import { getServices, getSettings, absoluteUrl } from "@/lib/cms";
import { Icon } from "@/components/icon";
import { JsonLd } from "@/components/json-ld";
import { faqPageLd } from "@/lib/faq";

export const revalidate = 120;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    title: "Digital Marketing Services in Nepal: SEO and Ads",
    description: `SEO and ads services in Nepal and worldwide: technical SEO, local SEO in Kathmandu, Google Ads, Meta Ads, CRO and analytics. Run by ${settings.name}.`,
    alternates: { canonical: "/services" },
    openGraph: {
      images: [{ url: settings.ogImage, width: 1200, height: 630, alt: settings.name }],
      title: `Services | ${settings.name}`,
      url: absoluteUrl("/services"),
    },
  };
}

/**
 * The hub used to be a bare grid of cards with no text of its own, which gave
 * Google nothing to rank it on. These answer the questions people actually
 * arrive with, and they double as FAQPage schema below.
 */
const HUB_FAQS = [
  {
    question: "Do I need SEO or ads first?",
    answer:
      "If people already search for what you sell, ads produce leads this week and SEO produces cheaper leads later. If nobody searches for it yet, ads are the only option that works at all, because SEO can only capture demand that already exists. Most businesses run one channel properly before adding the second.",
  },
  {
    question: "What is the difference between the Nepal pages and the others?",
    answer:
      "The Nepal pages cover the parts that only matter here: the Nepal Rastra Bank limit on foreign currency for ad payments, Google Business Profile verification, and how Nepali and Romanized Nepali queries behave. The general service pages cover the same disciplines without that local layer, for clients outside Nepal.",
  },
  {
    question: "How long before I see results?",
    answer:
      "Paid campaigns produce data in days and dependable numbers in two to four weeks. SEO on a site with technical faults spends its first month getting crawled and indexed before anything can rank. Local SEO sits in between, because fixing a Google Business Profile category can move a listing within weeks.",
  },
  {
    question: "Do you work with businesses outside Nepal?",
    answer:
      "Yes. I have run paid search and SEO for clients in the United States and the United Kingdom alongside Nepali work. The general service pages are written for that audience, and the method does not change with the country, only the auction and the search behaviour do.",
  },
  {
    question: "Can I hire you for a one-off audit instead of ongoing work?",
    answer:
      "Yes, and for a site that has never been looked at properly it is usually the sensible first step. An audit tells you whether the problem is worth paying to fix before you commit to a monthly arrangement.",
  },
];

export default async function ServicesPage() {
  const [settings, services] = await Promise.all([getSettings(), getServices()]);

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "Services", item: absoluteUrl("/services") },
    ],
  };

  const servicesLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: services.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Service",
        name: s.title,
        description: s.shortDescription,
        url: absoluteUrl(`/services/${s.slug}`),
        provider: { "@id": `${absoluteUrl("/")}#person` },
        areaServed: "Worldwide",
      },
    })),
  };

  return (
    <>
      <JsonLd data={breadcrumbLd} />
      <JsonLd data={servicesLd} />
      <JsonLd data={faqPageLd(HUB_FAQS)} />
      <section className="page-hero">
        <div className="container">
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span className="sep">/</span>
            <span>Services</span>
          </nav>
          <p className="kicker">Services</p>
          <h1>Digital marketing services in Nepal that pay for themselves</h1>
          <p>
            I am Janak Pokharel, an SEO and ads analyst based in Kathmandu. The
            services below split into two groups: pages written for businesses
            operating in Nepal, where payment limits and local search behave
            differently, and general pages for clients elsewhere. Every one of them
            is run by me directly rather than passed to an account manager.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 24 }}>
        <div className="container">
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
                  View details <Icon name="arrow-right" size={15} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="prose" style={{ maxWidth: 760 }}>
            <h2>Which of these do you actually need?</h2>
            <p>
              Most enquiries I get name a tactic when the real question is a
              sequence. Here is the short version of how I would decide.
            </p>
            <p>
              <strong>If your site is invisible on Google,</strong> start with{" "}
              <Link href="/services/technical-seo">technical SEO</Link>. Search for{" "}
              <code>site:</code> followed by your domain, and if far fewer pages come
              back than you published, nothing else is worth paying for until that is
              fixed. Ranking work on an unindexed site is money spent on a page Google
              has never read.
            </p>
            <p>
              <strong>If you have a shop, clinic or restaurant,</strong>{" "}
              <Link href="/services/local-seo-kathmandu">local SEO</Link> moves faster
              than anything else on this list. The three-result map pack is decided
              mostly by your Google Business Profile, and correcting a category can
              change what shows within weeks rather than months.
            </p>
            <p>
              <strong>If you need enquiries this month,</strong> paid comes first.{" "}
              <Link href="/services/google-ads-nepal">Google Ads</Link> captures people
              already searching;{" "}
              <Link href="/services/meta-ads-nepal">Meta Ads</Link> creates demand where
              nobody is searching yet. Which one fits depends on whether your category
              has search volume, and that takes about twenty minutes to check.
            </p>
            <p>
              <strong>If you are already spending and it is not converting,</strong> the
              problem is usually measurement rather than traffic.{" "}
              <Link href="/services/cro-analytics">CRO and analytics</Link> comes before
              buying more clicks, because without conversion tracking you cannot tell
              which half of the budget is working.
            </p>
            <p>
              Not sure which applies? Send me the URL and I will tell you which one I
              would start with, including when the answer is that you do not need me
              yet.
            </p>

            <h2>Frequently asked questions</h2>
            {HUB_FAQS.map((faq) => (
              <div key={faq.question}>
                <h3>{faq.question}</h3>
                <p>{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="cta-band">
            <h2>Not sure which service you need?</h2>
            <p>
              Tell me about your business and goals, I&apos;ll recommend the channel mix
              with the fastest path to results, honestly.
            </p>
            <div className="hero-actions" style={{ justifyContent: "center" }}>
              <Link href="/contact" className="btn btn-primary btn-lg">
                Get a Free Recommendation <Icon name="arrow-right" size={18} />
              </Link>
              <a
                href={`https://wa.me/${settings.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost btn-lg"
              >
                <Icon name="message-circle" size={18} /> WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
