import { defineSlotRecipe } from "@chakra-ui/react/styled-system";

/**
 * Slot recipe for the Markdown component.
 *
 * Typography reproduces the Figma `Markdown/*` scale by composing existing
 * primitive tokens (font sizes 14/16/18/20/24, line-heights 20/22/24/28,
 * weights 400/600/700) — no new `Markdown/*` composite tokens, and the existing
 * system `fontFamily.mono` for code (no Roboto Mono webfont).
 */
export const markdownSlotRecipe = defineSlotRecipe({
  className: "nimbus-markdown",
  slots: [
    "root",
    "heading",
    "paragraph",
    "link",
    "inlineCode",
    "codeBlock",
    "list",
    "listItem",
    "blockquote",
    "table",
    "tableHeaderCell",
    "tableCell",
    "image",
    "separator",
  ],
  base: {
    root: {
      // Markdown/Body — the default text style for the document.
      fontFamily: "body",
      fontSize: "400",
      lineHeight: "600",
      fontWeight: "400",
      color: "neutral.12",
      // Vertical rhythm between top-level blocks.
      "& > * + *": {
        marginTop: "400",
      },
    },
    heading: {
      fontFamily: "heading",
      fontWeight: "600",
      color: "neutral.12",
      // Figma Markdown heading scale, keyed by rendered level.
      "&[data-level='1']": { fontSize: "600", lineHeight: "700" }, // H1 24/28
      "&[data-level='2']": { fontSize: "500", lineHeight: "600" }, // H2 20/24
      "&[data-level='3']": { fontSize: "450", lineHeight: "600" }, // H3 18/24
      "&[data-level='4']": { fontSize: "400", lineHeight: "500" }, // H4 16/20
      // h5/h6 fold to the smallest (H4) style.
      "&[data-level='5'], &[data-level='6']": {
        fontSize: "400",
        lineHeight: "500",
      },
      // Tighter spacing above a heading that follows content.
      "& + *": { marginTop: "300" },
    },
    paragraph: {
      // Markdown/Body
      fontSize: "400",
      lineHeight: "600",
      fontWeight: "400",
    },
    link: {
      color: "primary.11",
      textDecoration: "underline",
      textUnderlineOffset: "2px",
      borderRadius: "100",
      _hover: { color: "primary.10" },
      _focusVisible: {
        outline: "2px solid",
        outlineColor: "primary.9",
        outlineOffset: "2px",
      },
    },
    inlineCode: {
      fontFamily: "mono",
      fontSize: "350",
      lineHeight: "550",
      bg: "neutral.3",
      color: "neutral.12",
      borderRadius: "100",
      px: "100",
      py: "25",
    },
    codeBlock: {
      fontFamily: "mono",
      fontSize: "350",
      lineHeight: "550",
      bg: "neutral.3",
      color: "neutral.12",
      borderRadius: "200",
      p: "300",
      overflowX: "auto",
      whiteSpace: "pre",
      "& code": {
        fontFamily: "mono",
        bg: "transparent",
        p: "0",
      },
    },
    list: {
      paddingInlineStart: "600",
      "& > li + li": { marginTop: "200" },
      // Nested lists tighten up.
      "& :where(ul, ol)": { marginTop: "200" },
    },
    listItem: {
      // GFM task-list items render a leading checkbox inline.
      "& > input[type='checkbox']": {
        marginInlineEnd: "200",
        verticalAlign: "middle",
      },
    },
    blockquote: {
      borderInlineStartWidth: "2px",
      borderInlineStartStyle: "solid",
      borderColor: "neutral.6",
      paddingInlineStart: "400",
      color: "neutral.11",
      fontStyle: "italic",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      fontSize: "350",
      lineHeight: "500",
      "& :where(th, td)": {
        borderWidth: "1px",
        borderStyle: "solid",
        borderColor: "neutral.6",
        px: "300",
        py: "200",
        textAlign: "start",
      },
    },
    tableHeaderCell: {
      fontWeight: "700",
      bg: "neutral.2",
    },
    tableCell: {},
    image: {
      maxWidth: "100%",
      height: "auto",
      borderRadius: "200",
    },
    separator: {
      borderColor: "neutral.6",
    },
  },
});
