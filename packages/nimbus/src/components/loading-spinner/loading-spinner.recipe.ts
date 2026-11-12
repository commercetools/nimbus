import { defineRecipe } from "@chakra-ui/react/styled-system";

/**
 * Recipe configuration for the LoadingSpinner component.
 * Defines the styling variants and base styles using Chakra UI's recipe system.
 */
export const loadingSpinnerRecipe = defineRecipe({
  className: "nimbus-loading-spinner",

  base: {
    flexShrink: "0",
    "& [data-svg-path='spinner-pointer']": {
      stroke: "colorPalette.10",
      animationName: "spin",
      animationDuration: "0.5s",
      animationTimingFunction: "linear",
      animationIterationCount: "infinite",
      transformOrigin: "center center 0",
    },
    "& [data-svg-path='spinner-circle']": {
      stroke: "colorPalette.5",
    },
  },

  variants: {
    // There is no default `size`: like an icon, a spinner without `size` takes
    // the size of its parent (for example a `Button`). The component sets the
    // fallback size of 24px as an attribute, which any CSS rule overrides.
    size: {
      "2xs": { width: "350", height: "350" },
      xs: { width: "500", height: "500" },
      sm: { width: "600", height: "600" },
      md: { width: "800", height: "800" },
      lg: { width: "1000", height: "1000" },
    },

    colorPalette: {
      primary: {
        colorPalette: "ctvioletAlpha",
      },
      white: {
        colorPalette: "whiteAlpha",
      },
    },
  },
});
