"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import type { SiteContent } from "@/data/site-content";
import type { CmsStatus } from "@/lib/github-cms";

type AdminCmsProps = {
  initialContent: SiteContent;
  status: CmsStatus;
};

type ApiResponse = {
  error?: string;
  message?: string;
  commitUrl?: string;
  content?: SiteContent;
};

export function AdminCms({ initialContent, status }: AdminCmsProps) {
  const router = useRouter();
  const [editorValue, setEditorValue] = useState(() => JSON.stringify(initialContent, null, 2));
  const [adminSecret, setAdminSecret] = useState("");
  const [feedback, setFeedback] = useState("");
  const [commitUrl, setCommitUrl] = useState("");
  const [isPending, startTransition] = useTransition();

  const sectionKeys = useMemo(() => Object.keys(initialContent), [initialContent]);

  async function refreshLatestContent() {
    setFeedback("Loading latest content...");
    setCommitUrl("");

    const response = await fetch("/api/content", {
      cache: "no-store"
    });

    const payload = (await response.json()) as ApiResponse;

    if (!response.ok || !payload.content) {
      setFeedback(payload.error || "Unable to load the latest content.");
      return;
    }

    setEditorValue(JSON.stringify(payload.content, null, 2));
    setFeedback("Editor refreshed with the latest saved content.");
    router.refresh();
  }

  function formatJson() {
    try {
      const parsed = JSON.parse(editorValue) as SiteContent;
      setEditorValue(JSON.stringify(parsed, null, 2));
      setFeedback("JSON formatted.");
    } catch {
      setFeedback("JSON formatting failed. Please fix the syntax first.");
    }
  }

  function saveContent() {
    startTransition(async () => {
      setFeedback("");
      setCommitUrl("");

      let parsedContent: SiteContent;

      try {
        parsedContent = JSON.parse(editorValue) as SiteContent;
      } catch {
        setFeedback("JSON is invalid. Please fix the syntax before saving.");
        return;
      }

      const response = await fetch("/api/content", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          content: parsedContent,
          secret: adminSecret
        })
      });

      const payload = (await response.json()) as ApiResponse;

      if (!response.ok) {
        setFeedback(payload.error || "Saving failed.");
        return;
      }

      const nextContent = payload.content ?? parsedContent;
      setEditorValue(JSON.stringify(nextContent, null, 2));
      setCommitUrl(payload.commitUrl || "");
      setFeedback(payload.message || "Content saved successfully.");
      router.refresh();
    });
  }

  return (
    <div className="admin-stack">
      <div className="admin-grid">
        <article className="panel">
          <h2>Live CMS Status</h2>
          <ul className="admin-list">
            <li>Repository: {status.repoLabel}</li>
            <li>Branch: {status.branch}</li>
            <li>Content file: {status.contentPath}</li>
            <li>Live reads: {status.readEnabled ? "Enabled" : "Using bundled fallback content"}</li>
            <li>Saving: {status.writeEnabled ? "Ready" : "Needs GitHub token"}</li>
            <li>Admin protection: {status.hasAdminSecret ? "Enabled" : "Needs CMS_ADMIN_SECRET"}</li>
          </ul>
        </article>

        <article className="panel">
          <h2>Editable Sections</h2>
          <div className="admin-chip-row">
            {sectionKeys.map((key) => (
              <span key={key} className="admin-chip">
                {key}
              </span>
            ))}
          </div>
          <p className="section-copy admin-help">
            Save updates here and the website will read the latest content directly from GitHub on Vercel, including
            the homepage, blogs page, blog detail pages, navigation, footer, and SEO metadata.
          </p>
        </article>
      </div>

      <article className="panel admin-editor-panel">
        <div className="admin-toolbar">
          <div>
            <h2>Content JSON</h2>
            <p className="section-copy admin-help">Edit any section here. Keep the JSON structure valid when saving.</p>
          </div>

          <div className="admin-actions">
            <button className="button button-secondary" onClick={refreshLatestContent} type="button">
              Reload Latest
            </button>
            <button className="button button-secondary" onClick={formatJson} type="button">
              Format JSON
            </button>
          </div>
        </div>

        <label className="admin-label" htmlFor="cms-secret">
          Admin Secret
        </label>
        <input
          className="admin-input"
          id="cms-secret"
          onChange={(event) => setAdminSecret(event.target.value)}
          placeholder="Enter CMS_ADMIN_SECRET"
          type="password"
          value={adminSecret}
        />

        <label className="admin-label" htmlFor="cms-editor">
          Site Content
        </label>
        <textarea
          className="admin-editor"
          id="cms-editor"
          onChange={(event) => setEditorValue(event.target.value)}
          spellCheck={false}
          value={editorValue}
        />

        <div className="admin-save-row">
          <button
            className="button button-primary"
            disabled={isPending || !status.writeEnabled || !status.hasAdminSecret}
            onClick={saveContent}
            type="button"
          >
            {isPending ? "Saving..." : "Save to GitHub CMS"}
          </button>

          {feedback ? <p className="admin-feedback">{feedback}</p> : null}
          {commitUrl ? (
            <a className="text-link" href={commitUrl} rel="noreferrer" target="_blank">
              View GitHub commit
            </a>
          ) : null}
        </div>
      </article>
    </div>
  );
}
