import { defineRecipe } from "@chakra-ui/react";

/**
 * Recipe configuration for the Card component.
 * Defines the styling variants and base styles using Chakra UI's recipe system.
 */
export const cardRecipe = defineRecipe({
  className: "bleh-ui-card",

  base: {
    colorPalette: "slate",
    display: "inline-flex",
    alignItems: "flex-start",
    padding: "400",
    borderRadius: "300",
  },

  variants: {
    borderStyle: {
      none: {},
      outlined: {
        border: "solid-25",
        borderColor: "colorPalette.3",
      },
    },
    elevation: {
      none: {},
      elevated: {
        shadow: "1",
      },
    },
    backgroundStyle: {
      default: {
        backgroundColor: "colorPalette.contrast",
      },
      muted: {
        backgroundColor: "colorPalette.2",
      },
    },
  },

  defaultVariants: {
    backgroundStyle: "default",
    borderStyle: "none",
    elevation: "none",
  },
});
