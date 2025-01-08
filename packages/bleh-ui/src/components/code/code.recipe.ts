import { defineRecipe } from "@chakra-ui/react";

export const codeRecipe = defineRecipe({
  className: "bleh-ui-code",
  base: {
    fontFamily: "mono",
    alignItems: "center",
    display: "inline-flex",
    borderRadius: "l2",
  },
  variants: {
    variant: {
      solid: {
        bg: "colorPalette.4",
        color: "colorPalette.11",
      },
      subtle: {
        bg: "colorPalette.3",
        color: "colorPalette.11",
      },
      outline: {
        color: "colorPalette.fg",
        shadow: "inset 0 0 0px 1px var(--shadow-color)",
        shadowColor: "colorPalette.muted",
      },
      surface: {
        bg: "colorPalette.subtle",
        color: "colorPalette.fg",
        shadow: "inset 0 0 0px 1px var(--shadow-color)",
        shadowColor: "colorPalette.muted",
      },
      plain: {
        color: "colorPalette.fg",
      },
    },
    size: {
      xs: {
        textStyle: "2xs",
        px: "100",
        minH: "4",
      },
      sm: {
        textStyle: "xs",
        px: "150",
        minH: "5",
      },
      md: {
        textStyle: "sm",
        px: "200",
        minH: "6",
      },
      lg: {
        textStyle: "sm",
        px: "250",
        minH: "7",
      },
    },
  },
  defaultVariants: {
    variant: "solid",
    size: "md",
  },
});
