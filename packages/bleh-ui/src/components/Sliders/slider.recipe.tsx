import { defineSlotRecipe } from "@chakra-ui/react";

export const sliderSlotRecipe = defineSlotRecipe({
  slots: ["root", "track", "range", "thumb"],
  base: {
    root: {
      position: "relative",
      display: "flex",
      alignItems: "center",
      userSelect: "none",
      touchAction: "none",
      width: "100%",
      height: "8",
    },
    track: {
      position: "relative",
      width: "100%",
      height: "8",
      bg: "colorPalette.3",
    },
    range: {
      position: "absolute",
      height: "8",
      bg: "colorPalette.5",
    },
    thumb: {
      width: "8",
      height: "8",
      top: "4",

      _focusVisible: {
        focusRing: "outside",
      },
      bg: "colorPalette.9",
      '[data-focused="true"] &': {
        outline: "2px solid",
        outlineOffset: "2px",
        focusRing: "outside",
      },

      _hover: {
        bg: "colorPalette.10",
      },
    },
  },
});
