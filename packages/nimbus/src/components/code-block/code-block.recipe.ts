import { defineSlotRecipe } from "@chakra-ui/react/styled-system";

/**
 * Extends the pointer target of a nested button to at least 44×44px without
 * changing its visible size (project rule for touch targets).
 */
const extendedHitArea = {
  "& > button::before": {
    content: '""',
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "100%",
    height: "100%",
    minWidth: "1100",
    minHeight: "1100",
  },
};

/**
 * Recipe configuration for the CodeBlock component.
 * Defines the styling variants and base styles using Chakra UI's recipe system.
 *
 * Token-driven theming: every syntax-token color is a namespaced CSS custom
 * property (`--code-token-*`) declared on the root slot. `CodeBlock.Content`
 * renders each token as a `span` with the classes `token <type>…` (Prism
 * token types), and the `code` slot maps those classes to the variables.
 * Switching color mode changes only the resolved token values — never the
 * component structure or logic.
 *
 * @see {@link https://nimbus-documentation.vercel.app/components/data-display/code-block}
 */
export const codeBlockSlotRecipe = defineSlotRecipe({
  slots: [
    "root",
    "header",
    "title",
    "languageLabel",
    "actions",
    "trigger",
    "content",
    "pre",
    "code",
    "line",
    "lineNumber",
    "marker",
    "prompt",
    "lineContent",
    "expandTrigger",
    "footer",
  ],

  className: "nimbus-code-block",

  base: {
    root: {
      colorPalette: "neutral",
      display: "flex",
      flexDirection: "column",
      borderRadius: "300",
      border: "solid-25",
      borderColor: "neutral.6",
      backgroundColor: "neutral.2",
      width: "fit-content",
      maxWidth: "100%",
      // ---------------------------------------------------------------
      // Syntax token CSS custom properties. The palette tokens carry their
      // own light and dark values, so no `_dark` block is needed.
      // ---------------------------------------------------------------
      // All shade-11 (or shade-12 for plain) to meet the APCA 60Lc threshold
      // on the neutral.2 light background. Comments use neutral.11 rather than
      // neutral.10 (which resolves to ~#bababa, failing at 34Lc).
      "--code-token-plain": "colors.neutral.12",
      "--code-token-keyword": "colors.purple.11",
      "--code-token-string": "colors.green.11",
      "--code-token-comment": "colors.neutral.11",
      "--code-token-number": "colors.orange.11",
      "--code-token-function": "colors.blue.11",
      "--code-token-tag": "colors.red.11",
      "--code-token-attr": "colors.cyan.11",
      "--code-token-punctuation": "colors.neutral.11",
      "--code-token-operator": "colors.teal.11",
      "--code-token-inserted": "colors.green.11",
      "--code-token-deleted": "colors.red.11",
    },
    header: {
      display: "flex",
      alignItems: "center",
      gap: "200",
      minWidth: 0,
      borderBottom: "solid-25",
      borderColor: "neutral.6",
      paddingX: "400",
      paddingY: "200",
    },
    title: {
      minWidth: 0,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      fontWeight: "500",
      color: "neutral.12",
    },
    languageLabel: {
      fontFamily: "mono",
      color: "neutral.11",
    },
    actions: {
      display: "flex",
      alignItems: "center",
      flexShrink: 0,
      marginInlineStart: "auto",
      // Inside `CodeBlock.Content` the actions form a column next to the
      // scroll area, so they never cover the code.
      "&[data-placement='content']": {
        alignSelf: "flex-start",
        paddingTop: "200",
        paddingInlineEnd: "200",
      },
    },
    trigger: {
      // Keeps triggers neutral inside components that set another palette
      // (Tabs sets primary for its subtree).
      colorPalette: "neutral",
      display: "inline-flex",
      ...extendedHitArea,
    },
    content: {
      display: "flex",
      alignItems: "flex-start",
      minWidth: 0,
    },
    pre: {
      // Scrollable code container; tabIndex is set in the component.
      flex: 1,
      minWidth: 0,
      overflow: "auto",
      margin: 0,
      backgroundColor: "transparent",
      fontFamily: "mono",
      _focusVisible: {
        focusRing: "inside",
      },
    },
    code: {
      // A one-column grid as wide as its widest line (and at least as wide as
      // the scroll area): every line stretches to that width, so line
      // backgrounds continue behind horizontally scrolled text.
      display: "grid",
      width: "max-content",
      minWidth: "100%",
      backgroundColor: "transparent",
      fontFamily: "mono",
      color: "var(--code-token-plain)",
      // The "\n" text nodes between lines keep `textContent` equal to the
      // code; `normal` collapses them so they add no empty rows.
      whiteSpace: "normal",
      "&[data-wrap]": {
        width: "100%",
        gridTemplateColumns: "minmax(0, 1fr)",
      },
      // Later rules win, so container types (tag, attr-value, string) come
      // before the types that occur inside them (punctuation, keyword, …).
      "& .token.tag, & .token.selector, & .token.property": {
        color: "var(--code-token-tag)",
      },
      "& .token.attr-value": {
        color: "var(--code-token-attr)",
      },
      "& .token.string, & .token.char": {
        color: "var(--code-token-string)",
      },
      "& .token.keyword, & .token.atrule, & .token.attr-name": {
        color: "var(--code-token-keyword)",
      },
      "& .token.function, & .token.class-name": {
        color: "var(--code-token-function)",
      },
      "& .token.number, & .token.boolean, & .token.constant, & .token.symbol, & .token.entity, & .token.url, & .token.variable":
        {
          color: "var(--code-token-number)",
        },
      "& .token.operator, & .token.regex, & .token.important": {
        color: "var(--code-token-operator)",
      },
      "& .token.punctuation": {
        color: "var(--code-token-punctuation)",
      },
      "& .token.comment, & .token.prolog, & .token.doctype, & .token.cdata": {
        color: "var(--code-token-comment)",
        fontStyle: "italic",
      },
      "& .token.inserted": {
        color: "var(--code-token-inserted)",
      },
      "& .token.deleted": {
        color: "var(--code-token-deleted)",
      },
      "& .token.important, & .token.bold": {
        fontWeight: "700",
      },
      "& .token.italic": {
        fontStyle: "italic",
      },
      // Word highlights: amber.4 / amber.1 keep token colors at or above 60Lc
      // APCA; the underline marks them also on a highlighted line, whose band
      // has a similar color.
      "& mark": {
        color: "inherit",
        backgroundColor: "amber.4",
        borderBottom: "solid-50",
        borderColor: "amber.9",
        _dark: {
          backgroundColor: "amber.1",
        },
      },
    },
    line: {
      display: "flex",
      // A blank line has no text and no line box; keep one line of height.
      minHeight: "1lh",
      // A transparent start border on every line keeps all lines aligned;
      // highlighted lines color it (a cue that does not rely on background
      // color alone, WCAG 1.4.1).
      borderInlineStart: "solid-50",
      borderInlineStartColor: "transparent",
      // Band shades keep every shade-11 token color at or above 60Lc APCA:
      // shade 3 in light mode (61.4–64.6Lc) and shade 1 in dark mode
      // (60.6–60.7Lc). In dark mode, shade 3 drops to 57.4Lc and shade 2 to
      // 59.96Lc (blue.11, the function color, is the limiting token).
      "&[data-mark='highlighted']": {
        backgroundColor: "amber.3",
        borderInlineStartColor: "amber.11",
        _dark: {
          backgroundColor: "amber.1",
        },
      },
      "&[data-mark='added']": {
        backgroundColor: "green.3",
        _dark: {
          backgroundColor: "green.1",
        },
      },
      "&[data-mark='removed']": {
        backgroundColor: "red.3",
        _dark: {
          backgroundColor: "red.1",
        },
      },
    },
    lineNumber: {
      // The gap after the number is a margin: with border-box sizing, padding
      // would count against the `ch`-based min-width set by Content.
      flexShrink: 0,
      // Non-selectable so line numbers are not copied with a manual selection
      userSelect: "none",
      textAlign: "end",
      color: "neutral.11",
    },
    marker: {
      flexShrink: 0,
      userSelect: "none",
      whiteSpace: "pre",
      paddingInlineEnd: "200",
      color: "neutral.11",
      "&[data-mark='added']": {
        color: "green.11",
      },
      "&[data-mark='removed']": {
        color: "red.11",
      },
    },
    prompt: {
      flexShrink: 0,
      userSelect: "none",
      whiteSpace: "pre",
      paddingInlineEnd: "200",
      color: "neutral.11",
    },
    lineContent: {
      whiteSpace: "pre",
      // Visually hidden start/end texts of marked runs live in the line;
      // keep them out of manual selections.
      "& [data-line-announcement]": {
        userSelect: "none",
      },
      "&[data-wrap]": {
        flex: 1,
        minWidth: 0,
        whiteSpace: "pre-wrap",
        overflowWrap: "anywhere",
      },
    },
    expandTrigger: {
      colorPalette: "neutral",
      display: "flex",
      justifyContent: "center",
      paddingBottom: "200",
      ...extendedHitArea,
    },
    footer: {
      borderTop: "solid-25",
      borderColor: "neutral.6",
      paddingX: "400",
      paddingY: "200",
      color: "neutral.11",
    },
  },

  variants: {
    size: {
      sm: {
        title: {
          textStyle: "xs",
        },
        languageLabel: {
          textStyle: "xs",
        },
        // Keeps neighboring 44px hit areas of the 24px buttons from overlapping.
        actions: {
          gap: "500",
        },
        // IconButton's `xs` size is 32px; the compact sm code block scales
        // the nested button below that via a descendant override so it stays
        // proportional to the smaller chrome. The hit area stays 44px.
        trigger: {
          "& > button": {
            h: "600",
            minW: "600",
            "& svg": {
              width: "400",
              height: "400",
            },
          },
        },
        pre: {
          paddingY: "300",
          textStyle: "xs",
        },
        line: {
          paddingInline: "300",
        },
        lineNumber: {
          marginInlineEnd: "300",
        },
        footer: {
          textStyle: "xs",
        },
      },
      md: {
        title: {
          textStyle: "sm",
        },
        languageLabel: {
          textStyle: "sm",
        },
        // Keeps neighboring 44px hit areas of the 32px buttons from overlapping.
        actions: {
          gap: "300",
        },
        pre: {
          paddingY: "400",
          textStyle: "sm",
        },
        line: {
          paddingInline: "400",
        },
        lineNumber: {
          marginInlineEnd: "400",
        },
        footer: {
          textStyle: "sm",
        },
      },
    },
  },

  defaultVariants: {
    size: "md",
  },
});
