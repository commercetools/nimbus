import type { PrismTheme } from "prism-react-renderer";

/**
 * Static PrismTheme that maps every Prism token type to a namespaced
 * CSS custom property (`var(--code-token-*)`).
 *
 * These variables are declared on the recipe's `root` slot with light defaults
 * and `_dark` overrides mapped to Nimbus color tokens. The theme object itself
 * is static and never changes between renders or color modes — light/dark
 * switching is resolved entirely by the CSS cascade.
 *
 * Consumed by `<Highlight theme={CODE_BLOCK_PRISM_THEME} ... />`.
 */
export const CODE_BLOCK_PRISM_THEME: PrismTheme = {
  plain: {
    color: "var(--code-token-plain)",
  },
  styles: [
    {
      types: ["comment", "prolog", "doctype", "cdata"],
      style: { color: "var(--code-token-comment)", fontStyle: "italic" },
    },
    {
      types: ["namespace"],
      style: { color: "var(--code-token-plain)", opacity: 0.7 },
    },
    {
      types: ["string", "char"],
      style: { color: "var(--code-token-string)" },
    },
    {
      types: ["attr-value"],
      style: { color: "var(--code-token-attr)" },
    },
    {
      types: ["punctuation"],
      style: { color: "var(--code-token-punctuation)" },
    },
    {
      types: ["operator"],
      style: { color: "var(--code-token-operator)" },
    },
    {
      types: [
        "entity",
        "url",
        "symbol",
        "number",
        "boolean",
        "variable",
        "constant",
        "inserted",
      ],
      style: { color: "var(--code-token-number)" },
    },
    {
      types: ["atrule", "keyword", "attr-name"],
      style: { color: "var(--code-token-keyword)" },
    },
    {
      types: ["selector", "deleted", "tag"],
      style: { color: "var(--code-token-tag)" },
    },
    {
      types: ["function", "class-name"],
      style: { color: "var(--code-token-function)" },
    },
    {
      types: ["regex", "important"],
      style: { color: "var(--code-token-operator)" },
    },
    {
      types: ["important", "bold"],
      style: { fontWeight: "bold" },
    },
    {
      types: ["italic"],
      style: { fontStyle: "italic" },
    },
  ],
};
