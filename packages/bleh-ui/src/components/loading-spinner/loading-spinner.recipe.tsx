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
      overflow: "visible",
    },
    "& svg path:last-of-type": {
      animation: "spin 0.5s linear infinite",
      transformOrigin: "{spacing.300} {spacing.300} 0",
    },
  },

  variants: {
    size: {
      "2xs": {
        width: "{spacing.350}",
        height: "{spacing.350}",
        padding: "calc({spacing.350} / 12)",
        "& svg": {
          width: "100%",
          height: "100%",
        },
      },
      xs: {
        width: "{spacing.500}",
        height: "{spacing.500}",
        padding: "calc({spacing.500} / 12)",
        "& svg": {
          width: "100%",
          height: "100%",
        },
      },
      sm: {
        width: "{spacing.600}",
        height: "{spacing.600}",
        padding: "calc({spacing.600} / 12)",
        "& svg": {
          width: "100%",
          height: "100%",
        },
      },
      md: {
        width: "{spacing.800}",
        height: "{spacing.800}",
        padding: "calc({spacing.800} / 12)",
        "& svg": {
          width: "100%",
          height: "100%",
        },
      },
      lg: {
        width: "{spacing.1000}",
        height: "{spacing.1000}",
        padding: "calc({spacing.1000} / 12)",
        "& svg": {
          width: "100%",
          height: "100%",
        },
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
