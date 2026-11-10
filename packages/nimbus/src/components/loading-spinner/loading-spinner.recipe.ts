import { defineRecipe } from "@chakra-ui/react/styled-system";

/**
 * Doubling the selector (`&&`) makes the spinner's own `size` win over rules
 * that size every svg inside a parent, such as the icon size of a `Button`.
 */
const sizeStyles = (token: "350" | "500" | "600" | "800" | "1000") => ({
  "&&": { width: token, height: token },
});

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
    size: {
      "2xs": sizeStyles("350"),
      xs: sizeStyles("500"),
      sm: sizeStyles("600"),
      md: sizeStyles("800"),
      lg: sizeStyles("1000"),
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

  defaultVariants: {
    size: "sm",
  },
});
