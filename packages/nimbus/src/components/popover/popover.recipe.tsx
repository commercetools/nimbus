import { defineRecipe } from "@chakra-ui/react/styled-system";
/**
 * Recipe configuration for the Popover component.
 * Defines the styling variants and base styles using Chakra UI's recipe system.
 */
export const popoverRecipe = defineRecipe({
  // Unique class name prefix for the component
  className: "nimbus-popover",
  // Base styles applied to all instances of the component
  base: {
    bg: "white",
    borderRadius: "200",
    boxShadow: "5",
    padding: "400",
    zIndex: 1,
  },
});
