import { defineRecipe } from "@chakra-ui/react";

/**
 * Recipe configuration for the Tooltip component.
 * Defines the styling variants and base styles using Chakra UI's recipe system.
 */
export const tooltipRecipe = defineRecipe({
  // Unique class name prefix for the component
  className: "bleh-ui-tooltip",

  // Base styles applied to all instances of the component
  base: {
    display: "inline-flex",
    alignItems: "center",
    boxShadow: "1",
    borderRadius: "100",
    background: "slate.12",
    color: "white",
    paddingX: "300",
    paddingY: "100",
    margin: "100",
    maxW: "6400",
    /* fixes FF gap */
  },

  // Available variants for customizing the component's appearance
  variants: {
    // Size variants from smallest to largest
    size: {
      "2xs": {}, // Extra extra small
      xs: {}, // Extra small
      sm: {}, // Small
      md: {}, // Medium
      lg: {}, // Large
      xl: {}, // Extra large
      "2xl": {}, // Extra extra large
    },

    // Visual style variants
    variant: {
      solid: {}, // Filled background
      subtle: {}, // Lighter background
      outline: {}, // Bordered style
      ghost: {}, // Background only on interaction
      plain: {}, // No background or border
    },
  },

  // Default variant values when not explicitly specified
  defaultVariants: {
    size: "md",
    variant: "subtle",
  },
});
