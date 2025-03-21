import { defineRecipe } from "@chakra-ui/react";

/**
 * Recipe configuration for the Accordion component.
 * Defines the styling variants and base styles using Chakra UI's recipe system.
 */
export const accordionRecipe = defineRecipe({
  // Unique class name prefix for the component
  className: "bleh-ui-accordion",

  // Base styles applied to all instances of the component
  base: {
    display: "block",

    // Disclosure styles
    ".disclosure": {
      // Trigger button styles
      ".trigger": {
        background: "none",
        border: "none",
        boxShadow: "none",
        fontWeight: "600",
        fontSize: "16px",
        display: "flex",
        alignItems: "center",
        gap: "8px",

        // SVG icon styles
        "& svg": {
          rotate: "0deg",
          transition: "rotate 200ms",
          width: "12px",
          height: "12px",
          fill: "none",
          stroke: "currentColor",
          strokeWidth: "3px",
        },
        "&[aria-expanded='true'] svg": {
          rotate: "90deg",
        },
      },

      // Expanded state styles
      ["&[data-expanded]='true', &[slot='trigger'] svg]"]: {
        rotate: "90deg",
      },
      // Panel styles
      ".panel": {
        marginLeft: "12px",
      },
    },
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
