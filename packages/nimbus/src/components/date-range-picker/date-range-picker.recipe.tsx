import { defineSlotRecipe } from "@chakra-ui/react";

export const dateRangePickerSlotRecipe = defineSlotRecipe({
  className: "nimbus-date-range-picker",
  slots: [
    "root",
    "group",
    "trigger",
    "popover",
    "calendar",
    "calendarHeader",
    "calendarGrid",
    "calendarCell",
  ],
  base: {
    root: {},
    group: {
      display: "flex",
      alignItems: "center",
      border: "solid-25",
      borderColor: "neutral.7",
      borderRadius: "400",
      background: "neutral.1",
      px: "400",
      height: "1200",
      boxSizing: "border-box",
      position: "relative",
      transition: "border-color 0.2s",
      _focusWithin: {
        borderColor: "primary.7",
        boxShadow: "0 0 0 2px var(--chakra-colors-primary-4)",
      },
      // Remove border/background from DateInputs
      '& [class*="nimbus-date-input__root"], & [class*="nimbus-date-input__segmentGroup"]':
        {
          border: "none",
          background: "transparent",
          boxShadow: "none",
          outline: "none",
          borderRadius: 0,
          px: 0,
          minWidth: "unset",
          width: "auto",
          flex: "0 0 auto",
        },
      // Style the separator
      '& > span[aria-hidden="true"]': {
        color: "neutral.9",
        px: "200",
        fontSize: "md",
        userSelect: "none",
      },
      // Style the icon buttons
      "& .nimbus-icon-button": {
        ml: "300",
        background: "none",
        border: "none",
        boxShadow: "none",
        color: "primary.7",
        cursor: "pointer",
        alignSelf: "center",
      },
    },
    trigger: {
      position: "static",
      ml: "auto",
      display: "flex",
      alignItems: "center",
      gap: "100",
    },
    popover: {
      bg: "neutral.1",
      boxShadow: "4",
      borderRadius: "300",
      overflow: "auto",
      "&[data-entering]": {
        animationName: "fade-in, scale-in",
        animationDuration: "fast",
      },
      "&[data-exiting]": {
        animationName: "fade-out, scale-out",
        animationDuration: "faster",
      },
    },
  },
  variants: {},
  defaultVariants: {},
});
