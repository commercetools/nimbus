import { defineSlotRecipe } from "@chakra-ui/react";

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
      borderRadius: "200",
      fontSize: "350",
      lineHeight: "500",
      fontWeight: "400",
      transitionProperty: "all",
      transitionDuration: "fastest",
      textAlign: "center",
      color: "neutral.12",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      mb: "200",
      focusRing: "outside",

      "&[aria-disabled=true]": {
        layerStyle: "disabled",
      },

      "&[data-hovered=true]": {
        bg: "primary.3",
      },

      "&[data-today=true]": {
        bg: "neutral.3",
      },

      "&[data-selected=true]": {
        bg: "primary.9",
        color: "primary.contrast",
      },
      /* RangeCalendar-specific selectors */
      // In-range dates
      "&[data-in-range=true]": {
        bg: "primary.3",
        color: "neutral.12",
        borderRadius: "0",
      },
      // Range start: remove right radius to connect visually to the rest of the range
      "&[data-selected=true][data-range-start=true]:not([data-range-end=true])":
        {
          borderTopRightRadius: "0",
          borderBottomRightRadius: "0",
        },
      // Range end: remove left radius to connect visually to the rest of the range
      "&[data-selected=true][data-range-end=true]:not([data-range-start=true])":
        {
          borderTopLeftRadius: "0",
          borderBottomLeftRadius: "0",
        },

      // Remove border radius from middle cells in highlighted range during drag (exclude start/end)
      "&[data-in-highlighted-range=true]:not([data-drag-start=true]):not([data-drag-end=true])":
        {
          bg: "primary.3",
          color: "neutral.12",
          borderRadius: "0",
        },
      // Remove right border radius from start cell during drag
      "&[data-drag-start=true]": {
        borderTopRightRadius: "0",
        borderBottomRightRadius: "0",
      },
      // Remove left border radius from end cell during drag
      "&[data-drag-end=true]": {
        borderTopLeftRadius: "0",
        borderBottomLeftRadius: "0",
      },

      // Preserve left border radius for range dates in first column
      "&[data-first-column]": {
        "&[data-selected=true], &[data-in-range=true]": {
          borderTopLeftRadius: "200 !important",
          borderBottomLeftRadius: "200 !important",
        },
      },
      // Preserve right border radius for range dates in last column
      "&[data-last-column]": {
        "&[data-selected=true], &[data-in-range=true]": {
          borderTopRightRadius: "200 !important",
          borderBottomRightRadius: "200 !important",
        },
      },
    },
  },
});
