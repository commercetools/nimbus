import { buttonRecipe } from "@/components/button/button.recipe";
import { defineRecipe } from "@chakra-ui/react/styled-system";

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
        _hover: {
          bg: "neutral.3",
          borderColor: "neutral.8",
        },
      },
      ghost: {
        color: "neutral.11",
        _hover: {
          bg: "neutral.3",
        },
      },
      subtle: {
        bg: "neutral.3",
        color: "neutral.11",
        _hover: {
          bg: "neutral.4",
        },
      },
    },
    activeFillStyle: {
      tint: {
        _selected: {
          bg: "colorPalette.5",
          color: "colorPalette.12",
          _hover: {
            bg: "colorPalette.6",
          },
        },
      },
      solid: {
        _selected: {
          bg: "colorPalette.9",
          color: "colorPalette.contrast",
          _hover: {
            bg: "colorPalette.10",
          },
        },
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
          _hover: {
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
          _hover: {
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
