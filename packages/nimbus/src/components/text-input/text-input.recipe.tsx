import { defineRecipe } from "@chakra-ui/react";

/**
 * Recipe configuration for the TextInput component.
 * Defines the styling variants and base styles using Chakra UI's recipe system.
 */
export const textInputRecipe = defineRecipe({
  // Unique class name prefix for the component
  className: "nimbus-text-input",

  // Base styles applied to all instances of the component
  base: {
    display: "block",
    borderRadius: "200",
    colorPalette: "neutral",
    width: "100%",
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
      bg: "neutral.3",
    },
    "&[data-invalid='true']": {
      "--border-color": "colors.critical.7",
      "--border-width": "sizes.50",
      color: "critical.11",
    },
    
    // Adjust padding when there are leading/trailing elements
    "&.has-leading-element": {
      pl: "1200",
      _rtl: {
        pl: "initial",
        pr: "1200",
      }
    },
    "&.has-trailing-element": {
      pr: "1200",
      _rtl: {
        pr: "initial",
        pl: "1200",
      }
    }
  },

  variants: {
    size: {
      sm: {
        h: 800,
        textStyle: "sm",
        px: 300,
        "--input-padding": "300",
        "&.has-leading-element": {
          pl: "1000", 
          _rtl: {
            pl: "300",
            pr: "1000",
          }
        },
        "&.has-trailing-element": {
          pr: "1000",
          _rtl: {
            pr: "300", 
            pl: "1000",
          }
        },
      },
      md: {
        h: 1000,
        textStyle: "md",
        px: 400,
        "--input-padding": "400",
        "&.has-leading-element": {
          pl: "1200",
          _rtl: {
            pl: "400",
            pr: "1200",
          }
        },
        "&.has-trailing-element": {
          pr: "1200",
          _rtl: {
            pr: "400",
            pl: "1200",
          }
        },
      },
    },

    variant: {
      solid: {
        "--border-width": "sizes.25",
        "--border-color": "colors.neutral.7",
        backgroundColor: "primary.1",
        _hover: {
          backgroundColor: "primary.2",
        },
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
