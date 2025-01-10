import { defineRecipe } from "@chakra-ui/react";

export const kbdRecipe = defineRecipe({
  className: "bleh-ui-kbd",
  base: {
    display: "inline-flex",
    alignItems: "center",
    fontWeight: "medium",
    fontFamily: "mono",
    flexShrink: "0",
    whiteSpace: "nowrap",
    wordSpacing: "-0.5em",
    userSelect: "none",
    px: "100",
    borderRadius: "100",
  },
  variants: {
    variant: {
      raised: {
        bg: "colorPalette.subtle",
        color: "colorPalette.fg",
        borderWidth: "1px",
        borderBottomWidth: "2px",
        borderColor: "colorPalette.muted",
      },
      outline: {
        borderWidth: "1px",
        color: "colorPalette.fg",
      },
      subtle: {
        bg: "colorPalette.muted",
        color: "colorPalette.fg",
      },
      plain: {
        color: "colorPalette.fg",
      },
    },
    size: {
      sm: {
        textStyle: "xs",
        height: "450",
      },
      md: {
        textStyle: "sm",
        height: "500",
      },
      lg: {
        textStyle: "md",
        height: "600",
      },
    },
  },
  defaultVariants: {
    size: "md",
    variant: "raised",
  },
});
