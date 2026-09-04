import { buttonRecipe } from "@/components/button/button.recipe";
import { defineRecipe } from "@chakra-ui/react/styled-system";

const activeFill = {
  tint: {
    bg: "colorPalette.5",
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
    variant: {
      outline: {
        borderColor: "neutral.7",
        color: "neutral.11",
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
    activeFillStyle: {
      tint: {
        _selected: activeFill.tint,
      },
      solid: {
        _selected: activeFill.solid,
      },
    },
  },
  compoundVariants: [
    {
      variant: "outline",
      activeFillStyle: "tint",
      css: {
        _selected: {
          borderColor: "colorPalette.8",
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
        _selected: {
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
    activeFillStyle: "tint",
  },
});
