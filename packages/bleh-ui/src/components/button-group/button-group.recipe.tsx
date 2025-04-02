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
      display: "inline",
      "& button": {
        borderRadius: "0",
      },
      "& button:first-of-type": {
        borderLeftRadius: "200",
      },
      "& button:last-of-type": {
        borderRightRadius: "200",
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
    variant: {},
  },
});
