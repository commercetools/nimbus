import { defineSlotRecipe } from "@chakra-ui/react/styled-system";

/**
 * Recipe configuration for the Card component.
 * Defines the styling variants and base styles using Chakra UI's recipe system.
 */
export const cardRecipe = defineSlotRecipe({
  slots: ["root", "header", "content"],

  className: "nimbus-card",

  base: {
    root: {
      colorPalette: "slate",
      display: "inline-flex",
      alignItems: "flex-start",
      borderRadius: "300",
      focusVisibleRing: "outside",
    },
  },

  variants: {
    cardPadding: {
      sm: {
        root: {
          padding: "200",
        },
      },
      md: {
        root: {
          padding: "400",
        },
      },
      lg: {
        root: {
          padding: "600",
        },
      },
    },

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
    cardPadding: "md",
    borderStyle: "outlined",
    elevation: "none",
    backgroundStyle: "default",
  },
});
