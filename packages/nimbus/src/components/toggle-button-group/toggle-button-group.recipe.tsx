import { defineSlotRecipe } from "@chakra-ui/react/styled-system";
import { buttonRecipe } from "../button/button.recipe";

/**
 * Recipe configuration for the ToggleButtonGroup component.
 * Defines the styling variants and base styles using Chakra UI's recipe system.
 */

// FEC-1170: the active (selected) fill — the active-fill logic is kept in sync
// with toggle-button.recipe.ts. Resting is always neutral; the chosen
// `colorPalette` applies only to the selected state. `activeFillStyle` sets how
// heavy the active fill is (light `tint` vs full `solid`); selection always
// changes the fill (not hue alone), so it is never signalled by color alone
// (WCAG 1.4.1). The border is NOT set here: border presence is owned by the
// `variant` (resting chrome), so only `outline` recolors its border on
// selection (see `compoundVariants`); `subtle` must not grow a border when
// selected.
const activeFill = {
  tint: {
    bg: "colorPalette.3",
    color: "colorPalette.11",
    _hover: {
      bg: "colorPalette.4",
    },
  },
  solid: {
    bg: "colorPalette.9",
    color: "colorPalette.contrast",
    _hover: {
      bg: "colorPalette.10",
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
    //
    // NOTE: unlike the standalone ToggleButton, the group intentionally omits
    // `ghost`. A group's job is to present mutually-related options as one
    // control, and its segmenting chrome (shared borders) is what binds them;
    // `ghost` (no border, no fill) leaves nothing to bind at rest, so it reads
    // as a loose row rather than a control. For a quiet grouped control use
    // `subtle` (a filled track that still binds the set).
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
    activeFillStyle: {
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

  // Border presence is owned by `variant`: only `outline` has a resting border,
  // so only `outline` recolors it on selection. `subtle` keeps the Button
  // base's transparent 1px border, so selecting it never adds a ring.
  //
  // Segments collapse their right border (`borderRightWidth: 0`), so a selected
  // button's right divider is physically drawn by the NEXT button's left
  // border. We recolor that sibling's left border too — otherwise the selection
  // outline is accent on three sides and neutral on the right. (When the
  // selected button is last, it keeps its own right border, and there is no
  // sibling to recolor.)
  compoundVariants: [
    {
      variant: "outline",
      activeFillStyle: "tint",
      css: {
        button: {
          "&[data-selected=true]": {
            borderColor: "colorPalette.8",
            // Hold the accent border on hover. The `variant.outline` hover sets
            // a neutral border; without this the selected button would revert to
            // gray on hover (this selector is more specific, so it wins).
            _hover: {
              borderColor: "colorPalette.8",
            },
          },
          "&[data-selected=true] + button": {
            borderLeftColor: "colorPalette.8",
          },
        },
      },
    },
    {
      variant: "outline",
      activeFillStyle: "solid",
      css: {
        button: {
          "&[data-selected=true]": {
            borderColor: "colorPalette.9",
            _hover: {
              borderColor: "colorPalette.10",
            },
          },
          "&[data-selected=true] + button": {
            borderLeftColor: "colorPalette.9",
          },
        },
      },
    },
  ],

  defaultVariants: {
    size: "md",
    variant: "outline",
    // Fallback; the Root wrapper resolves this from selectionMode.
    activeFillStyle: "solid",
  },
});
