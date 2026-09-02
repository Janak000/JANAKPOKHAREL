"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabase-browser";
import { LinkDialog, type LinkValue } from "./link-dialog";

type Props = {
  value: string; // HTML
  onChange: (html: string) => void;
};

const FONT_SIZES = [
  { label: "Small", value: "2" },
  { label: "Normal", value: "3" },
  { label: "Large", value: "5" },
  { label: "Huge", value: "6" },
];

const BLOCKS = [
  { label: "Paragraph", value: "P" },
  { label: "Heading 2", value: "H2" },
  { label: "Heading 3", value: "H3" },
  { label: "Heading 4", value: "H4" },
  { label: "Quote", value: "BLOCKQUOTE" },
  { label: "Code block", value: "PRE" },
];

const COLORS = [
  "#e8ecf6", "#d54835", "#ff8a73", "#22c55e", "#3b82f6",
  "#f59e0b", "#a855f7", "#ec4899", "#94a3b8", "#000000",
];

export function RichEditor({ value, onChange }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [showColors, setShowColors] = useState(false);
  const [showHighlight, setShowHighlight] = useState(false);
  const savedRange = useRef<Range | null>(null);

  const [linkOpen, setLinkOpen] = useState(false);
  const [linkInit, setLinkInit] = useState<LinkValue>({ url: "", text: "", newTab: false, nofollow: false });
  const [linkCanEditText, setLinkCanEditText] = useState(true);
  const linkAnchor = useRef<HTMLAnchorElement | null>(null);

  // Load initial HTML once (uncontrolled thereafter to preserve caret).
  useEffect(() => {
    if (ref.current && ref.current.innerHTML !== value) {
      ref.current.innerHTML = value || "<p><br/></p>";
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const emit = useCallback(() => {
    if (ref.current) onChange(ref.current.innerHTML);
  }, [onChange]);

  function saveSelection() {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) savedRange.current = sel.getRangeAt(0).cloneRange();
  }

  function restoreSelection() {
    const sel = window.getSelection();
    if (sel && savedRange.current) {
      sel.removeAllRanges();
      sel.addRange(savedRange.current);
    }
  }

  function exec(command: string, arg?: string) {
    ref.current?.focus();
    restoreSelection();
    try {
      document.execCommand("styleWithCSS", false, "true");
    } catch {
      /* ignore */
    }
    document.execCommand(command, false, arg);
    emit();
  }

  function setBlock(tag: string) {
    ref.current?.focus();
    restoreSelection();
    document.execCommand("formatBlock", false, tag);
    emit();
  }

  /** Find the <a> the caret currently sits inside, if any. */
  function anchorAtSelection(): HTMLAnchorElement | null {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return null;
    let node: Node | null = sel.getRangeAt(0).commonAncestorContainer;
    while (node && node !== ref.current) {
      if (node instanceof HTMLAnchorElement) return node;
      node = node.parentNode;
    }
    return null;
  }

  function openLinkDialog() {
    saveSelection();
    const sel = window.getSelection();
    const selectedText = sel ? sel.toString() : "";
    const existing = anchorAtSelection();
    linkAnchor.current = existing;

    if (existing) {
      const rel = existing.getAttribute("rel") ?? "";
      setLinkInit({
        url: existing.getAttribute("href") ?? "",
        text: existing.textContent ?? "",
        newTab: existing.getAttribute("target") === "_blank",
        nofollow: rel.includes("nofollow"),
      });
      setLinkCanEditText(true);
    } else {
      setLinkInit({ url: "", text: selectedText, newTab: false, nofollow: false });
      // When text is already highlighted we wrap it, so the text is not editable here.
      setLinkCanEditText(selectedText.trim().length === 0);
    }
    setLinkOpen(true);
  }

  function decorate(a: HTMLAnchorElement, v: LinkValue) {
    a.setAttribute("href", v.url);
    const rels: string[] = [];
    if (v.newTab) {
      a.setAttribute("target", "_blank");
      rels.push("noopener", "noreferrer");
    } else {
      a.removeAttribute("target");
    }
    if (v.nofollow) rels.push("nofollow");
    if (rels.length) a.setAttribute("rel", Array.from(new Set(rels)).join(" "));
    else a.removeAttribute("rel");
  }

  function applyLink(v: LinkValue) {
    const existing = linkAnchor.current;

    if (existing) {
      if (v.text && v.text !== existing.textContent) existing.textContent = v.text;
      decorate(existing, v);
    } else {
      ref.current?.focus();
      restoreSelection();
      const sel = window.getSelection();
      const hasSelection = sel ? sel.toString().length > 0 : false;

      if (hasSelection) {
        document.execCommand("createLink", false, v.url);
        const made = anchorAtSelection();
        if (made) decorate(made, v);
      } else {
        const a = document.createElement("a");
        a.textContent = v.text || v.url;
        decorate(a, v);
        const range = sel && sel.rangeCount > 0 ? sel.getRangeAt(0) : null;
        if (range) {
          range.insertNode(a);
          range.setStartAfter(a);
          range.collapse(true);
          sel?.removeAllRanges();
          sel?.addRange(range);
        } else {
          ref.current?.appendChild(a);
        }
      }
    }

    linkAnchor.current = null;
    setLinkOpen(false);
    emit();
  }

  function removeLinkFromDialog() {
    const existing = linkAnchor.current;
    if (existing && existing.parentNode) {
      const text = document.createTextNode(existing.textContent ?? "");
      existing.parentNode.replaceChild(text, existing);
    }
    linkAnchor.current = null;
    setLinkOpen(false);
    emit();
  }

  function insertImageUrl(url: string) {
    ref.current?.focus();
    restoreSelection();
    document.execCommand("insertHTML", false, `<img src="${url}" alt="" />`);
    emit();
  }

  async function uploadImage(file: File) {
    const supabase = getSupabaseBrowser();
    if (!supabase) {
      const url = window.prompt("Image URL");
      if (url) insertImageUrl(url);
      return;
    }
    const name = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]+/g, "-")}`;
    const { error } = await supabase.storage.from("media").upload(name, file, {
      cacheControl: "31536000",
    });
    if (error) {
      alert(`Upload failed: ${error.message}`);
      return;
    }
    const url = supabase.storage.from("media").getPublicUrl(name).data.publicUrl;
    insertImageUrl(url);
  }

  function Btn({
    onClick,
    title,
    children,
    active,
  }: {
    onClick: () => void;
    title: string;
    children: React.ReactNode;
    active?: boolean;
  }) {
    return (
      <button
        type="button"
        title={title}
        className={`re-btn ${active ? "active" : ""}`}
        onMouseDown={(e) => {
          e.preventDefault();
          onClick();
        }}
      >
        {children}
      </button>
    );
  }

  return (
    <div className="rich-editor">
      <div className="re-toolbar">
        <select
          className="re-select"
          title="Text style"
          onMouseDown={saveSelection}
          onChange={(e) => {
            setBlock(e.target.value);
            e.target.selectedIndex = 0;
          }}
          defaultValue=""
        >
          <option value="" disabled>
            Style
          </option>
          {BLOCKS.map((b) => (
            <option key={b.value} value={b.value}>
              {b.label}
            </option>
          ))}
        </select>

        <select
          className="re-select"
          title="Font size"
          onMouseDown={saveSelection}
          onChange={(e) => {
            exec("fontSize", e.target.value);
            e.target.selectedIndex = 0;
          }}
          defaultValue=""
        >
          <option value="" disabled>
            Size
          </option>
          {FONT_SIZES.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>

        <span className="re-sep" />

        <Btn title="Bold (Ctrl+B)" onClick={() => exec("bold")}>
          <b>B</b>
        </Btn>
        <Btn title="Italic (Ctrl+I)" onClick={() => exec("italic")}>
          <i>I</i>
        </Btn>
        <Btn title="Underline (Ctrl+U)" onClick={() => exec("underline")}>
          <u>U</u>
        </Btn>
        <Btn title="Strikethrough" onClick={() => exec("strikeThrough")}>
          <s>S</s>
        </Btn>

        <span className="re-sep" />

        <div className="re-pop-wrap">
          <Btn
            title="Text color"
            onClick={() => {
              saveSelection();
              setShowColors((v) => !v);
              setShowHighlight(false);
            }}
          >
            <span className="re-a-color">A</span>
          </Btn>
          {showColors && (
            <div className="re-popover">
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  className="re-swatch"
                  style={{ background: c }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    exec("foreColor", c);
                    setShowColors(false);
                  }}
                />
              ))}
            </div>
          )}
        </div>

        <div className="re-pop-wrap">
          <Btn
            title="Highlight"
            onClick={() => {
              saveSelection();
              setShowHighlight((v) => !v);
              setShowColors(false);
            }}
          >
            <span className="re-hl">H</span>
          </Btn>
          {showHighlight && (
            <div className="re-popover">
              {["#fde68a", "#fecaca", "#bbf7d0", "#bfdbfe", "#e9d5ff", "transparent"].map((c) => (
                <button
                  key={c}
                  type="button"
                  className="re-swatch"
                  style={{ background: c === "transparent" ? "#333" : c }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    exec("hiliteColor", c);
                    setShowHighlight(false);
                  }}
                />
              ))}
            </div>
          )}
        </div>

        <span className="re-sep" />

        <Btn title="Bulleted list" onClick={() => exec("insertUnorderedList")}>
          ☰
        </Btn>
        <Btn title="Numbered list" onClick={() => exec("insertOrderedList")}>
          1.
        </Btn>
        <Btn title="Indent" onClick={() => exec("indent")}>
          ⇥
        </Btn>
        <Btn title="Outdent" onClick={() => exec("outdent")}>
          ⇤
        </Btn>

        <span className="re-sep" />

        <Btn title="Align left" onClick={() => exec("justifyLeft")}>
          ⬅
        </Btn>
        <Btn title="Align center" onClick={() => exec("justifyCenter")}>
          ↔
        </Btn>
        <Btn title="Align right" onClick={() => exec("justifyRight")}>
          ➡
        </Btn>

        <span className="re-sep" />

        <Btn title="Insert or edit link" onClick={openLinkDialog}>
          🔗
        </Btn>
        <Btn title="Remove link" onClick={() => exec("unlink")}>
          ⛓
        </Btn>
        <Btn title="Insert image" onClick={() => fileRef.current?.click()}>
          🖼
        </Btn>
        <Btn title="Horizontal line" onClick={() => exec("insertHorizontalRule")}>
          ―
        </Btn>

        <span className="re-sep" />

        <Btn title="Undo (Ctrl+Z)" onClick={() => exec("undo")}>
          ↶
        </Btn>
        <Btn title="Redo (Ctrl+Y)" onClick={() => exec("redo")}>
          ↷
        </Btn>
        <Btn title="Clear formatting" onClick={() => exec("removeFormat")}>
          ✕
        </Btn>

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void uploadImage(f);
            e.target.value = "";
          }}
        />
      </div>

      <div
        ref={ref}
        className="re-content prose"
        contentEditable
        suppressContentEditableWarning
        onInput={emit}
        onBlur={emit}
      />

      <LinkDialog
        open={linkOpen}
        initial={linkInit}
        canEditText={linkCanEditText}
        editingExisting={Boolean(linkAnchor.current)}
        onSubmit={applyLink}
        onRemove={removeLinkFromDialog}
        onClose={() => {
          linkAnchor.current = null;
          setLinkOpen(false);
        }}
      />
    </div>
  );
}
