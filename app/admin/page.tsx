import Link from "next/link";

import { AdminCms } from "@/components/admin-cms";
import { getCmsStatus } from "@/lib/github-cms";
import { getSiteContent } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const content = await getSiteContent();
  const status = getCmsStatus();

  return (
    <section className="section-block page-offset">
      <div className="shell admin-shell">
        <div className="section-heading">
          <p className="section-kicker">Content Admin</p>
          <h1>Edit every section from one live CMS</h1>
          <p className="section-copy">
            Update the structured content below and save it back to GitHub. Your Vercel site will pull the latest JSON
            content for the homepage, all sections, blog listing, blog pages, and metadata.
          </p>
        </div>

        <AdminCms initialContent={content} status={status} />

        <article className="panel">
          <h2>Setup notes</h2>
          <ul className="admin-list">
            <li>Add the GitHub and CMS environment variables in Vercel before saving from this page.</li>
            <li>Keep the admin secret private so only you can publish changes.</li>
            <li>Use the same repository that Vercel is connected to for the smoothest publishing flow.</li>
          </ul>
          <Link className="text-link" href="/">
            Return to homepage
          </Link>
        </article>
      </div>
    </section>
  );
}
