export type SiteSettings = {
  name: string;
  shortName: string;
  role: string;
  tagline: string;
  description: string;
  url: string;
  email: string;
  phone: string;
  whatsapp: string;
  location: string;
  facebook: string;
  linkedin: string;
  gtmId?: string;
  gaId?: string;
  /** Google Search Console HTML-tag verification code (the content="" value). */
  gscVerification?: string;
  ogImage: string;
  keywords: string[];
};

export type Hero = {
  availability: string;
  eyebrow: string;
  headline: string;
  description: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  imageSrc: string;
  imageAlt: string;
  statValue: string;
  statLabel: string;
};

export type AboutContent = {
  kicker: string;
  title: string;
  intro: string;
  /** Optional search snippet; the page falls back to `intro`. */
  metaDescription?: string;
  body: string;
  /** Optional heading and Markdown text for the "work I take on" section under the highlight cards. */
  workTitle?: string;
  workBody?: string;
  stats: { value: string; label: string }[];
  highlights: { icon: string; title: string; description: string }[];
  organizationsTitle: string;
  organizations: { name: string; logo: string; alt: string }[];
  /** Kicker above the "work I take on" heading. */
  workKicker?: string;
  journeyKicker?: string;
  journeyTitle?: string;
  trustedKicker?: string;
  ctaTitle?: string;
  ctaText?: string;
  ctaLabel?: string;
} & FaqFields;

export type ContactContent = {
  title: string;
  intro: string;
  whatsappTitle: string;
  whatsappDescription: string;
  /** Optional overrides for the search title and snippet. */
  metaTitle?: string;
  metaDescription?: string;
  nextKicker?: string;
  nextTitle?: string;
  nextIntro?: string;
  steps?: CardItem[];
  nextNote?: string;
} & FaqFields;

export type FaqItem = { question: string; answer: string };
export type CardItem = { icon: string; title: string; description: string };

/** Heading and rows for a page's FAQ section. Leave `faqs` empty to hide the section and its FAQPage markup. */
export type FaqFields = {
  faqKicker?: string;
  faqTitle?: string;
  faqIntro?: string;
  faqs?: FaqItem[];
};

export type HomeContent = {
  servicesKicker: string;
  servicesTitle: string;
  servicesLinkLabel: string;
  workKicker: string;
  workTitle: string;
  workLinkLabel: string;
  behindKicker: string;
  behindTitle: string;
  behindBody: string;
  behindPoints: { text: string }[];
  behindLinkLabel: string;
  blogKicker: string;
  blogTitle: string;
  blogLinkLabel: string;
  ctaKicker: string;
  ctaTitle: string;
  ctaText: string;
  ctaPrimaryLabel: string;
  ctaSecondaryLabel: string;
} & FaqFields;

export type ServicesPageContent = {
  metaTitle: string;
  metaDescription: string;
  kicker: string;
  title: string;
  intro: string;
  guideKicker: string;
  guideTitle: string;
  guideIntro: string;
  guideItems: CardItem[];
  guideNote: string;
  ctaTitle: string;
  ctaText: string;
  ctaPrimaryLabel: string;
  ctaSecondaryLabel: string;
} & FaqFields;

export type PortfolioPageContent = {
  metaTitle: string;
  metaDescription: string;
  kicker: string;
  title: string;
  intro: string;
  approachKicker: string;
  approachTitle: string;
  approachIntro: string;
  approachCards: CardItem[];
  approachNote: string;
  ctaKicker: string;
  ctaTitle: string;
  ctaText: string;
  ctaLabel: string;
} & FaqFields;

export type BlogSettings = {
  title: string;
  description: string;
  /** Optional <title> and snippet, so the long on-page intro can stay long. */
  metaTitle?: string;
  metaDescription?: string;
};

export type Service = {
  id?: string;
  slug: string;
  icon: string;
  title: string;
  /** Page heading. Falls back to `title`, which stays short for nav and cards. */
  h1?: string;
  shortDescription: string;
  body: string;
  metaTitle?: string;
  metaDescription?: string;
  sortOrder: number;
  published: boolean;
  updatedAt?: string;
};

export type Project = {
  id?: string;
  title: string;
  category: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  tags: string[];
  result?: string;
  sortOrder: number;
  published: boolean;
};

export type ResumeEntry = {
  id?: string;
  kind: "experience" | "education" | "certification";
  title: string;
  subtitle: string;
  href?: string;
  points: string[];
  sortOrder: number;
};

export type PostFaq = { question: string; answer: string };

export type Post = {
  id?: string;
  slug: string;
  title: string;
  category: string;
  tags: string[];
  excerpt: string;
  metaTitle?: string;
  metaDescription: string;
  coverImage?: string;
  readTime: string;
  heroIntro: string;
  body: string;
  faqs: PostFaq[];
  featured: boolean;
  published: boolean;
  publishedAt: string;
  updatedAt: string;
};

/** Editable text, sources and related-service rules for service and blog pages. */
export type PageLinks = {
  showInlineCta: boolean;
  serviceCtaTitle: string; // {title} = the service name
  serviceCtaText: string;
  serviceCtaLabel: string;
  postCtaTitle: string; // {title} = the first related service
  postCtaText: string;
  postCtaLabel: string;
  moreServicesHeading: string;
  moreServicesIntro: string;
  relatedServicesHeading: string;
  relatedServicesIntro: string;
  keepReadingHeading: string;
  sourcesHeading: string;
  /** page = a service or post slug, e.g. seo-services-nepal */
  sources: { page: string; label: string; url: string }[];
  /** post = a post slug; services = comma-separated service slugs, most relevant first */
  relatedServices: { post: string; services: string }[];
};

/** Editable footer. Empty/missing values fall back to the built-in footer. */
export type FooterContent = {
  /** Replaces the tagline under the logo. Empty = use the site tagline. */
  tagline: string;
  /** Extra social icons next to the built-in Facebook / LinkedIn / email ones. */
  socials: { label: string; url: string }[];
  /** Link columns, e.g. Explore. Each row is "Link text" + "Link URL". */
  columns: { title: string; links: string }[];
  showServices: boolean;
  showGuides: boolean;
  copyright: string;
  bottomLine: string;
};

/** Social posts shown on /social. Each item is just a pasted link. */
export type SocialFeed = {
  metaTitle: string;
  metaDescription: string;
  kicker: string;
  title: string;
  intro: string;
  items: { url: string; title: string }[];
  /** Homepage strip right after the hero. */
  showOnHome: boolean;
  homeKicker: string;
  homeTitle: string;
  homeButtonLabel: string;
};

/** A footer column after the CMS text ("Label | /url" per line) has been parsed. */
export type FooterColumn = { title: string; links: { label: string; href: string }[] };
