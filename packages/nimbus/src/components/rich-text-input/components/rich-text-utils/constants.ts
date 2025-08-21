// Block element tags
export const BLOCK_TAGS = {
  blockquote: "block-quote",
  p: "paragraph",
  pre: "code",
  h1: "heading-one",
  h2: "heading-two",
  h3: "heading-three",
  h4: "heading-four",
  h5: "heading-five",
  ul: "bulleted-list",
  ol: "numbered-list",
  li: "list-item",
  a: "link",
} as const;

// Inline/mark tags
export const MARK_TAGS = {
  strong: "bold",
  b: "bold",
  em: "italic",
  i: "italic",
  u: "underline",
  code: "code",
  sup: "superscript",
  sub: "subscript",
  del: "strikethrough",
  s: "strikethrough",
} as const;

export type BlockTagKey = keyof typeof BLOCK_TAGS;
export type MarkTagKey = keyof typeof MARK_TAGS;
export type BlockTagValue = (typeof BLOCK_TAGS)[BlockTagKey];
export type MarkTagValue = (typeof MARK_TAGS)[MarkTagKey];
