# janakpokharel.com.np, Multipage Site + Sanchalan CMS

A fast, SEO-first multipage portfolio and blog for **Janak Pokharel**, built with
Next.js (App Router) + Supabase, deployed on Vercel.

## Pages

| Route | What it is |
|---|---|
| `/` | Homepage, hero, stats, services, featured work, latest posts |
| `/about` | About, resume timeline (experience / education / certifications) |
| `/services` + `/services/[slug]` | Services listing + one SEO page per service |
| `/portfolio` | Brands and campaigns |
| `/blog`, `/blog/[slug]`, `/blog/category/[slug]` | Blog listing, articles, categories |
| `/contact` | Contact channels + form (saves to Supabase) |
| `/sanchalan` | **CMS admin** (Supabase Auth protected, noindex) |

Every page reads its content from Supabase and falls back to built-in content if
the database is empty or unreachable, so the site always renders.

## SEO / AI-model (GEO) features

- Per-page `generateMetadata` (title, description, canonical, Open Graph, Twitter)
- JSON-LD: Person, WebSite, BlogPosting, FAQPage, BreadcrumbList, Service, Blog
- Dynamic `sitemap.xml` (includes every post, service, and category)
- `robots.txt` that explicitly allows AI crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended…)
- RSS feed at `/feed.xml`
- `llms.txt` at `/llms.txt`, machine-readable site summary for AI answer engines
- Clean semantic HTML, ISR caching, instant revalidation after CMS saves

## Setup

### 1. Supabase (free tier)

1. Create a project at [supabase.com](https://supabase.com).
2. Open **SQL Editor** and run [`supabase/schema.sql`](supabase/schema.sql).
3. Then run [`supabase/seed.sql`](supabase/seed.sql) to load the current content.
4. Go to **Authentication → Users → Add user** and create your login
   (email + password, check "auto confirm").
5. Back in SQL Editor, grant that user admin access:

   ```sql
   insert into public.admin_users (user_id)
   select id from auth.users where email = 'YOUR-EMAIL-HERE'
   on conflict do nothing;
   ```

### 2. Local development

```bash
cp .env.example .env.local   # fill in your Supabase URL + anon key
npm install
npm run dev
```

Site: http://localhost:3000 · CMS: http://localhost:3000/sanchalan

### 3. Deploy to Vercel

1. Push this folder to a GitHub repo.
2. Import the repo at [vercel.com/new](https://vercel.com/new).
3. Add the environment variables from `.env.example` in
   **Project → Settings → Environment Variables**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL` = `https://janakpokharel.com.np`
4. Deploy, then add `janakpokharel.com.np` under **Settings → Domains** and
   point your domain's DNS (A record → `76.76.21.21`, or CNAME `www` →
   `cname.vercel-dns.com`) as Vercel instructs.

### 4. Using the CMS (`/sanchalan`)

- **Blog Posts**, Markdown editor with live preview, SEO meta fields, tags,
  categories, and FAQs (FAQ rich results generated automatically).
- **Page Content**, edit hero, about, contact, blog settings, and site settings.
- **Services / Portfolio / Resume**, full CRUD for structured content.
- **Messages**, contact form submissions inbox.
- **Media**, upload images to Supabase Storage and copy URLs.
- Saves trigger instant revalidation, so changes go live in seconds.

## Notes

- Content is cached with ISR (`revalidate: 120`), so the site stays fast and
  well within Supabase free-tier limits even with traffic.
- The CMS writes Markdown; the site renders it server-side (good for SEO).
- `/sanchalan` and `/api/*` are excluded from robots and the sitemap.
