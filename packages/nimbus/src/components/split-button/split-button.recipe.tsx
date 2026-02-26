import { defineSlotRecipe } from "@chakra-ui/react/styled-system";

/**
 * Recipe configuration for the SplitButton component.
 * Defines the styling variants and base styles using Chakra UI's slot recipe system.
 */
export const splitButtonSlotRecipe = defineSlotRecipe({
  slots: ["root", "buttonGroup", "primaryButton", "dropdownTrigger"],
  // Unique class name prefix for the component
  className: "nimbus-split-button",

  // Base styles applied to all instances of the component
  base: {
    root: {
      display: "inline-block",
      position: "relative",
    },
    buttonGroup: {
      display: "inline-flex",
      alignItems: "stretch",
      position: "relative",
      borderRadius: "200",
    },
    primaryButton: {
      // Split button mode styles - connected to dropdown trigger
      "[data-mode='split'] &": {
        borderRightRadius: "0", // Left rounded corners only
        borderRightWidth: "0",
      },

      // Ensure focus ring is visible above dropdown trigger
      "&:focus-visible": {
        zIndex: 2,
      },
    },
    dropdownTrigger: {
      borderLeftWidth: "1px",
      borderLeftStyle: "solid",
      borderLeftRadius: "0",

      // Ensure focus ring is visible above primary button
      "&:focus-visible": {
        zIndex: 2,
      },
    },
  },

  variants: {
    variant: {
      solid: {
        dropdownTrigger: {
          borderLeftColor: "colorPalette.contrast", // White delimiter
        },
      },
      ghost: {
        dropdownTrigger: {
          borderLeftColor: "colorPalette.7", // Theme-aware border
        },
      },
      outline: {},
      subtle: {},
      link: {},
    },
  },
  defaultVariants: {
    variant: "solid", // Match component default
  },
});
