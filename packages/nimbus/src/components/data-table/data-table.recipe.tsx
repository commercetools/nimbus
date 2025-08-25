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
    "column",
    "footer",
    "selectionCell",
    "detailsButton",
    "expandButton",
    "nestedIcon",
    "headerSortIcon",
    "columnResizer",
  ],
  className: "nimbus-data-table",
  base: {
    root: {
      colorPalette: "slate",
      display: "block",
      borderRadius: "8px",
      border: "1px solid {colors.neutral.3}",
      boxShadow: "1",
      overflow: "auto",
      contain: "layout style",
      "& .react-aria-Cell": {
        paddingTop: "400",
        paddingBottom: "400",
        paddingLeft: "600",
        paddingRight: "600",
        color: "neutral.11",
        focusRing: "outside",
        hyphens: "auto",
        "&[data-slot='expand']": {
          padding: 0,
        },
        "&[data-slot='pin-row-cell']": {
          alignItems: "center",
          justifyContent: "center",
        },
        "& .nimbus-table-cell-copy-button": {
          display: "none",
        },
        "& .nimbus-table-cell-pin-button": {
          display: "none",
        },
        "& .nimbus-table-cell-pin-button-pinned": {
          display: "inherit",
        },
      },
      "& .data-table-row": {
        borderBottom: "1px solid {colors.neutral.3}",
        focusRing: "outside",
        "& td, div": {
          userSelect: "text",
        },
        "&:last-child": {
          borderBottom: "none",
        },
        _hover: {
          backgroundColor: "{colors.primary.3}",
          transition: "background-color 100ms ease",
          transform: "translate3d(0, 0, 0)",
          "& .data-table-row-details-button": {
            opacity: 1,
          },
          "& .nimbus-table-cell-copy-button": {
            display: "inherit",
          },
          "& .nimbus-table-cell-pin-button": {
            display: "inherit",
          },
        },
        "& .data-table-row-details-button": {
          opacity: 0,
        },
        "& .data-table-row-details-button:focus": {
          opacity: 1,
        },
      },
      "& .data-table-row[data-selected='true']": {
        background: "{colors.primary.4}",
      },
      "& .data-table-row[data-disabled='true']": {
        // layerStyle: "disabled",
        opacity: 0.8,
        cursor: "not-allowed",
      },
      "& .data-table-row-pinned": {
        borderLeft: "2px solid {colors.neutral.7}",
        borderRight: "2px solid {colors.neutral.7}",
        "&.data-table-row-pinned-first": {
          borderTop: "2px solid {colors.neutral.7}",
        },
        "&.data-table-row-pinned-last": {
          borderBottom: "2px solid {colors.neutral.7}",
        },
        "&.data-table-row-pinned-single": {
          border: "2px solid {colors.neutral.7}",
        },
      },
      "& .data-table-header": {
        background: "colorPalette.2",
        color: "colorPalette.11",
        borderBottom: "1px solid {colors.neutral.3}",
        lineHeight: "400",
        fontWeight: "500",
        textStyle: "sm",
        fontSize: "300",
        height: "1000",
        "& .data-table-column-divider": {
          display: "none",
          position: "absolute",
          right: 0,
          top: "10%",
          bottom: "10%",
          height: "80%",
          width: "1px",
          pointerEvents: "none",
        },
        _hover: {
          "& .data-table-column-divider": {
            display: "inherit",
          },
          "& tr th:last-of-type .data-table-column-divider": {
            display: "none",
          },
        },
      },
      // Multiline header truncation using webkit line clamp
    },
    table: {
      width: "fit-content",
      tableLayout: "fixed",
    },
    column: {
      textAlign: "right",
      position: "relative",
      paddingTop: "100",
      paddingBottom: "100",
      paddingLeft: "600",
      paddingRight: "600",
      lineHeight: "450",
      focusVisibleRing: "outside",
      focusRing: "outside",
      _focus: {
        focusRing: "outside",
      },
      "& .nimbus-data-table__headerSortIcon": {
        display: "none",
      },

      "& > div": {
        display: "flex",
        alignItems: "center",
        "& > span:first-of-type": {
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        },
        "& span[data-multiline-header]": {
          overflow: "hidden",
          lineHeight: "450",
          wordBreak: "break-word",
          whiteSpace: "normal",
          textOverflow: "ellipsis",
          textAlign: "left",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
        } as object,
        "& > span:not(:first-of-type)": {
          flexShrink: 0,
        },
      },
      "&.selection-column-header, &.expand-column-header": {
        cursor: "default",
        "&:hover": {
          backgroundColor: "transparent",
        },
      },
      "&.expand-column-header": {
        padding: "0",
      },
      "&[aria-sort]": {
        fontWeight: 600,
        cursor: "pointer",
        "&[aria-sort='none']:hover": {
          "& .nimbus-data-table__headerSortIcon": {
            display: "inherit",
          },
        },
        "&[aria-sort='ascending'], &[aria-sort='descending']": {
          "& .nimbus-data-table__headerSortIcon": {
            display: "inherit",
          },
        },
        "&[aria-sort='ascending']": {
          "& .nimbus-data-table__headerSortIcon": {
            transform: "rotate(180deg)",
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
            paddingTop: "400",
            paddingBottom: "400",
          },
        },
      },
      condensed: {
        root: {
          "& .react-aria-Cell": {
            paddingTop: "300",
            paddingBottom: "300",
          },
        },
      },
    },
  },
});
