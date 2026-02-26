import { defineRecipe } from "@chakra-ui/react/styled-system";

/**
 * Recipe configuration for the Group component.
 * Defines the styling variants and base styles using Chakra UI's recipe system.
 */
export const groupRecipe = defineRecipe({
  className: "nimbus-group",
  base: {
    display: "inline-flex",
    alignItems: "center",
  },
  // TODO: there could be variants here
});
