-- ============================================================
-- Seed data, run AFTER schema.sql.
-- Loads the current site content into the CMS so everything is
-- editable from /sanchalan from day one.
-- ============================================================

-- ---------- Content blocks ----------
insert into public.content_blocks (key, data) values
('settings', '{
  "name": "Janak Pokharel",
  "shortName": "Janak",
  "role": "Global SEO & Ads Manager",
  "tagline": "Helping businesses grow through smart search and performance marketing.",
  "description": "Janak Pokharel is a Global SEO and Ads Manager helping businesses scale through data-driven search strategies, content systems, and high-performance advertising.",
  "url": "https://janakpokharel.com.np",
  "email": "janakpokharel000@gmail.com",
  "phone": "+977-9840033771",
  "whatsapp": "9779840033771",
  "location": "Kathmandu, Nepal",
  "facebook": "https://www.facebook.com/janak.pokharel7788",
  "linkedin": "https://www.linkedin.com/in/janak-pokharel",
  "gtmId": "GTM-564SNKQ7",
  "gaId": "G-TFN0WN40XW",
  "ogImage": "/image/janakOG.webp",
  "keywords": ["SEO expert Nepal", "Ads manager Nepal", "Janak Pokharel", "SEO freelancer", "Meta Ads specialist", "Google Ads expert", "digital marketing Nepal"]
}'::jsonb),
('hero', '{
  "availability": "Available for new projects",
  "eyebrow": "SPECIALIZED IN SEO, META ADS, AND GROWTH SYSTEMS",
  "headline": "Search engine optimization and ads management that actually moves revenue.",
  "description": "I help brands grow with technical SEO, performance content, Meta Ads, and conversion-focused strategy backed by a dedicated team.",
  "primaryCtaLabel": "Start a Project",
  "primaryCtaHref": "/contact",
  "secondaryCtaLabel": "View Portfolio",
  "secondaryCtaHref": "/portfolio",
  "imageSrc": "/image/janak.webp",
  "imageAlt": "Portrait of Janak Pokharel",
  "statValue": "12+",
  "statLabel": "Happy Clients"
}'::jsonb),
('about', '{
  "kicker": "About Me",
  "title": "Who is Janak?",
  "intro": "I help small and growing businesses build sustainable visibility through technical SEO, content strategy, and paid acquisition systems.",
  "body": "My work blends search intent, site performance, persuasive messaging, and campaign optimization. That means cleaner rankings, stronger lead flow, and better return on every marketing dollar you invest.",
  "stats": [
    {"value": "3+", "label": "Years Experience"},
    {"value": "16+", "label": "Projects Delivered"},
    {"value": "12+", "label": "Happy Clients"},
    {"value": "10+", "label": "Brands Supported"}
  ],
  "highlights": [
    {"icon": "users", "title": "Leading SEO & Ads Team", "description": "Driving results with a focused team that supports strategy, creative, and execution."},
    {"icon": "heart", "title": "Community Leader", "description": "Founder and admin of BIT Guide-TU with a growing student and professional network."}
  ],
  "organizationsTitle": "Associated Organizations",
  "organizations": [
    {"name": "Limi Creatives", "logo": "/image/limi creatives.webp", "alt": "Limi Creatives logo"},
    {"name": "Bhatti Chulo", "logo": "/image/bhattichulo.webp", "alt": "Bhatti Chulo logo"},
    {"name": "Supreme College", "logo": "/image/supreme college.webp", "alt": "Supreme College logo"},
    {"name": "Gurzu Nepal", "logo": "/image/gurzu.webp", "alt": "Gurzu Nepal logo"},
    {"name": "Bhundipuran Prakashan", "logo": "/image/bhundipuran.webp", "alt": "Bhundipuran Prakashan logo"},
    {"name": "Splashnode", "logo": "/image/splashnode.webp", "alt": "Splashnode logo"},
    {"name": "IT Mart", "logo": "/image/IT mart logo.webp", "alt": "IT Mart logo"},
    {"name": "Shopit", "logo": "/image/shopit.webp", "alt": "Shopit logo"},
    {"name": "Click Dribble", "logo": "/image/click dribble.webp", "alt": "Click Dribble logo"},
    {"name": "Nomor Tech", "logo": "/image/nomor tech.webp", "alt": "Nomor Tech logo"}
  ]
}'::jsonb),
('contact', '{
  "title": "Get in Touch",
  "intro": "Ready to improve your search presence, ads performance, or overall growth system? Let''s talk about the next step for your business.",
  "whatsappTitle": "Let''s Chat on WhatsApp",
  "whatsappDescription": "Get quick responses for digital marketing questions, project discussions, or new campaign planning."
}'::jsonb),
('blog', '{
  "title": "Digital Marketing Insights",
  "description": "Strategies, tips, and practical guides on SEO, Meta Ads, Google Ads, and digital growth in 2026."
}'::jsonb)
on conflict (key) do update set data = excluded.data, updated_at = now();

-- ---------- Services ----------
insert into public.services (slug, icon, title, short_description, body_md, meta_description, sort_order, published) values
('advanced-seo', 'search', 'Advanced SEO',
 'On-page, off-page, and technical optimization built to rank stronger and convert better.',
 E'## What this covers\n\nComplete search engine optimization: keyword research mapped to real buyer intent, on-page optimization, authority building, and content systems that compound over time.\n\n## How I work\n\n- **Deep audit first.** Every engagement starts with a technical and content audit so we fix what blocks rankings before creating anything new.\n- **Intent-mapped keywords.** Keywords are grouped by what the searcher actually wants, so pages rank and convert.\n- **Content that earns links.** Practical, expert-level content designed to be cited by both search engines and AI assistants.\n- **Transparent reporting.** Clear monthly reporting tied to traffic, rankings, and leads, not vanity metrics.\n\n## Who this is for\n\nSmall and growing businesses that want durable, compounding organic traffic instead of renting visibility through ads alone.',
 'Advanced SEO services by Janak Pokharel: technical audits, intent-driven keyword strategy, and content systems that rank and convert.', 0, true),
('meta-ads', 'target', 'Meta Ads Mastery',
 'Performance campaigns on Facebook and Instagram with sharper targeting and lower wasted spend.',
 E'## What this covers\n\nFull-funnel Meta Ads management: campaign structure, creative testing, audience strategy, retargeting, and conversion tracking across Facebook and Instagram.\n\n## How I work\n\n- **Creative-first testing.** In 2026, creative quality carries most of the performance burden. I build fast creative feedback loops.\n- **Clean account structure.** Simplified campaign structures that give the algorithm room to optimize.\n- **Landing page alignment.** Ads and pages are treated as one system, because the page decides profitability.\n- **Honest budgets.** Spend recommendations based on your margins, not on platform suggestions.\n\n## Who this is for\n\nLead generation, e-commerce, and local service brands that want profitable paid social, not just cheap clicks.',
 'Meta Ads management by Janak Pokharel: creative-first testing, clean account structure, and campaigns aligned to your landing pages and margins.', 1, true),
('google-ads-ppc', 'mouse-pointer', 'Google Ads & PPC',
 'Paid search campaigns tuned for conversion intent, efficient bidding, and profitable scale.',
 E'## What this covers\n\nSearch, Performance Max, and display campaigns built around commercial intent, capturing demand at the exact moment people search for what you sell.\n\n## How I work\n\n- **Intent-tiered keywords.** Budget flows to the queries most likely to convert, protected by rigorous negative keyword lists.\n- **Conversion tracking done right.** Accurate tracking and value-based bidding so the algorithm optimizes toward revenue.\n- **Ad copy that qualifies.** Ads written to attract buyers and filter out low-quality clicks before you pay for them.\n- **Continuous optimization.** Weekly query mining, bid adjustments, and landing page experiments.\n\n## Who this is for\n\nBusinesses with clear demand for their product or service who want efficient, measurable customer acquisition from paid search.',
 'Google Ads and PPC management by Janak Pokharel: intent-driven search campaigns, accurate conversion tracking, and profitable scaling.', 2, true),
('technical-seo', 'settings', 'Technical SEO',
 'Site audits, Core Web Vitals improvements, indexation fixes, and schema implementation.',
 E'## What this covers\n\nThe engineering side of search: crawlability, indexation, site speed, structured data, and site architecture, the foundation everything else stands on.\n\n## How I work\n\n- **Full technical audits.** Crawl analysis, index coverage, duplicate content, redirect chains, and internal linking.\n- **Core Web Vitals.** Real performance fixes that improve both rankings and conversion rates.\n- **Schema markup.** Structured data (Article, FAQ, Organization, Service) that helps search engines and AI models understand and cite your content.\n- **AI-ready architecture.** Clean semantic HTML and content structure that generative engines can parse and reference.\n\n## Who this is for\n\nSites with content that deserves to rank but is held back by technical problems, or new sites that want the foundation right from day one.',
 'Technical SEO by Janak Pokharel: audits, Core Web Vitals, indexation fixes, and schema markup for search engines and AI models.', 3, true),
('cro-analytics', 'bar-chart', 'CRO & Analytics',
 'Clear tracking, performance reporting, and conversion-focused optimization across funnels.',
 E'## What this covers\n\nMeasurement and conversion optimization: GA4 and GTM setup, conversion tracking, funnel analysis, and page-level experiments that turn more visitors into leads.\n\n## How I work\n\n- **Tracking first.** You can''t optimize what you can''t measure. Clean GA4 events, GTM containers, and conversion definitions.\n- **Funnel diagnosis.** Find exactly where visitors drop off and why.\n- **Evidence-based changes.** Page and form improvements grounded in data and user behavior, not guesses.\n- **Readable reporting.** Dashboards and monthly summaries you can actually act on.\n\n## Who this is for\n\nBusinesses already getting traffic that want more results from it, and clarity about which marketing actually drives revenue.',
 'CRO and analytics by Janak Pokharel: GA4 and GTM setup, conversion tracking, funnel analysis, and data-driven optimization.', 4, true),
('programmatic-ads', 'cpu', 'Programmatic Ads',
 'Data-led ad buying systems that reach the right audience at the right time across channels.',
 E'## What this covers\n\nAutomated, data-driven ad buying across display, video, and native inventory, reaching your audience wherever they are, at efficient cost.\n\n## How I work\n\n- **Audience-first planning.** Campaigns built around who your customers actually are, not just where ads are cheap.\n- **Cross-channel coordination.** Programmatic works alongside your search and social campaigns, not in isolation.\n- **Frequency and brand safety controls.** Your ads appear in the right context, at the right frequency.\n- **Performance transparency.** Clear reporting on what inventory and audiences actually drive results.\n\n## Who this is for\n\nBrands ready to scale awareness and retargeting beyond Meta and Google with data-led media buying.',
 'Programmatic advertising by Janak Pokharel: data-led ad buying across display, video, and native channels with full transparency.', 5, true)
on conflict (slug) do nothing;

-- ---------- Projects ----------
insert into public.projects (title, category, description, image_src, image_alt, tags, result, sort_order, published) values
('Limi Creatives', 'SEO and Growth Strategy', 'Supported search visibility, campaign planning, and performance-focused digital growth work for a creative-led client portfolio.', '/image/limi creatives.webp', 'Limi Creatives logo', '{"SEO","Strategy","Content","Growth"}', 'Ongoing support', 0, true),
('Bhatti Chulo Lounge & Bar', 'Local Brand Growth', 'Worked on digital visibility and audience growth for a hospitality brand focused on stronger local reach and customer engagement.', '/image/bhattichulo.webp', 'Bhatti Chulo Lounge and Bar logo', '{"Local SEO","Branding","Social Campaigns"}', 'Local visibility', 1, true),
('Gurzu Nepal', 'Digital Marketing Execution', 'Contributed to SEO research, product-focused growth support, and digital campaign execution for Gurzu and related products.', '/image/gurzu.webp', 'Gurzu Nepal logo', '{"SEO","Research","Product Marketing"}', 'Cross-product support', 2, true),
('Clickdribble', 'Creative and Click-Focused Marketing', 'Supported brand growth work centered on stronger messaging, campaign direction, and audience-ready digital presentation.', '/image/click dribble.webp', 'Clickdribble logo', '{"Creative Strategy","Ads","Positioning"}', 'Sharper messaging', 3, true),
('ShopIt', 'E-commerce Growth', 'Worked on performance-oriented digital promotion for an e-commerce brand with a focus on traffic quality and conversion intent.', '/image/shopit.webp', 'ShopIt logo', '{"E-commerce","Paid Media","Performance"}', 'Revenue-focused traffic', 4, true),
('Supreme College', 'Education and Community Reach', 'Contributed to educational visibility and digital communication support while strengthening community-facing brand presence.', '/image/supreme college.webp', 'Supreme College logo', '{"Education","Brand Reach","Content"}', 'Community engagement', 5, true);

-- ---------- Resume ----------
insert into public.resume_entries (kind, title, subtitle, href, points, sort_order) values
('experience', 'SEO & Ads Manager', 'Limi Creatives | Dec 2025 - Present', null, '{"Leading SEO strategies and Meta Ads campaigns for a diverse client portfolio.","Managing campaign planning, budget optimization, and measurable growth reporting."}', 0),
('experience', 'Computer Science Teacher', 'Supreme College | Sep 2025 - Present', null, '{"Teaching Computer Science to grade 11 students during morning shifts.","Guiding students through programming basics and practical assignments."}', 1),
('experience', 'Digital Marketing Executive', 'Gurzu Nepal | May 2025 - Sep 2025', 'https://gurzu.com/', '{"Executed SEO, keyword research, competitor analysis, and campaign support for product growth.","Supported digital promotion for Gurzu products including Splashnode and Meesa."}', 2),
('experience', 'Digital Assistant', 'Bhundipuran Prakashan | Nov 2023 - Mar 2025', null, '{"Created and published social content with a strong focus on Facebook.","Managed online sales workflows and supported small-scale ad campaigns."}', 3),
('education', 'Tribhuvan University', 'BIT | 2022 - 2026', null, '{"Bachelor of Information Technology with focus areas across AI, digital systems, and modern web technologies.","Coursework includes web development, databases, software engineering, and data systems."}', 0),
('education', 'Nilkantha Secondary School', '+2 Science | 2019 - 2021', null, '{"Completed higher secondary education in the science stream with strong analytical foundations.","Built early depth in mathematics, computer science, physics, and problem solving."}', 1),
('education', 'Sunaulo Bhairabi Secondary School', 'SEE | 2019', null, '{"Graduated with distinction and developed an early interest in technology and digital work.","Built the academic foundation that later shaped a technical and marketing career path."}', 2),
('certification', '5-Day SEO Challenge', 'ORKA SOCIALS', null, '{"Completed an intensive hands-on SEO bootcamp that accelerated foundational search strategy skills.","Learned practical keyword research, content planning, and early optimization workflows."}', 0),
('certification', 'SEO Certification', 'HubSpot Academy', null, '{"Earned certification covering on-page SEO, off-page SEO, technical SEO, and optimization strategy.","Strengthened skills in content performance, link building, and search measurement."}', 1),
('certification', 'Mastering SEO Strategy', 'Advanced Certification', null, '{"Completed advanced study in technical SEO, site architecture, and performance-driven optimization.","Built stronger execution frameworks for enterprise-style audits and strategy planning."}', 2);

-- ---------- Blog posts ----------
insert into public.posts (slug, title, category, tags, excerpt, meta_description, read_time, hero_intro, body_md, faqs, featured, published, published_at, updated_at) values
('hire-seo-ads-freelancer', 'Hire an SEO and Ads Freelancer for a Small Business', 'SEO Strategy', '{"SEO","Freelancing","Small Business"}',
 'Small businesses often get better speed, communication, and ROI from a specialized freelancer than from a large agency package.',
 'Learn why hiring an SEO and Ads freelancer can be a stronger fit for small businesses than choosing a large agency.',
 '5 min read',
 'Small businesses usually need focused execution, not bloated retainers. A freelancer who owns both SEO and ads can move faster, communicate more clearly, and shape strategy around your actual business goals.',
 E'## Why freelancers can be more cost-efficient\n\nFreelancers usually operate with less overhead than agencies, so more of your budget goes into work instead of account layers. That often means better value for technical fixes, content planning, and campaign optimization.\n\n## Direct communication means fewer delays\n\nWhen the strategist and the executor are the same person, decisions happen faster. You avoid long handoffs, reduce misunderstandings, and get cleaner visibility into what is being tested and why.\n\n## Tailored strategy beats generic retainers\n\nSmaller businesses rarely benefit from recycled agency playbooks. A dedicated freelancer can build around your actual sales cycle, geography, niche, and margin constraints.',
 '[{"question":"How much does an SEO freelancer usually cost?","answer":"Pricing depends on scope, market, and reporting depth, but freelancers are often more flexible than agency retainers and easier to phase in around realistic goals."},{"question":"When should a small business choose an agency instead?","answer":"An agency makes more sense when you need a larger multidisciplinary team immediately or already have the budget and internal systems to manage a broader operation."}]'::jsonb,
 true, true, '2026-02-06T00:00:00Z', '2026-02-06T00:00:00Z'),
('are-meta-ads-worth-it-2026', 'Are Meta Ads Worth It in 2026?', 'Paid Media', '{"Meta Ads","Paid Media","Facebook Ads"}',
 'Meta Ads still work well in 2026 when account structure, creative testing, and landing page alignment are treated as one system.',
 'A practical look at whether Meta Ads are still worth it in 2026 and what separates profitable campaigns from wasted spend.',
 '4 min read',
 'Meta Ads are still one of the fastest ways to get attention, leads, and purchases, but they reward strong systems more than ever. Targeting alone is not enough anymore.',
 E'## Creative quality matters more than narrow targeting\n\nAs platform automation keeps improving, ad creative and message-market fit carry more of the performance burden. Strong hooks, clear offers, and fast feedback loops matter more than trying to over-control the audience.\n\n## Your landing page still decides profitability\n\nEven well-optimized campaigns fail if the page experience is slow, confusing, or mismatched to the ad promise. Conversion rate and ad efficiency are tightly connected.\n\n## Meta Ads are strongest when paired with retention and SEO\n\nPaid traffic works best when it feeds a broader system that includes remarketing, organic visibility, and offer refinement. That is how you keep customer acquisition from becoming too expensive over time.',
 '[{"question":"What businesses benefit most from Meta Ads?","answer":"Lead generation, e-commerce, local service brands, and awareness-focused campaigns can all perform well when the offer is clear and the funnel is set up properly."},{"question":"How quickly can Meta Ads show results?","answer":"You can get early signal within days, but stable performance normally needs testing time, enough budget to gather data, and a page that converts."}]'::jsonb,
 false, true, '2026-01-24T00:00:00Z', '2026-01-24T00:00:00Z'),
('seo-vs-meta-ads', 'SEO vs Meta Ads: Which One Should You Choose?', 'Comparison', '{"SEO","Meta Ads","Strategy"}',
 'SEO builds durable traffic while Meta Ads deliver speed. The strongest strategy often uses both, but in different phases.',
 'Compare SEO and Meta Ads for cost, speed, ROI, and long-term value to decide which growth channel fits your business.',
 '6 min read',
 'Choosing between SEO and Meta Ads is really about choosing between speed and durability. Each channel solves a different business problem, and your best option depends on timing, budget, and internal capacity.',
 E'## SEO is slower but compounds over time\n\nSearch optimization usually takes longer to show clear movement, but the upside is durable traffic, stronger authority, and less dependency on ongoing spend once rankings improve.\n\n## Meta Ads create speed and fast feedback\n\nAds can generate traffic and lead volume almost immediately, which is useful for launches, offers, demand testing, and shorter sales cycles. The tradeoff is that traffic slows when spend stops.\n\n## The best answer is often sequencing, not choosing\n\nMany businesses should start with the channel that solves the immediate bottleneck, then layer the second channel for resilience. Use ads for speed and SEO for long-term efficiency.',
 '[{"question":"Which channel has the better long-term ROI?","answer":"SEO often produces stronger long-term efficiency because organic clicks do not have a direct ongoing cost, but it requires patience and consistent execution."},{"question":"Can a small budget still work for paid ads?","answer":"Yes, but small budgets need tighter offers, stronger pages, and realistic expectations. Efficiency matters even more when testing room is limited."}]'::jsonb,
 false, true, '2025-12-20T00:00:00Z', '2025-12-20T00:00:00Z')
on conflict (slug) do nothing;
