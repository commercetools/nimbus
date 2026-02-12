import { defineSlotRecipe } from "@chakra-ui/react";

/**
 * Slot recipe configuration for the DataTable component.
 * Defines the styling variants, base styles, and slots using Chakra UI's slot recipe system.
 */
export const dataTableSlotRecipe = defineSlotRecipe({
  // Available slots for the DataTable component
  slots: [
    "root",
    "table",
    "header",
    "column",
    "body",
    "row",
    "cell",
    "footer",
    "selectionCell",
    "nestedIcon",
    "headerSortIcon",
    "columnResizer",
  ],
  className: "nimbus-data-table",
  base: {
    root: {
      width: "100%",
      display: "block",
      overflow: "auto",
      contain: "layout style",
      // CSS custom properties for pinned row shadows
      "--pinned-shadow-left": "inset 2px 0 0 {colors.neutral.7}",
      "--pinned-shadow-right": "inset -2px 0 0 {colors.neutral.7}",
      "--pinned-shadow-top": "inset 0 2px 0 {colors.neutral.7}",
      "--pinned-shadow-bottom": "inset 0 -2px 0 {colors.neutral.7}",
      "& .react-aria-Cell": {
        paddingTop: "400",
        paddingBottom: "400",
        paddingLeft: "600",
        paddingRight: "600",
        color: "neutral.11",
        focusRing: "outside",
        hyphens: "auto",
        "& [data-slot='pin-row-cell']": {
          alignItems: "center",
          justifyContent: "center",
          position: "sticky",
          right: 0,
          zIndex: 10,
          backgroundColor: "bg",
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
        "& [data-slot='pin-row-cell']": {
          position: "sticky",
          right: 0,
          zIndex: 3,
          "& [data-slot='nimbus-table-cell-pin-button']": {
            opacity: 0,
          },
          "& [data-slot='nimbus-table-cell-pin-button-pinned']": {
            opacity: 1,
          },
        },
        "& .data-table-sticky-cell": {
          position: "sticky",
          left: 0,
        },
        "& [data-slot='selection']": {
          zIndex: 11,
        },
        "& [data-slot='expand']": {
          zIndex: 12,
        },
        // When selection column is present, move expand column to the right
        "& [data-slot='selection'] ~ [data-slot='expand']": {
          left: "72px", // Width of selection column
        },
        _hover: {
          backgroundColor: "{colors.primary.3}",
          transition: "background-color 100ms ease",
          transform: "translate3d(0, 0, 0)",
          "& .data-table-sticky-cell": {
            transition: "background-color 100ms ease",
            backgroundColor: "inherit",
            position: "sticky",
          },
          "& [data-slot='selection']": {
            zIndex: 11,
          },
          "& [data-slot='expand']": {
            zIndex: 12,
          },
          // When selection column is present, move expand column to the right on hover
          "& [data-slot='selection'] ~ [data-slot='expand']": {
            left: "72px", // Width of selection column
          },
          "& [data-slot='pin-row-cell']": {
            right: 0,
            zIndex: 10,
            "& [data-slot='nimbus-table-cell-pin-button']": {
              opacity: 1,
            },
          },
          "& .data-table-row[data-disabled='true']": {
            opacity: 0.8,
          },
        },
      },
      "& .data-table-row[data-selected='true']": {
        "& .data-table-sticky-cell": {
          backgroundColor: "inherit",
        },
      },
      "& .data-table-row[data-disabled='true']": {
        // layerStyle: "disabled",
        opacity: 0.8,
        cursor: "not-allowed",
        backgroundColor: "inherit",
      },
      "& .data-table-row-pinned": {
        boxShadow: "var(--pinned-shadow-left), var(--pinned-shadow-right)",
        "& .data-table-sticky-cell": {
          position: "sticky",
          left: 0,
          zIndex: 3,
        },
        "& [data-slot='selection']": {
          clipPath: "inset(2px 0 2px 2px)",
        },
        "& [data-slot='expand']": {
          clipPath: "inset(2px 0)",
        },
        // When selection column is present in pinned rows, move expand column
        "& [data-slot='selection'] ~ [data-slot='expand']": {
          left: "72px", // Width of selection column
        },
        "& [data-slot='pin-row-cell']": {
          backgroundColor: "bg",
          position: "sticky",
          clipPath: "inset(2px 2px 2px 0)",
        },
        "&.data-table-row-pinned-first": {
          boxShadow:
            "var(--pinned-shadow-left), var(--pinned-shadow-right), var(--pinned-shadow-top)",
        },
        "&.data-table-row-pinned-last": {
          boxShadow:
            "var(--pinned-shadow-left), var(--pinned-shadow-right), var(--pinned-shadow-bottom)",
        },
        "&.data-table-row-pinned-single": {
          boxShadow:
            "var(--pinned-shadow-left), var(--pinned-shadow-right), var(--pinned-shadow-top), var(--pinned-shadow-bottom)",
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
        zIndex: 14,
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
      tableLayout: "fixed",
      boxSizing: "border-box",
      boxShadow: "inset 0 0 0 1px {colors.neutral.3}",
      borderRadius: "0 0 {sizes.200} {sizes.200}",
      colorPalette: "slate",
      width: "100%",
    },
    header: {
      background: "colorPalette.2",
      boxShadow: "inset 0 0 0 1px {colors.neutral.3}",
      borderRadius: "{sizes.200} {sizes.200} 0 0",
      color: "colorPalette.11",
      borderBottom: "1px solid {colors.neutral.3}",
      lineHeight: "400",
      fontWeight: "500",
      textStyle: "sm",
      fontSize: "300",
      height: "1000",
      "&[data-sticky]": {
        position: "sticky",
        top: 0,
        zIndex: 10,
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
    column: {
      textAlign: "right",
      position: "relative",
      lineHeight: "450",
      h: "100%",
      "&:focus": {
        outlineWidth: "var(--focus-ring-width)",
        outlineColor: "var(--focus-ring-color)",
        outlineStyle: "var(--focus-ring-style)",
        outlineOffset: "-2px",
        borderRadius: "2px",
      },
      "& > .nimbus-data-table__column-container": {
        paddingTop: "100",
        paddingBottom: "100",
        paddingLeft: "600",
        paddingRight: "600",
        display: "flex",
        alignItems: "center",
        h: "100%",
        // https://react-spectrum.adobe.com/react-aria/Table.html#width-values
        "&:focus": {
          outlineWidth: "var(--focus-ring-width)",
          outlineColor: "var(--focus-ring-color)",
          outlineStyle: "var(--focus-ring-style)",
          outlineOffset: "-2px",
          borderRadius: "2px",
        },
        "& > span:not(:first-of-type)": {
          flexShrink: 0,
        },
      },
      "&.selection-column-header": {
        cursor: "default",
        paddingTop: "100",
        paddingBottom: "100",
        paddingLeft: "600",
        paddingRight: "600",
        position: "sticky",
        left: 0,
        zIndex: 13,
      },
      "&.expand-column-header": {
        cursor: "default",
        padding: "0",
        position: "sticky",
        left: 0, // Default position when no selection column
        zIndex: 12,
      },
      // When selection column is present, adjust expand column header position
      "&.selection-column-header + &.expand-column-header": {
        left: "72px", // Width of selection column
      },
      "&.pin-rows-column-header": {
        cursor: "default",
        paddingTop: "100",
        paddingBottom: "100",
        paddingLeft: "600",
        paddingRight: "600",
        position: "sticky",
        right: 0,
        zIndex: 11,
      },
      "&[aria-sort]": {
        fontWeight: 600,
        cursor: "pointer",
        "&[aria-sort='none']:hover": {
          "& .nimbus-data-table__headerSortIcon > svg": {
            display: "inherit",
          },
        },
      },
    },
    body: {},
    row: {
      position: "relative",
      borderBottom: "1px solid {colors.neutral.3}",
      focusRing: "outside",
      "&:hover:not([data-nested-row-expanded])": {
        backgroundColor: "{colors.primary.3}",
        transition: "background-color 200ms ease",
        transform: "translate3d(0, 0, 0)",
      },
      "& td, div": {
        userSelect: "none",
      },
      "&:last-child": {
        borderBottom: "none",
      },
      "&[data-clickable='true']": {
        cursor: "pointer",
      },
      "&[data-selected='true']": {
        background: "{colors.primary.4}",
      },
      "&[data-disabled='true']": {
        // layerStyle: "disabled",
        opacity: 0.8,
        cursor: "not-allowed",
      },
      "&[data-nested-row-expanded='false']": {
        display: "none",
      },
    },
    cell: {
      paddingTop: "400",
      paddingBottom: "400",
      paddingLeft: "600",
      paddingRight: "600",
      color: "neutral.11",
      focusRing: "outside",
      hyphens: "auto",
      height: "100%",
      "&[data-slot='expand']": {
        padding: 0,
      },
      "&[data-nested-cell]": {
        boxShadow: "inset 2px 0 0 {colors.primary.10}",
      },
    },
    footer: {
      width: "100%",
    },
    selectionCell: {},
    nestedIcon: {},
    headerSortIcon: {
      transition: "transform 300ms cubic-bezier(0.4, 0.0, 0.2, 1)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginLeft: "6px",
      width: "16px",
      height: "16px",
      willChange: "opacity, color, transform",
      color: "neutral.10",
      // Only hide the svg so that the sort icon appearing does not cause layout shift
      "& > svg": { display: "none" },
      "&[data-sort-active='true']": {
        color: "neutral.11",
        "& > svg": { display: "inherit" },
      },
      "&[data-sort-direction='ascending']": {
        transform: "rotate(180deg)",
      },
    },
    columnResizer: {
      width: "150",
      height: "100%",
      position: "absolute",
      right: 0,
      top: 0,
      cursor: "col-resize",
      transition: "background 100ms",
      background: "transparent",
      outline: "none",
      zIndex: 2,
      "&:hover": {
        background: "var(--focus-ring-color)",
      },
      "&[data-resizing='true']": {
        background: "{colors.primary}",
      },
      "&[data-focused='true']": {
        outlineWidth: "var(--focus-ring-width)",
        outlineColor: "var(--focus-ring-color)",
        outlineStyle: "var(--focus-ring-style)",
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
        cell: {
          paddingTop: "400",
          paddingBottom: "400",
        },
      },
      condensed: {
        cell: {
          paddingTop: "300",
          paddingBottom: "300",
        },
      },
    },
  },
});
