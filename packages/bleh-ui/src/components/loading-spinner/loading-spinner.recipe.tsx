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
    "& svg [data-testid='spinner-pointer']": {
      animation: "spin 0.5s linear infinite",
      transformOrigin: "center center 0",
    },
  },

  variants: {
    size: {
      "2xs": {
        width: "{sizes.350}",
        height: "{sizes.350}",
      },
      xs: {
        width: "{sizes.500}",
        height: "{sizes.500}",
      },
      sm: {
        width: "{sizes.600}",
        height: "{sizes.600}",
      },
      md: {
        width: "{sizes.800}",
        height: "{sizes.800}",
      },
      lg: {
        width: "{sizes.1000}",
        height: "{sizes.1000}",
      },
    },

    tone: {
      primary: {
        colorPalette: "ctvioletAlpha",
        "& svg [data-testid='spinner-circle']": {
          stroke: "colorPalette.5",
        },
        "& svg [data-testid='spinner-pointer']": {
          stroke: "colorPalette.9",
        },
      },
      white: {
        colorPalette: "whiteAlpha",
        "& svg [data-testid='spinner-circle']": {
          stroke: "colorPalette.5",
        },
        "& svg [data-testid='spinner-pointer']": {
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
