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
    backgroundColor: "colorPalette.3",
    colorPalette: "primary",
    color: "colorPalette.11",
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
  },
  defaultVariants: {
    size: "md",
  },
});
