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
  body: string;
  stats: { value: string; label: string }[];
  highlights: { icon: string; title: string; description: string }[];
  organizationsTitle: string;
  organizations: { name: string; logo: string; alt: string }[];
};

export type ContactContent = {
  title: string;
  intro: string;
  whatsappTitle: string;
  whatsappDescription: string;
};

export type BlogSettings = {
  title: string;
  description: string;
};

export type Service = {
  id?: string;
  slug: string;
  icon: string;
  title: string;
  shortDescription: string;
  body: string;
  metaTitle?: string;
  metaDescription?: string;
  sortOrder: number;
  published: boolean;
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
