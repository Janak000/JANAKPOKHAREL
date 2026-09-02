"use client";

import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { getSupabaseBrowser } from "@/lib/supabase-browser";
import { Icon } from "@/components/icon";
import { PostsEditor } from "./posts-editor";
import { ServicesEditor, ProjectsEditor, ResumeEditor } from "./collections-editor";
import { BlocksEditor } from "./blocks-editor";
import { MessagesPanel } from "./messages-panel";
import { MediaPanel } from "./media-panel";

type Tab =
  | "dashboard"
  | "posts"
  | "services"
  | "projects"
  | "resume"
  | "pages"
  | "messages"
  | "media";

const tabs: { key: Tab; label: string; icon: string }[] = [
  { key: "dashboard", label: "Dashboard", icon: "sparkles" },
  { key: "posts", label: "Blog Posts", icon: "tag" },
  { key: "pages", label: "Page Content", icon: "settings" },
  { key: "services", label: "Services", icon: "target" },
  { key: "projects", label: "Portfolio", icon: "briefcase" },
  { key: "resume", label: "Resume", icon: "graduation-cap" },
  { key: "messages", label: "Messages", icon: "mail" },
  { key: "media", label: "Media", icon: "heart" },
];

export function AdminApp() {
  const supabase = getSupabaseBrowser();
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [ready, setReady] = useState(false);
  const [tab, setTab] = useState<Tab>("dashboard");

  useEffect(() => {
    if (!supabase) {
      setReady(true);
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setIsAdmin(null);
    });
    return () => sub.subscription.unsubscribe();
  }, [supabase]);

  useEffect(() => {
    if (!supabase || !session) return;
    supabase
      .from("admin_users")
      .select("user_id")
      .limit(1)
      .then(({ data }) => setIsAdmin(Boolean(data && data.length > 0)));
  }, [supabase, session]);

  if (!supabase) {
    return (
      <div className="admin-root admin-login">
        <div className="admin-login-card">
          <span className="brand-mark">JP</span>
          <h1>CMS not connected</h1>
          <p>
            Supabase environment variables are missing. Add
            <code> NEXT_PUBLIC_SUPABASE_URL</code> and
            <code> NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to your
            <code> .env.local</code> (and Vercel project settings), then reload.
          </p>
        </div>
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="admin-root admin-login">
        <p style={{ color: "var(--text-faint)" }}>Loading…</p>
      </div>
    );
  }

  if (!session) return <LoginCard />;

  if (isAdmin === null) {
    return (
      <div className="admin-root admin-login">
        <p style={{ color: "var(--text-faint)" }}>Checking access…</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="admin-root admin-login">
        <div className="admin-login-card">
          <span className="brand-mark">JP</span>
          <h1>Access denied</h1>
          <p>
            You are signed in as <strong>{session.user.email}</strong>, but this
            account is not registered as an admin. Run the admin setup SQL in
            Supabase (see README) to grant access.
          </p>
          <button className="btn btn-ghost" onClick={() => supabase.auth.signOut()}>
            Sign out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-root admin-shell">
      <aside className="admin-sidebar">
        <div className="brand">
          <span className="brand-mark">JP</span>
          <span className="brand-name">Sanchalan</span>
        </div>
        {tabs.map((t) => (
          <button
            key={t.key}
            className={`admin-nav-btn ${tab === t.key ? "active" : ""}`}
            onClick={() => setTab(t.key)}
          >
            <Icon name={t.icon} size={17} /> {t.label}
          </button>
        ))}
        <div className="spacer" />
        <a className="admin-nav-btn" href="/" target="_blank" rel="noopener noreferrer">
          <Icon name="arrow-up-right" size={17} /> View site
        </a>
        <button className="admin-nav-btn" onClick={() => supabase.auth.signOut()}>
          <Icon name="x" size={17} /> Sign out
        </button>
      </aside>

      <div className="admin-main">
        {tab === "dashboard" && <Dashboard onNavigate={setTab} />}
        {tab === "posts" && <PostsEditor />}
        {tab === "pages" && <BlocksEditor />}
        {tab === "services" && <ServicesEditor />}
        {tab === "projects" && <ProjectsEditor />}
        {tab === "resume" && <ResumeEditor />}
        {tab === "messages" && <MessagesPanel />}
        {tab === "media" && <MediaPanel />}
      </div>
    </div>
  );
}

function LoginCard() {
  const supabase = getSupabaseBrowser()!;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) setError(error.message);
  }

  return (
    <div className="admin-root admin-login">
      <form className="admin-login-card admin-form" onSubmit={signIn}>
        <span className="brand-mark">JP</span>
        <h1>Sanchalan</h1>
        <p>Sign in to manage janakpokharel.com.np</p>
        <label>
          <span>Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </label>
        <label>
          <span>Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </label>
        {error && <p className="form-error">{error}</p>}
        <button type="submit" className="btn btn-primary" disabled={busy}>
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}

function Dashboard({ onNavigate }: { onNavigate: (tab: Tab) => void }) {
  const supabase = getSupabaseBrowser()!;
  const [counts, setCounts] = useState({ posts: 0, services: 0, projects: 0, messages: 0 });

  useEffect(() => {
    (async () => {
      const tables = ["posts", "services", "projects", "messages"] as const;
      const results = await Promise.all(
        tables.map((t) =>
          supabase.from(t).select("*", { count: "exact", head: true })
        )
      );
      setCounts({
        posts: results[0].count ?? 0,
        services: results[1].count ?? 0,
        projects: results[2].count ?? 0,
        messages: results[3].count ?? 0,
      });
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div className="admin-topbar">
        <h1>Dashboard</h1>
      </div>
      <div className="admin-cards">
        <button className="admin-stat" style={{ textAlign: "left", cursor: "pointer" }} onClick={() => onNavigate("posts")}>
          <strong>{counts.posts}</strong>
          <span>Blog posts</span>
        </button>
        <button className="admin-stat" style={{ textAlign: "left", cursor: "pointer" }} onClick={() => onNavigate("services")}>
          <strong>{counts.services}</strong>
          <span>Services</span>
        </button>
        <button className="admin-stat" style={{ textAlign: "left", cursor: "pointer" }} onClick={() => onNavigate("projects")}>
          <strong>{counts.projects}</strong>
          <span>Projects</span>
        </button>
        <button className="admin-stat" style={{ textAlign: "left", cursor: "pointer" }} onClick={() => onNavigate("messages")}>
          <strong>{counts.messages}</strong>
          <span>Messages</span>
        </button>
      </div>

      <div className="admin-form" style={{ maxWidth: 720 }}>
        <h2 style={{ fontSize: 18 }}>Quick guide</h2>
        <ul style={{ color: "var(--text-muted)", fontSize: 14.5, marginLeft: 20, lineHeight: 2 }}>
          <li><strong>Blog Posts</strong>, write articles in Markdown with live preview, SEO fields, and FAQs (FAQ schema is added automatically).</li>
          <li><strong>Page Content</strong>, edit the homepage hero, about page, contact page, blog settings, and site-wide settings.</li>
          <li><strong>Services / Portfolio / Resume</strong>, manage the structured content shown across the site.</li>
          <li><strong>Media</strong>, upload images and copy their URLs into any image field.</li>
          <li>Saves go live within seconds, the site revalidates automatically after each save.</li>
        </ul>
      </div>
    </div>
  );
}
