"use client";

import { useEffect, useRef, useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabase-browser";
import { NoticeBar, confirmDelete, type Notice } from "./shared";

type MediaFile = { name: string; url: string };

const BUCKET = "media";

export function MediaPanel() {
  const supabase = getSupabaseBrowser()!;
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [notice, setNotice] = useState<Notice>(null);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function load() {
    const { data, error } = await supabase.storage
      .from(BUCKET)
      .list("", { limit: 200, sortBy: { column: "created_at", order: "desc" } });
    if (error) {
      setNotice({
        kind: "err",
        text: `Could not list media (${error.message}). Make sure a public bucket named "${BUCKET}" exists in Supabase Storage.`,
      });
      return;
    }
    setFiles(
      (data ?? [])
        .filter((f) => f.name !== ".emptyFolderPlaceholder")
        .map((f) => ({
          name: f.name,
          url: supabase.storage.from(BUCKET).getPublicUrl(f.name).data.publicUrl,
        }))
    );
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function upload(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    setUploading(true);
    setNotice(null);
    for (const file of Array.from(fileList)) {
      const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]+/g, "-")}`;
      const { error } = await supabase.storage.from(BUCKET).upload(safeName, file, {
        cacheControl: "31536000",
        upsert: false,
      });
      if (error) {
        setNotice({ kind: "err", text: `Upload failed: ${error.message}` });
        setUploading(false);
        return;
      }
    }
    setUploading(false);
    setNotice({ kind: "ok", text: "Upload complete. Click a file to copy its URL." });
    await load();
  }

  async function remove(file: MediaFile) {
    if (!confirmDelete(file.name)) return;
    await supabase.storage.from(BUCKET).remove([file.name]);
    await load();
  }

  function copyUrl(url: string) {
    void navigator.clipboard.writeText(url);
    setNotice({ kind: "ok", text: "URL copied to clipboard, paste it into any image field." });
  }

  return (
    <div>
      <div className="admin-topbar">
        <h1>Media library</h1>
        <div className="actions">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            style={{ display: "none" }}
            onChange={(e) => void upload(e.target.files)}
          />
          <button
            className="btn btn-primary btn-sm"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
          >
            {uploading ? "Uploading…" : "Upload images"}
          </button>
        </div>
      </div>
      <NoticeBar notice={notice} />
      <p style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 20 }}>
        Upload images here, then click one to copy its URL for use in posts,
        projects, or page content. Use WebP where possible for speed.
      </p>
      <div className="media-grid">
        {files.map((file) => (
          <div key={file.name} className="media-item">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={file.url}
              alt={file.name}
              style={{ cursor: "pointer" }}
              onClick={() => copyUrl(file.url)}
            />
            <div className="media-meta">{file.name}</div>
            <button onClick={() => copyUrl(file.url)}>Copy URL</button>
            <button onClick={() => remove(file)} style={{ color: "#fca5a5" }}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
