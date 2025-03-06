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
    focusVisibleRing: "outside",
    bg: "transparent",
    outline: "none",
    boxShadow: "inset 0 0 0 var(--border-width) var(--border-color)",
    _placeholder: {
      opacity: 0.5,
      color: "currentColor",
    },
    _disabled: {
      layerStyle: "disabled",
      bg: "transparent",
    },
    "&[data-invalid='true']": {
      color: "error.7",
      "--border-width": "sizes.50",
      "--border-color": "colors.error.7",
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
        _hover: {
          backgroundColor: "primary.2",
        },
        "--border-width": "sizes.50",
        "--border-color": "colors.neutral.7",
      },
      ghost: {
        _hover: {
          backgroundColor: "primary.2",
        },
      },
    },
  },

  defaultVariants: {
    size: "md",
    variant: "solid",
  },
});
