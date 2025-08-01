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
  className: "nimbus-data-table",
  base: {
    root: {
      colorPalette: "slate",
      display: "block",
      borderRadius: "8px",
      border: "1px solid {colors.neutral.3}",
      boxShadow: "1",
      overflow: "hidden",
      contain: "layout style",
      "& .react-aria-Cell": {
        paddingTop: "400",
        paddingBottom: "400",
        paddingLeft: "600",
        paddingRight: "600",
        color: "neutral.11",
      },
      "& .data-table-row": {
        borderBottom: "1px solid {colors.neutral.3}",
        "&:last-child": {
          borderBottom: "none",
        },
      },
      "& .data-table-row-details-button": {
        opacity: 0,
      },
      "& .data-table-row-details-button:focus": {
        opacity: 1,
      },
      "& .data-table-row:hover": {
        backgroundColor: "{colors.primary.3}",
        transition: "background-color 100ms ease",
        transform: "translate3d(0, 0, 0)",
        "& .data-table-row-details-button": {
          opacity: 1,
        },
      },
      "& .data-table-row-selected": {
        backgroundColor: "{colors.primary.4}",
      },
      "& .data-table-row-disabled": {
        "& .data-table-row-details-button": {
          display: "none",
        },
        // layerStyle: "disabled",
        opacity: 0.8,
        cursor: "not-allowed",
      },
      "& .data-table-header": {
        background: "colorPalette.2",
        color: "colorPalette.11",
        borderBottom: "1px solid {colors.neutral.3}",
        lineHeight: "400",
        fontWeight: "500",
        textStyle: "sm",
        fontSize: "300",
        height: "40px",
      },
      "& .react-aria-Column": {
        textAlign: "right",
        position: "relative",
        cursor: "pointer",
        userSelect: "none",
        paddingTop: "100",
        paddingBottom: "100",
        paddingLeft: "600",
        paddingRight: "600",
        lineHeight: "450",
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
            lineHeight: "18px",
            maxHeight: "36px", 
            wordBreak: "break-word",
            whiteSpace: "normal",
            textOverflow: "ellipsis",
            textAlign: "left",
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
      // Multiline header truncation using webkit line clamp
      "& span[data-multiline-header]": {
        display: "-webkit-box",
        WebkitBoxOrient: "vertical",
        WebkitLineClamp: "2",
      } as {},
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
