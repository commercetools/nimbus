import { defineSlotRecipe } from "@chakra-ui/react";

/**
 * Slot recipe configuration for the DataTable component.
 * Defines the styling variants, base styles, and slots using Chakra UI's slot recipe system.
 */
export const dataTableRecipe = defineSlotRecipe({
  // Available slots for the DataTable component
  slots: [
    "root",
    "footer",
    "selectionCell",
    "detailsButton",
    "expandButton",
    "nestedIcon",
  ],
  // Unique class name prefix for the component
  className: "nimbus-data-table",
  // Base styles applied to all instances of the component
  base: {
    root: { 
      overflowX: "auto",
      display: "block",
      "& .data-table-row": {
        borderBottom: "1px solid #E0E0E0"
      },
      "& .data-table-row:hover": {
        backgroundColor: "#F8F9FA",
        transition: "background-color 0.15s ease",
      },
      "& .react-aria-Column": {
        cursor: "pointer",
        userSelect: "none",
        transition: "background-color 0.15s ease",
        "&:hover": {
          backgroundColor: "#E8E8E8",
        },
        // Disable hover effects for selection and expand columns
        "&.selection-column-header, &#expand": {
          cursor: "default !important",
          "&:hover": {
            backgroundColor: "transparent",
          },
        },
        "&[aria-sort]": {
          fontWeight: 600,
          "&[aria-sort='none']:hover": {
            backgroundColor: "#F0F0F0",
          },
          "&[aria-sort='ascending'], &[aria-sort='descending']": {
            backgroundColor: "#F0F8FF",
            "&:hover": {
              backgroundColor: "#E6F3FF",
            },
          },
        },
      },
      "& .react-aria-Row[aria-selected='true']": {
        backgroundColor: "#EBF8FF",
        "&:hover": {
          backgroundColor: "#DBEAFE",
        },
      },
      // Native checkbox styling
      "& input[type='checkbox']": {
        appearance: "none",
        width: "16px",
        height: "16px",
        border: "2px solid #d1d5db",
        borderRadius: "4px",
        background: "white",
        cursor: "pointer",
        position: "relative",
        transition: "all 0.2s",
        flexShrink: 0,
        "&:checked": {
          background: "#2563eb",
          borderColor: "#2563eb",
          "&::after": {
            content: "''",
            position: "absolute",
            left: "3px",
            top: "0px",
            width: "6px",
            height: "10px",
            border: "solid white",
            borderWidth: "0 2px 2px 0",
            transform: "rotate(45deg)",
          },
        },
        "&:indeterminate": {
          background: "#2563eb",
          borderColor: "#2563eb",
          "&::after": {
            content: "''",
            position: "absolute",
            left: "2px",
            top: "6px",
            width: "8px",
            height: "2px",
            background: "white",
            transform: "none",
          },
        },
      },
    },
    footer: {
      width: "100%",
    },
    selectionCell: {},
    detailsButton: {},
    expandButton: {},
    nestedIcon: {},
  },
  // Variants for different states
  variants: {
    truncated: {
      true: {
        root: {
          "& .truncated-cell": {
            maxWidth: "200px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          },
        },
      },
    },
  },
});
