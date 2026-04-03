# Content Audit

## Hardcoded values found in the original app

- Personal identity: name, short name, role, tagline, description, email, phone, WhatsApp, location, social URLs, analytics IDs, canonical URL, OG image.
- Navigation: menu labels, menu destinations, sticky header CTA label and href.
- Hero: availability badge, eyebrow, headline, body copy, portrait path, stat label/value, both CTA labels and hrefs.
- About: section kicker, title, intro, body, stats, highlight cards, organizations heading, organization logo list.
- Services: section heading and every expertise card title, icon, and description.
- Projects: section heading, intro, locked portfolio copy/CTA, every project card title, category, image, tags, description, result label, and CTA.
- Resume: section labels plus every experience, education, certification item and bullet point.
- Blog listing: page title, homepage title, description, button labels, back label, FAQ heading.
- Blog posts: slugs, titles, dates, categories, excerpts, meta descriptions, read times, hero intros, body sections, FAQs, CTA copy.
- Contact and footer: section heading, WhatsApp card copy, WhatsApp button label, footer headings, copyright line, footer note.
- Design tokens: dark-neon palette, accent choices, button styling, panel styling, spacing, and organization grid presentation.

## Legacy files audited

- Active application: `app/*`, `components/*`, `lib/*`, `data/*`.
- Legacy static mirrors: `index.html`, `blog.html`, `admin.html`, `content.json`, `cms.js`, and related static assets.
- Conclusion: the Next.js app was the live implementation path; the older static files duplicated the same content model and confirmed additional editable fields.

## Supabase normalization outcome

- Singleton tables hold section-level copy and SEO settings.
- Ordered child tables hold repeated content such as navigation links, stats, cards, organizations, services, projects, resume entries, and blog FAQs.
- Blog posts store rich text as HTML so the CMS can use a real editor instead of raw JSON blocks.
