import { buttonRecipe } from "@/components/button/button.recipe";
import { defineRecipe } from "@chakra-ui/react";

export const toggleButtonRecipe = defineRecipe({
  className: "nimbus-toggle-button",
  base: {
    ...buttonRecipe.base,
    /* ["&[data-hovered=true]"]: {
      _hover: {},
    },
    ["&[data-pressed=true]"]: {
      transform: "scale(0.97)",
    },
    ["&[data-focused=true]"]: {
      // Focus styles are handled by focusVisibleRing in base
    },
    ["&[data-disabled=true]"]: {
      layerStyle: "disabled",
    }, */
  },
  variants: {
    size: {
      ...buttonRecipe.variants?.size,
    },
    variant: {
      outline: {
        ...buttonRecipe.variants?.variant?.outline,
        // Selected state styles

        ["&[data-selected=true]"]: {
          bg: "colorPalette.3",
          borderColor: "colorPalette.8",
          color: "colorPalette.11",
          _hover: {
            bg: "colorPalette.4",
            borderColor: "colorPalette.9",
          },
        },
      },
      ghost: {
        ...buttonRecipe.variants?.variant?.ghost,
        color: "neutral.11",
        "&[data-hovered='true']": {
          bg: "colorPalette.2",
        },
        // Selected state styles
        ["&[data-selected='true']"]: {
          bg: "colorPalette.3",
          color: "colorPalette.11",

          "&[data-hovered='true']": {
            bg: "colorPalette.4",
          },
        },
      },
    },
    tone: {
      ...buttonRecipe.variants?.tone,
    },
  },
  defaultVariants: {
    size: "md",
    variant: "outline",
    tone: "primary",
  },
});
