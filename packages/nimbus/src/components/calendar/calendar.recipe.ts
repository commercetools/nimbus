import { defineSlotRecipe } from "@chakra-ui/react";

export const calendarSlotRecipe = defineSlotRecipe({
  slots: [
    "root",
    "header",
    "grids",
    "grid",
    "gridHeader",
    "headerCell",
    "gridBody",
    "bodyCell",
  ],
  className: "nimbus-calendar",
  base: {
    root: {
      maxWidth: "100vw",
    },
    header: {
      height: "1200",
      p: "200",
      mb: "300",
      borderBottom: "1px solid",
      borderColor: "neutral.3",
    },
    // the container contianing the month(s) grid(s)
    grids: {
      display: "flex",
      gap: "800",
    },
    // A single grid (<table>) containing a months days
    grid: {
      w: "full",
      minW: "8000",
      mx: "200",
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

      "&[data-selected=true]": {
        bg: "primary.9",
        color: "primary.contrast",
      },
    },
  },
  variants: {
    size: {
      md: {},
    },
    variant: {
      plain: {},
      standalone: {
        root: {
          display: "inline-block",
          borderRadius: "200",
          boxShadow: "4",
        },
      },
    },
  },
  defaultVariants: {
    size: "md",
    variant: "standalone",
  },
});
