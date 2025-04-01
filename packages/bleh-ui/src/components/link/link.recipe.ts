import { defineRecipe } from "@chakra-ui/react";

export const linkRecipe = defineRecipe({
  className: "bleh-ui-link",
  base: {
    display: "inline-flex",
    alignItems: "center",
    outline: "none",
    gap: "150",
    cursor: "pointer",
    borderRadius: "50",
    focusRing: "outside",
  },
  variants: {
    variant: {
      underline: {
        color: "colorPalette.fg",
        textDecoration: "underline",
        textUnderlineOffset: "3px",
        textDecorationColor: "currentColor/20",
      },
      plain: {
        color: "colorPalette.fg",
        _hover: {
          textDecoration: "underline",
          textUnderlineOffset: "3px",
          textDecorationColor: "currentColor/20",
        },
      },
    },
  },
});
