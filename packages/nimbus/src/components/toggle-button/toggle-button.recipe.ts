import { buttonRecipe } from "@/components/button/button.recipe";
import { defineRecipe } from "@chakra-ui/react/styled-system";

// FEC-1170: the active (selected) fill. Resting is always neutral; the chosen
// `colorPalette` applies only to the selected state. `fillStyle` sets how heavy
// that active fill is — a light `tint` or a full `solid`. Both change the
// *fill* and carry a colored border, so selection is never signalled by hue
// alone (WCAG 1.4.1). Kept in sync with toggle-button-group.recipe.tsx.
const activeFill = {
  tint: {
    bg: "colorPalette.3",
    color: "colorPalette.11",
    borderColor: "colorPalette.8",
    "&[data-hovered='true']": {
      bg: "colorPalette.4",
    },
  },
  solid: {
    bg: "colorPalette.9",
    color: "colorPalette.contrast",
    borderColor: "colorPalette.9",
    "&[data-hovered='true']": {
      bg: "colorPalette.10",
      borderColor: "colorPalette.10",
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
        "&[data-hovered='true']": {
          bg: "neutral.2",
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
    fillStyle: {
      tint: {
        "&[data-selected='true']": activeFill.tint,
      },
      solid: {
        "&[data-selected='true']": activeFill.solid,
      },
    },
  },
  defaultVariants: {
    size: "md",
    variant: "outline",
    // Standalone toggles are independent binaries → quiet by default.
    fillStyle: "tint",
  },
});
