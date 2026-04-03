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
  href?: string;
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
  contentHtml: string;
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
    ogImage: string;
    keywords: string[];
    navigationCta: {
      label: string;
      href: string;
    };
    footer: {
      exploreTitle: string;
      contactTitle: string;
      copyrightText: string;
    };
  };
  navigation: NavItem[];
  hero: HeroContent;
  about: {
    kicker: string;
    title: string;
    intro: string;
    body: string;
    stats: SimpleStat[];
    highlightCards: HighlightCard[];
    organizationsKicker: string;
    organizationsTitle: string;
    organizations: Organization[];
  };
  services: {
    kicker: string;
    title: string;
    items: Service[];
  };
  projects: {
    kicker: string;
    title: string;
    intro: string;
    lockedTitle: string;
    lockedDescription: string;
    lockedCtaLabel: string;
    lockedCtaHref: string;
    items: Project[];
  };
  resume: {
    kicker: string;
    experienceTitle: string;
    educationTitle: string;
    certificationsTitle: string;
    experience: ResumeItem[];
    education: ResumeItem[];
    certifications: ResumeItem[];
  };
  blog: {
    kicker: string;
    title: string;
    listingTitle: string;
    description: string;
    viewAllLabel: string;
    readMoreLabel: string;
    openPostLabel: string;
    backToBlogLabel: string;
    faqTitle: string;
    posts: BlogPost[];
  };
  contact: {
    kicker: string;
    title: string;
    intro: string;
    whatsappTitle: string;
    whatsappDescription: string;
    whatsappButtonLabel: string;
    footerNote: string;
  };
};

type LegacySection = {
  heading: string;
  body: string;
};

type LegacyContent = {
  site: SiteContent["site"] & {
    keywords?: string[];
    ogImage?: string;
    navigationCta?: SiteContent["site"]["navigationCta"];
    footer?: SiteContent["site"]["footer"];
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
  services: Service[] | SiteContent["services"];
  projects: Omit<SiteContent["projects"], "kicker"> & {
    items: Project[];
  };
  resume: Omit<SiteContent["resume"], "kicker" | "experienceTitle" | "educationTitle" | "certificationsTitle">;
  blog: {
    title: string;
    description: string;
    posts: Array<
      Omit<BlogPost, "contentHtml"> & {
        contentHtml?: string;
        sections?: LegacySection[];
      }
    >;
  };
  contact: SiteContent["contact"] & {
    kicker?: string;
    whatsappButtonLabel?: string;
  };
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function legacySectionsToHtml(sections: LegacySection[] | undefined) {
  if (!sections || sections.length === 0) {
    return "<p>Add your article content here.</p>";
  }

  return sections
    .map(
      (section) =>
        `<section><h2>${escapeHtml(section.heading)}</h2><p>${escapeHtml(section.body)}</p></section>`
    )
    .join("");
}

function migrateLegacySiteContent(legacyData: LegacyContent): SiteContent {
  const site = legacyData.site;
  const services =
    Array.isArray(legacyData.services) ?
      {
        kicker: "Services",
        title: "Core expertise built for growth",
        items: legacyData.services
      }
    : legacyData.services;

  return {
    site: {
      ...site,
      ogImage: site.ogImage ?? "/image/janakOG.webp",
      keywords: site.keywords ?? [
        "Janak Pokharel",
        "SEO expert Nepal",
        "Meta Ads manager",
        "Google Ads specialist",
        "technical SEO",
        "digital marketing consultant"
      ],
      navigationCta: site.navigationCta ?? {
        label: "Let's Talk",
        href: "/#contact"
      },
      footer: site.footer ?? {
        exploreTitle: "Explore",
        contactTitle: "Contact",
        copyrightText: `${site.name}. All rights reserved.`
      }
    },
    navigation: legacyData.navigation,
    hero: legacyData.hero,
    about: {
      kicker: "About",
      title: legacyData.about.title,
      intro: legacyData.about.intro,
      body: legacyData.about.body,
      stats: legacyData.about.stats,
      highlightCards: legacyData.about.highlightCards,
      organizationsKicker: "Brands",
      organizationsTitle: legacyData.about.organizationsTitle,
      organizations: legacyData.about.organizations
    },
    services,
    projects: {
      kicker: "Portfolio",
      ...legacyData.projects
    },
    resume: {
      kicker: "Resume",
      experienceTitle: "Experience",
      educationTitle: "Education",
      certificationsTitle: "Certifications",
      ...legacyData.resume
    },
    blog: {
      kicker: "Blogs",
      title: legacyData.blog.title,
      listingTitle: "Latest insights",
      description: legacyData.blog.description,
      viewAllLabel: "View All",
      readMoreLabel: "Read blog",
      openPostLabel: "Open blog",
      backToBlogLabel: "Back to blogs",
      faqTitle: "Frequently asked questions",
      posts: legacyData.blog.posts.map((post) => ({
        ...post,
        contentHtml: post.contentHtml ?? legacySectionsToHtml(post.sections)
      }))
    },
    contact: {
      ...legacyData.contact,
      kicker: legacyData.contact.kicker ?? "Contact",
      whatsappButtonLabel: legacyData.contact.whatsappButtonLabel ?? "Message on WhatsApp"
    }
  };
}

export const defaultSiteContent = migrateLegacySiteContent(siteContentData as LegacyContent);
