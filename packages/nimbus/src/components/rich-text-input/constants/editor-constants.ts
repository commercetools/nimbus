/**
 * Constants for the rich text editor component
 *
 * This file consolidates all the configuration constants used by the rich text editor.
 * Previously split across multiple files, now consolidated for better maintainability.
 */

// Keyboard shortcuts for formatting
export const HOTKEYS = {
  "mod+b": "bold",
  "mod+i": "italic",
  "mod+u": "underline",
  "mod+`": "code",
} as const;

// Default configuration values
export const EDITOR_DEFAULTS = {
  placeholder: "Start typing...",
  isDisabled: false,
  isReadOnly: false,
  autoFocus: false,
} as const;

// HTML to Slate element mapping for serialization
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

// Formatting options for the "More Options" menu
export const FORMATTING_OPTIONS = {
  STRIKETHROUGH: "strikethrough",
  CODE: "code",
  SUPERSCRIPT: "superscript",
  SUBSCRIPT: "subscript",
} as const;

export const BASIC_FORMATTING = [
  FORMATTING_OPTIONS.STRIKETHROUGH,
  FORMATTING_OPTIONS.CODE,
] as const;

export const SCRIPT_FORMATTING = [
  FORMATTING_OPTIONS.SUPERSCRIPT,
  FORMATTING_OPTIONS.SUBSCRIPT,
] as const;

// Mutual exclusion groups - superscript and subscript cannot both be active
export const MUTUALLY_EXCLUSIVE_GROUPS = {
  script: [FORMATTING_OPTIONS.SUPERSCRIPT, FORMATTING_OPTIONS.SUBSCRIPT],
} as const;

// Type definitions
export type HotkeyType = typeof HOTKEYS;
export type HotkeyKey = keyof HotkeyType;
export type HotkeyValue = HotkeyType[HotkeyKey];
export type BlockTagKey = keyof typeof BLOCK_TAGS;
export type MarkTagKey = keyof typeof MARK_TAGS;
export type BlockTagValue = (typeof BLOCK_TAGS)[BlockTagKey];
export type MarkTagValue = (typeof MARK_TAGS)[MarkTagKey];
export type FormattingType =
  (typeof FORMATTING_OPTIONS)[keyof typeof FORMATTING_OPTIONS];
export type BasicFormattingType = (typeof BASIC_FORMATTING)[number];
export type ScriptFormattingType = (typeof SCRIPT_FORMATTING)[number];
