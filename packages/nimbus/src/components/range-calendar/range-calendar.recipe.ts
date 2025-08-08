import { defineSlotRecipe } from "@chakra-ui/react/styled-system";

export const rangeCalendarSlotRecipe = defineSlotRecipe({
  slots: [
    "root",
    "header",
    "grids",
    "monthTitle",
    "grid",
    "gridHeader",
    "headerCell",
    "gridBody",
    "bodyCell",
  ],
  className: "nimbus-range-calendar",
  base: {
    // the container element
    root: {
      display: "inline-block",
      maxWidth: "100%",
    },
    header: {
      height: "1200",
      p: "200",
      mb: "300",
      borderBottom: "solid-25",
      borderColor: "neutral.3",
    },
    // the container containing the month(s) grid(s)
    grids: {
      display: "flex",
      flexWrap: "wrap",
      gap: "800",
      mx: "200",
      maxWidth: "full",
    },
    // Month title above each grid
    monthTitle: {
      textAlign: "center",
      fontSize: "400",
      fontWeight: "600",
      color: "neutral.11",
      mb: "300",
      px: "200",
    },
    // A single grid (<table>) containing a months days
    grid: {
      w: "full",
      minW: "fit-content",
      flex: "1 1 auto",
    },
    // Weekday Row
    gridHeader: {},
    // Weekday Item
    headerCell: {
      p: "200",
      pb: "300",
      textAlign: "center",
      color: "neutral.9",
      fontSize: "300",
      lineHeight: "350",
      fontWeight: "500",
    },
    gridBody: {},

    // Day Item
    bodyCell: {
      cursor: "pointer",
      p: "200",
      minW: "1400",
      fontSize: "350",
      lineHeight: "500",
      fontWeight: "400",
      textAlign: "center",
      color: "neutral.12",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      mb: "200",
      focusRing: "outside",

      /** today cell (lowest priority, styling-wise) */
      "&[data-today=true]": {
        bg: "neutral.3",
        borderRadius: "200",
      },
      /** hovered or keyboard-focused cell */
      "&[data-hovered='true'], &[data-focused='true']": {
        bg: "primary.3",
        borderRadius: "200",
      },
      /** selected cell (any cell in the range) */
      "&[data-selected='true']": {
        bg: "primary.3",
        borderRadius: "0",
      },
      /** bodyCell within first column */
      "[role='gridcell']:first-child &": {
        borderLeftRadius: "200",
      },
      /** bodyCell within last column */
      "[role='gridcell']:last-child &": {
        borderRightRadius: "200",
      },
      /** start- & end-cell (shared styling) */
      "&[data-selection-start='true'], &[data-selection-end=true]": {
        bg: "primary.9",
        color: "primary.contrast",
      },
      /** start selection cell (only gets a border-radius on the left) */
      "&[data-selection-start='true']": {
        borderLeftRadius: "200",
      },
      /** end selection cell (only gets a border-radius on the right)*/
      "&[data-selection-end=true]": {
        borderRightRadius: "200",
      },
      /** BUT: if start = end cell, border-radius on all sides */
      "&[data-selection-end=true]&[data-selection-start='true']": {
        borderRadius: "200",
      },
      /** disabled cell (must still be focusable) */
      "&[aria-disabled=true]": {
        layerStyle: "disabled",
      },
    },
  },
});
