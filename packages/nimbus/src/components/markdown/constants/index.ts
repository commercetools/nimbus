/**
 * Default safe element allowlist (Markdown is safe by default).
 *
 * Seeded from the Merchant Center markdown viewer's list
 * (`h1,h2,p,a,br,strong,i,code,ul,ol,li`) and extended to cover every element
 * the Nimbus default renderers produce — all heading levels, emphasis, code
 * blocks, blockquotes, images, horizontal rules, and the GFM
 * table/strikethrough/task-list elements.
 */
export const DEFAULT_ALLOWED_ELEMENTS: readonly string[] = [
  // headings
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  // text + inline
  "p",
  "a",
  "br",
  "strong",
  "b",
  "em",
  "i",
  "del",
  "code",
  "span",
  // blocks
  "pre",
  "blockquote",
  "hr",
  // lists
  "ul",
  "ol",
  "li",
  "input",
  // media
  "img",
  // GFM tables
  "table",
  "thead",
  "tbody",
  "tr",
  "th",
  "td",
];

/** Maximum HTML heading level. */
export const MAX_HEADING_LEVEL = 6;
