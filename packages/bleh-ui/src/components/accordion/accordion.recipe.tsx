import { defineSlotRecipe } from "@chakra-ui/react";

/**
 * Recipe configuration for the Accordion component.
 * Defines the styling variants and base styles using Chakra UI's recipe system.
 */
export const accordionSlotRecipe = defineSlotRecipe({
  slots: ["root", "disclosure", "trigger", "panel"],
  // Unique class name prefix for the component
  className: "bleh-ui-accordion",

  base: {
    root: {
      width: "100%",
    },
    disclosure: {
      width: "100%",
    },
    trigger: {
      background: "none",
      border: "none",
      boxShadow: "none",
      fontWeight: "bold",
      fontSize: "16px",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      color: "var(--text-color)",
      width: "100%",

      "& svg": {
        rotate: "0deg",
        transition: "rotate 200ms",
        width: "12px",
        height: "12px",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "3px",
      },
      '&[aria-expanded="true"] svg': {
        rotate: "90deg",
      },
      "&:disabled": {
        color: "var(--gray-300)",
      },
    },
    panel: {
      marginLeft: "20px",
    },
  },

  variants: {
    size: {
      "2xs": {},
      xs: {},
      sm: {},
      md: {},
      lg: {},
      xl: {},
      "2xl": {},
    },

    variant: {
      solid: {},
      subtle: {},
      outline: {},
      ghost: {},
      plain: {},
    },
  },

  // Default variant values when not explicitly specified
  defaultVariants: {},
});
