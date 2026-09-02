"use client";

import { useEffect, useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabase-browser";
import {
  Field,
  NoticeBar,
  confirmDelete,
  requestRevalidate,
  slugify,
  type Notice,
} from "./shared";

/* ---------------- Services ---------------- */

type ServiceRow = {
  id?: string;
  slug: string;
  icon: string;
  title: string;
  short_description: string;
  body_md: string;
  meta_title: string | null;
  meta_description: string | null;
  sort_order: number;
  published: boolean;
};

const iconOptions = [
  "search",
  "target",
  "mouse-pointer",
  "settings",
  "bar-chart",
  "cpu",
  "sparkles",
  "users",
];

export function ServicesEditor() {
  const supabase = getSupabaseBrowser()!;
  const [rows, setRows] = useState<ServiceRow[]>([]);
  const [editing, setEditing] = useState<ServiceRow | null>(null);
  const [notice, setNotice] = useState<Notice>(null);

  async function load() {
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .order("sort_order");
    if (error) setNotice({ kind: "err", text: error.message });
    else setRows((data as ServiceRow[]) ?? []);
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function save() {
    if (!editing) return;
    const { error } = editing.id
      ? await supabase.from("services").update(editing).eq("id", editing.id)
      : await supabase.from("services").insert(editing);
    if (error) {
      setNotice({ kind: "err", text: error.message });
      return;
    }
    setNotice({ kind: "ok", text: "Service saved." });
    setEditing(null);
    await load();
    void requestRevalidate();
  }

  async function remove(row: ServiceRow) {
    if (!row.id || !confirmDelete(`"${row.title}"`)) return;
    await supabase.from("services").delete().eq("id", row.id);
    await load();
    void requestRevalidate();
  }

  if (editing) {
    return (
      <div>
        <div className="admin-topbar">
          <h1>{editing.id ? "Edit service" : "New service"}</h1>
          <div className="actions">
            <button className="btn btn-ghost btn-sm" onClick={() => setEditing(null)}>
              Cancel
            </button>
            <button className="btn btn-primary btn-sm" onClick={save}>
              Save service
            </button>
          </div>
        </div>
        <NoticeBar notice={notice} />
        <div className="admin-form">
          <div className="row-3">
            <Field label="Title">
              <input
                value={editing.title}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    title: e.target.value,
                    slug: editing.id ? editing.slug : slugify(e.target.value),
                  })
                }
              />
            </Field>
            <Field label="Slug (URL)">
              <input
                value={editing.slug}
                onChange={(e) => setEditing({ ...editing, slug: slugify(e.target.value) })}
              />
            </Field>
            <Field label="Icon">
              <select
                value={editing.icon}
                onChange={(e) => setEditing({ ...editing, icon: e.target.value })}
              >
                {iconOptions.map((i) => (
                  <option key={i}>{i}</option>
                ))}
              </select>
            </Field>
          </div>
          <Field label="Short description (card text)">
            <textarea
              rows={2}
              value={editing.short_description}
              onChange={(e) =>
                setEditing({ ...editing, short_description: e.target.value })
              }
            />
          </Field>
          <Field label="Detail page body (Markdown)">
            <textarea
              rows={14}
              value={editing.body_md}
              onChange={(e) => setEditing({ ...editing, body_md: e.target.value })}
              style={{ fontFamily: "ui-monospace, monospace", fontSize: 14 }}
            />
          </Field>
          <div className="row-2">
            <Field label="Meta title (optional)">
              <input
                value={editing.meta_title ?? ""}
                onChange={(e) =>
                  setEditing({ ...editing, meta_title: e.target.value || null })
                }
              />
            </Field>
            <Field label="Meta description (optional)">
              <input
                value={editing.meta_description ?? ""}
                onChange={(e) =>
                  setEditing({ ...editing, meta_description: e.target.value || null })
                }
              />
            </Field>
          </div>
          <div className="row-2">
            <Field label="Sort order">
              <input
                type="number"
                value={editing.sort_order}
                onChange={(e) =>
                  setEditing({ ...editing, sort_order: Number(e.target.value) })
                }
              />
            </Field>
            <label style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <input
                type="checkbox"
                checked={editing.published}
                onChange={(e) => setEditing({ ...editing, published: e.target.checked })}
                style={{ width: "auto" }}
              />
              <span>Published</span>
            </label>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="admin-topbar">
        <h1>Services</h1>
        <button
          className="btn btn-primary btn-sm"
          onClick={() =>
            setEditing({
              slug: "",
              icon: "search",
              title: "",
              short_description: "",
              body_md: "## What this covers\n\n",
              meta_title: null,
              meta_description: null,
              sort_order: rows.length,
              published: true,
            })
          }
        >
          New service
        </button>
      </div>
      <NoticeBar notice={notice} />
      <table className="admin-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Slug</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr>
              <td colSpan={4} style={{ color: "var(--text-faint)" }}>
                No services in the database yet, the site is showing built-in
                defaults. Add services here to manage them from the CMS.
              </td>
            </tr>
          )}
          {rows.map((row) => (
            <tr key={row.id}>
              <td style={{ fontWeight: 600 }}>{row.title}</td>
              <td>/services/{row.slug}</td>
              <td>
                <span className={`badge ${row.published ? "badge-green" : "badge-gray"}`}>
                  {row.published ? "Published" : "Hidden"}
                </span>
              </td>
              <td style={{ whiteSpace: "nowrap" }}>
                <button className="btn btn-ghost btn-sm" onClick={() => setEditing(row)}>
                  Edit
                </button>{" "}
                <button className="btn btn-danger btn-sm" onClick={() => remove(row)}>
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

/* ---------------- Projects ---------------- */

type ProjectRow = {
  id?: string;
  title: string;
  category: string;
  description: string;
  image_src: string;
  image_alt: string;
  tags: string[];
  result: string | null;
  sort_order: number;
  published: boolean;
};

export function ProjectsEditor() {
  const supabase = getSupabaseBrowser()!;
  const [rows, setRows] = useState<ProjectRow[]>([]);
  const [editing, setEditing] = useState<ProjectRow | null>(null);
  const [notice, setNotice] = useState<Notice>(null);

  async function load() {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("sort_order");
    if (error) setNotice({ kind: "err", text: error.message });
    else setRows((data as ProjectRow[]) ?? []);
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function save() {
    if (!editing) return;
    const { error } = editing.id
      ? await supabase.from("projects").update(editing).eq("id", editing.id)
      : await supabase.from("projects").insert(editing);
    if (error) {
      setNotice({ kind: "err", text: error.message });
      return;
    }
    setNotice({ kind: "ok", text: "Project saved." });
    setEditing(null);
    await load();
    void requestRevalidate();
  }

  async function remove(row: ProjectRow) {
    if (!row.id || !confirmDelete(`"${row.title}"`)) return;
    await supabase.from("projects").delete().eq("id", row.id);
    await load();
    void requestRevalidate();
  }

  if (editing) {
    return (
      <div>
        <div className="admin-topbar">
          <h1>{editing.id ? "Edit project" : "New project"}</h1>
          <div className="actions">
            <button className="btn btn-ghost btn-sm" onClick={() => setEditing(null)}>
              Cancel
            </button>
            <button className="btn btn-primary btn-sm" onClick={save}>
              Save project
            </button>
          </div>
        </div>
        <NoticeBar notice={notice} />
        <div className="admin-form">
          <div className="row-2">
            <Field label="Title">
              <input
                value={editing.title}
                onChange={(e) => setEditing({ ...editing, title: e.target.value })}
              />
            </Field>
            <Field label="Category label">
              <input
                value={editing.category}
                onChange={(e) => setEditing({ ...editing, category: e.target.value })}
              />
            </Field>
          </div>
          <Field label="Description">
            <textarea
              rows={3}
              value={editing.description}
              onChange={(e) => setEditing({ ...editing, description: e.target.value })}
            />
          </Field>
          <div className="row-2">
            <Field label="Logo / image URL (upload in Media tab first)">
              <input
                value={editing.image_src}
                onChange={(e) => setEditing({ ...editing, image_src: e.target.value })}
              />
            </Field>
            <Field label="Image alt text">
              <input
                value={editing.image_alt}
                onChange={(e) => setEditing({ ...editing, image_alt: e.target.value })}
              />
            </Field>
          </div>
          <div className="row-2">
            <Field label="Tags (comma-separated)">
              <input
                value={editing.tags.join(", ")}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean),
                  })
                }
              />
            </Field>
            <Field label="Result highlight (e.g. 'Local visibility')">
              <input
                value={editing.result ?? ""}
                onChange={(e) => setEditing({ ...editing, result: e.target.value || null })}
              />
            </Field>
          </div>
          <div className="row-2">
            <Field label="Sort order">
              <input
                type="number"
                value={editing.sort_order}
                onChange={(e) =>
                  setEditing({ ...editing, sort_order: Number(e.target.value) })
                }
              />
            </Field>
            <label style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <input
                type="checkbox"
                checked={editing.published}
                onChange={(e) => setEditing({ ...editing, published: e.target.checked })}
                style={{ width: "auto" }}
              />
              <span>Published</span>
            </label>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="admin-topbar">
        <h1>Portfolio projects</h1>
        <button
          className="btn btn-primary btn-sm"
          onClick={() =>
            setEditing({
              title: "",
              category: "",
              description: "",
              image_src: "",
              image_alt: "",
              tags: [],
              result: null,
              sort_order: rows.length,
              published: true,
            })
          }
        >
          New project
        </button>
      </div>
      <NoticeBar notice={notice} />
      <table className="admin-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Category</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr>
              <td colSpan={4} style={{ color: "var(--text-faint)" }}>
                No projects in the database yet, the site is showing built-in defaults.
              </td>
            </tr>
          )}
          {rows.map((row) => (
            <tr key={row.id}>
              <td style={{ fontWeight: 600 }}>{row.title}</td>
              <td>{row.category}</td>
              <td>
                <span className={`badge ${row.published ? "badge-green" : "badge-gray"}`}>
                  {row.published ? "Published" : "Hidden"}
                </span>
              </td>
              <td style={{ whiteSpace: "nowrap" }}>
                <button className="btn btn-ghost btn-sm" onClick={() => setEditing(row)}>
                  Edit
                </button>{" "}
                <button className="btn btn-danger btn-sm" onClick={() => remove(row)}>
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

/* ---------------- Resume ---------------- */

type ResumeRow = {
  id?: string;
  kind: "experience" | "education" | "certification";
  title: string;
  subtitle: string;
  href: string | null;
  points: string[];
  sort_order: number;
};

export function ResumeEditor() {
  const supabase = getSupabaseBrowser()!;
  const [rows, setRows] = useState<ResumeRow[]>([]);
  const [editing, setEditing] = useState<ResumeRow | null>(null);
  const [notice, setNotice] = useState<Notice>(null);

  async function load() {
    const { data, error } = await supabase
      .from("resume_entries")
      .select("*")
      .order("kind")
      .order("sort_order");
    if (error) setNotice({ kind: "err", text: error.message });
    else setRows((data as ResumeRow[]) ?? []);
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function save() {
    if (!editing) return;
    const { error } = editing.id
      ? await supabase.from("resume_entries").update(editing).eq("id", editing.id)
      : await supabase.from("resume_entries").insert(editing);
    if (error) {
      setNotice({ kind: "err", text: error.message });
      return;
    }
    setNotice({ kind: "ok", text: "Entry saved." });
    setEditing(null);
    await load();
    void requestRevalidate();
  }

  async function remove(row: ResumeRow) {
    if (!row.id || !confirmDelete(`"${row.title}"`)) return;
    await supabase.from("resume_entries").delete().eq("id", row.id);
    await load();
    void requestRevalidate();
  }

  if (editing) {
    return (
      <div>
        <div className="admin-topbar">
          <h1>{editing.id ? "Edit entry" : "New entry"}</h1>
          <div className="actions">
            <button className="btn btn-ghost btn-sm" onClick={() => setEditing(null)}>
              Cancel
            </button>
            <button className="btn btn-primary btn-sm" onClick={save}>
              Save entry
            </button>
          </div>
        </div>
        <NoticeBar notice={notice} />
        <div className="admin-form">
          <div className="row-3">
            <Field label="Type">
              <select
                value={editing.kind}
                onChange={(e) =>
                  setEditing({ ...editing, kind: e.target.value as ResumeRow["kind"] })
                }
              >
                <option value="experience">Experience</option>
                <option value="education">Education</option>
                <option value="certification">Certification</option>
              </select>
            </Field>
            <Field label="Title (role / school / certificate)">
              <input
                value={editing.title}
                onChange={(e) => setEditing({ ...editing, title: e.target.value })}
              />
            </Field>
            <Field label="Subtitle (org | dates)">
              <input
                value={editing.subtitle}
                onChange={(e) => setEditing({ ...editing, subtitle: e.target.value })}
              />
            </Field>
          </div>
          <Field label="Link (optional)">
            <input
              value={editing.href ?? ""}
              onChange={(e) => setEditing({ ...editing, href: e.target.value || null })}
            />
          </Field>
          <Field label="Bullet points (one per line)">
            <textarea
              rows={4}
              value={editing.points.join("\n")}
              onChange={(e) =>
                setEditing({
                  ...editing,
                  points: e.target.value.split("\n").filter((l) => l.trim()),
                })
              }
            />
          </Field>
          <Field label="Sort order">
            <input
              type="number"
              value={editing.sort_order}
              onChange={(e) =>
                setEditing({ ...editing, sort_order: Number(e.target.value) })
              }
            />
          </Field>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="admin-topbar">
        <h1>Resume</h1>
        <button
          className="btn btn-primary btn-sm"
          onClick={() =>
            setEditing({
              kind: "experience",
              title: "",
              subtitle: "",
              href: null,
              points: [],
              sort_order: 0,
            })
          }
        >
          New entry
        </button>
      </div>
      <NoticeBar notice={notice} />
      <table className="admin-table">
        <thead>
          <tr>
            <th>Type</th>
            <th>Title</th>
            <th>Subtitle</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr>
              <td colSpan={4} style={{ color: "var(--text-faint)" }}>
                No entries in the database yet, the site is showing built-in defaults.
              </td>
            </tr>
          )}
          {rows.map((row) => (
            <tr key={row.id}>
              <td>
                <span className="badge badge-purple">{row.kind}</span>
              </td>
              <td style={{ fontWeight: 600 }}>{row.title}</td>
              <td>{row.subtitle}</td>
              <td style={{ whiteSpace: "nowrap" }}>
                <button className="btn btn-ghost btn-sm" onClick={() => setEditing(row)}>
                  Edit
                </button>{" "}
                <button className="btn btn-danger btn-sm" onClick={() => remove(row)}>
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
