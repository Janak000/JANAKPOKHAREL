import Link from "next/link";
import { Icon } from "@/components/icon";
import { Markdown } from "@/components/markdown";

/**
 * Reusable page sections. Every one takes plain content props, so the CMS can
 * drive them and the layout stays identical from page to page.
 */

/** Heading in a left column, Markdown text in a right column, inside one panel that spans the container. */
export function SplitText({
  kicker,
  title,
  body,
}: {
  kicker?: string;
  title?: string;
  body?: string;
}) {
  if (!title && !body) return null;
  return (
    <section className="section" style={{ paddingTop: 0 }}>
      <div className="container">
        <div className="split-text">
          <div className="split-text-head">
            {kicker && <p className="kicker">{kicker}</p>}
            {title && <h2>{title}</h2>}
          </div>
          {body && <Markdown content={body} className="split-text-body" />}
        </div>
      </div>
    </section>
  );
}

type CardItem = { icon: string; title: string; description: string };

/** Centred heading over a two-column grid of cards whose text can carry Markdown links, plus an optional closing note. */
export function GuideGrid({
  kicker,
  title,
  intro,
  items,
  note,
}: {
  kicker?: string;
  title?: string;
  intro?: string;
  items: CardItem[];
  note?: string;
}) {
  const cards = (items ?? []).filter((i) => i.title || i.description);
  if (!title && cards.length === 0) return null;
  return (
    <section className="section" style={{ paddingTop: 0 }}>
      <div className="container">
        <div className="section-head section-head-center">
          {kicker && <p className="kicker">{kicker}</p>}
          {title && <h2>{title}</h2>}
          {intro && <p>{intro}</p>}
        </div>
        <div className="guide-grid">
          {cards.map((item, i) => (
            <article key={`${i}-${item.title}`} className="guide-card">
              {item.icon && (
                <div className="card-icon">
                  <Icon name={item.icon} size={22} />
                </div>
              )}
              <h3>{item.title}</h3>
              <Markdown content={item.description} />
            </article>
          ))}
        </div>
        {note && <SectionNote note={note} />}
      </div>
    </section>
  );
}

/** One short centred line of Markdown under a section, kept to a readable width. */
export function SectionNote({ note }: { note?: string }) {
  if (!note) return null;
  return (
    <div className="section-note">
      <Markdown content={note} />
    </div>
  );
}

/** Closing call to action with one or two buttons. */
export function CtaBand({
  kicker,
  title,
  text,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
  flush = true,
}: {
  kicker?: string;
  title: string;
  text?: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  /** Remove the top padding when the section above already leaves space. */
  flush?: boolean;
}) {
  return (
    <section className="section" style={flush ? { paddingTop: 0 } : undefined}>
      <div className="container">
        <div className="cta-band">
          {kicker && (
            <p className="kicker" style={{ justifyContent: "center" }}>
              {kicker}
            </p>
          )}
          <h2>{title}</h2>
          {text && <p>{text}</p>}
          <div className="hero-actions" style={{ justifyContent: "center" }}>
            <Link href={primaryHref} className="btn btn-primary btn-lg">
              {primaryLabel} <Icon name="arrow-right" size={18} />
            </Link>
            {secondaryLabel && secondaryHref && (
              <a
                href={secondaryHref}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost btn-lg"
              >
                <Icon name="message-circle" size={18} /> {secondaryLabel}
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
