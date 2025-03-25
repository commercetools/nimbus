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
      // This proportionally scales the spinner to fit the container while also scaling padding
      transform: "scale(calc(1 - 2/12))",
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
      },
      xs: {
        width: "{spacing.500}",
        height: "{spacing.500}",
      },
      sm: {
        width: "{spacing.600}",
        height: "{spacing.600}",
      },
      md: {
        width: "{spacing.800}",
        height: "{spacing.800}",
      },
      lg: {
        width: "{spacing.1000}",
        height: "{spacing.1000}",
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
