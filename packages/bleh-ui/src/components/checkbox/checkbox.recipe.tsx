import { defineSlotRecipe } from "@chakra-ui/react";

/**
 * Recipe configuration for the Checkbox component.
 * Defines the styling variants and base styles using Chakra UI's recipe system.
 */
export const checkboxSlotRecipe = defineSlotRecipe({
  slots: ["root", "control", "label"],
  // Unique class name prefix for the component
  className: "bleh-ui-checkbox",

  base: {
    root: { display: "flex", alignItems: "center", gap: "2" },
    control: { borderWidth: "1px", borderRadius: "sm" },
    label: { marginStart: "2" },
  },
  variants: {
    size: {
      sm: {
        control: { width: "8", height: "8" },
        label: { fontSize: "sm" },
      },
      md: {
        control: { width: "10", height: "10" },
        label: { fontSize: "md" },
      },
    },
  },
});
