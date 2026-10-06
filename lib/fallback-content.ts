import type {
  AboutContent,
  BlogSettings,
  ContactContent,
  Hero,
  HomeContent,
  PortfolioPageContent,
  Post,
  Project,
  ResumeEntry,
  Service,
  ServicesPageContent,
  SiteSettings,
} from "./types";

export const fallbackSettings: SiteSettings = {
  name: "Janak Pokharel",
  shortName: "Janak",
  role: "Global SEO & Ads Manager",
  tagline: "Helping businesses grow through smart search and performance marketing.",
  description:
    "Janak Pokharel is a Global SEO and Ads Manager helping businesses grow with data-driven search strategy, content systems, and performance advertising.",
  url: "https://janakpokharel.com.np",
  email: "janakpokharel000@gmail.com",
  phone: "+977-9840033771",
  whatsapp: "9779840033771",
  location: "Kathmandu, Nepal",
  facebook: "https://www.facebook.com/janak.pokharel7788",
  linkedin: "https://www.linkedin.com/in/janak-pokharel",
  gtmId: "GTM-564SNKQ7",
  gaId: "G-TFN0WN40XW",
  ogImage: "/image/og-logo.webp",
  keywords: [
    "SEO expert Nepal",
    "Ads manager Nepal",
    "Janak Pokharel",
    "SEO freelancer",
    "Meta Ads specialist",
    "Google Ads expert",
    "digital marketing Nepal",
  ],
};

export const fallbackHero: Hero = {
  availability: "Available for new projects",
  eyebrow: "SPECIALIZED IN SEO, META ADS, AND GROWTH SYSTEMS",
  headline: "Search engine optimization and ads management that actually moves revenue.",
  description:
    "I help brands grow with technical SEO, performance content, Meta Ads, and conversion-focused strategy backed by a dedicated team.",
  primaryCtaLabel: "Start a Project",
  primaryCtaHref: "/contact",
  secondaryCtaLabel: "View Portfolio",
  secondaryCtaHref: "/portfolio",
  imageSrc: "/image/janak.webp",
  imageAlt: "Portrait of Janak Pokharel",
  statValue: "12+",
  statLabel: "Happy Clients",
};

export const fallbackAbout: AboutContent = {
  kicker: "About Me",
  title: "Who is Janak?",
  intro:
    "I help small and growing businesses build sustainable visibility through technical SEO, content strategy, and paid acquisition systems.",
  body:
    "My work blends search intent, site performance, persuasive messaging, and campaign optimization. That means cleaner rankings, stronger lead flow, and better return on every marketing dollar you invest.",
  workTitle: "The work I take on",
  workBody:
    "Most of what I do falls into two groups. For rankings and indexing, that means [SEO services in Nepal](/services/seo-services-nepal) and [technical SEO](/services/technical-seo). For paid acquisition, it means [Google Ads](/services/google-ads-ppc) and [Meta Ads](/services/meta-ads). When a project also needs design, video or motion graphics, my agency [Limi Creatives](/services/digital-marketing-agency-nepal) handles that alongside the search and ads work.\n\nIf you would rather see how I think before getting in touch, the [blog](/blog) has plain-English guides on costs, indexing and ad budgets, and the [portfolio](/portfolio) lists the brands I have supported.",
  stats: [
    { value: "3+", label: "Years Experience" },
    { value: "16+", label: "Projects Delivered" },
    { value: "12+", label: "Happy Clients" },
    { value: "10+", label: "Brands Supported" },
  ],
  highlights: [
    {
      icon: "users",
      title: "Leading SEO & Ads Team",
      description:
        "Driving results with a focused team that supports strategy, creative, and execution.",
    },
    {
      icon: "heart",
      title: "Community Leader",
      description:
        "Founder and admin of BIT Guide-TU with a growing student and professional network.",
    },
  ],
  organizationsTitle: "Associated Organizations",
  organizations: [
    { name: "Limi Creatives", logo: "/image/limi creatives.webp", alt: "Limi Creatives logo" },
    { name: "Bhatti Chulo", logo: "/image/bhattichulo.webp", alt: "Bhatti Chulo logo" },
    { name: "Supreme College", logo: "/image/supreme college.webp", alt: "Supreme College logo" },
    { name: "Gurzu Nepal", logo: "/image/gurzu.webp", alt: "Gurzu Nepal logo" },
    { name: "Bhundipuran Prakashan", logo: "/image/bhundipuran.webp", alt: "Bhundipuran Prakashan logo" },
    { name: "Splashnode", logo: "/image/splashnode.webp", alt: "Splashnode logo" },
    { name: "IT Mart", logo: "/image/IT mart logo.webp", alt: "IT Mart logo" },
    { name: "Shopit", logo: "/image/shopit.webp", alt: "Shopit logo" },
    { name: "Click Dribble", logo: "/image/click dribble.webp", alt: "Click Dribble logo" },
    { name: "Nomor Tech", logo: "/image/nomor tech.webp", alt: "Nomor Tech logo" },
  ],
  workKicker: "How I Work",
  journeyKicker: "My Journey",
  journeyTitle: "Experience, education & credentials",
  trustedKicker: "Trusted By",
  ctaTitle: "Want to work together?",
  ctaText:
    "I'm currently available for new SEO and ads projects. Let's talk about what growth looks like for your business.",
  ctaLabel: "Get in Touch",
  faqKicker: "About Janak",
  faqTitle: "Questions people ask about me",
  faqIntro: "Short answers about who I am, what I work on and how to reach me.",
  faqs: [
    {
      question: "Who is Janak Pokharel?",
      answer:
        "Janak Pokharel is an SEO and paid ads service provider based in Kathmandu, Nepal, and the co-founder of Limi Creatives, a digital marketing agency. He works on organic SEO, answer engine optimization, Google Ads and Meta Ads for businesses all over the world.",
    },
    {
      question: "What does Janak work on?",
      answer:
        "The work splits roughly 60 percent organic search and 40 percent paid advertising. Organic covers technical SEO, schema markup, content strategy, internal linking and local SEO. Paid covers Google Ads and Meta Ads across Facebook and Instagram.",
    },
    {
      question: "What is answer engine optimization?",
      answer:
        "It is the practice of structuring content so systems such as ChatGPT, Perplexity, Google AI Overviews and Gemini can retrieve, understand and cite it. In practice that means self contained answers, explicit entity relationships and valid structured data rather than keyword density.",
    },
    {
      question: "What is Limi Creatives?",
      answer:
        "Limi Creatives is the digital marketing agency Janak co-founded. When a project also needs design, video or motion graphics, the agency handles that alongside the search and ads work.",
    },
    {
      question: "How can I get in touch?",
      answer:
        "Use the [contact page](/contact) or WhatsApp. Every genuine enquiry gets a reply within 24 hours, usually much sooner.",
    },
  ],
};

export const fallbackContact: ContactContent = {
  title: "Get in Touch",
  intro:
    "Ready to improve your search presence, ads performance, or overall growth system? Let's talk about the next step for your business.",
  whatsappTitle: "Let's Chat on WhatsApp",
  whatsappDescription:
    "Get quick responses for digital marketing questions, project discussions, or new campaign planning.",
  nextKicker: "What Happens Next",
  nextTitle: "From first message to a clear plan",
  nextIntro:
    "Reaching out costs nothing and there is no obligation. Here is exactly how the first conversation works.",
  steps: [
    {
      icon: "message-circle",
      title: "1. You get in touch",
      description:
        "Send a message with your website and goals. The more context you share about your business, the sharper my first response can be.",
    },
    {
      icon: "search",
      title: "2. I review your situation",
      description:
        "I look at your site, search visibility, and current ads, then reply within 24 hours with honest, specific direction, not a generic pitch.",
    },
    {
      icon: "target",
      title: "3. We map the opportunity",
      description:
        "On a short call we agree where the fastest wins are across SEO, Meta Ads, and Google Ads, and what a realistic plan and budget look like.",
    },
  ],
  nextNote:
    "Not sure what you need yet? Browse the [services](/services), or read [what SEO costs in Nepal](/blog/seo-price-nepal) and [what Google Ads costs per click](/blog/google-ads-cost-nepal) before we talk. If you want to see past work first, the [portfolio](/portfolio) lists the brands I have supported.",
  faqKicker: "Before You Reach Out",
  faqTitle: "Contact FAQs",
  faqIntro: "Quick answers to what people ask before getting in touch.",
  faqs: [
    {
      question: "How quickly will you respond?",
      answer:
        "I reply to every genuine enquiry within 24 hours, usually much sooner. For quick questions, WhatsApp is the fastest way to reach me.",
    },
    {
      question: "How much do your SEO and ads services cost?",
      answer:
        "Pricing depends on scope, competition, and goals. After a short conversation I give you a clear, honest quote with no long lock-in contracts, so you always know what you are paying for.",
    },
    {
      question: "Do you work with small businesses and startups?",
      answer:
        "Yes. Most of my clients are small and growing businesses that want focused execution and direct communication rather than a large agency retainer.",
    },
    {
      question: "Which locations do you serve?",
      answer:
        "I am based in Kathmandu, Nepal and work with clients worldwide. Search and paid advertising are delivered remotely, with clear reporting throughout.",
    },
  ],
};

export const fallbackHome: HomeContent = {
  servicesKicker: "What I Do",
  servicesTitle: "Services built around measurable growth",
  servicesLinkLabel: "All services",
  workKicker: "Selected Work",
  workTitle: "Brands and campaigns I've supported",
  workLinkLabel: "Full portfolio",
  behindKicker: "Behind the Work",
  behindTitle: "No account layers. No recycled playbooks. Just focused execution.",
  behindBody:
    "When you work with me, the person building your strategy is the same person executing it. That means faster decisions, honest reporting, and campaigns shaped around your actual business, not a template.",
  behindPoints: [
    { text: "Strategy, execution, and reporting handled by one accountable person" },
    { text: "Weekly progress you can actually see, rankings, leads, and revenue" },
    { text: "Direct communication on WhatsApp or email, no ticket queues" },
  ],
  behindLinkLabel: "More about me",
  blogKicker: "From the Blog",
  blogTitle: "Latest digital marketing insights",
  blogLinkLabel: "All articles",
  faqKicker: "Common Questions",
  faqTitle: "SEO, Meta Ads & Google Ads, answered",
  faqIntro:
    "A few things business owners ask before starting a search and paid advertising project with a dedicated SEO and Ads manager.",
  faqs: [
    {
      question: "What does an SEO and Ads manager actually do?",
      answer:
        "I combine search engine optimization and paid advertising into one growth system. That means technical SEO audits, keyword and content strategy, and hands-on management of Meta Ads and Google Ads campaigns, all measured against real business results like leads and revenue rather than vanity metrics.",
    },
    {
      question: "Do you work with businesses outside Nepal?",
      answer:
        "Yes. I am based in Kathmandu, Nepal and work with startups and growing businesses worldwide. Search and paid advertising are global channels, so most of my work is delivered remotely with clear reporting and direct communication over email or WhatsApp.",
    },
    {
      question: "How long does SEO take to show results?",
      answer:
        "SEO is a compounding investment. Technical fixes can help within weeks, but durable ranking and organic traffic growth usually take three to six months of consistent optimization and content. Paid ads, by contrast, can generate leads within days, which is why I often pair the two.",
    },
    {
      question: "Should I invest in SEO or paid ads first?",
      answer:
        "It depends on your timeline and budget. If you need leads quickly, start with Meta Ads or Google Ads for speed. If you want lower long-term acquisition costs, invest in SEO. The strongest strategy usually sequences both so paid traffic funds growth while organic visibility compounds.",
    },
  ],
  ctaKicker: "Ready When You Are",
  ctaTitle: "Let's build your next growth system",
  ctaText:
    "Whether it's SEO, paid ads, or a full-funnel strategy, tell me about your business and I'll show you exactly where the opportunity is.",
  ctaPrimaryLabel: "Start a Project",
  ctaSecondaryLabel: "WhatsApp Me",
};

export const fallbackServicesPage: ServicesPageContent = {
  metaTitle: "Digital Marketing Services in Nepal: SEO and Ads",
  metaDescription:
    "SEO and ads services in Nepal and worldwide: technical SEO, local SEO in Kathmandu, Google Ads, Meta Ads, CRO and analytics. Run by Janak Pokharel.",
  kicker: "Services",
  title: "Digital marketing services in Nepal that pay for themselves",
  intro:
    "I am Janak Pokharel, an SEO and ads analyst based in Kathmandu. The services below split into two groups: pages written for businesses operating in Nepal, where payment limits and local search behave differently, and general pages for clients elsewhere. Every one of them is run by me directly rather than passed to an account manager.",
  guideKicker: "Decision Guide",
  guideTitle: "Which of these do you actually need?",
  guideIntro:
    "Most enquiries I get name a tactic when the real question is a sequence. Here is the short version of how I would decide.",
  guideItems: [
    {
      icon: "search",
      title: "If your site is invisible on Google",
      description:
        "Start with [technical SEO](/services/technical-seo). Search for `site:` followed by your domain, and if far fewer pages come back than you published, nothing else is worth paying for until that is fixed. Ranking work on an unindexed site is money spent on a page Google has never read.",
    },
    {
      icon: "map-pin",
      title: "If you have a shop, clinic or restaurant",
      description:
        "[Local SEO](/services/seo-services-nepal) moves faster than anything else on this list. The three-result map pack is decided mostly by your Google Business Profile, and correcting a category can change what shows within weeks rather than months.",
    },
    {
      icon: "target",
      title: "If you need enquiries this month",
      description:
        "Paid comes first. [Google Ads](/services/google-ads-ppc) captures people already searching; [Meta Ads](/services/meta-ads) creates demand where nobody is searching yet. Which one fits depends on whether your category has search volume, and that takes about twenty minutes to check.",
    },
    {
      icon: "bar-chart",
      title: "If you are already spending and it is not converting",
      description:
        "The problem is usually measurement rather than traffic. [Conversion tracking and analytics](/services/digital-marketing-nepal) comes before buying more clicks, because without conversion tracking you cannot tell which half of the budget is working.",
    },
  ],
  guideNote:
    "Not sure which applies? [Send me the URL](/contact) and I will tell you which one I would start with, including when the answer is that you do not need me yet.",
  faqKicker: "Common Questions",
  faqTitle: "Frequently asked questions",
  faqIntro: "Quick answers on choosing between SEO and ads, timelines, and working with me.",
  faqs: [
    {
      question: "Do I need SEO or ads first?",
      answer:
        "If people already search for what you sell, ads produce leads this week and SEO produces cheaper leads later. If nobody searches for it yet, ads are the only option that works at all, because SEO can only capture demand that already exists. Most businesses run one channel properly before adding the second.",
    },
    {
      question: "What is the difference between the Nepal pages and the others?",
      answer:
        "The Nepal pages cover the parts that only matter here: the Nepal Rastra Bank limit on foreign currency for ad payments, Google Business Profile verification, and how Nepali and Romanized Nepali queries behave. The general service pages cover the same disciplines without that local layer, for clients outside Nepal.",
    },
    {
      question: "How long before I see results?",
      answer:
        "Paid campaigns produce data in days and dependable numbers in two to four weeks. SEO on a site with technical faults spends its first month getting crawled and indexed before anything can rank. Local SEO sits in between, because fixing a Google Business Profile category can move a listing within weeks.",
    },
    {
      question: "Do you work with businesses outside Nepal?",
      answer:
        "Yes. I have run paid search and SEO for clients in the United States and the United Kingdom alongside Nepali work. The general service pages are written for that audience, and the method does not change with the country, only the auction and the search behaviour do.",
    },
    {
      question: "Can I hire you for a one-off audit instead of ongoing work?",
      answer:
        "Yes, and for a site that has never been looked at properly it is usually the sensible first step. An audit tells you whether the problem is worth paying to fix before you commit to a monthly arrangement.",
    },
  ],
  ctaTitle: "Not sure which service you need?",
  ctaText:
    "Tell me about your business and goals, I'll recommend the channel mix with the fastest path to results, honestly.",
  ctaPrimaryLabel: "Get a Free Recommendation",
  ctaSecondaryLabel: "WhatsApp",
};

export const fallbackPortfolioPage: PortfolioPageContent = {
  metaTitle: "SEO & Ads Portfolio, Brands & Campaigns",
  metaDescription:
    "Brands and campaigns Janak Pokharel has supported across SEO, Meta Ads, Google Ads, content, and growth, from local businesses to clients worldwide.",
  kicker: "Selected Work",
  title: "Featured brands and campaigns",
  intro:
    "Brands and projects I have supported across SEO, paid media, content, and growth execution.",
  approachKicker: "How I Work With Brands",
  approachTitle: "Search and paid growth across industries",
  approachIntro:
    "Every brand above came to me with a different goal, more qualified traffic, lower ad costs, stronger local visibility, or a cleaner path from click to customer. My role is the same each time: connect technical SEO, content, and paid advertising into one system measured against real business results.",
  approachCards: [
    {
      icon: "search",
      title: "SEO & content",
      description:
        "Technical audits, intent-mapped keywords, and content that earns rankings and links, so brands compound organic traffic over time.",
    },
    {
      icon: "target",
      title: "Meta & Google Ads",
      description:
        "Full-funnel paid campaigns with sharp targeting, creative testing, and landing pages aligned to the offer, built for profitable scale.",
    },
    {
      icon: "bar-chart",
      title: "Tracking & growth",
      description:
        "Clean analytics, conversion tracking, and honest reporting tied to leads and revenue, from local service brands to worldwide clients.",
    },
  ],
  approachNote:
    "The services behind this work are [SEO services in Nepal](/services/seo-services-nepal), [technical SEO](/services/technical-seo), [Google Ads and PPC](/services/google-ads-ppc) and [Meta Ads](/services/meta-ads). If you are still deciding on a budget, read [what SEO costs in Nepal](/blog/seo-price-nepal) and [what Google Ads costs per click](/blog/google-ads-cost-nepal) first.",
  faqKicker: "Portfolio FAQs",
  faqTitle: "Questions about the work",
  faqIntro: "Short answers about the work, case studies and how a project starts.",
  faqs: [
    {
      question: "Can I see detailed case studies?",
      answer:
        "Many campaigns are protected by client agreements, so detailed case studies and reporting snapshots are shared privately on request. Use the [contact page](/contact) to ask.",
    },
    {
      question: "What kinds of projects are in the portfolio?",
      answer:
        "Brands and projects supported across SEO, paid media, content and growth execution, from local service businesses to clients worldwide. The role is the same each time: connect technical SEO, content and paid advertising into one system measured against real business results.",
    },
    {
      question: "How do I start a project?",
      answer:
        "Send a message with your website and goals through the contact page or WhatsApp. I reply within 24 hours with specific direction, and a short call follows to agree where the fastest wins are.",
    },
  ],
  ctaKicker: "Confidential Portfolio",
  ctaTitle: "Detailed case studies available on request",
  ctaText:
    "Many campaigns are protected by client agreements, so detailed case studies and reporting snapshots are shared privately.",
  ctaLabel: "Request Access",
};

export const fallbackBlogSettings: BlogSettings = {
  title: "Digital Marketing Insights",
  description:
    "Strategies, tips, and practical guides on SEO, Meta Ads, Google Ads, and digital growth in 2026.",
};

export const fallbackServices: Service[] = [
  {
    slug: "advanced-seo",
    icon: "search",
    title: "Advanced SEO",
    shortDescription:
      "On-page, off-page, and technical optimization built to rank stronger and convert better.",
    body: `## What this covers

Complete search engine optimization: keyword research mapped to real buyer intent, on-page optimization, authority building, and content systems that compound over time.

## How I work

- **Deep audit first.** Every engagement starts with a technical and content audit so we fix what blocks rankings before creating anything new.
- **Intent-mapped keywords.** Keywords are grouped by what the searcher actually wants, so pages rank and convert.
- **Content that earns links.** Practical, expert-level content designed to be cited by both search engines and AI assistants.
- **Transparent reporting.** Clear monthly reporting tied to traffic, rankings, and leads, not vanity metrics.

## Who this is for

Small and growing businesses that want durable, compounding organic traffic instead of renting visibility through ads alone.`,
    metaDescription:
      "Advanced SEO services by Janak Pokharel: technical audits, intent-driven keyword strategy, and content systems that rank and convert.",
    sortOrder: 0,
    published: true,
  },
  {
    slug: "meta-ads",
    icon: "target",
    title: "Meta Ads Mastery",
    shortDescription:
      "Performance campaigns on Facebook and Instagram with sharper targeting and lower wasted spend.",
    body: `## What this covers

Full-funnel Meta Ads management: campaign structure, creative testing, audience strategy, retargeting, and conversion tracking across Facebook and Instagram.

## How I work

- **Creative-first testing.** In 2026, creative quality carries most of the performance burden. I build fast creative feedback loops.
- **Clean account structure.** Simplified campaign structures that give the algorithm room to optimize.
- **Landing page alignment.** Ads and pages are treated as one system, because the page decides profitability.
- **Honest budgets.** Spend recommendations based on your margins, not on platform suggestions.

## Who this is for

Lead generation, e-commerce, and local service brands that want profitable paid social, not just cheap clicks.`,
    metaDescription:
      "Meta Ads management by Janak Pokharel: creative-first testing, clean account structure, and campaigns aligned to your landing pages and margins.",
    sortOrder: 1,
    published: true,
  },
  {
    slug: "google-ads-ppc",
    icon: "mouse-pointer",
    title: "Google Ads & PPC",
    shortDescription:
      "Paid search campaigns tuned for conversion intent, efficient bidding, and profitable scale.",
    body: `## What this covers

Search, Performance Max, and display campaigns built around commercial intent, capturing demand at the exact moment people search for what you sell.

## How I work

- **Intent-tiered keywords.** Budget flows to the queries most likely to convert, protected by rigorous negative keyword lists.
- **Conversion tracking done right.** Accurate tracking and value-based bidding so the algorithm optimizes toward revenue.
- **Ad copy that qualifies.** Ads written to attract buyers and filter out low-quality clicks before you pay for them.
- **Continuous optimization.** Weekly query mining, bid adjustments, and landing page experiments.

## Who this is for

Businesses with clear demand for their product or service who want efficient, measurable customer acquisition from paid search.`,
    metaDescription:
      "Google Ads and PPC management by Janak Pokharel: intent-driven search campaigns, accurate conversion tracking, and profitable scaling.",
    sortOrder: 2,
    published: true,
  },
  {
    slug: "technical-seo",
    icon: "settings",
    title: "Technical SEO",
    shortDescription:
      "Site audits, Core Web Vitals improvements, indexation fixes, and schema implementation.",
    body: `## What this covers

The engineering side of search: crawlability, indexation, site speed, structured data, and site architecture, the foundation everything else stands on.

## How I work

- **Full technical audits.** Crawl analysis, index coverage, duplicate content, redirect chains, and internal linking.
- **Core Web Vitals.** Real performance fixes that improve both rankings and conversion rates.
- **Schema markup.** Structured data (Article, FAQ, Organization, Service) that helps search engines and AI models understand and cite your content.
- **AI-ready architecture.** Clean semantic HTML and content structure that generative engines can parse and reference.

## Who this is for

Sites with content that deserves to rank but is held back by technical problems, or new sites that want the foundation right from day one.`,
    metaDescription:
      "Technical SEO by Janak Pokharel: audits, Core Web Vitals, indexation fixes, and schema markup for search engines and AI models.",
    sortOrder: 3,
    published: true,
  },
  {
    slug: "cro-analytics",
    icon: "bar-chart",
    title: "CRO & Analytics",
    shortDescription:
      "Clear tracking, performance reporting, and conversion-focused optimization across funnels.",
    body: `## What this covers

Measurement and conversion optimization: GA4 and GTM setup, conversion tracking, funnel analysis, and page-level experiments that turn more visitors into leads.

## How I work

- **Tracking first.** You can't optimize what you can't measure. Clean GA4 events, GTM containers, and conversion definitions.
- **Funnel diagnosis.** Find exactly where visitors drop off and why.
- **Evidence-based changes.** Page and form improvements grounded in data and user behavior, not guesses.
- **Readable reporting.** Dashboards and monthly summaries you can actually act on.

## Who this is for

Businesses already getting traffic that want more results from it, and clarity about which marketing actually drives revenue.`,
    metaDescription:
      "CRO and analytics by Janak Pokharel: GA4 and GTM setup, conversion tracking, funnel analysis, and data-driven optimization.",
    sortOrder: 4,
    published: true,
  },
  {
    slug: "programmatic-ads",
    icon: "cpu",
    title: "Programmatic Ads",
    shortDescription:
      "Data-led ad buying systems that reach the right audience at the right time across channels.",
    body: `## What this covers

Automated, data-driven ad buying across display, video, and native inventory, reaching your audience wherever they are, at efficient cost.

## How I work

- **Audience-first planning.** Campaigns built around who your customers actually are, not just where ads are cheap.
- **Cross-channel coordination.** Programmatic works alongside your search and social campaigns, not in isolation.
- **Frequency and brand safety controls.** Your ads appear in the right context, at the right frequency.
- **Performance transparency.** Clear reporting on what inventory and audiences actually drive results.

## Who this is for

Brands ready to scale awareness and retargeting beyond Meta and Google with data-led media buying.`,
    metaDescription:
      "Programmatic advertising by Janak Pokharel: data-led ad buying across display, video, and native channels with full transparency.",
    sortOrder: 5,
    published: true,
  },
];

export const fallbackProjects: Project[] = [
  {
    title: "Limi Creatives",
    category: "SEO and Growth Strategy",
    description:
      "Supported search visibility, campaign planning, and performance-focused digital growth work for a creative-led client portfolio.",
    tags: ["SEO", "Strategy", "Content", "Growth"],
    imageSrc: "/image/limi creatives.webp",
    imageAlt: "Limi Creatives logo",
    result: "Ongoing support",
    sortOrder: 0,
    published: true,
  },
  {
    title: "Bhatti Chulo Lounge & Bar",
    category: "Local Brand Growth",
    description:
      "Worked on digital visibility and audience growth for a hospitality brand focused on stronger local reach and customer engagement.",
    tags: ["Local SEO", "Branding", "Social Campaigns"],
    imageSrc: "/image/bhattichulo.webp",
    imageAlt: "Bhatti Chulo Lounge and Bar logo",
    result: "Local visibility",
    sortOrder: 1,
    published: true,
  },
  {
    title: "Gurzu Nepal",
    category: "Digital Marketing Execution",
    description:
      "Contributed to SEO research, product-focused growth support, and digital campaign execution for Gurzu and related products.",
    tags: ["SEO", "Research", "Product Marketing"],
    imageSrc: "/image/gurzu.webp",
    imageAlt: "Gurzu Nepal logo",
    result: "Cross-product support",
    sortOrder: 2,
    published: true,
  },
  {
    title: "Clickdribble",
    category: "Creative and Click-Focused Marketing",
    description:
      "Supported brand growth work centered on stronger messaging, campaign direction, and audience-ready digital presentation.",
    tags: ["Creative Strategy", "Ads", "Positioning"],
    imageSrc: "/image/click dribble.webp",
    imageAlt: "Clickdribble logo",
    result: "Sharper messaging",
    sortOrder: 3,
    published: true,
  },
  {
    title: "ShopIt",
    category: "E-commerce Growth",
    description:
      "Worked on performance-oriented digital promotion for an e-commerce brand with a focus on traffic quality and conversion intent.",
    tags: ["E-commerce", "Paid Media", "Performance"],
    imageSrc: "/image/shopit.webp",
    imageAlt: "ShopIt logo",
    result: "Revenue-focused traffic",
    sortOrder: 4,
    published: true,
  },
  {
    title: "Supreme College",
    category: "Education and Community Reach",
    description:
      "Contributed to educational visibility and digital communication support while strengthening community-facing brand presence.",
    tags: ["Education", "Brand Reach", "Content"],
    imageSrc: "/image/supreme college.webp",
    imageAlt: "Supreme College logo",
    result: "Community engagement",
    sortOrder: 5,
    published: true,
  },
];

export const fallbackResume: ResumeEntry[] = [
  {
    kind: "experience",
    title: "SEO & Ads Manager",
    subtitle: "Limi Creatives | Dec 2025 - Present",
    points: [
      "Leading SEO strategies and Meta Ads campaigns for a diverse client portfolio.",
      "Managing campaign planning, budget optimization, and measurable growth reporting.",
    ],
    sortOrder: 0,
  },
  {
    kind: "experience",
    title: "Computer Science Teacher",
    subtitle: "Supreme College | Sep 2025 - Present",
    points: [
      "Teaching Computer Science to grade 11 students during morning shifts.",
      "Guiding students through programming basics and practical assignments.",
    ],
    sortOrder: 1,
  },
  {
    kind: "experience",
    title: "Digital Marketing Executive",
    subtitle: "Gurzu Nepal | May 2025 - Sep 2025",
    href: "https://gurzu.com/",
    points: [
      "Executed SEO, keyword research, competitor analysis, and campaign support for product growth.",
      "Supported digital promotion for Gurzu products including Splashnode and Meesa.",
    ],
    sortOrder: 2,
  },
  {
    kind: "experience",
    title: "Digital Assistant",
    subtitle: "Bhundipuran Prakashan | Nov 2023 - Mar 2025",
    points: [
      "Created and published social content with a strong focus on Facebook.",
      "Managed online sales workflows and supported small-scale ad campaigns.",
    ],
    sortOrder: 3,
  },
  {
    kind: "education",
    title: "Tribhuvan University",
    subtitle: "BIT | 2022 - 2026",
    points: [
      "Bachelor of Information Technology with focus areas across AI, digital systems, and modern web technologies.",
      "Coursework includes web development, databases, software engineering, and data systems.",
    ],
    sortOrder: 0,
  },
  {
    kind: "education",
    title: "Nilkantha Secondary School",
    subtitle: "+2 Science | 2019 - 2021",
    points: [
      "Completed higher secondary education in the science stream with strong analytical foundations.",
      "Built early depth in mathematics, computer science, physics, and problem solving.",
    ],
    sortOrder: 1,
  },
  {
    kind: "education",
    title: "Sunaulo Bhairabi Secondary School",
    subtitle: "SEE | 2019",
    points: [
      "Graduated with distinction and developed an early interest in technology and digital work.",
      "Built the academic foundation that later shaped a technical and marketing career path.",
    ],
    sortOrder: 2,
  },
  {
    kind: "certification",
    title: "5-Day SEO Challenge",
    subtitle: "ORKA SOCIALS",
    points: [
      "Completed an intensive hands-on SEO bootcamp that accelerated foundational search strategy skills.",
      "Learned practical keyword research, content planning, and early optimization workflows.",
    ],
    sortOrder: 0,
  },
  {
    kind: "certification",
    title: "SEO Certification",
    subtitle: "HubSpot Academy",
    points: [
      "Earned certification covering on-page SEO, off-page SEO, technical SEO, and optimization strategy.",
      "Strengthened skills in content performance, link building, and search measurement.",
    ],
    sortOrder: 1,
  },
  {
    kind: "certification",
    title: "Mastering SEO Strategy",
    subtitle: "Advanced Certification",
    points: [
      "Completed advanced study in technical SEO, site architecture, and performance-driven optimization.",
      "Built stronger execution frameworks for enterprise-style audits and strategy planning.",
    ],
    sortOrder: 2,
  },
];

export const fallbackPosts: Post[] = [
  {
    slug: "hire-seo-ads-freelancer",
    title: "Hire an SEO and Ads Freelancer for a Small Business",
    category: "SEO Strategy",
    tags: ["SEO", "Freelancing", "Small Business"],
    excerpt:
      "Small businesses often get better speed, communication, and ROI from a specialized freelancer than from a large agency package.",
    metaDescription:
      "Learn why hiring an SEO and Ads freelancer can be a stronger fit for small businesses than choosing a large agency.",
    readTime: "5 min read",
    heroIntro:
      "Small businesses usually need focused execution, not bloated retainers. A freelancer who owns both SEO and ads can move faster, communicate more clearly, and shape strategy around your actual business goals.",
    body: `## Why freelancers can be more cost-efficient

Freelancers usually operate with less overhead than agencies, so more of your budget goes into work instead of account layers. That often means better value for technical fixes, content planning, and campaign optimization.

## Direct communication means fewer delays

When the strategist and the executor are the same person, decisions happen faster. You avoid long handoffs, reduce misunderstandings, and get cleaner visibility into what is being tested and why.

## Tailored strategy beats generic retainers

Smaller businesses rarely benefit from recycled agency playbooks. A dedicated freelancer can build around your actual sales cycle, geography, niche, and margin constraints.`,
    faqs: [
      {
        question: "How much does an SEO freelancer usually cost?",
        answer:
          "Pricing depends on scope, market, and reporting depth, but freelancers are often more flexible than agency retainers and easier to phase in around realistic goals.",
      },
      {
        question: "When should a small business choose an agency instead?",
        answer:
          "An agency makes more sense when you need a larger multidisciplinary team immediately or already have the budget and internal systems to manage a broader operation.",
      },
    ],
    featured: true,
    published: true,
    publishedAt: "2026-02-06T00:00:00.000Z",
    updatedAt: "2026-02-06T00:00:00.000Z",
  },
  {
    slug: "are-meta-ads-worth-it-2026",
    title: "Are Meta Ads Worth It in 2026?",
    category: "Paid Media",
    tags: ["Meta Ads", "Paid Media", "Facebook Ads"],
    excerpt:
      "Meta Ads still work well in 2026 when account structure, creative testing, and landing page alignment are treated as one system.",
    metaDescription:
      "A practical look at whether Meta Ads are still worth it in 2026 and what separates profitable campaigns from wasted spend.",
    readTime: "4 min read",
    heroIntro:
      "Meta Ads are still one of the fastest ways to get attention, leads, and purchases, but they reward strong systems more than ever. Targeting alone is not enough anymore.",
    body: `## Creative quality matters more than narrow targeting

As platform automation keeps improving, ad creative and message-market fit carry more of the performance burden. Strong hooks, clear offers, and fast feedback loops matter more than trying to over-control the audience.

## Your landing page still decides profitability

Even well-optimized campaigns fail if the page experience is slow, confusing, or mismatched to the ad promise. Conversion rate and ad efficiency are tightly connected.

## Meta Ads are strongest when paired with retention and SEO

Paid traffic works best when it feeds a broader system that includes remarketing, organic visibility, and offer refinement. That is how you keep customer acquisition from becoming too expensive over time.`,
    faqs: [
      {
        question: "What businesses benefit most from Meta Ads?",
        answer:
          "Lead generation, e-commerce, local service brands, and awareness-focused campaigns can all perform well when the offer is clear and the funnel is set up properly.",
      },
      {
        question: "How quickly can Meta Ads show results?",
        answer:
          "You can get early signal within days, but stable performance normally needs testing time, enough budget to gather data, and a page that converts.",
      },
    ],
    featured: false,
    published: true,
    publishedAt: "2026-01-24T00:00:00.000Z",
    updatedAt: "2026-01-24T00:00:00.000Z",
  },
  {
    slug: "seo-vs-meta-ads",
    title: "SEO vs Meta Ads: Which One Should You Choose?",
    category: "Comparison",
    tags: ["SEO", "Meta Ads", "Strategy"],
    excerpt:
      "SEO builds durable traffic while Meta Ads deliver speed. The strongest strategy often uses both, but in different phases.",
    metaDescription:
      "Compare SEO and Meta Ads for cost, speed, ROI, and long-term value to decide which growth channel fits your business.",
    readTime: "6 min read",
    heroIntro:
      "Choosing between SEO and Meta Ads is really about choosing between speed and durability. Each channel solves a different business problem, and your best option depends on timing, budget, and internal capacity.",
    body: `## SEO is slower but compounds over time

Search optimization usually takes longer to show clear movement, but the upside is durable traffic, stronger authority, and less dependency on ongoing spend once rankings improve.

## Meta Ads create speed and fast feedback

Ads can generate traffic and lead volume almost immediately, which is useful for launches, offers, demand testing, and shorter sales cycles. The tradeoff is that traffic slows when spend stops.

## The best answer is often sequencing, not choosing

Many businesses should start with the channel that solves the immediate bottleneck, then layer the second channel for resilience. Use ads for speed and SEO for long-term efficiency.`,
    faqs: [
      {
        question: "Which channel has the better long-term ROI?",
        answer:
          "SEO often produces stronger long-term efficiency because organic clicks do not have a direct ongoing cost, but it requires patience and consistent execution.",
      },
      {
        question: "Can a small budget still work for paid ads?",
        answer:
          "Yes, but small budgets need tighter offers, stronger pages, and realistic expectations. Efficiency matters even more when testing room is limited.",
      },
    ],
    featured: false,
    published: true,
    publishedAt: "2025-12-20T00:00:00.000Z",
    updatedAt: "2025-12-20T00:00:00.000Z",
  },
];
