import { defineRecipe } from "@chakra-ui/react/styled-system";

export const floatingActionButtonRecipe = defineRecipe({
  className: "nimbus-floating-action-button",
  base: {
    display: "inline-flex",
    appearance: "none",
    alignItems: "center",
    justifyContent: "center",
    userSelect: "none",
    position: "relative",
    borderWidth: "0",
    borderRadius: "full",
    cursor: "pointer",
    flexShrink: "0",
    outline: "0",
    isolation: "isolate",
    transitionProperty: "common",
    transitionDuration: "moderate",
    focusVisibleRing: "outside",
    colorPalette: "primary",
    w: "1200",
    h: "1200",
    bg: "colorPalette.9",
    color: "colorPalette.contrast",
    shadow: "3",
    zIndex: "banner",
    _hover: {
      bg: "colorPalette.10",
    },
    _disabled: {
      layerStyle: "disabled",
    },
    _icon: {
      flexShrink: "0",
      width: "700",
      height: "700",
    },
  },
  defaultVariants: {},
});
