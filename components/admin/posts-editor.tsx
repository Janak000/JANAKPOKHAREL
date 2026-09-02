"use client";

import { useEffect, useState } from "react";
import { marked } from "marked";
import { getSupabaseBrowser } from "@/lib/supabase-browser";
import { Icon } from "@/components/icon";
import { RichEditor } from "./rich-editor";
import {
  Field,
  NoticeBar,
  confirmDelete,
  requestRevalidate,
  slugify,
  type Notice,
} from "./shared";

// Existing posts store Markdown; the rich editor works in HTML. Convert on open
// so old posts stay editable, and store HTML going forward (the public renderer
// runs it through marked, which passes HTML through unchanged).
function toEditorHtml(body: string): string {
  if (!body) return "";
  const looksLikeHtml = /<(p|h[1-6]|ul|ol|blockquote|pre|div|img|figure)\b/i.test(body);
  return looksLikeHtml ? body : (marked.parse(body) as string);
}

type PostRow = {
  id?: string;
  slug: string;
  title: string;
  category: string;
  tags: string[];
  excerpt: string;
  meta_title: string | null;
  meta_description: string;
  cover_image: string | null;
  read_time: string;
  hero_intro: string;
  body_md: string;
  faqs: { question: string; answer: string }[];
  featured: boolean;
  published: boolean;
  published_at: string;
};

const emptyPost = (): PostRow => ({
  slug: "",
  title: "",
  category: "SEO Strategy",
  tags: [],
  excerpt: "",
  meta_title: null,
  meta_description: "",
  cover_image: null,
  read_time: "5 min read",
  hero_intro: "",
  body_md: "<h2>First section</h2><p>Write your article here. Use the toolbar to format text, add headings, lists, links, and images.</p>",
  faqs: [],
  featured: false,
  published: false,
  published_at: new Date().toISOString(),
});

export function PostsEditor() {
  const supabase = getSupabaseBrowser()!;
  const [posts, setPosts] = useState<PostRow[]>([]);
  const [editing, setEditing] = useState<PostRow | null>(null);
  const [notice, setNotice] = useState<Notice>(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("published_at", { ascending: false });
    if (error) setNotice({ kind: "err", text: error.message });
    else setPosts((data as PostRow[]) ?? []);
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function openPost(post: PostRow) {
    setEditing({ ...post, body_md: toEditorHtml(post.body_md) });
  }

  async function save() {
    if (!editing) return;
    if (!editing.title.trim() || !editing.slug.trim()) {
      setNotice({ kind: "err", text: "Title and slug are required." });
      return;
    }
    setSaving(true);
    const row = { ...editing, updated_at: new Date().toISOString() };
    const { error } = row.id
      ? await supabase.from("posts").update(row).eq("id", row.id)
      : await supabase.from("posts").insert(row);
    setSaving(false);
    if (error) {
      setNotice({ kind: "err", text: error.message });
      return;
    }
    setNotice({ kind: "ok", text: "Post saved. Site is updating…" });
    setEditing(null);
    await load();
    void requestRevalidate();
  }

  async function remove(post: PostRow) {
    if (!post.id || !confirmDelete(`"${post.title}"`)) return;
    const { error } = await supabase.from("posts").delete().eq("id", post.id);
    if (error) setNotice({ kind: "err", text: error.message });
    else {
      setNotice({ kind: "ok", text: "Post deleted." });
      await load();
      void requestRevalidate();
    }
  }

  function set<K extends keyof PostRow>(key: K, value: PostRow[K]) {
    setEditing((p) => (p ? { ...p, [key]: value } : p));
  }

  if (editing) {
    return (
      <div>
        <div className="admin-topbar">
          <h1>{editing.id ? "Edit post" : "New post"}</h1>
          <div className="actions">
            <button className="btn btn-ghost btn-sm" onClick={() => setEditing(null)}>
              Cancel
            </button>
            <button className="btn btn-primary btn-sm" onClick={save} disabled={saving}>
              {saving ? "Saving…" : "Save post"}
            </button>
          </div>
        </div>
        <NoticeBar notice={notice} />

        <div className="admin-form">
          <div className="row-2">
            <Field label="Title">
              <input
                value={editing.title}
                onChange={(e) => {
                  const title = e.target.value;
                  setEditing((p) =>
                    p
                      ? {
                          ...p,
                          title,
                          slug: p.id ? p.slug : slugify(title),
                        }
                      : p
                  );
                }}
              />
            </Field>
            <Field label="Slug (URL)">
              <input
                value={editing.slug}
                onChange={(e) => set("slug", slugify(e.target.value))}
              />
            </Field>
          </div>

          <div className="row-3">
            <Field label="Category">
              <input value={editing.category} onChange={(e) => set("category", e.target.value)} />
            </Field>
            <Field label="Read time">
              <input value={editing.read_time} onChange={(e) => set("read_time", e.target.value)} />
            </Field>
            <Field label="Publish date">
              <input
                type="date"
                value={editing.published_at.slice(0, 10)}
                onChange={(e) =>
                  set("published_at", new Date(e.target.value).toISOString())
                }
              />
            </Field>
          </div>

          <Field label="Tags (comma-separated)">
            <input
              value={editing.tags.join(", ")}
              onChange={(e) =>
                set(
                  "tags",
                  e.target.value.split(",").map((t) => t.trim()).filter(Boolean)
                )
              }
            />
          </Field>

          <Field label="Excerpt (shown on cards and in search results)">
            <textarea
              rows={2}
              value={editing.excerpt}
              onChange={(e) => set("excerpt", e.target.value)}
            />
          </Field>

          <Field label="Intro paragraph (large opening text)">
            <textarea
              rows={3}
              value={editing.hero_intro}
              onChange={(e) => set("hero_intro", e.target.value)}
            />
          </Field>

          <div className="field">
            <span>Body</span>
            <RichEditor
              value={editing.body_md}
              onChange={(html) => set("body_md", html)}
            />
          </div>

          <h2 style={{ fontSize: 18, marginTop: 12 }}>SEO</h2>
          <div className="row-2">
            <Field label="Meta title (optional, defaults to post title)">
              <input
                value={editing.meta_title ?? ""}
                onChange={(e) => set("meta_title", e.target.value || null)}
              />
            </Field>
            <Field label="Cover image URL (optional)">
              <input
                value={editing.cover_image ?? ""}
                onChange={(e) => set("cover_image", e.target.value || null)}
              />
            </Field>
          </div>
          <Field label={`Meta description (${editing.meta_description.length}/160)`}>
            <textarea
              rows={2}
              maxLength={200}
              value={editing.meta_description}
              onChange={(e) => set("meta_description", e.target.value)}
            />
          </Field>

          <h2 style={{ fontSize: 18, marginTop: 12 }}>
            FAQs (adds FAQ rich results in Google + helps AI answers)
          </h2>
          {editing.faqs.map((faq, i) => (
            <div key={i} className="row-2" style={{ alignItems: "end" }}>
              <Field label={`Question ${i + 1}`}>
                <input
                  value={faq.question}
                  onChange={(e) => {
                    const faqs = [...editing.faqs];
                    faqs[i] = { ...faqs[i], question: e.target.value };
                    set("faqs", faqs);
                  }}
                />
              </Field>
              <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
                <Field label="Answer">
                  <textarea
                    rows={2}
                    style={{ minWidth: 260 }}
                    value={faq.answer}
                    onChange={(e) => {
                      const faqs = [...editing.faqs];
                      faqs[i] = { ...faqs[i], answer: e.target.value };
                      set("faqs", faqs);
                    }}
                  />
                </Field>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => set("faqs", editing.faqs.filter((_, j) => j !== i))}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <button
            className="btn btn-ghost btn-sm"
            style={{ alignSelf: "flex-start" }}
            onClick={() => set("faqs", [...editing.faqs, { question: "", answer: "" }])}
          >
            + Add FAQ
          </button>

          <div className="row-2" style={{ marginTop: 12 }}>
            <label style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <input
                type="checkbox"
                checked={editing.published}
                onChange={(e) => set("published", e.target.checked)}
                style={{ width: "auto" }}
              />
              <span>Published (visible on the site)</span>
            </label>
            <label style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <input
                type="checkbox"
                checked={editing.featured}
                onChange={(e) => set("featured", e.target.checked)}
                style={{ width: "auto" }}
              />
              <span>Featured</span>
            </label>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="admin-topbar">
        <h1>Blog posts</h1>
        <button className="btn btn-primary btn-sm" onClick={() => setEditing(emptyPost())}>
          <Icon name="sparkles" size={15} /> New post
        </button>
      </div>
      <NoticeBar notice={notice} />
      <table className="admin-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Category</th>
            <th>Status</th>
            <th>Date</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {posts.length === 0 && (
            <tr>
              <td colSpan={5} style={{ color: "var(--text-faint)" }}>
                No posts yet. The site is currently showing the built-in starter
                articles, create a post to take over.
              </td>
            </tr>
          )}
          {posts.map((post) => (
            <tr key={post.id}>
              <td style={{ fontWeight: 600 }}>{post.title}</td>
              <td>{post.category}</td>
              <td>
                <span className={`badge ${post.published ? "badge-green" : "badge-gray"}`}>
                  {post.published ? "Published" : "Draft"}
                </span>
              </td>
              <td>{post.published_at?.slice(0, 10)}</td>
              <td style={{ whiteSpace: "nowrap" }}>
                <button className="btn btn-ghost btn-sm" onClick={() => openPost(post)}>
                  Edit
                </button>{" "}
                <button className="btn btn-danger btn-sm" onClick={() => remove(post)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
