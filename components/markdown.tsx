import { marked } from "marked";

marked.setOptions({ gfm: true, breaks: false });

export function Markdown({ content, className }: { content: string; className?: string }) {
  // Posts written in the rich editor are already HTML; older posts are Markdown.
  const looksLikeHtml = /<(p|h[1-6]|ul|ol|blockquote|pre|div|img|figure)\b/i.test(content);
  const raw = looksLikeHtml ? content : (marked.parse(content) as string);
  // External links open in a new tab and never leak the opener. Internal and
  // relative links are left alone so they keep client-side navigation.
  const html = raw.replace(/<a\s+([^>]*?)href="(https?:\/\/[^"]+)"([^>]*)>/gi, (full, a, href, b) => {
    if (/janakpokharel\.com\.np/i.test(href) || /\btarget=/i.test(full)) return full;
    return `<a ${a}href="${href}"${b} target="_blank" rel="noopener noreferrer">`;
  });
  return (
    <div
      className={`prose ${className ?? ""}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
