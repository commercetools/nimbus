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
    "& svg [data-svg-path='spinner-pointer']": {
      stroke: "colorPalette.10",
      animationName: "spin",
      animationDuration: "0.5s",
      animationTimingFunction: "linear",
      animationIterationCount: "infinite",
      transformOrigin: "center center 0",
    },
    "& svg [data-svg-path='spinner-circle']": {
      stroke: "colorPalette.5",
    },
  },

  variants: {
    size: {
      "2xs": {
        width: "350",
        height: "350",
      },
      xs: {
        width: "500",
        height: "500",
      },
      sm: {
        width: "600",
        height: "600",
      },
      md: {
        width: "800",
        height: "800",
      },
      lg: {
        width: "1000",
        height: "1000",
      },
    },

    tone: {
      primary: {
        colorPalette: "ctvioletAlpha",
      },
      white: {
        colorPalette: "whiteAlpha",
      },
    },
  },
});
