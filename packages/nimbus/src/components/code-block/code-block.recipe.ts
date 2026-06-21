import { defineSlotRecipe } from "@chakra-ui/react/styled-system";

/**
 * Recipe configuration for the CodeBlock component.
 * Defines the styling variants and base styles using Chakra UI's recipe system.
 *
 * Token-driven theming: every syntax-token color is a namespaced CSS custom
 * property (`--code-token-*`) declared on the root slot. A static PrismTheme
 * (in code-block.constants.ts) maps Prism token types to these variables via
 * `var(--code-token-*)`. Switching color mode changes only the resolved token
 * values — never the component structure or logic.
 *
 * @see {@link https://nimbus-documentation.vercel.app/components/data-display/code-block}
 */
export const codeBlockSlotRecipe = defineSlotRecipe({
  slots: [
    "root",
    "header",
    "languageLabel",
    "copyButton",
    "pre",
    "code",
    "line",
    "lineNumber",
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
      overflow: "hidden",
      width: "fit-content",
      maxWidth: "100%",
      // ---------------------------------------------------------------
      // Syntax token CSS custom properties (light-mode defaults).
      // Dark-mode overrides live in the _dark block below.
      // These are consumed by the static PrismTheme in constants.ts via
      // var(--code-token-*). Component logic never reads these values.
      // ---------------------------------------------------------------
      // All shade-11 (or shade-12 for plain/punctuation) to meet the APCA 60Lc
      // threshold on the neutral.2 light background. Comments use neutral.11
      // rather than neutral.10 (which resolves to ~#bababa, failing at 34Lc).
      // Dark mode uses neutral.10 for comments since dark surfaces have
      // higher contrast with lighter grays.
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
    },
    header: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "200",
      borderBottom: "solid-25",
      borderColor: "neutral.6",
      paddingX: "400",
      paddingY: "200",
    },
    languageLabel: {
      fontFamily: "mono",
      color: "neutral.11",
    },
    copyButton: {
      display: "flex",
      alignItems: "center",
      flexShrink: 0,
    },
    pre: {
      // Scrollable code container; tabIndex is set in the component.
      overflow: "auto",
      margin: 0,
      backgroundColor: "transparent",
      fontFamily: "mono",
    },
    code: {
      display: "block",
      backgroundColor: "transparent",
      fontFamily: "mono",
      // Ensure long lines don't wrap
      whiteSpace: "pre",
    },
    line: {
      display: "block",
    },
    lineNumber: {
      display: "inline-block",
      // Non-selectable so line numbers are not copied to clipboard
      userSelect: "none",
      textAlign: "right",
      color: "neutral.11",
      paddingRight: "400",
    },
  },

  variants: {
    size: {
      sm: {
        languageLabel: {
          textStyle: "xs",
        },
        pre: {
          paddingX: "300",
          paddingY: "300",
          textStyle: "xs",
        },
        lineNumber: {
          paddingRight: "300",
        },
      },
      md: {
        languageLabel: {
          textStyle: "sm",
        },
        pre: {
          paddingX: "400",
          paddingY: "400",
          textStyle: "sm",
        },
        lineNumber: {
          paddingRight: "400",
        },
      },
    },
  },

  defaultVariants: {
    size: "md",
  },
});
