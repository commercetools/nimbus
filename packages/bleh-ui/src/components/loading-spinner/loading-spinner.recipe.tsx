import { defineRecipe } from "@chakra-ui/react";

/**
 * Recipe configuration for the LoadingSpinner component.
 * Defines the styling variants and base styles using Chakra UI's recipe system.
 */
export const loadingSpinnerRecipe = defineRecipe({
  className: "bleh-ui-loading-spinner",

  base: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    "& svg": {
      animation: "spin 0.5s linear infinite",
    },
  },

  variants: {
    size: {
      "2xs": {
        width: "{spacing.350}",
        height: "{spacing.350}",
        padding: "calc({spacing.350} / 12)",
      },
      xs: {
        width: "{spacing.500}",
        height: "{spacing.500}",
        padding: "calc({spacing.500} / 12)",
      },
      sm: {
        width: "{spacing.600}",
        height: "{spacing.600}",
        padding: "calc({spacing.600} / 12)",
      },
      md: {
        width: "{spacing.800}",
        height: "{spacing.800}",
        padding: "calc({spacing.800} / 12)",
      },
      lg: {
        width: "{spacing.1000}",
        height: "{spacing.1000}",
        padding: "calc({spacing.1000} / 12)",
      },
    },

    tone: {
      primary: {
        colorPalette: "ctvioletAlpha",
        "& svg path:first-of-type": {
          stroke: "colorPalette.5",
        },
        "& svg path:last-of-type": {
          stroke: "colorPalette.9",
        },
      },
      white: {
        colorPalette: "whiteAlpha",
        "& svg path:first-of-type": {
          stroke: "colorPalette.5",
        },
        "& svg path:last-of-type": {
          stroke: "white",
        },
      },
    },
  },

  defaultVariants: {
    size: "sm",
    tone: "primary",
  },
});
