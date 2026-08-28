import { defineSlotRecipe } from "@chakra-ui/react/styled-system";
import { buttonRecipe } from "../button/button.recipe";

/**
 * Recipe configuration for the ToggleButtonGroup component.
 * Defines the styling variants and base styles using Chakra UI's recipe system.
 */

// FEC-1170: the active (selected) fill — kept in sync with
// toggle-button.recipe.ts. Resting is always neutral; the chosen `colorPalette`
// applies only to the selected state. `fillStyle` sets how heavy the active
// fill is (light `tint` vs full `solid`); both change the fill and carry a
// colored border, so selection is never signalled by hue alone (WCAG 1.4.1).
const activeFill = {
  tint: {
    bg: "colorPalette.3",
    color: "colorPalette.11",
    borderColor: "colorPalette.8",
    _hover: {
      bg: "colorPalette.4",
    },
  },
  solid: {
    bg: "colorPalette.9",
    color: "colorPalette.contrast",
    borderColor: "colorPalette.9",
    _hover: {
      bg: "colorPalette.10",
      borderColor: "colorPalette.10",
    },
  },
};

export const buttonGroupRecipe = defineSlotRecipe({
  slots: ["root", "button"],
  // Unique class name prefix for the component
  className: "nimbus-toggle-button-group",

  // Base styles applied to all instances of the component
  base: {
    root: {
      display: "inline-flex",
    },
    button: {
      // Base style is the same as our Button
      ...buttonRecipe.base,
      // Structural overrides so the buttons read as one segmented control.
      // borderWidth stays 1px (transparent) from the Button base; variants only
      // recolor the border, so state changes never shift layout.
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

  variants: {
    // FEC-1170: resting chrome — always neutral. `colorPalette` is reserved for
    // the active state, so unselected options never carry the accent hue.
    variant: {
      outline: {
        button: {
          borderColor: "neutral.7",
          color: "neutral.11",
          _hover: {
            bg: "neutral.2",
            borderColor: "neutral.8",
          },
        },
      },
      ghost: {
        button: {
          color: "neutral.11",
          _hover: {
            bg: "neutral.3",
          },
        },
      },
      subtle: {
        button: {
          bg: "neutral.3",
          color: "neutral.11",
          _hover: {
            bg: "neutral.4",
          },
        },
      },
    },

    // FEC-1170: active-state fill weight. Default is resolved from
    // `selectionMode` in the Root wrapper (single → solid, multiple → tint).
    fillStyle: {
      tint: {
        button: {
          "&[data-selected=true]": activeFill.tint,
        },
      },
      solid: {
        button: {
          "&[data-selected=true]": activeFill.solid,
        },
      },
    },

    size: {
      xs: {
        button: buttonRecipe.variants?.size.xs,
      },
      md: {
        button: buttonRecipe.variants?.size.md,
      },
    },

    colorPalette: {
      primary: {
        button: { colorPalette: "primary" },
      },
      critical: {
        button: { colorPalette: "critical" },
      },
      neutral: {
        button: { colorPalette: "neutral" },
      },
    },
  },

  defaultVariants: {
    size: "md",
    variant: "outline",
    // Fallback; the Root wrapper resolves this from selectionMode.
    fillStyle: "solid",
  },
});
