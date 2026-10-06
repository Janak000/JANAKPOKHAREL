import {
  getAbout,
  getPosts,
  getProjects,
  getResume,
  getServices,
  getSettings,
  absoluteUrl,
  formatDate,
} from "@/lib/cms";

export const revalidate = 3600;

// llms-full.txt: the complete text of the site in one Markdown file, for AI
// models and answer engines that want the content itself rather than a link
// list. /llms.txt is the short index; this is the long form.
// See https://llmstxt.org/

const ENTITIES: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  "&apos;": "'",
  "&nbsp;": " ",
  "&rsquo;": "’",
  "&lsquo;": "‘",
  "&rdquo;": "”",
  "&ldquo;": "“",
  "&ndash;": "–",
  "&mdash;": "—",
  "&hellip;": "…",
};

function decode(s: string): string {
  return s
    .replace(/&(#\d+|#x[0-9a-f]+|[a-z]+);/gi, (m, code: string) => {
      if (ENTITIES[m]) return ENTITIES[m];
      if (code[0] === "#") {
        const n = code[1].toLowerCase() === "x" ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
        return Number.isFinite(n) ? String.fromCodePoint(n) : m;
      }
      return m;
    });
}

function absolutise(href: string): string {
  if (/^(https?:|mailto:|tel:)/i.test(href)) return href;
  if (href.startsWith("#")) return href;
  return absoluteUrl(href);
}

/** Inline HTML to Markdown: links, emphasis, code, line breaks; everything else is dropped. */
function inline(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<a\b[^>]*?href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi, (_m, href: string, text: string) => {
      const label = text.replace(/<[^>]+>/g, "").trim();
      return label ? `[${label}](${absolutise(href)})` : "";
    })
    .replace(/<(strong|b)\b[^>]*>([\s\S]*?)<\/\1>/gi, "**$2**")
    .replace(/<(em|i)\b[^>]*>([\s\S]*?)<\/\1>/gi, "*$2*")
    .replace(/<code\b[^>]*>([\s\S]*?)<\/code>/gi, "`$1`")
    .replace(/<[^>]+>/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .trim();
}

/** Push every Markdown heading down by `shift` levels so a body nests under its own title. */
function shiftHeadings(md: string, shift: number): string {
  let inFence = false;
  return md
    .split("\n")
    .map((line) => {
      if (/^\s*```/.test(line)) inFence = !inFence;
      if (inFence) return line;
      const m = line.match(/^(#{1,6})\s+(.*)$/);
      if (!m) return line;
      return `${"#".repeat(Math.min(6, m[1].length + shift))} ${m[2]}`;
    })
    .join("\n");
}

/**
 * Bodies are HTML when written in the rich editor and Markdown otherwise, so
 * accept both. Plain regex conversion keeps this free of extra dependencies.
 */
function toMarkdown(content: string, shift = 0): string {
  const source = content ?? "";
  const looksLikeHtml = /<(p|h[1-6]|ul|ol|li|blockquote|pre|div|table|a|strong|em|br)\b/i.test(source);
  if (!looksLikeHtml) {
    const withLinks = source.replace(/\]\((\/[^)\s]*)\)/g, (_m, href: string) => `](${absoluteUrl(href)})`);
    return shiftHeadings(withLinks.trim(), shift);
  }

  const md = source
    .replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, "")
    .replace(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi, (_m, level: string, text: string) => {
      const hashes = "#".repeat(Math.min(6, Number(level) + shift));
      return `\n\n${hashes} ${inline(text).replace(/\s*\n\s*/g, " ")}\n\n`;
    })
    .replace(/<pre\b[^>]*>([\s\S]*?)<\/pre>/gi, (_m, code: string) => {
      return `\n\n\`\`\`\n${code.replace(/<[^>]+>/g, "").trim()}\n\`\`\`\n\n`;
    })
    .replace(/<blockquote\b[^>]*>([\s\S]*?)<\/blockquote>/gi, (_m, text: string) => {
      const body = inline(text.replace(/<\/p>\s*<p\b[^>]*>/gi, "\n\n"));
      return `\n\n${body.split("\n").map((l) => `> ${l}`).join("\n")}\n\n`;
    })
    .replace(/<li\b[^>]*>([\s\S]*?)<\/li>/gi, (_m, text: string) => `\n- ${inline(text).replace(/\s*\n\s*/g, " ")}`)
    .replace(/<\/?(ul|ol)\b[^>]*>/gi, "\n\n")
    .replace(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi, (_m, row: string) => {
      const cells = Array.from(row.matchAll(/<t[hd]\b[^>]*>([\s\S]*?)<\/t[hd]>/gi)).map((c) =>
        inline(c[1]).replace(/\s*\n\s*/g, " ")
      );
      return `\n| ${cells.join(" | ")} |`;
    })
    .replace(/<\/?(table|thead|tbody|tfoot)\b[^>]*>/gi, "\n\n")
    .replace(/<p\b[^>]*>([\s\S]*?)<\/p>/gi, (_m, text: string) => `\n\n${inline(text)}\n\n`)
    .replace(/<\/?(div|section|article|figure|figcaption|span)\b[^>]*>/gi, "\n")
    .replace(/<img\b[^>]*>/gi, "");

  // Whatever inline markup is left outside block tags (loose text, links).
  // Entities are decoded once, last, so a literal "<" in the text is never
  // mistaken for the start of a tag.
  return decode(inline(md))
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function oneLine(text: string): string {
  return toMarkdown(text).replace(/\s*\n\s*/g, " ").trim();
}

export async function GET() {
  const [settings, about, services, posts, projects, resume] = await Promise.all([
    getSettings(),
    getAbout(),
    getServices(),
    getPosts(),
    getProjects(),
    getResume(),
  ]);

  const out: string[] = [];

  out.push(`# ${settings.name}`);
  out.push(`> ${settings.description}`);
  out.push(
    `${settings.name} is a ${settings.role} based in ${settings.location}, working with clients worldwide. ` +
      `This file holds the full text of the site in one place. A shorter index is at ${absoluteUrl("/llms.txt")}.`
  );
  out.push(
    [
      `- Website: ${absoluteUrl("/")}`,
      `- Contact page: ${absoluteUrl("/contact")}`,
      settings.email ? `- Email: ${settings.email}` : "",
      settings.location ? `- Location: ${settings.location}` : "",
      settings.linkedin ? `- LinkedIn: ${settings.linkedin}` : "",
      settings.facebook ? `- Facebook: ${settings.facebook}` : "",
    ]
      .filter(Boolean)
      .join("\n")
  );

  // About
  out.push(`## About`);
  out.push(`Page: ${absoluteUrl("/about")}`);
  if (about.intro) out.push(oneLine(about.intro));
  if (about.body) out.push(toMarkdown(about.body, 2));
  if (about.stats?.length) {
    out.push(about.stats.map((s) => `- ${s.value} ${s.label}`).join("\n"));
  }
  if (about.highlights?.length) {
    out.push(about.highlights.map((h) => `- **${h.title}**: ${h.description}`).join("\n"));
  }

  // Experience, education, credentials
  const kinds: { kind: "experience" | "education" | "certification"; heading: string }[] = [
    { kind: "experience", heading: "Experience" },
    { kind: "education", heading: "Education" },
    { kind: "certification", heading: "Certifications" },
  ];
  for (const { kind, heading } of kinds) {
    const entries = resume.filter((r) => r.kind === kind);
    if (entries.length === 0) continue;
    out.push(`### ${heading}`);
    out.push(
      entries
        .map((e) => {
          const head = `- **${e.title}**${e.subtitle ? `, ${e.subtitle}` : ""}`;
          const pts = (e.points ?? []).map((p) => `  - ${p}`).join("\n");
          return pts ? `${head}\n${pts}` : head;
        })
        .join("\n")
    );
  }

  // Services
  out.push(`## Services`);
  for (const s of services) {
    out.push(`### ${s.h1 || s.title}`);
    out.push(`Page: ${absoluteUrl(`/services/${s.slug}`)}`);
    if (s.shortDescription) out.push(s.shortDescription);
    if (s.body) out.push(toMarkdown(s.body, 2));
  }

  // Portfolio
  if (projects.length > 0) {
    out.push(`## Portfolio`);
    out.push(`Page: ${absoluteUrl("/portfolio")}`);
    out.push(
      projects
        .map((p) => {
          const tags = p.tags?.length ? ` Tags: ${p.tags.join(", ")}.` : "";
          const result = p.result ? ` Result: ${p.result}.` : "";
          return `- **${p.title}** (${p.category}): ${p.description}${tags}${result}`;
        })
        .join("\n")
    );
  }

  // Blog
  out.push(`## Blog articles`);
  out.push(`Index: ${absoluteUrl("/blog")}`);
  for (const p of posts) {
    out.push(`### ${p.title}`);
    out.push(
      [
        `URL: ${absoluteUrl(`/blog/${p.slug}`)}`,
        `Category: ${p.category}`,
        `Published: ${formatDate(p.publishedAt)}`,
        p.updatedAt && p.updatedAt !== p.publishedAt ? `Updated: ${formatDate(p.updatedAt)}` : "",
        p.readTime ? `Reading time: ${p.readTime}` : "",
      ]
        .filter(Boolean)
        .join("\n")
    );
    if (p.excerpt) out.push(`> ${oneLine(p.excerpt)}`);
    if (p.heroIntro) out.push(toMarkdown(p.heroIntro, 2));
    if (p.body) out.push(toMarkdown(p.body, 2));
    if (p.faqs?.length) {
      out.push(`#### Frequently asked questions`);
      out.push(p.faqs.map((f) => `**${oneLine(f.question)}**\n${toMarkdown(f.answer, 2)}`).join("\n\n"));
    }
  }

  const body = out.filter((chunk) => chunk && chunk.trim()).join("\n\n") + "\n";

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
