import { defineRecipe } from "@chakra-ui/react";

/**
 * Recipe configuration for the Icon component.
 * Defines the styling variants and base styles using Chakra UI's recipe system.
 */
export const iconRecipe = defineRecipe({
  className: "nimbus-icon",
  base: {
    display: "inline-block",
  },

  variants: {
    /**
     * allows applying a predefined size to the icon
     */
    size: {
      "2xs": { boxSize: "600" },
      xs: { boxSize: "800" },
      sm: { boxSize: "900" },
      md: { boxSize: "1000" },
      lg: { boxSize: "1200" },
      xl: { boxSize: "1400" },
    },
  },
});
