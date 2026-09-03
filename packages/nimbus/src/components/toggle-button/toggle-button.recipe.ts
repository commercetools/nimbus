import { buttonRecipe } from "@/components/button/button.recipe";
import { defineRecipe } from "@chakra-ui/react/styled-system";

// FEC-1170: the active (selected) fill. Resting is always neutral; the chosen
// `colorPalette` applies only to the selected state. `activeFillStyle` sets how
// heavy that active fill is — a light `tint` or a full `solid`. Selection always
// changes the *fill* (not hue alone), so it is never signalled by color alone
// (WCAG 1.4.1). The border is deliberately NOT set here: border presence is
// owned by the `variant` (resting chrome), so only `outline` — the one variant
// with a resting border — recolors it on selection (see `compoundVariants`);
// `ghost`/`subtle` must not grow a border when selected. The active-fill logic
// is kept in sync with toggle-button-group.recipe.tsx; the group intentionally
// omits the `ghost` variant (a group needs a resting binding affordance).
const activeFill = {
  tint: {
    bg: "colorPalette.5",
    // Step 12 (not 11) for AA: on the deepened .5/.6 fill, step 11 text drops
    // below 4.5:1 for the neutral and critical palettes in light mode; step 12
    // clears it on every palette/theme (worst case 7.48:1).
    color: "colorPalette.12",
    "&[data-hovered='true']": {
      bg: "colorPalette.6",
    },
  },
  solid: {
    bg: "colorPalette.9",
    color: "colorPalette.contrast",
    "&[data-hovered='true']": {
      bg: "colorPalette.10",
    },
  },
};

export const toggleButtonRecipe = defineRecipe({
  className: "nimbus-toggle-button",
  base: {
    ...buttonRecipe.base,
    colorPalette: "primary",
  },
  variants: {
    size: {
      ...buttonRecipe.variants?.size,
    },
    // Resting chrome — always neutral. `colorPalette` is reserved for the
    // active state, so unselected buttons never carry the accent hue.
    variant: {
      outline: {
        borderColor: "neutral.7",
        color: "neutral.11",
        // Off-state hover matches Button's outline hover step (bg .3, border
        // .8); the palette stays neutral (resting chrome never carries the
        // accent — that's reserved for the selected state).
        "&[data-hovered='true']": {
          bg: "neutral.3",
          borderColor: "neutral.8",
        },
      },
      ghost: {
        color: "neutral.11",
        "&[data-hovered='true']": {
          bg: "neutral.3",
        },
      },
      subtle: {
        bg: "neutral.3",
        color: "neutral.11",
        "&[data-hovered='true']": {
          bg: "neutral.4",
        },
      },
    },
    // Active-state fill weight (applies to the selected state only). Border
    // width is constant (1px from the Button base), so the color change causes
    // no layout shift between states.
    activeFillStyle: {
      tint: {
        "&[data-selected='true']": activeFill.tint,
      },
      solid: {
        "&[data-selected='true']": activeFill.solid,
      },
    },
  },
  // Border presence is owned by `variant`: only `outline` has a resting border,
  // so only `outline` recolors it on selection. `ghost`/`subtle` keep the
  // Button base's transparent 1px border, so selecting them never adds a ring.
  compoundVariants: [
    {
      variant: "outline",
      activeFillStyle: "tint",
      css: {
        "&[data-selected='true']": {
          borderColor: "colorPalette.8",
          // Hold the accent border on hover. The `variant.outline` hover sets a
          // neutral border; without this the selected button would revert to
          // gray on hover (this selector is more specific, so it wins).
          "&[data-hovered='true']": {
            borderColor: "colorPalette.8",
          },
        },
      },
    },
    {
      variant: "outline",
      activeFillStyle: "solid",
      css: {
        "&[data-selected='true']": {
          borderColor: "colorPalette.9",
          "&[data-hovered='true']": {
            borderColor: "colorPalette.10",
          },
        },
      },
    },
  ],
  defaultVariants: {
    size: "md",
    variant: "outline",
    // Standalone toggles are independent binaries → quiet by default.
    activeFillStyle: "tint",
  },
});
