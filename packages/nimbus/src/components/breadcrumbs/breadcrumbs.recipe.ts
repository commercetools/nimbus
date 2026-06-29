import { defineSlotRecipe } from "@chakra-ui/react/styled-system";

/**
 * Recipe configuration for the Breadcrumbs component.
 * Defines the styling variants and base styles using Chakra UI's recipe system.
 *
 * Renders navigation semantics (`<nav>` landmark + ordered list of `<a>`
 * elements) for the path to the current page. The last item represents the
 * current page and is rendered as non-interactive text with
 * `aria-current="page"`.
 */
export const breadcrumbsSlotRecipe = defineSlotRecipe({
  slots: ["root", "list", "item", "link", "separator"],

  className: "nimbus-breadcrumbs",

  base: {
    root: {
      display: "block",
      width: "100%",
    },
    list: {
      display: "flex",
      flexDirection: "row",
      flexWrap: "wrap",
      alignItems: "center",
      listStyle: "none",
      margin: "0",
      padding: "0",
      gap: "var(--breadcrumbs-gap)",
    },
    item: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      gap: "var(--breadcrumbs-gap)",
      fontSize: "var(--breadcrumbs-font-size)",
    },
    link: {
      display: "inline-flex",
      alignItems: "center",
      gap: "200",
      color: "neutral.11",
      textDecoration: "none",
      cursor: "pointer",
      borderRadius: "200",
      transition: "color 150ms ease",
      focusVisibleRing: "outside",
      _hover: {
        color: "primary.11",
        textDecoration: "underline",
      },
      // React Aria sets data-current on the current (last) breadcrumb's link.
      "&[data-current]": {
        color: "neutral.12",
        fontWeight: "500",
        textDecoration: "none",
        cursor: "default",
        pointerEvents: "none",
      },
      _disabled: {
        layerStyle: "disabled",
      },
    },
    separator: {
      display: "inline-flex",
      alignItems: "center",
      color: "neutral.9",
      userSelect: "none",
      // The first breadcrumb has no preceding separator.
      "li:first-of-type > &": {
        display: "none",
      },
    },
  },

  variants: {
    size: {
      sm: {
        item: {
          "--breadcrumbs-font-size": "fontSizes.300",
          "--breadcrumbs-gap": "{spacing.100}",
        },
        list: {
          "--breadcrumbs-gap": "{spacing.100}",
        },
      },
      md: {
        item: {
          "--breadcrumbs-font-size": "fontSizes.350",
          "--breadcrumbs-gap": "{spacing.200}",
        },
        list: {
          "--breadcrumbs-gap": "{spacing.200}",
        },
      },
    },
  },

  defaultVariants: {
    size: "md",
  },
});
