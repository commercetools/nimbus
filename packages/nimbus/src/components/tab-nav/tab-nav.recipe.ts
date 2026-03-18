import { defineSlotRecipe } from "@chakra-ui/react/styled-system";

/**
 * Recipe configuration for the TabNav component.
 * Defines the styling variants and base styles using Chakra UI's recipe system.
 *
 * Renders navigation semantics (`<nav>` + `<a>`) with visual styling that
 * matches the Tabs `line` (horizontal underline) variant.
 */
export const tabNavSlotRecipe = defineSlotRecipe({
  slots: ["root", "item"],

  className: "nimbus-tab-nav",

  base: {
    root: {
      display: "flex",
      flexDirection: "row",
      width: "100%",
    },
    item: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "200",
      fontSize: "var(--tab-nav-font-size)",
      paddingTop: "var(--tab-nav-padding-top)",
      paddingRight: "var(--tab-nav-padding-right)",
      paddingBottom: "var(--tab-nav-padding-bottom)",
      paddingLeft: "var(--tab-nav-padding-left)",
    },
  },

  variants: {
    variant: {
      tabs: {
        root: {
          boxShadow: "0 1px 0 0 {colors.neutral.6}",
        },
        item: {
          color: "neutral.12",
          cursor: "pointer",
          fontWeight: "500",
          textDecoration: "none",
          transition: "all 150ms ease",
          boxShadow: "0 2px 0 0 transparent",
          _hover: {
            color: "primary.11",
          },
          '&[aria-current="page"]': {
            color: "primary.9",
            boxShadow: "0 2px 0 0 {colors.primary.9}",
          },
          _disabled: {
            layerStyle: "disabled",
          },
          _focusVisible: {
            layerStyle: "focusRing",
          },
        },
      },
    },
    size: {
      sm: {
        item: {
          "--tab-nav-font-size": "fontSizes.300",
          "--tab-nav-padding-top": "spacing.100",
          "--tab-nav-padding-right": "spacing.300",
          "--tab-nav-padding-bottom": "spacing.100",
          "--tab-nav-padding-left": "spacing.300",
        },
      },
      md: {
        item: {
          "--tab-nav-font-size": "fontSizes.350",
          "--tab-nav-padding-top": "spacing.200",
          "--tab-nav-padding-right": "spacing.400",
          "--tab-nav-padding-bottom": "spacing.200",
          "--tab-nav-padding-left": "spacing.400",
        },
      },
      lg: {
        item: {
          "--tab-nav-font-size": "fontSizes.400",
          "--tab-nav-padding-top": "spacing.300",
          "--tab-nav-padding-right": "spacing.600",
          "--tab-nav-padding-bottom": "spacing.300",
          "--tab-nav-padding-left": "spacing.600",
        },
      },
    },
  },

  defaultVariants: {
    variant: "tabs",
    size: "md",
  },
});
