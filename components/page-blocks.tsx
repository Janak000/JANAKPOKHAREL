import Link from "next/link";
import { Icon } from "@/components/icon";
import type { Source } from "@/lib/page-links-defaults";

/** Compact call to action placed inside a long article. */
export function InlineCta({ title, text, label = "Request a proposal" }: { title: string; text: string; label?: string }) {
  return (
    <aside className="inline-cta" aria-label={title}>
      <div>
        <strong>{title}</strong>
        <p>{text}</p>
      </div>
      <Link href="/contact" className="btn btn-primary">
        {label} <Icon name="arrow-right" size={16} />
      </Link>
    </aside>
  );
}

export type LinkCard = { href: string; title: string; text?: string };

/** Related pages as scannable cards instead of one dense paragraph of links. */
export function LinkCards({ heading, id, intro, cards }: { heading: string; id: string; intro?: string; cards: LinkCard[] }) {
  if (cards.length === 0) return null;
  return (
    <section aria-labelledby={id} className="link-cards-section">
      <h2 id={id}>{heading}</h2>
      {intro && <p>{intro}</p>}
      <div className="link-cards">
        {cards.map((c) => (
          <Link key={c.href} href={c.href} className="link-card">
            <strong>{c.title}</strong>
            {c.text && <span>{c.text}</span>}
            <em>
              Read more <Icon name="arrow-right" size={14} />
            </em>
          </Link>
        ))}
      </div>
    </section>
  );
}

/** External references. Opens in a new tab; passes no `nofollow` because these are editorial citations. */
export function SourcesList({ sources, heading = "Sources and further reading" }: { sources: Source[] | undefined; heading?: string }) {
  if (!sources || sources.length === 0) return null;
  return (
    <section aria-labelledby="sources-heading" className="sources-section">
      <h2 id="sources-heading">{heading}</h2>
      <ul>
        {sources.map((s) => (
          <li key={s.url}>
            <a href={s.url} target="_blank" rel="noopener noreferrer">
              {s.label}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
