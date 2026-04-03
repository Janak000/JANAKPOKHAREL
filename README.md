# Janak Pokharel Portfolio

This portfolio now uses a Supabase-backed CMS instead of the previous GitHub JSON workflow. The public site reads dynamic content from Supabase, and `/admin` edits the same data model through a field-based CMS with a rich text editor for blog posts.

## Stack

- Next.js App Router
- TypeScript
- Supabase for content storage
- TipTap editor for blog CMS authoring

## What is dynamic

The Supabase-backed model covers:

- personal details, SEO metadata, navigation CTA, footer labels
- hero copy, image, stat, and CTAs
- about copy, stats, highlight cards, and associated organizations
- expertise/services section heading and cards
- projects section copy, cards, tags, and locked CTA
- resume section labels, experience, education, and certifications
- blog landing copy, blog post metadata, FAQs, and rich text article bodies
- contact section copy and WhatsApp CTA

## Supabase setup

1. Create a Supabase project.
2. Run [supabase/schema.sql](/C:/Users/janak/Downloads/portfolio-main%20(2)/JANAKPOKHAREL-git/supabase/schema.sql) in the SQL editor.
3. Seed each singleton table with one row, or save from `/admin` after adding environment variables.
4. Add yourself to `public.admin_users` if you want direct authenticated table writes later.

The app still falls back to the bundled local content file when Supabase is not configured, so local development stays unblocked.

## Environment variables

Copy `.env.example` into `.env.local` and fill in:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `CMS_ADMIN_SECRET`

## Run locally

1. Install dependencies with `npm install`.
2. Start development with `npm run dev`.
3. Open `http://localhost:3000`.
4. Open `http://localhost:3000/admin` for the CMS.

## Notes

- Public reads use the Supabase anon key and RLS-safe `select` policies.
- Admin saves go through the Next.js API route using the service role key plus `CMS_ADMIN_SECRET`.
- Blog bodies are stored as `content_html`, which the CMS edits with TipTap and the public site renders directly.
