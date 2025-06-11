import { defineSlotRecipe } from "@chakra-ui/react";

export const calendarSlotRecipe = defineSlotRecipe({
  slots: [
    "root",
    "header",
    "grid",
    "gridHeader",
    "headerCell",
    "gridBody",
    "cell",
  ],
  className: "nimbus-calendar",
  base: {
    root: {
      w: "302px",
      border: "1px solid",
      borderColor: "neutral.border",
      borderRadius: "md",
      p: "4",
    },
    header: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      w: "full",
      mb: "4",
    },
    grid: {
      w: "full",
      borderCollapse: "collapse",
    },
    gridHeader: {
      color: "neutral.text-disabled",
      fontSize: "sm",
      fontWeight: "regular",
    },
    headerCell: {
      pb: "2",
      textAlign: "center",
    },
    gridBody: {},
    cell: {
      w: "8",
      h: "8",
      textAlign: "center",
      verticalAlign: "middle",
      borderRadius: "md",
      cursor: "pointer",
      "&[data-hovered]": {
        backgroundColor: "neutral.surface-hover",
      },
      "&[data-pressed]": {
        backgroundColor: "neutral.surface-active",
      },
      "&[data-selected]": {
        backgroundColor: "primary.surface-strong",
        color: "primary.text-on-strong",
      },
      "&[data-disabled]": {
        color: "neutral.text-disabled",
        cursor: "not-allowed",
        _hover: {
          backgroundColor: "transparent",
        },
      },
      "&[data-unavailable]": {
        color: "neutral.text-disabled",
      },
      "&[data-outside-month]": {
        color: "neutral.text-disabled",
      },
    },
  },
  variants: {
    size: {
      md: {},
    },
  },
  defaultVariants: {
    size: "md",
  },
});
