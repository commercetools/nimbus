import { defineRecipe } from "@chakra-ui/react";

export const mehButtonRecipe = defineRecipe({
  className: "bleh-ui-meh-button",
  base: {
    display: "block",
  },
  variants: {
    size: {
      "2xs": {},
      xs: {},
      sm: {},
      md: {},
      lg: {},
      xl: {},
      "2xl": {},
    },
    variant: {
      solid: {},
      subtle: {},
      outline: {},
      ghost: {},
      plain: {},
    },
  },
  defaultVariants: {
    size: "md",
    variant: "subtle",
  },
});
