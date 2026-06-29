import { defineSlotRecipe } from "@chakra-ui/react/styled-system";

/**
 * Recipe configuration for the Breadcrumbs component.
 * Defines the styling variants and base styles using Chakra UI's recipe system.
 */
export const breadcrumbsSlotRecipe = defineSlotRecipe({
  slots: ["root", "list", "item", "link", "separator"],
  // Unique class name prefix for the component
  className: "nimbus-breadcrumbs",

  // Base styles applied to all instances of the component
  base: {
    // `root` is the <nav> landmark wrapper.
    root: {
      display: "block",
      color: "neutral.11",
    },
    // `list` is the React Aria Breadcrumbs <ol>.
    list: {
      display: "flex",
      flexWrap: "wrap",
      alignItems: "center",
      listStyle: "none",
      margin: "0",
      padding: "0",
    },
    item: {
      display: "inline-flex",
      alignItems: "center",
    },
    link: {
      display: "inline-flex",
      alignItems: "center",
      color: "primary.11",
      borderRadius: "100",
      outline: "none",
      bg: "transparent",
      cursor: "pointer",
      textDecoration: "none",
      focusVisibleRing: "outside",
      _hover: {
        textDecoration: "underline",
        textUnderlineOffset: "3px",
      },
      // The current page item is rendered as a non-link span by React Aria
      // when no `href` is supplied. When a link is the current item React Aria
      // sets `data-current`; style it as static, emphasized text.
      "&[data-current]": {
        color: "neutral.12",
        fontWeight: "600",
        textDecoration: "none",
        cursor: "default",
        pointerEvents: "none",
      },
      "&[data-disabled]": {
        layerStyle: "disabled",
        cursor: "default",
        pointerEvents: "none",
      },
    },
    separator: {
      display: "inline-flex",
      alignItems: "center",
      color: "neutral.9",
      flexShrink: "0",
      // Hidden from assistive tech — the ordered-list structure already
      // communicates hierarchy.
      "& svg": {
        width: "var(--separator-size)",
        height: "var(--separator-size)",
      },
    },
  },

  // Available variants for customizing the component's appearance
  variants: {
    // Size variants from smallest to largest
    size: {
      sm: {
        list: { gap: "100" },
        item: { gap: "100" },
        link: {
          fontSize: "350",
          lineHeight: "500",
        },
        separator: {
          css: { "--separator-size": "sizes.400" },
        },
      },
      md: {
        list: { gap: "200" },
        item: { gap: "200" },
        link: {
          fontSize: "400",
          lineHeight: "600",
        },
        separator: {
          css: { "--separator-size": "sizes.500" },
        },
      },
    },
  },

  // Default variant values when not explicitly specified
  defaultVariants: {
    size: "md",
  },
});
