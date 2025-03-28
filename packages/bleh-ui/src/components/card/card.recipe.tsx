import { defineSlotRecipe } from "@chakra-ui/react";

/**
 * Recipe configuration for the Card component.
 * Defines the styling variants and base styles using Chakra UI's recipe system.
 */
// TODO: make slots and do the compound component thing
export const cardRecipe = defineSlotRecipe({
  slots: ["root", "header", "content"],

  className: "bleh-ui-card",

  base: {
    root: {
      colorPalette: "slate",
      display: "inline-flex",
      alignItems: "flex-start",
      padding: "400",
      borderRadius: "300",
    },
  },

  variants: {
    borderStyle: {
      none: {},
      outlined: {
        root: {
          border: "solid-25",
          borderColor: "colorPalette.3",
        },
      },
    },
    elevation: {
      none: {},
      elevated: {
        root: {
          shadow: "1",
        },
      },
    },
    backgroundStyle: {
      default: {
        root: {
          backgroundColor: "colorPalette.contrast",
        },
      },
      muted: {
        root: {
          backgroundColor: "colorPalette.2",
        },
      },
    },
  },

  defaultVariants: {
    backgroundStyle: "default",
    borderStyle: "none",
    elevation: "none",
  },
});
