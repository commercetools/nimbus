import { defineSlotRecipe } from "@chakra-ui/react";
import { buttonRecipe } from "../button/button.recipe";

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
      // Base style is the same as our Button
      ...buttonRecipe.base,
      // Default style is outlined
      ...buttonRecipe.variants?.variant.outline,
      // Create overrides for custom ButtonGroup styles
      borderRadius: "0",
      borderRightWidth: "0",
      "&:first-of-type": {
        borderLeftRadius: "200",
      },
      "&:last-of-type": {
        borderRightWidth: "1px",
        borderRightRadius: "200",
      },
      // When selected, the button is styled like a solid button
      "&[data-selected=true]": buttonRecipe.variants?.variant.solid,
    },
  },

  variants: {
    size: {
      xs: {
        button: buttonRecipe.variants?.size.xs,
      },
      md: {
        button: buttonRecipe.variants?.size.md,
      },
    },

    tone: {
      primary: {
        button: { colorPalette: "primary" },
      },
      critical: {
        button: { colorPalette: "error" },
      },
      neutral: {
        button: { colorPalette: "neutral" },
      },
    },
  },
});
