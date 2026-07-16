import { defineRecipe } from "@chakra-ui/react/styled-system";

export const avatarRecipe = defineRecipe({
  className: "nimbus-avatar",
  base: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    verticalAlign: "middle",
    overflow: "hidden",
    userSelect: "none",
    borderRadius: "full",
    flexShrink: 0,
    fontWeight: "600",
    focusVisibleRing: "outside",
    "button&": {
      cursor: "button",
    },
    _icon: {
      flexShrink: "0",
    },
  },
  variants: {
    size: {
      md: {
        boxSize: "1000",
        textStyle: "sm",
        _icon: { boxSize: "600" },
      },
      xs: {
        boxSize: "800",
        textStyle: "xs",
        _icon: { boxSize: "500" },
      },
      "2xs": {
        boxSize: "600",
        textStyle: "2xs",
        _icon: { boxSize: "400" },
      },
    },
    variant: {
      // `subtle` is the historical avatar look and stays the default; `solid`
      // mirrors Button's solid tokens so an avatar reads as consistent with a
      // same-palette button.
      subtle: {
        backgroundColor: "colorPalette.3",
        color: "colorPalette.11",
      },
      solid: {
        backgroundColor: "colorPalette.9",
        color: "colorPalette.contrast",
      },
    },
  },
  defaultVariants: {
    size: "md",
    variant: "subtle",
  },
});
