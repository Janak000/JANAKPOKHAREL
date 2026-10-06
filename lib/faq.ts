/**
 * FAQ helpers shared by every page that shows an FAQ.
 *
 * Two sources feed them. Pages managed through the CMS (home, services hub,
 * about, portfolio, contact, blog posts) store a plain list of
 * question/answer rows. Service pages keep their FAQ inside the Markdown body:
 * an H2 whose text starts with "Frequently asked" (or "FAQ"), followed by one
 * H3 per question, with the answer as the prose beneath it. splitFaqs() lifts
 * that block out so it can be shown with the same accordion as everywhere else.
 */
export type Faq = { question: string; answer: string };

const FAQ_HEADING = /^##\s+(?:frequently asked|faqs?\b)/i;

const ENTITIES: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  "&nbsp;": " ",
};

/**
 * The visible text of a Markdown or HTML snippet. FAQPage answers have to be
 * plain text that matches what readers see, so links, emphasis and tags are
 * reduced to their words.
 */
export function plainText(source: string | null | undefined): string {
  if (!source) return "";
  return source
    .replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, "")
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<\/(p|div|li|h[1-6]|blockquote|tr)>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/^\s{0,3}(?:#{1,6}|>|[-*+]|\d+\.)\s+/gm, "")
    .replace(/(\*\*|__)(.+?)\1/g, "$2")
    .replace(/(^|[\s(])[*_]([^*_\n]+)[*_](?=[\s).,;:!?]|$)/g, "$1$2")
    .replace(/`([^`]*)`/g, "$1")
    .replace(/&(?:amp|lt|gt|quot|#39|nbsp);/g, (m) => ENTITIES[m] ?? m)
    .replace(/\s+/g, " ")
    .trim();
}

/** Drops rows with a blank question or answer, so an empty CMS row never renders or reaches the schema. */
export function cleanFaqs(faqs: Faq[] | null | undefined): Faq[] {
  return (faqs ?? [])
    .map((f) => ({ question: plainText(f?.question), answer: (f?.answer ?? "").trim() }))
    .filter((f) => f.question && plainText(f.answer));
}

/** FAQPage JSON-LD built from the same rows the page displays, so markup and visible text cannot drift apart. */
export function faqPageLd(faqs: Faq[], pageUrl?: string) {
  const items = cleanFaqs(faqs);
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    ...(pageUrl ? { "@id": `${pageUrl}#faq`, url: pageUrl } : {}),
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: plainText(f.answer) },
    })),
  };
}

export type FaqSplit = {
  /** Markdown before the FAQ heading. */
  before: string;
  /** Text of the FAQ heading itself, e.g. "Frequently asked questions". */
  heading: string;
  /** Anything written between the FAQ heading and the first question. */
  intro: string;
  /** Questions with their Markdown answers (links kept). */
  faqs: Faq[];
  /** Markdown after the FAQ block, starting at the next H2. */
  after: string;
};

/**
 * Splits a Markdown body around its FAQ block. When the convention is not
 * present (or holds no questions) everything is returned in `before`, so
 * callers can render the body untouched and skip the FAQ schema rather than
 * publishing an empty or wrong one.
 */
export function splitFaqs(markdown: string | null | undefined): FaqSplit {
  const source = markdown ?? "";
  const none: FaqSplit = { before: source, heading: "", intro: "", faqs: [], after: "" };

  const lines = source.split(/\r?\n/);
  const start = lines.findIndex((line) => FAQ_HEADING.test(line.trim()));
  if (start === -1) return none;

  const faqs: Faq[] = [];
  const intro: string[] = [];
  let question: string | null = null;
  let answer: string[] = [];
  let end = lines.length;

  const flush = () => {
    if (question) {
      const text = answer.join("\n").trim();
      if (text) faqs.push({ question, answer: text });
    }
    question = null;
    answer = [];
  };

  for (let i = start + 1; i < lines.length; i++) {
    const line = lines[i].trim();

    // The next H2 ends the FAQ block. "###" does not match: the third # is not whitespace.
    if (/^##\s+/.test(line)) {
      end = i;
      break;
    }

    if (/^###\s+/.test(line)) {
      flush();
      question = line.replace(/^###\s+/, "").replace(/[*_`]/g, "").trim();
      continue;
    }

    if (question) answer.push(lines[i]);
    else intro.push(lines[i]);
  }
  flush();

  if (faqs.length === 0) return none;

  return {
    before: lines.slice(0, start).join("\n").trim(),
    heading: lines[start].trim().replace(/^##\s+/, "").replace(/[*_`]/g, "").trim(),
    intro: intro.join("\n").trim(),
    faqs,
    after: lines.slice(end).join("\n").trim(),
  };
}

/** Kept for callers that only need the question list. */
export function extractFaqs(markdown: string): Faq[] {
  return splitFaqs(markdown).faqs.map((f) => ({ question: f.question, answer: plainText(f.answer) }));
}
