---
to: packages/bleh-ui/src/components/<%= h.changeCase.paramCase(name) %>/<%= h.changeCase.paramCase(name) %>.slots.tsx
---
import { defineRecipe } from "@chakra-ui/react";

export const <%= h.changeCase.camel(name) %>Recipe = defineRecipe({
  className: "bleh-ui-<%= h.changeCase.paramCase(name) %>",
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
