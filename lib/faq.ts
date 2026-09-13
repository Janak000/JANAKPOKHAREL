/**
 * Extracts FAQ pairs from a markdown body.
 *
 * Convention used across service pages: an H2 whose text starts with
 * "Frequently asked" (or "FAQ"), followed by one H3 per question, with the
 * answer as the prose beneath it. Anything before that H2 is ignored, so
 * ordinary H3 sub-headings elsewhere in the page are never mistaken for
 * questions.
 *
 * Returns [] when the convention is not present, so callers can skip emitting
 * FAQPage schema rather than publishing an empty or wrong one.
 */
export type Faq = { question: string; answer: string };

const FAQ_HEADING = /^##\s+(?:frequently asked|faqs?\b)/i;

export function extractFaqs(markdown: string): Faq[] {
  if (!markdown) return [];

  const lines = markdown.split(/\r?\n/);
  const start = lines.findIndex((line) => FAQ_HEADING.test(line.trim()));
  if (start === -1) return [];

  const faqs: Faq[] = [];
  let question: string | null = null;
  let answer: string[] = [];

  const flush = () => {
    if (question && answer.length) {
      const text = answer
        .join(" ")
        .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1") // strip markdown links
        .replace(/[*_`]/g, "")
        .replace(/\s+/g, " ")
        .trim();
      if (text) faqs.push({ question, answer: text });
    }
    question = null;
    answer = [];
  };

  for (const raw of lines.slice(start + 1)) {
    const line = raw.trim();

    // A following H2 ends the FAQ block.
    if (/^##\s+/.test(line) && !/^###/.test(line)) break;

    if (/^###\s+/.test(line)) {
      flush();
      question = line.replace(/^###\s+/, "").replace(/[*_`]/g, "").trim();
      continue;
    }

    if (question && line) answer.push(line);
  }
  flush();

  return faqs;
}

export function faqPageLd(faqs: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}
