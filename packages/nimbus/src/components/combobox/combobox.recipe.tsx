import { defineRecipe } from "@chakra-ui/react";

/**
 * Recipe configuration for the Combobox component.
 * Defines the styling variants and base styles using Chakra UI's recipe system.
 */
export const comboboxRecipe = defineRecipe({
  // Unique class name prefix for the component
  className: "nimbus-combobox",

  // Base styles applied to all instances of the component
  base: {
    display: "block",
  },

  // Available variants for customizing the component's appearance
  variants: {
    // Size variants from smallest to largest
    size: {
      "2xs": {},  // Extra extra small
      xs: {},     // Extra small
      sm: {},     // Small
      md: {},     // Medium
      lg: {},     // Large
      xl: {},     // Extra large
      "2xl": {},  // Extra extra large
    },

    // Visual style variants
    variant: {
      solid: {},   // Filled background
      subtle: {},  // Lighter background
      outline: {}, // Bordered style
      ghost: {},   // Background only on interaction
      plain: {},   // No background or border
    },
  },

  // Default variant values when not explicitly specified
  defaultVariants: {
    size: "md",
    variant: "subtle",
  },
});
