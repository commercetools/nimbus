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
    "column",
    "body",
    "row",
    "cell",
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
    },
    table: {
      width: "fit-content",
      tableLayout: "fixed",
    },
    header: {
      background: "colorPalette.2",
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
      "&.selection-column-header, &.expand-column-header": {
        cursor: "default",
        paddingTop: "100",
        paddingBottom: "100",
        paddingLeft: "600",
        paddingRight: "600",
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
          "& .nimbus-data-table__headerSortIcon > svg": {
            display: "inherit",
          },
        },
      },
    },
    body: {},
    row: {
      borderBottom: "1px solid {colors.neutral.3}",
      focusRing: "outside",
      "& td, div": {
        userSelect: "none",
      },
      "&:last-child": {
        borderBottom: "none",
      },
      "&[data-selected='true']": {
        background: "{colors.primary.4}",
      },
      "&[data-disabled='true']": {
        "& .data-table-row-details-button": {
          display: "none",
        },
        // layerStyle: "disabled",
        opacity: 0.8,
        cursor: "not-allowed",
      },
      _hover: {
        backgroundColor: "{colors.primary.3}",
        transition: "background-color 100ms ease",
        transform: "translate3d(0, 0, 0)",
        "& .data-table-row-details-button": {
          opacity: 1,
        },
      },
      "& .data-table-row-details-button": {
        opacity: 0,
      },
      "& .data-table-row-details-button:focus": {
        opacity: 1,
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
      "&[data-slot='expand']": {
        padding: 0,
      },
      "& .nimbus-table-cell-copy-button": {
        display: "none",
      },
      _hover: {
        "& > div > .nimbus-table-cell-copy-button": {
          display: "inherit",
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
