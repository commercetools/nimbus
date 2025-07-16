import { defineRecipe } from "@chakra-ui/react";

/**
 * Recipe configuration for the Divider component.
 * Defines the styling variants and base styles using Chakra UI's recipe system.
 */
export const dividerRecipe = defineRecipe({
  className: "nimbus-divider",

  // Base styles applied to all instances of the component
  base: {
    border: "none",
    flexShrink: "0",
    color: "neutral",
    borderColor: "colorPalette.6",
  },

  // Available variants for customizing the component's appearance
  variants: {
    orientation: {
      horizontal: {
        width: "100%",
        height: "1px",
        borderTopWidth: "1px",
        borderTopStyle: "solid",
        borderLeftWidth: "0",
      },
      vertical: {
        height: "100%",
        width: "1px",
        borderLeftWidth: "1px",
        borderLeftStyle: "solid",
        borderTopWidth: "0",
      },
    },
  },

  // Default variant values when not explicitly specified
  defaultVariants: {
    orientation: "horizontal",
  },
});
