import { defineSlotRecipe } from "@chakra-ui/react";

/**
 * Recipe configuration for the Alert component.
 * Defines the styling variants and base styles using Chakra UI's recipe system.
 */
export const alertRecipe = defineSlotRecipe({
  slots: ["root", "title", "description", "icon", "actions", "dismiss"],
  // Unique class name prefix for the component
  className: "bleh-ui-alert",

  // Base styles applied to all instances of the component
  base: {
    root: {
      display: "inline-flex",
      flexDirection: "row",
      gap: "8px",
      width: "100%",
    },
    // TODO: figure out how to get this spacing to work
    icon: {
      "& svg": {
        width: "20px",
        height: "20px",
      },
    },
  },

  // Available variants for customizing the component's appearance
  variants: {
    borderStyle: {
      none: {},
      outlined: {
        root: {
          border: "solid-25",
          borderColor: "colorPalette.5",
          backgroundColor: "colorPalette.2",
          padding: "8px",
          borderRadius: "8px",
        },
      },
    },
    // Visual style variants
    variant: {
      solid: {}, // Filled background
      subtle: {}, // Lighter background
      outline: {}, // Bordered style
      ghost: {}, // Background only on interaction
      plain: {}, // No background or border
    },
  },

  // Default variant values when not explicitly specified
  defaultVariants: {
    variant: "subtle",
    borderStyle: "outlined",
  },
});
