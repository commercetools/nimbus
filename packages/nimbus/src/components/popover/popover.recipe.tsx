import { defineSlotRecipe } from "@chakra-ui/react";

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
      border: "1px solid",
      borderColor: "gray.200",
      bg: "white",
      borderRadius: "md",
      boxShadow: "lg",
      padding: "4",
      zIndex: 1,
    },
  },
});