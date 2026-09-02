"use client";

import { getSupabaseBrowser } from "@/lib/supabase-browser";

export type Notice = { kind: "ok" | "err"; text: string } | null;

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** Tell the site to rebuild cached pages right away after a content change. */
export async function requestRevalidate(): Promise<void> {
  const supabase = getSupabaseBrowser();
  if (!supabase) return;
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) return;
  try {
    await fetch("/api/revalidate", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch {
    // Non-fatal: ISR will refresh within the revalidate window anyway.
  }
}

export function NoticeBar({ notice }: { notice: Notice }) {
  if (!notice) return null;
  return <div className={`admin-notice ${notice.kind}`}>{notice.text}</div>;
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label>
      <span>{label}</span>
      {children}
    </label>
  );
}

export function confirmDelete(what: string): boolean {
  return window.confirm(`Delete ${what}? This cannot be undone.`);
}
