import Link from "next/link";
import { Icon } from "@/components/icon";
import { JsonLd } from "@/components/json-ld";
import { Markdown } from "@/components/markdown";
import { cleanFaqs, faqPageLd, type Faq } from "@/lib/faq";

type Props = {
  faqs: Faq[] | null | undefined;
  title?: string;
  kicker?: string;
  intro?: string;
  /** Absolute URL of the page, added to the FAQPage markup. */
  pageUrl?: string;
  /**
   * "split": heading column beside the list, for full-width sections.
   * "inline": heading above the list, for use inside an article column.
   */
  layout?: "split" | "inline";
  /** Link shown under the heading in the split layout. Omit to hide it. */
  ctaHref?: string;
  ctaLabel?: string;
  id?: string;
};

/**
 * One FAQ pattern for the whole site. It renders the accordion and the FAQPage
 * JSON-LD from the same rows, so the markup always matches what readers see,
 * and a page that has no questions emits neither. Use it once per page: a page
 * with two FAQPage blocks is invalid structured data.
 */
export function FaqSection({
  faqs,
  title = "Frequently asked questions",
  kicker,
  intro,
  pageUrl,
  layout = "split",
  ctaHref,
  ctaLabel = "Ask me directly",
  id = "faq",
}: Props) {
  const items = cleanFaqs(faqs);
  if (items.length === 0) return null;

  const headingId = `${id}-heading`;

  const list = (
    <div className="faq-list">
      {items.map((faq, i) => (
        <details key={`${i}-${faq.question}`} className="faq-item" open={i === 0}>
          <summary>
            <h3>{faq.question}</h3>
          </summary>
          <Markdown content={faq.answer} className="faq-answer" />
        </details>
      ))}
    </div>
  );

  if (layout === "inline") {
    return (
      <section id={id} className="faq-inline" aria-labelledby={headingId}>
        <JsonLd data={faqPageLd(items, pageUrl)} />
        <h2 id={headingId}>{title}</h2>
        {intro && <p className="faq-lead">{intro}</p>}
        {list}
      </section>
    );
  }

  return (
    <section id={id} className="section" aria-labelledby={headingId}>
      <div className="container">
        <JsonLd data={faqPageLd(items, pageUrl)} />
        <div className="faq-layout">
          <div className="faq-intro">
            {kicker && <p className="kicker">{kicker}</p>}
            <h2 id={headingId}>{title}</h2>
            {intro && <p>{intro}</p>}
            {ctaHref && (
              <Link href={ctaHref} className="btn btn-ghost">
                {ctaLabel} <Icon name="arrow-right" size={16} />
              </Link>
            )}
          </div>
          {list}
        </div>
      </div>
    </section>
  );
}
