import { defineRecipe } from "@chakra-ui/react";

export const boxRecipe = defineRecipe({
  className: "bleh-ui-box",
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
  },
});
