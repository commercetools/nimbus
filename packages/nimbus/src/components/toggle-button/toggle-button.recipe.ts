import { buttonRecipe } from "@/components/button/button.recipe";
import { defineRecipe } from "@chakra-ui/react/styled-system";

// FEC-1170: the selected (ON) state every variant escalates to — the most
// prominent color (solid colorPalette.9). Kept in sync with
// toggle-button-group.recipe.tsx so standalone and grouped toggle buttons look
// identical when selected. "Solid" is a universal state here, not a variant.
const selectedOn = {
  bg: "colorPalette.9",
  color: "colorPalette.contrast",
  borderColor: "colorPalette.9",
  "&[data-hovered='true']": {
    bg: "colorPalette.10",
    borderColor: "colorPalette.10",
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
    // FEC-1170: toggle variants describe the resting *chrome* of the control,
    // not Button's emphasis levels. Every variant escalates to `selectedOn`
    // (solid .9) when selected. Button's `solid` and `link` are intentionally
    // excluded: `solid` is the selected state above, and a "link" has no
    // coherent toggled affordance.
    variant: {
      outline: {
        borderColor: "colorPalette.7",
        color: "colorPalette.11",
        "&[data-hovered='true']": {
          bg: "colorPalette.3",
          borderColor: "colorPalette.8",
        },
        "&[data-selected='true']": selectedOn,
      },
      ghost: {
        color: "colorPalette.11",
        "&[data-hovered='true']": {
          bg: "colorPalette.4",
        },
        "&[data-selected='true']": selectedOn,
      },
      subtle: {
        bg: "colorPalette.3",
        color: "colorPalette.11",
        "&[data-hovered='true']": {
          bg: "colorPalette.4",
        },
        "&[data-selected='true']": selectedOn,
      },
    },
  },
  defaultVariants: {
    size: "md",
    variant: "outline",
  },
});
