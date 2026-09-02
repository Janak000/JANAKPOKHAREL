import type {
  AboutContent,
  BlogSettings,
  ContactContent,
  Hero,
  Post,
  Project,
  ResumeEntry,
  Service,
  SiteSettings,
} from "./types";
import {
  fallbackAbout,
  fallbackBlogSettings,
  fallbackContact,
  fallbackHero,
  fallbackPosts,
  fallbackProjects,
  fallbackResume,
  fallbackServices,
  fallbackSettings,
} from "./fallback-content";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

export const cmsEnabled = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

export const REVALIDATE_SECONDS = 120;

async function rest<T>(path: string): Promise<T | null> {
  if (!cmsEnabled) return null;
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
      headers: {
        apikey: SUPABASE_ANON_KEY as string,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      next: { revalidate: REVALIDATE_SECONDS, tags: ["content"] },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

async function getBlock<T>(key: string, fallback: T): Promise<T> {
  const rows = await rest<{ data: T }[]>(
    `content_blocks?key=eq.${key}&select=data&limit=1`
  );
  if (rows && rows.length > 0 && rows[0].data) {
    return { ...fallback, ...rows[0].data };
  }
  return fallback;
}

export async function getSettings(): Promise<SiteSettings> {
  const settings = await getBlock("settings", fallbackSettings);

  // Defensive trim. The stored `role` was " SEO & Ads Analyst " (leading and
  // trailing spaces), which leaked into <title> as "Janak Pokharel |  SEO &
  // Ads Analyst  in Nepal" - double spaces - and into llms.txt and the JSON-LD
  // jobTitle. Trimming here fixes every consumer at once, and keeps the site
  // clean even if the value is re-saved with padding from the CMS.
  const clean = <T,>(v: T): T =>
    typeof v === "string" ? (v.trim().replace(/\s+/g, " ") as unknown as T) : v;

  return {
    ...settings,
    name: clean(settings.name),
    shortName: clean(settings.shortName),
    role: clean(settings.role),
    tagline: clean(settings.tagline),
    description: clean(settings.description),
    location: clean(settings.location),
  };
}

export function getHero(): Promise<Hero> {
  return getBlock("hero", fallbackHero);
}

export function getAbout(): Promise<AboutContent> {
  return getBlock("about", fallbackAbout);
}

export function getContact(): Promise<ContactContent> {
  return getBlock("contact", fallbackContact);
}

export function getBlogSettings(): Promise<BlogSettings> {
  return getBlock("blog", fallbackBlogSettings);
}

type ServiceRow = {
  id: string;
  slug: string;
  icon: string;
  title: string;
  short_description: string;
  body_md: string;
  meta_title: string | null;
  meta_description: string | null;
  sort_order: number;
  published: boolean;
};

export async function getServices(): Promise<Service[]> {
  const rows = await rest<ServiceRow[]>(
    "services?published=eq.true&order=sort_order.asc&select=*"
  );
  if (!rows || rows.length === 0) return fallbackServices;
  return rows.map((r) => ({
    id: r.id,
    slug: r.slug,
    icon: r.icon,
    title: r.title,
    shortDescription: r.short_description,
    body: r.body_md,
    metaTitle: r.meta_title ?? undefined,
    metaDescription: r.meta_description ?? undefined,
    sortOrder: r.sort_order,
    published: r.published,
  }));
}

export async function getService(slug: string): Promise<Service | null> {
  const services = await getServices();
  return services.find((s) => s.slug === slug) ?? null;
}

type ProjectRow = {
  id: string;
  title: string;
  category: string;
  description: string;
  image_src: string;
  image_alt: string;
  tags: string[] | null;
  result: string | null;
  sort_order: number;
  published: boolean;
};

export async function getProjects(): Promise<Project[]> {
  const rows = await rest<ProjectRow[]>(
    "projects?published=eq.true&order=sort_order.asc&select=*"
  );
  if (!rows || rows.length === 0) return fallbackProjects;
  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    category: r.category,
    description: r.description,
    imageSrc: r.image_src,
    imageAlt: r.image_alt,
    tags: r.tags ?? [],
    result: r.result ?? undefined,
    sortOrder: r.sort_order,
    published: r.published,
  }));
}

type ResumeRow = {
  id: string;
  kind: "experience" | "education" | "certification";
  title: string;
  subtitle: string;
  href: string | null;
  points: string[] | null;
  sort_order: number;
};

export async function getResume(): Promise<ResumeEntry[]> {
  const rows = await rest<ResumeRow[]>(
    "resume_entries?order=kind.asc,sort_order.asc&select=*"
  );
  if (!rows || rows.length === 0) return fallbackResume;
  return rows.map((r) => ({
    id: r.id,
    kind: r.kind,
    title: r.title,
    subtitle: r.subtitle,
    href: r.href ?? undefined,
    points: r.points ?? [],
    sortOrder: r.sort_order,
  }));
}

type PostRow = {
  id: string;
  slug: string;
  title: string;
  category: string;
  tags: string[] | null;
  excerpt: string;
  meta_title: string | null;
  meta_description: string;
  cover_image: string | null;
  read_time: string;
  hero_intro: string;
  body_md: string;
  faqs: { question: string; answer: string }[] | null;
  featured: boolean;
  published: boolean;
  published_at: string;
  updated_at: string;
};

function mapPost(r: PostRow): Post {
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    category: r.category,
    tags: r.tags ?? [],
    excerpt: r.excerpt,
    metaTitle: r.meta_title ?? undefined,
    metaDescription: r.meta_description,
    coverImage: r.cover_image ?? undefined,
    readTime: r.read_time,
    heroIntro: r.hero_intro,
    body: r.body_md,
    faqs: r.faqs ?? [],
    featured: r.featured,
    published: r.published,
    publishedAt: r.published_at,
    updatedAt: r.updated_at,
  };
}

export async function getPosts(): Promise<Post[]> {
  const rows = await rest<PostRow[]>(
    "posts?published=eq.true&order=published_at.desc&select=*"
  );
  if (!rows || rows.length === 0) return fallbackPosts;
  return rows.map(mapPost);
}

export async function getPost(slug: string): Promise<Post | null> {
  const posts = await getPosts();
  return posts.find((p) => p.slug === slug) ?? null;
}

export async function getCategories(): Promise<string[]> {
  const posts = await getPosts();
  return Array.from(new Set(posts.map((p) => p.category)));
}

export function categorySlug(category: string): string {
  return category
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function getPostsByCategory(slug: string): Promise<{ category: string; posts: Post[] } | null> {
  const posts = await getPosts();
  const matched = posts.filter((p) => categorySlug(p.category) === slug);
  if (matched.length === 0) return null;
  return { category: matched[0].category, posts: matched };
}

export function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

export function siteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "") ||
    "https://janakpokharel.com.np"
  );
}

export function absoluteUrl(path: string): string {
  return `${siteUrl()}${path.startsWith("/") ? path : `/${path}`}`;
}
