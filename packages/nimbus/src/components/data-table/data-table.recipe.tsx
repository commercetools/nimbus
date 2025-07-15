import { defineSlotRecipe } from "@chakra-ui/react";

/**
 * Slot recipe configuration for the DataTable component.
 * Defines the styling variants, base styles, and slots using Chakra UI's slot recipe system.
 */
export const dataTableRecipe = defineSlotRecipe({
  // Available slots for the DataTable component
  slots: [
    "root",
    "table",
    "header",
    "body",
    "row",
    "cell",
    "columnHeader",
    "columnResizer",
    "selectionCell",
    "detailsButton",
    "expandButton",
    "nestedIcon",
  ],
  // Unique class name prefix for the component
  className: "nimbus-data-table",
  // Base styles applied to all instances of the component
  base: {
    root: { display: "block" },
    table: {},
    header: {},
    body: {},
    row: {},
    cell: {},
    columnHeader: {},
    columnResizer: {},
    selectionCell: {},
    detailsButton: {},
    expandButton: {},
    nestedIcon: {},
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
