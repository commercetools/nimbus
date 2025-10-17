import { buttonRecipe } from "@/components/button/button.recipe";
import { defineRecipe } from "@chakra-ui/react/styled-system";

export const toggleButtonRecipe = defineRecipe({
  className: "nimbus-toggle-button",
  base: {
    ...buttonRecipe.base,
  },
  variants: {
    size: {
      ...buttonRecipe.variants?.size,
    },
    variant: {
      outline: {
        "--button-bg": "transparent",
        "--button-text": "{colors.colorPalette.11}",
        "--border-width": "{sizes.25}",
        "--border-color": "{colors.colorPalette.7}",

        bg: "var(--button-bg)",
        boxShadow: "0 0 0 var(--border-width) var(--border-color)",
        color: "var(--button-text)",

        "&[data-hovered='true']": {
          "--button-bg": "{colors.colorPalette.2}",
          "--border-color": "{colors.colorPalette.8}",
        },

        ["&[data-selected=true]"]: {
          "--button-bg": "{colors.colorPalette.3}",
          "--border-color": "{colors.colorPalette.8}",

          _hover: {
            "--button-bg": "{colors.colorPalette.4}",
            "--border-color": "{colors.colorPalette.9}",
          },
        },
      },
      ghost: {
        "--button-text": "{colors.neutral.11}",
        "--button-bg": "transparent",

        color: "var(--button-text)",
        bg: "var(--button-bg)",

        "&[data-hovered='true']": {
          "--button-bg": "{colors.colorPalette.2}",
        },

        ["&[data-selected='true']"]: {
          "--button-bg": "{colors.colorPalette.3}",
          "--button-text": "{colors.colorPalette.11}",

          "&[data-hovered='true']": {
            "--button-bg": "{colors.colorPalette.4}",
          },
        },
      },
    },
  },
  defaultVariants: {
    size: "md",
    variant: "outline",
    colorPalette: "primary",
  },
});
