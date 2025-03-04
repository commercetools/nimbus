import { defineRecipe } from "@chakra-ui/react";

/**
 * Recipe configuration for the TextInput component.
 * Defines the styling variants and base styles using Chakra UI's recipe system.
 */
export const textInputRecipe = defineRecipe({
  // Unique class name prefix for the component
  className: "bleh-ui-text-input",

  // Base styles applied to all instances of the component
  base: {
    display: "block",
    borderRadius: "200",
    colorPalette: "neutral",
    _disabled: {
      layerStyle: "disabled",
    },
    "&:hover": {
      backgroundColor: "primary.2",
    },
    "&[data-invalid='true']": {
      color: "error.7",
      border: "solid-50",
      "&::placeholder ": {
        color: "error.11",
      },
    },
  },

  variants: {
    size: {
      sm: {
        h: 800,
        textStyle: "sm",
        px: 300,
      },
      md: {
        h: 1000,
        textStyle: "sm",
        px: 400,
      },
    },

    variant: {
      solid: {
        border: "solid-25",
        borderColor: "colorPalette.7",
      },
      ghost: {},
    },
  },

  defaultVariants: {
    size: "md",
    variant: "solid",
  },
});
