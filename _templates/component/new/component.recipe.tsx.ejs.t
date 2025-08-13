---
to: packages/nimbus/src/components/<%= h.changeCase.paramCase(name) %>/<%= h.changeCase.paramCase(name) %>.recipe.tsx
---
import { defineRecipe } from "@chakra-ui/react/styled-system";

/**
 * Recipe configuration for the <%= h.changeCase.pascalCase(name) %> component.
 * Defines the styling variants and base styles using Chakra UI's recipe system.
 */
export const <%= h.changeCase.camel(name) %>Recipe = defineRecipe({
  // Unique class name prefix for the component
  className: "nimbus-<%= h.changeCase.paramCase(name) %>",

  // Base styles applied to all instances of the component
  base: {
    display: "block",
  },

  // Available variants for customizing the component's appearance
  variants: {
    // Size variants from smallest to largest
    size: {
      "2xs": {},  // Extra extra small
      xs: {},     // Extra small
      sm: {},     // Small
      md: {},     // Medium
      lg: {},     // Large
      xl: {},     // Extra large
      "2xl": {},  // Extra extra large
    },

    // Visual style variants
    variant: {
      solid: {},   // Filled background
      subtle: {},  // Lighter background
      outline: {}, // Bordered style
      ghost: {},   // Background only on interaction
      plain: {},   // No background or border
    },
  },

  // Default variant values when not explicitly specified
  defaultVariants: {
    size: "md",
    variant: "subtle",
  },
});
