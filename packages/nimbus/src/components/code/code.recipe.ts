import { defineRecipe } from "@chakra-ui/react/styled-system";

export const codeRecipe = defineRecipe({
  className: "nimbus-code",
  base: {
    fontFamily: "mono",
    alignItems: "center",
    display: "inline-flex",
    borderRadius: "100",
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
        minH: "400",
      },
      sm: {
        textStyle: "xs",
        px: "150",
        minH: "500",
      },
      md: {
        textStyle: "sm",
        px: "200",
        minH: "600",
      },
      lg: {
        textStyle: "sm",
        px: "250",
        minH: "700",
      },
    },
  },
  defaultVariants: {
    variant: "solid",
    size: "md",
  },
});
