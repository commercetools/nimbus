import { defineSlotRecipe } from "@chakra-ui/react/styled-system";

const slots = ["root", "content"];

/**
 * Recipe configuration for the Popover component.
 * Defines the styling variants and base styles using Chakra UI's recipe system.
 */
export const popoverSlotRecipe = defineSlotRecipe({
  // Unique class name prefix for the component
  className: "nimbus-popover",
  slots,
  // Base styles applied to all instances of the component
  base: {
    root: {
      position: "relative",
      display: "inline-block",
    },
    content: {
      bg: "white",
      borderRadius: "200",
      boxShadow: "5",
      padding: "400",
      zIndex: 1,
    },
  },
});
