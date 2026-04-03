import siteContentData from "./site-content.json";

export type NavItem = {
  label: string;
  href: string;
};

export type HeroContent = {
  availability: string;
  eyebrow: string;
  headline: string;
  description: string;
  primaryCta: {
    label: string;
    href: string;
  };
  secondaryCta: {
    label: string;
    href: string;
  };
  image: {
    src: string;
    alt: string;
  };
  stat: {
    value: string;
    label: string;
  };
};

export type SimpleStat = {
  value: string;
  label: string;
};

export type HighlightCard = {
  icon: string;
  title: string;
  description: string;
};

export type Organization = {
  name: string;
  logo: string;
  alt: string;
};

export type Service = {
  icon: string;
  title: string;
  description: string;
};

export type ResumeItem = {
  title: string;
  subtitle: string;
  points: string[];
  href?: string;
};

export type Project = {
  title: string;
  category: string;
  description: string;
  tags: string[];
  image: {
    src: string;
    alt: string;
  };
  result?: string;
  href?: string;
  ctaLabel?: string;
  locked?: boolean;
};

export type BlogSection = {
  heading: string;
  body: string;
};

export type BlogFaq = {
  question: string;
  answer: string;
};

export type BlogPost = {
  slug: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  metaDescription: string;
  readTime: string;
  heroIntro: string;
  sections: BlogSection[];
  faqs: BlogFaq[];
  cta: {
    title: string;
    buttonLabel: string;
    buttonHref: string;
  };
};

export type SiteContent = {
  site: {
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
    gtmId: string;
    gaId: string;
  };
  navigation: NavItem[];
  hero: HeroContent;
  about: {
    title: string;
    intro: string;
    body: string;
    stats: SimpleStat[];
    highlightCards: HighlightCard[];
    organizationsTitle: string;
    organizations: Organization[];
  };
  services: Service[];
  projects: {
    title: string;
    intro: string;
    lockedTitle: string;
    lockedDescription: string;
    lockedCtaLabel: string;
    lockedCtaHref: string;
    items: Project[];
  };
  resume: {
    experience: ResumeItem[];
    education: ResumeItem[];
    certifications: ResumeItem[];
  };
  blog: {
    title: string;
    description: string;
    posts: BlogPost[];
  };
  contact: {
    title: string;
    intro: string;
    whatsappTitle: string;
    whatsappDescription: string;
    footerNote: string;
  };
};

export const defaultSiteContent = siteContentData as SiteContent;
