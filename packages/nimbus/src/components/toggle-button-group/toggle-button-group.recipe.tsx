import { defineSlotRecipe } from "@chakra-ui/react/styled-system";
import { buttonRecipe } from "../button/button.recipe";

/**
 * Recipe configuration for the ToggleButtonGroup component.
 * Defines the styling variants and base styles using Chakra UI's recipe system.
 */

// FEC-1170: the selected (ON) state every variant escalates to — the most
// prominent color on the scale (solid colorPalette.9 with contrast text).
// "Solid" is deliberately modelled as a universal *state* rather than a
// variant: a toggle's job is to make the current selection obvious, and the
// boldest fill is what does that, regardless of the resting chrome.
const selectedOn = {
  bg: "colorPalette.9",
  color: "colorPalette.contrast",
  borderColor: "colorPalette.9",
  _hover: {
    bg: "colorPalette.10",
    borderColor: "colorPalette.10",
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
      // borderWidth stays at the Button base (1px, transparent); the resting
      // variants only recolor the border, so this right-edge collapse survives
      // regardless of which variant is active.
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
    // FEC-1170: toggle variants describe the resting *chrome* of the control
    // (how much container each option carries) — not Button's emphasis levels.
    // Every variant escalates to `selectedOn` (solid .9) when selected.
    // Button's `solid` and `link` are intentionally excluded: `solid` is the
    // selected state above, and a "link" has no coherent toggled affordance.
    variant: {
      outline: {
        button: {
          borderColor: "colorPalette.7",
          color: "colorPalette.11",
          _hover: {
            bg: "colorPalette.3",
            borderColor: "colorPalette.8",
          },
          "&[data-selected=true]": selectedOn,
        },
      },
      ghost: {
        button: {
          color: "colorPalette.11",
          _hover: {
            bg: "colorPalette.4",
          },
          "&[data-selected=true]": selectedOn,
        },
      },
      subtle: {
        button: {
          bg: "colorPalette.3",
          color: "colorPalette.11",
          _hover: {
            bg: "colorPalette.4",
          },
          "&[data-selected=true]": selectedOn,
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
    // Preserves the current look: outline at rest, solid .9 when selected.
    variant: "outline",
  },
});
