"use client";

import { useRef, useState } from "react";
import { LinkDialog, type LinkValue } from "./link-dialog";

type Props = {
  value: string;
  onChange: (next: string) => void;
  rows?: number;
  placeholder?: string;
};

/** Markdown textarea with the same link picker the rich editor uses.
 *  Used for service pages and any other Markdown body, so every page type
 *  gets internal linking without changing how its content is stored. */
export function MarkdownEditor({ value, onChange, rows = 18, placeholder }: Props) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkInit, setLinkInit] = useState<LinkValue>({ url: "", text: "", newTab: false, nofollow: false });
  const [editingExisting, setEditingExisting] = useState(false);
  const selection = useRef<{ start: number; end: number }>({ start: 0, end: 0 });
  const existingRange = useRef<{ start: number; end: number } | null>(null);

  function capture() {
    const el = ref.current;
    if (!el) return;
    selection.current = { start: el.selectionStart, end: el.selectionEnd };
  }

  function replaceRange(start: number, end: number, insert: string, caretOffset?: number) {
    const next = value.slice(0, start) + insert + value.slice(end);
    onChange(next);
    requestAnimationFrame(() => {
      const el = ref.current;
      if (!el) return;
      const pos = start + (caretOffset ?? insert.length);
      el.focus();
      el.setSelectionRange(pos, pos);
    });
  }

  function wrap(before: string, after = before) {
    capture();
    const { start, end } = selection.current;
    const selected = value.slice(start, end) || "text";
    replaceRange(start, end, `${before}${selected}${after}`, before.length + selected.length + after.length);
  }

  function prefixLine(prefix: string) {
    capture();
    const { start } = selection.current;
    const lineStart = value.lastIndexOf("\n", start - 1) + 1;
    replaceRange(lineStart, lineStart, prefix);
  }

  /** If the caret sits inside a [text](url) link, return its bounds. */
  function markdownLinkAt(pos: number): { start: number; end: number; text: string; url: string } | null {
    const re = /\[([^\]]*)\]\(([^)\s]+)\)/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(value)) !== null) {
      const start = m.index;
      const end = m.index + m[0].length;
      if (pos >= start && pos <= end) return { start, end, text: m[1], url: m[2] };
    }
    return null;
  }

  function openLink() {
    capture();
    const { start, end } = selection.current;
    const found = markdownLinkAt(start);

    if (found) {
      existingRange.current = { start: found.start, end: found.end };
      setLinkInit({ url: found.url, text: found.text, newTab: false, nofollow: false });
      setEditingExisting(true);
    } else {
      existingRange.current = null;
      setLinkInit({ url: "", text: value.slice(start, end), newTab: false, nofollow: false });
      setEditingExisting(false);
    }
    setLinkOpen(true);
  }

  function applyLink(v: LinkValue) {
    const label = v.text.trim() || v.url;
    const md = `[${label}](${v.url})`;
    const range = existingRange.current ?? selection.current;
    replaceRange(range.start, range.end, md);
    existingRange.current = null;
    setLinkOpen(false);
  }

  function removeLink() {
    const range = existingRange.current;
    if (range) {
      const found = markdownLinkAt(range.start);
      if (found) replaceRange(found.start, found.end, found.text);
    }
    existingRange.current = null;
    setLinkOpen(false);
  }

  const Btn = ({ label, title, onClick }: { label: string; title: string; onClick: () => void }) => (
    <button
      type="button"
      className="re-btn"
      title={title}
      onMouseDown={(e) => {
        e.preventDefault();
        onClick();
      }}
    >
      {label}
    </button>
  );

  return (
    <div className="rich-editor">
      <div className="re-toolbar">
        <Btn label="H2" title="Heading 2" onClick={() => prefixLine("## ")} />
        <Btn label="H3" title="Heading 3" onClick={() => prefixLine("### ")} />
        <span className="re-sep" />
        <Btn label="B" title="Bold" onClick={() => wrap("**")} />
        <Btn label="I" title="Italic" onClick={() => wrap("_")} />
        <span className="re-sep" />
        <Btn label="☰" title="Bullet" onClick={() => prefixLine("- ")} />
        <Btn label="1." title="Numbered" onClick={() => prefixLine("1. ")} />
        <Btn label="❝" title="Quote" onClick={() => prefixLine("> ")} />
        <span className="re-sep" />
        <Btn label="🔗" title="Insert or edit link" onClick={openLink} />
        <Btn label="―" title="Divider" onClick={() => prefixLine("\n---\n")} />
      </div>

      <textarea
        ref={ref}
        className="re-md"
        rows={rows}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onSelect={capture}
        onKeyUp={capture}
        onClick={capture}
      />

      <LinkDialog
        open={linkOpen}
        initial={linkInit}
        canEditText
        editingExisting={editingExisting}
        onSubmit={applyLink}
        onRemove={removeLink}
        onClose={() => {
          existingRange.current = null;
          setLinkOpen(false);
        }}
      />
    </div>
  );
}
