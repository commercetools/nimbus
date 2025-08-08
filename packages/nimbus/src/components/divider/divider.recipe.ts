import { defineRecipe } from "@chakra-ui/react/styled-system";

/**
 * Recipe configuration for the Divider component.
 * Defines the styling variants and base styles using Chakra UI's recipe system.
 */
export const dividerRecipe = defineRecipe({
  className: "nimbus-divider",

  // Base styles applied to all instances of the component
  base: {
    border: "0",
    flexShrink: "0",
    colorPalette: "neutral",
    backgroundColor: "colorPalette.6",
  },

  // Available variants for customizing the component's appearance
  variants: {
    orientation: {
      horizontal: {
        width: "100%",
        height: "25",
      },
      vertical: {
        width: "25",
        height: "100%",
      },
    },
  },

  // Default variant values when not explicitly specified
  defaultVariants: {
    orientation: "horizontal",
  },
});
