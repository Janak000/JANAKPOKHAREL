/**
 * Splits article content at the heading nearest its middle so a call to action
 * can sit inside a long article instead of only at the very end. Works on both
 * Markdown ("## Heading") and the HTML the rich editor saves ("<h2>").
 * Short articles (under 4 headings) are returned whole.
 */
export function splitAtMiddleHeading(content: string): [string, string] {
  const html = /<h2\b/i.test(content);
  const re = html ? /<h2\b/gi : /^## /gm;
  const starts: number[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(content))) starts.push(m.index);
  if (starts.length < 4) return [content, ""];
  const at = starts[Math.floor(starts.length / 2)];
  return [content.slice(0, at), content.slice(at)];
}
