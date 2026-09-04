import { defineSlotRecipe } from "@chakra-ui/react/styled-system";

/**
 * Recipe configuration for the ToggleButtonGroup component.
 * Defines the styling variants and base styles using Chakra UI's recipe system.
 */

export const buttonGroupRecipe = defineSlotRecipe({
  slots: ["root", "button"],
  // Unique class name prefix for the component
  className: "nimbus-toggle-button-group",

  // Base styles applied to all instances of the component
  base: {
    root: {
      display: "inline-flex",
      // Child selector, not the `button` slot: out-specifies the toggle button's
      // own recipe, so segmentation wins without `!important`.
      "& > .nimbus-toggle-button-group__button": {
        borderRadius: "0",
        borderRightWidth: "0",
        "&:first-of-type": {
          borderLeftRadius: "200",
        },
        "&:last-of-type": {
          borderRightWidth: "1px",
          borderRightRadius: "200",
        },
      },
    },
  },

  variants: {
    variant: { outline: {}, subtle: {} },
    activeFillStyle: { tint: {}, solid: {} },
    size: { xs: {}, md: {} },
    colorPalette: { primary: {}, critical: {}, neutral: {} },
  },

  compoundVariants: [
    {
      variant: "outline",
      activeFillStyle: "tint",
      css: {
        button: {
          _selected: {
            "& + button": {
              borderLeftColor: "colorPalette.8",
            },
          },
        },
      },
    },
    {
      variant: "outline",
      activeFillStyle: "solid",
      css: {
        button: {
          _selected: {
            "& + button": {
              borderLeftColor: "colorPalette.9",
            },
          },
        },
      },
    },
  ],

  defaultVariants: {
    size: "md",
    variant: "outline",
    activeFillStyle: "solid",
  },
});
