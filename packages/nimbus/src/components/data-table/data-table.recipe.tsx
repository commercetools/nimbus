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
});
