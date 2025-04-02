import { defineSlotRecipe } from "@chakra-ui/react";

/**
 * Recipe configuration for the ButtonGroup component.
 * Defines the styling variants and base styles using Chakra UI's recipe system.
 */
export const buttonGroupRecipe = defineSlotRecipe({
  slots: ["root", "button"],
  // Unique class name prefix for the component
  className: "nimbus-button-group",

  // Base styles applied to all instances of the component
  base: {
    root: {
      display: "inline-flex",
    },
    button: {
      colorPalette: "primary",
      borderRadius: "0",
      borderRightWidth: "0",
      "&:first-of-type": {
        borderLeftRadius: "200",
      },
      "&:last-of-type": {
        borderRightWidth: "1px",
        borderRightRadius: "200",
      },

      "&[data-selected=true]": {
        color: "colorPalette.contrast",
        bg: "colorPalette.9",
      },
    },
  },

  // Available variants for customizing the component's appearance
  variants: {
    // Size variants from smallest to largest
    size: {
      xs: {},
      md: {},
    },

    // Visual style variants
    variant: {
      outline: {},
    },
  },
});
