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
      boxShadow: "0 1px 0 0 {colors.neutral.6}",
    },
    item: {
      color: "neutral.12",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "200",
      fontWeight: "500",
      fontSize: "350",
      paddingTop: "200",
      paddingRight: "400",
      paddingBottom: "200",
      paddingLeft: "400",
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
      _focusVisible: {
        layerStyle: "focusRing",
      },
    },
  },

  variants: {
    variant: {
      tabs: {},
    },
  },

  defaultVariants: {
    variant: "tabs",
  },
});
