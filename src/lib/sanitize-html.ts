const ALLOWED_TAGS = new Set(["span", "br", "strong", "em", "p", "ul", "ol", "li", "h1", "h2", "h3", "a"]);
const ALLOWED_ATTRS: Record<string, Set<string>> = {
  span: new Set(["class"]),
  p: new Set(["class"]),
  h1: new Set(["class"]),
  h2: new Set(["class"]),
  h3: new Set(["class"]),
  a: new Set(["href", "target", "rel"]),
};

export function sanitizeHtml(html: string): string {
  let result = html.replace(
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    ""
  );
  result = result.replace(/<!--[\s\S]*?-->/g, "");
  result = result.replace(
    /<\/?([a-zA-Z][a-zA-Z0-9]*)\b[^>]*>/gi,
    (match, tagName: string) => {
      if (!ALLOWED_TAGS.has(tagName.toLowerCase())) return "";
      return match.replace(
        /\s+([a-zA-Z-]+)(?:="[^"]*")?/g,
        (attrMatch: string, attrName: string) => {
          const allowed = ALLOWED_ATTRS[tagName.toLowerCase()];
          if (allowed?.has(attrName.toLowerCase())) return attrMatch;
          return "";
        }
      );
    }
  );
  return result;
}
