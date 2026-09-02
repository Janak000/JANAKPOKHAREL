"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabase-browser";

export type LinkValue = {
  url: string;
  text: string;
  newTab: boolean;
  nofollow: boolean;
};

export type InternalTarget = {
  url: string;
  label: string;
  group: string;
  note?: string;
};

const STATIC_TARGETS: InternalTarget[] = [
  { url: "/", label: "Home", group: "Pages" },
  { url: "/about", label: "About", group: "Pages" },
  { url: "/services", label: "Services hub", group: "Pages" },
  { url: "/portfolio", label: "Portfolio", group: "Pages" },
  { url: "/blog", label: "Blog", group: "Pages" },
  { url: "/contact", label: "Contact", group: "Pages" },
];

/** Every linkable URL on the site, loaded live so new posts and services
 *  appear here the moment they are saved. */
export function useInternalTargets(): { targets: InternalTarget[]; loading: boolean } {
  const [targets, setTargets] = useState<InternalTarget[]>(STATIC_TARGETS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const supabase = getSupabaseBrowser();
      if (!supabase) {
        setLoading(false);
        return;
      }

      const [servicesRes, postsRes] = await Promise.all([
        supabase.from("services").select("slug,title,published").order("sort_order"),
        supabase.from("posts").select("slug,title,category,published").order("published_at", { ascending: false }),
      ]);

      if (cancelled) return;

      const services: InternalTarget[] = (servicesRes.data ?? []).map((s) => ({
        url: `/services/${s.slug}`,
        label: s.title,
        group: "Services",
        note: s.published ? undefined : "draft",
      }));

      const posts: InternalTarget[] = (postsRes.data ?? []).map((p) => ({
        url: `/blog/${p.slug}`,
        label: p.title,
        group: "Blog posts",
        note: p.published ? undefined : "draft",
      }));

      const categories: InternalTarget[] = Array.from(
        new Set((postsRes.data ?? []).map((p) => p.category).filter(Boolean) as string[])
      ).map((c) => ({
        url: `/blog/category/${c.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`,
        label: c,
        group: "Categories",
      }));

      setTargets([...STATIC_TARGETS, ...services, ...posts, ...categories]);
      setLoading(false);
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  return { targets, loading };
}

export function isInternalUrl(url: string): boolean {
  const trimmed = url.trim();
  if (!trimmed) return false;
  if (trimmed.startsWith("#")) return true;
  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) return true;
  return /^https?:\/\/(www\.)?janakpokharel\.com\.np/i.test(trimmed);
}

type Props = {
  open: boolean;
  initial: LinkValue;
  /** False when the editor already has text selected, so the text field is not editable. */
  canEditText: boolean;
  /** True when the cursor sits inside an existing link, so we show Update/Remove. */
  editingExisting: boolean;
  onSubmit: (value: LinkValue) => void;
  onRemove: () => void;
  onClose: () => void;
};

export function LinkDialog({
  open,
  initial,
  canEditText,
  editingExisting,
  onSubmit,
  onRemove,
  onClose,
}: Props) {
  const [url, setUrl] = useState(initial.url);
  const [text, setText] = useState(initial.text);
  const [newTab, setNewTab] = useState(initial.newTab);
  const [nofollow, setNofollow] = useState(initial.nofollow);
  const [query, setQuery] = useState("");
  const [touchedNewTab, setTouchedNewTab] = useState(false);
  const urlRef = useRef<HTMLInputElement>(null);

  const { targets, loading } = useInternalTargets();

  useEffect(() => {
    if (!open) return;
    setUrl(initial.url);
    setText(initial.text);
    setNewTab(initial.newTab);
    setNofollow(initial.nofollow);
    setQuery("");
    setTouchedNewTab(false);
    const t = setTimeout(() => urlRef.current?.focus(), 30);
    return () => clearTimeout(t);
  }, [open, initial]);

  const internal = isInternalUrl(url);

  // Internal links should not open a new tab; external ones usually should.
  // Only auto-switch until the editor sets it by hand.
  useEffect(() => {
    if (!touchedNewTab) setNewTab(!internal && url.trim().length > 0);
  }, [internal, url, touchedNewTab]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = q
      ? targets.filter((t) => t.label.toLowerCase().includes(q) || t.url.toLowerCase().includes(q))
      : targets;
    const groups = new Map<string, InternalTarget[]>();
    for (const t of list) {
      const arr = groups.get(t.group) ?? [];
      arr.push(t);
      groups.set(t.group, arr);
    }
    return Array.from(groups.entries());
  }, [targets, query]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const canSave = url.trim().length > 0 && (!canEditText || text.trim().length > 0);

  function submit() {
    if (!canSave) return;
    onSubmit({ url: url.trim(), text: text.trim(), newTab, nofollow });
  }

  return (
    <div className="lnk-overlay" role="dialog" aria-modal="true" aria-label="Insert link" onMouseDown={onClose}>
      <div className="lnk-modal" onMouseDown={(e) => e.stopPropagation()}>
        <header className="lnk-head">
          <h3>{editingExisting ? "Edit link" : "Insert link"}</h3>
          <button type="button" className="lnk-x" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </header>

        <div className="lnk-body">
          <label className="lnk-field">
            <span>
              URL
              <em className={internal ? "lnk-tag internal" : "lnk-tag external"}>
                {url.trim() ? (internal ? "internal" : "external") : "empty"}
              </em>
            </span>
            <input
              ref={urlRef}
              value={url}
              placeholder="/blog/my-post or https://example.com"
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  submit();
                }
              }}
            />
          </label>

          {canEditText && (
            <label className="lnk-field">
              <span>Link text</span>
              <input
                value={text}
                placeholder="Describe the destination, not 'click here'"
                onChange={(e) => setText(e.target.value)}
              />
            </label>
          )}

          <div className="lnk-toggles">
            <label>
              <input
                type="checkbox"
                checked={newTab}
                onChange={(e) => {
                  setTouchedNewTab(true);
                  setNewTab(e.target.checked);
                }}
              />
              <span>Open in a new tab</span>
            </label>
            <label>
              <input type="checkbox" checked={nofollow} onChange={(e) => setNofollow(e.target.checked)} />
              <span>Add nofollow</span>
            </label>
          </div>

          {internal && newTab && (
            <p className="lnk-hint warn">Internal links normally open in the same tab.</p>
          )}

          <div className="lnk-picker">
            <div className="lnk-picker-head">
              <span>Pick a page on this site</span>
              <input
                className="lnk-search"
                value={query}
                placeholder="Search pages, services, posts"
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            <div className="lnk-list">
              {loading && <p className="lnk-hint">Loading pages…</p>}
              {!loading && filtered.length === 0 && <p className="lnk-hint">Nothing matches “{query}”.</p>}
              {filtered.map(([group, items]) => (
                <div key={group} className="lnk-group">
                  <p className="lnk-group-name">{group}</p>
                  {items.map((t) => (
                    <button
                      key={t.url}
                      type="button"
                      className={`lnk-item ${url.trim() === t.url ? "active" : ""}`}
                      onClick={() => {
                        setUrl(t.url);
                        if (canEditText && !text.trim()) setText(t.label);
                      }}
                    >
                      <span className="lnk-item-label">
                        {t.label}
                        {t.note && <em className="lnk-note">{t.note}</em>}
                      </span>
                      <code>{t.url}</code>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        <footer className="lnk-foot">
          {editingExisting && (
            <button type="button" className="lnk-btn danger" onClick={onRemove}>
              Remove link
            </button>
          )}
          <span className="lnk-spacer" />
          <button type="button" className="lnk-btn" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="lnk-btn primary" disabled={!canSave} onClick={submit}>
            {editingExisting ? "Update link" : "Insert link"}
          </button>
        </footer>
      </div>
    </div>
  );
}
