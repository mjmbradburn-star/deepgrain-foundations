/**
 * Slugify heading text into a stable URL fragment.
 *
 * Mirrors GitHub/MDX conventions: lowercase, spaces -> "-", strip punctuation,
 * collapse repeats, trim. The same input always produces the same slug, so
 * external links to `/intelligence/<article>#<heading-slug>` stay valid as
 * long as the heading text itself does not change.
 */
export const slugifyHeading = (input: unknown): string => {
  const text = headingText(input);
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

/** Recursively flatten MDX heading children (strings, arrays, elements) to text. */
const headingText = (node: unknown): string => {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(headingText).join("");
  if (typeof node === "object" && node && "props" in (node as Record<string, unknown>)) {
    const props = (node as { props?: { children?: unknown } }).props;
    return headingText(props?.children);
  }
  return "";
};
