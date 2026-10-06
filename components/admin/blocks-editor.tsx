"use client";

import { useEffect, useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabase-browser";
import {
  fallbackAbout,
  fallbackBlogSettings,
  fallbackContact,
  fallbackHero,
  fallbackHome,
  fallbackPortfolioPage,
  fallbackServicesPage,
  fallbackSettings,
} from "@/lib/fallback-content";
import { Field, NoticeBar, requestRevalidate, type Notice } from "./shared";
import { MarkdownEditor } from "./markdown-editor";

type Column = { key: string; label: string; multiline?: boolean };

type FieldDef =
  | { key: string; label: string; type: "heading" }
  | { key: string; label: string; type: "text" }
  | { key: string; label: string; type: "textarea"; rows?: number }
  | { key: string; label: string; type: "markdown"; rows?: number }
  | { key: string; label: string; type: "csv" }
  | { key: string; label: string; type: "objects"; columns: Column[] };

/** Rows for a page's FAQ section; the same four fields everywhere. */
const faqFields: FieldDef[] = [
  { key: "h-faq", label: "FAQ section (also published as FAQ schema; leave the list empty to hide it)", type: "heading" },
  { key: "faqKicker", label: "FAQ kicker", type: "text" },
  { key: "faqTitle", label: "FAQ heading", type: "text" },
  { key: "faqIntro", label: "FAQ intro (optional)", type: "textarea", rows: 2 },
  {
    key: "faqs",
    label: "Questions and answers (answers can use Markdown links)",
    type: "objects",
    columns: [
      { key: "question", label: "Question" },
      { key: "answer", label: "Answer", multiline: true },
    ],
  },
];

type BlockDef = {
  key: string;
  title: string;
  description: string;
  fallback: Record<string, unknown>;
  fields: FieldDef[];
};

const blocks: BlockDef[] = [
  {
    key: "settings",
    title: "Site settings",
    description: "Identity, contact details, social links, and analytics IDs used across every page.",
    fallback: fallbackSettings as unknown as Record<string, unknown>,
    fields: [
      { key: "name", label: "Full name", type: "text" },
      { key: "shortName", label: "Short name", type: "text" },
      { key: "role", label: "Role / headline title", type: "text" },
      { key: "tagline", label: "Tagline", type: "text" },
      { key: "description", label: "Site description (SEO)", type: "textarea", rows: 3 },
      { key: "url", label: "Canonical URL", type: "text" },
      { key: "email", label: "Email", type: "text" },
      { key: "phone", label: "Phone", type: "text" },
      { key: "whatsapp", label: "WhatsApp number (digits only)", type: "text" },
      { key: "location", label: "Location", type: "text" },
      { key: "facebook", label: "Facebook URL", type: "text" },
      { key: "linkedin", label: "LinkedIn URL", type: "text" },
      { key: "gtmId", label: "Google Tag Manager ID", type: "text" },
      { key: "gaId", label: "GA4 ID", type: "text" },
      { key: "ogImage", label: "Default social share image", type: "text" },
      { key: "keywords", label: "SEO keywords (comma-separated)", type: "csv" },
    ],
  },
  {
    key: "hero",
    title: "Homepage hero",
    description: "The first thing visitors see on the homepage.",
    fallback: fallbackHero as unknown as Record<string, unknown>,
    fields: [
      { key: "availability", label: "Availability badge", type: "text" },
      { key: "eyebrow", label: "Eyebrow line", type: "text" },
      { key: "headline", label: "Headline", type: "textarea", rows: 2 },
      { key: "description", label: "Description", type: "textarea", rows: 3 },
      { key: "primaryCtaLabel", label: "Primary button label", type: "text" },
      { key: "primaryCtaHref", label: "Primary button link", type: "text" },
      { key: "secondaryCtaLabel", label: "Secondary button label", type: "text" },
      { key: "secondaryCtaHref", label: "Secondary button link", type: "text" },
      { key: "imageSrc", label: "Portrait image URL", type: "text" },
      { key: "imageAlt", label: "Portrait alt text", type: "text" },
      { key: "statValue", label: "Floating stat value", type: "text" },
      { key: "statLabel", label: "Floating stat label", type: "text" },
    ],
  },
  {
    key: "home",
    title: "Homepage sections",
    description: "Headings, text, FAQ and closing call to action for the sections below the homepage hero.",
    fallback: fallbackHome as unknown as Record<string, unknown>,
    fields: [
      { key: "h-services", label: "Services section", type: "heading" },
      { key: "servicesKicker", label: "Kicker", type: "text" },
      { key: "servicesTitle", label: "Heading", type: "text" },
      { key: "servicesLinkLabel", label: "Link label", type: "text" },
      { key: "h-work", label: "Selected work section", type: "heading" },
      { key: "workKicker", label: "Kicker", type: "text" },
      { key: "workTitle", label: "Heading", type: "text" },
      { key: "workLinkLabel", label: "Link label", type: "text" },
      { key: "h-behind", label: "Behind the work section", type: "heading" },
      { key: "behindKicker", label: "Kicker", type: "text" },
      { key: "behindTitle", label: "Heading", type: "textarea", rows: 2 },
      { key: "behindBody", label: "Text", type: "textarea", rows: 4 },
      {
        key: "behindPoints",
        label: "Checklist",
        type: "objects",
        columns: [{ key: "text", label: "Point" }],
      },
      { key: "behindLinkLabel", label: "Button label", type: "text" },
      { key: "h-blog", label: "Blog section", type: "heading" },
      { key: "blogKicker", label: "Kicker", type: "text" },
      { key: "blogTitle", label: "Heading", type: "text" },
      { key: "blogLinkLabel", label: "Link label", type: "text" },
      ...faqFields,
      { key: "h-cta", label: "Closing call to action", type: "heading" },
      { key: "ctaKicker", label: "Kicker", type: "text" },
      { key: "ctaTitle", label: "Heading", type: "text" },
      { key: "ctaText", label: "Text", type: "textarea", rows: 3 },
      { key: "ctaPrimaryLabel", label: "Primary button label", type: "text" },
      { key: "ctaSecondaryLabel", label: "WhatsApp button label", type: "text" },
    ],
  },
  {
    key: "about",
    title: "About page",
    description: "About intro, stats, highlight cards, and associated organizations.",
    fallback: fallbackAbout as unknown as Record<string, unknown>,
    fields: [
      { key: "kicker", label: "Kicker", type: "text" },
      { key: "title", label: "Title", type: "text" },
      { key: "intro", label: "Intro", type: "textarea", rows: 3 },
      { key: "metaDescription", label: "Search snippet (max 155 characters, falls back to Intro)", type: "textarea", rows: 2 },
      { key: "body", label: "Body (Markdown, supports links)", type: "markdown", rows: 10 },
      { key: "h-work", label: "Work section (panel under the highlight cards)", type: "heading" },
      { key: "workKicker", label: "Kicker", type: "text" },
      { key: "workTitle", label: "Heading", type: "text" },
      { key: "workBody", label: "Text (Markdown, supports links)", type: "markdown", rows: 8 },
      { key: "h-numbers", label: "Stats and highlight cards", type: "heading" },
      {
        key: "stats",
        label: "Stats",
        type: "objects",
        columns: [
          { key: "value", label: "Value" },
          { key: "label", label: "Label" },
        ],
      },
      {
        key: "highlights",
        label: "Highlight cards",
        type: "objects",
        columns: [
          { key: "icon", label: "Icon" },
          { key: "title", label: "Title" },
          { key: "description", label: "Description" },
        ],
      },
      { key: "h-journey", label: "Experience and organizations headings", type: "heading" },
      { key: "journeyKicker", label: "Experience kicker", type: "text" },
      { key: "journeyTitle", label: "Experience heading", type: "text" },
      { key: "trustedKicker", label: "Organizations kicker", type: "text" },
      { key: "organizationsTitle", label: "Organizations section title", type: "text" },
      {
        key: "organizations",
        label: "Organizations",
        type: "objects",
        columns: [
          { key: "name", label: "Name" },
          { key: "logo", label: "Logo URL" },
          { key: "alt", label: "Alt text" },
        ],
      },
      ...faqFields,
      { key: "h-cta", label: "Closing call to action", type: "heading" },
      { key: "ctaTitle", label: "Heading", type: "text" },
      { key: "ctaText", label: "Text", type: "textarea", rows: 3 },
      { key: "ctaLabel", label: "Button label", type: "text" },
    ],
  },
  {
    key: "servicesPage",
    title: "Services page",
    description: "Services overview: intro, decision guide, FAQ and closing call to action. Each service itself is edited under Services.",
    fallback: fallbackServicesPage as unknown as Record<string, unknown>,
    fields: [
      { key: "h-seo", label: "Search listing", type: "heading" },
      { key: "metaTitle", label: "Search title (max 60 characters)", type: "text" },
      { key: "metaDescription", label: "Search snippet (max 155 characters)", type: "textarea", rows: 2 },
      { key: "h-hero", label: "Page heading", type: "heading" },
      { key: "kicker", label: "Kicker", type: "text" },
      { key: "title", label: "Heading (H1)", type: "text" },
      { key: "intro", label: "Intro", type: "textarea", rows: 4 },
      { key: "h-guide", label: "Decision guide (cards under the service list)", type: "heading" },
      { key: "guideKicker", label: "Kicker", type: "text" },
      { key: "guideTitle", label: "Heading", type: "text" },
      { key: "guideIntro", label: "Intro", type: "textarea", rows: 2 },
      {
        key: "guideItems",
        label: "Guide cards (text can use Markdown links)",
        type: "objects",
        columns: [
          { key: "icon", label: "Icon" },
          { key: "title", label: "Title" },
          { key: "description", label: "Text", multiline: true },
        ],
      },
      { key: "guideNote", label: "Closing line under the cards (Markdown)", type: "textarea", rows: 2 },
      ...faqFields,
      { key: "h-cta", label: "Closing call to action", type: "heading" },
      { key: "ctaTitle", label: "Heading", type: "text" },
      { key: "ctaText", label: "Text", type: "textarea", rows: 3 },
      { key: "ctaPrimaryLabel", label: "Primary button label", type: "text" },
      { key: "ctaSecondaryLabel", label: "WhatsApp button label", type: "text" },
    ],
  },
  {
    key: "portfolioPage",
    title: "Portfolio page",
    description: "Portfolio intro, approach section, FAQ and closing call to action. The projects themselves are edited under Portfolio.",
    fallback: fallbackPortfolioPage as unknown as Record<string, unknown>,
    fields: [
      { key: "h-seo", label: "Search listing", type: "heading" },
      { key: "metaTitle", label: "Search title (max 60 characters)", type: "text" },
      { key: "metaDescription", label: "Search snippet (max 155 characters)", type: "textarea", rows: 2 },
      { key: "h-hero", label: "Page heading", type: "heading" },
      { key: "kicker", label: "Kicker", type: "text" },
      { key: "title", label: "Heading (H1)", type: "text" },
      { key: "intro", label: "Intro", type: "textarea", rows: 3 },
      { key: "h-approach", label: "Approach section (under the projects)", type: "heading" },
      { key: "approachKicker", label: "Kicker", type: "text" },
      { key: "approachTitle", label: "Heading", type: "text" },
      { key: "approachIntro", label: "Intro", type: "textarea", rows: 4 },
      {
        key: "approachCards",
        label: "Cards",
        type: "objects",
        columns: [
          { key: "icon", label: "Icon" },
          { key: "title", label: "Title" },
          { key: "description", label: "Text", multiline: true },
        ],
      },
      { key: "approachNote", label: "Closing line under the cards (Markdown)", type: "textarea", rows: 3 },
      ...faqFields,
      { key: "h-cta", label: "Closing call to action", type: "heading" },
      { key: "ctaKicker", label: "Kicker", type: "text" },
      { key: "ctaTitle", label: "Heading", type: "text" },
      { key: "ctaText", label: "Text", type: "textarea", rows: 3 },
      { key: "ctaLabel", label: "Button label", type: "text" },
    ],
  },
  {
    key: "contact",
    title: "Contact page",
    description: "Contact page intro and WhatsApp card.",
    fallback: fallbackContact as unknown as Record<string, unknown>,
    fields: [
      { key: "title", label: "Title", type: "text" },
      { key: "intro", label: "Intro", type: "textarea", rows: 3 },
      { key: "whatsappTitle", label: "WhatsApp card title", type: "text" },
      { key: "whatsappDescription", label: "WhatsApp card description", type: "textarea", rows: 2 },
      { key: "h-seo", label: "Search listing (optional, falls back to the defaults)", type: "heading" },
      { key: "metaTitle", label: "Search title (max 60 characters)", type: "text" },
      { key: "metaDescription", label: "Search snippet (max 155 characters)", type: "textarea", rows: 2 },
      { key: "h-next", label: "What happens next (cards under the form)", type: "heading" },
      { key: "nextKicker", label: "Kicker", type: "text" },
      { key: "nextTitle", label: "Heading", type: "text" },
      { key: "nextIntro", label: "Intro", type: "textarea", rows: 2 },
      {
        key: "steps",
        label: "Steps",
        type: "objects",
        columns: [
          { key: "icon", label: "Icon" },
          { key: "title", label: "Title" },
          { key: "description", label: "Text", multiline: true },
        ],
      },
      { key: "nextNote", label: "Closing line under the steps (Markdown)", type: "textarea", rows: 3 },
      ...faqFields,
    ],
  },
  {
    key: "blog",
    title: "Blog settings",
    description: "Blog listing page title and description.",
    fallback: fallbackBlogSettings as unknown as Record<string, unknown>,
    fields: [
      { key: "title", label: "Blog title", type: "text" },
      { key: "description", label: "Blog description (shown on the page)", type: "textarea", rows: 6 },
      { key: "metaTitle", label: "Search title (max 60 characters, falls back to Blog title)", type: "text" },
      { key: "metaDescription", label: "Search snippet (max 155 characters, falls back to description)", type: "textarea", rows: 2 },
    ],
  },
];

export function BlocksEditor() {
  const supabase = getSupabaseBrowser()!;
  const [active, setActive] = useState(blocks[0].key);
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [notice, setNotice] = useState<Notice>(null);
  const [saving, setSaving] = useState(false);

  const block = blocks.find((b) => b.key === active)!;

  useEffect(() => {
    let cancelled = false;
    setData(null);
    setNotice(null);
    (async () => {
      const { data: rows } = await supabase
        .from("content_blocks")
        .select("data")
        .eq("key", block.key)
        .limit(1);
      if (cancelled) return;
      const stored = rows?.[0]?.data as Record<string, unknown> | undefined;
      setData({ ...block.fallback, ...(stored ?? {}) });
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  async function save() {
    if (!data) return;
    setSaving(true);
    const { error } = await supabase
      .from("content_blocks")
      .upsert({ key: block.key, data, updated_at: new Date().toISOString() });
    setSaving(false);
    if (error) {
      setNotice({ kind: "err", text: error.message });
      return;
    }
    setNotice({ kind: "ok", text: `${block.title} saved. Site is updating…` });
    void requestRevalidate();
  }

  function renderField(field: FieldDef) {
    if (!data) return null;
    if (field.type === "heading") {
      return (
        <h3 key={field.key} className="field-group">
          {field.label}
        </h3>
      );
    }
    const value = data[field.key];

    if (field.type === "text") {
      return (
        <Field key={field.key} label={field.label}>
          <input
            value={String(value ?? "")}
            onChange={(e) => setData({ ...data, [field.key]: e.target.value })}
          />
        </Field>
      );
    }

    if (field.type === "markdown") {
      return (
        <div className="field" key={field.key}>
          <span>{field.label}</span>
          <MarkdownEditor
            rows={field.rows ?? 10}
            value={String(value ?? "")}
            onChange={(md) => setData({ ...data, [field.key]: md })}
          />
        </div>
      );
    }

    if (field.type === "textarea") {
      return (
        <Field key={field.key} label={field.label}>
          <textarea
            rows={field.rows ?? 3}
            value={String(value ?? "")}
            onChange={(e) => setData({ ...data, [field.key]: e.target.value })}
          />
        </Field>
      );
    }

    if (field.type === "csv") {
      const arr = Array.isArray(value) ? (value as string[]) : [];
      return (
        <Field key={field.key} label={field.label}>
          <input
            value={arr.join(", ")}
            onChange={(e) =>
              setData({
                ...data,
                [field.key]: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
              })
            }
          />
        </Field>
      );
    }

    // objects
    const items = Array.isArray(value) ? (value as Record<string, string>[]) : [];
    return (
      <div key={field.key} className="field">
        <span>{field.label}</span>
        {items.map((item, i) => (
          <div key={i} className="repeat-item">
            {field.columns.map((col) => {
              const update = (text: string) => {
                const next = [...items];
                next[i] = { ...next[i], [col.key]: text };
                setData({ ...data, [field.key]: next });
              };
              return (
                <div key={col.key} className={col.multiline ? "repeat-wide" : undefined}>
                  <Field label={col.label}>
                    {col.multiline ? (
                      <textarea
                        rows={4}
                        value={item[col.key] ?? ""}
                        onChange={(e) => update(e.target.value)}
                      />
                    ) : (
                      <input value={item[col.key] ?? ""} onChange={(e) => update(e.target.value)} />
                    )}
                  </Field>
                </div>
              );
            })}
            <div className="repeat-actions">
              <button
                className="btn btn-danger btn-sm"
                onClick={() =>
                  setData({ ...data, [field.key]: items.filter((_, j) => j !== i) })
                }
              >
                Remove
              </button>
            </div>
          </div>
        ))}
        <button
          className="btn btn-ghost btn-sm"
          style={{ alignSelf: "flex-start" }}
          onClick={() =>
            setData({
              ...data,
              [field.key]: [
                ...items,
                Object.fromEntries(field.columns.map((c) => [c.key, ""])),
              ],
            })
          }
        >
          + Add row
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="admin-topbar">
        <h1>Page content</h1>
        <button className="btn btn-primary btn-sm" onClick={save} disabled={saving || !data}>
          {saving ? "Saving…" : `Save ${block.title.toLowerCase()}`}
        </button>
      </div>

      <div className="category-filter">
        {blocks.map((b) => (
          <button
            key={b.key}
            className={`chip ${b.key === active ? "chip-accent" : ""}`}
            onClick={() => setActive(b.key)}
          >
            {b.title}
          </button>
        ))}
      </div>

      <NoticeBar notice={notice} />
      <p style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 20 }}>
        {block.description}
      </p>

      {!data ? (
        <p style={{ color: "var(--text-faint)" }}>Loading…</p>
      ) : (
        <div className="admin-form">{block.fields.map(renderField)}</div>
      )}
    </div>
  );
}
