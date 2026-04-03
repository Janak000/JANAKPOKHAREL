import Link from "next/link";

import { AdminCms } from "@/components/admin-cms";
import { getSiteContent } from "@/lib/site-content";
import { getCmsStatus } from "@/lib/supabase-content";

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
            Update the structured content below and save it to Supabase. The public site reads from the same backend
            for the homepage, blog listing, blog posts, footer, and metadata.
          </p>
        </div>

        <AdminCms initialContent={content} status={status} />

        <article className="panel">
          <h2>Setup notes</h2>
          <ul className="admin-list">
            <li>Add the Supabase URL, anon key, service role key, and admin secret in your environment variables.</li>
            <li>Run the SQL schema in Supabase before saving from this page.</li>
            <li>Keep the admin secret private so only trusted editors can publish changes.</li>
          </ul>
          <Link className="text-link" href="/">
            Return to homepage
          </Link>
        </article>
      </div>
    </section>
  );
}
