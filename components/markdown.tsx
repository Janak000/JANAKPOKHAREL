import { marked } from "marked";

marked.setOptions({ gfm: true, breaks: false });

export function Markdown({ content, className }: { content: string; className?: string }) {
  // Posts written in the rich editor are already HTML; older posts are Markdown.
  const looksLikeHtml = /<(p|h[1-6]|ul|ol|blockquote|pre|div|img|figure)\b/i.test(content);
  const html = looksLikeHtml ? content : (marked.parse(content) as string);
  return (
    <div
      className={`prose ${className ?? ""}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
