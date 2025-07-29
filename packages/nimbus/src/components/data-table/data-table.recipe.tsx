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
    "headerSortIcon",
    "columnResizer",
  ],
  // Unique class name prefix for the component
  className: "nimbus-data-table",
  // Base styles applied to all instances of the component
  base: {
    root: {
      colorPalette: "slate",
      display: "block",
      borderRadius: "8px",
      border: "1px solid hsl(232, 18%, 95%)",
      boxShadow: "0 1px 5px 0 rgba(0, 0, 0, 0.05)",
      overflow: "hidden", // Ensure border-radius is respected
      contain: "layout style", // Prevent layout recalculations from affecting parents
      "& .react-aria-Cell": {
        padding: "16px 24px",
        color: "#6b7280", // Slightly grey text color
      },
      "& .data-table-row": {
        borderBottom: "1px solid hsl(232, 18%, 95%)",
        "&:last-child": {
          borderBottom: "none", // Remove border from last row
        },
      },
      "& .data-table-row:hover": {
        backgroundColor: "#F8F9FA",
        transition: "background-color 0.15s ease",
        transform: "translate3d(0, 0, 0)", // Force hardware acceleration
      },
      "& .data-table-header": {
        background: "colorPalette.2",
        color: "colorPalette.11",
        borderBottom: "1px solid hsl(232, 18%, 95%)",
        lineHeight: "400",
        height: "40px",
        fontWeight: "500",
        textStyle: "sm",
        fontSize: "300",
      },
      "& .react-aria-Column": {
        textAlign: "right",
        position: "relative",
        cursor: "pointer",
        userSelect: "none",
        padding: "4px 24px",
        "& > div": {
          display: "flex",
          alignItems: "center",
          "& > span:first-of-type": {
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          },
          "& > span:not(:first-of-type)": {
            flexShrink: 0,
          },
        },
        "&.selection-column-header, &#expand": {
          cursor: "default",
          "&:hover": {
            backgroundColor: "transparent",
          },
        },
        "&[aria-sort]": {
          fontWeight: 600,
          "&[aria-sort='none']:hover": {
            // backgroundColor: "#F0F0F0",
          },
          "&[aria-sort='ascending'], &[aria-sort='descending']": {
            // backgroundColor: "#F0F8FF",
            "&:hover": {
              // backgroundColor: "#E6F3FF",
            },
          },
        },
      },
      "& .data-table-header-divider": {
        position: "absolute",
        right: 0,
        top: "10%",
        bottom: "10%",
        height: "80%",
        width: "1px",
        pointerEvents: "none",
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
    headerSortIcon: {
      transition: "transform 100ms cubic-bezier(0.4, 0.0, 0.2, 1)",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      marginLeft: "6px",
      width: "16px",
      height: "16px",
      willChange: "opacity, color, transform",
    },
    columnResizer: {
      width: "4px",
      height: "100%",
      position: "absolute",
      right: 0,
      top: 0,
      cursor: "col-resize",
      transition: "background 100ms",
      background: "transparent",
      outline: "none",
      zIndex: 2,
      "&[data-resizing='true']": {
        background: "{colors.primary}",
      },
      "&[data-focused='true']": {
        outline: "1px solid {colors.primary}",
      },
    },
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
    density: {
      default: {
        root: {
          "& .react-aria-Cell": {
            padding: "16px",
          },
        },
      },
      condensed: {
        root: {
          "& .react-aria-Cell": {
            padding: "8px 16px",
          },
        },
      },
    },
  },
});
