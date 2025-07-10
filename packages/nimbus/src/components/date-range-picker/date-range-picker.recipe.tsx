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
    root: {
      display: "inline-block",
      overflow: "hidden",
    },
    group: {
      display: "flex",
      alignItems: "center",
      border: "solid-25",
      borderColor: "neutral.7",
      borderRadius: "200",
      background: "neutral.1",
      px: "300", // 12px left and right padding to match DatePicker
      gap: 0, // No gap between children
      height: "1000", // Default to md size height
      boxSizing: "border-box",
      maxWidth: "fit-content",

      // Remove border/background/margin from individual DateInputs
      '& [class*="nimbus-date-input__root"]': {
        border: "none",
        boxShadow: "none",
        borderRadius: 0,
        px: 0,
        width: "auto",
        minWidth: 0,
        flex: "0 0 auto",
        margin: 0,
        marginRight: "0 !important", // Forcefully remove right margin
        background: "none",
      },
      '& [class*="nimbus-date-input__segmentGroup"]': {
        border: "none",
        boxShadow: "none",
        borderRadius: 0,
        px: 0,
        width: "auto",
        minWidth: 0,
        flex: "0 0 auto",
        margin: 0,
        background: "none",
      },
      // Style the separator
      '& > span[aria-hidden="true"]': {
        color: "neutral.8",
        px: 0,
        mx: 0,
        userSelect: "none",
        fontWeight: 400,
        fontSize: "md",
      },
      // Style the icon buttons
      "& .nimbus-icon-button": {
        ml: 0, // No margin-left
        color: "primary.7",
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
  variants: {
    // Size variants from smallest to largest
    size: {
      sm: {
        group: {
          height: "800", // Match DateInput sm height
          "& .nimbus-date-input__root": {
            mr: "1400",
          },
        },
        trigger: {
          top: "50",
        },
      },
      md: {
        group: {
          height: "1000", // Match DateInput md height
          "& .nimbus-date-input__root": {
            // combine 2 tokens cause there is no token for this crooked value
            mr: "calc({spacing.1600} + {spacing.200})",
          },
        },
        trigger: {
          top: "100",
        },
      },
    },
    variant: {
      solid: {},
      ghost: {
        group: {
          background: "transparent",
          border: "none",
          borderRadius: 0,
          boxShadow: "none",
          px: "300",
          _hover: {
            background: "primary.2",
          },
        },
        root: {
          background: "transparent",
          boxShadow: "none",
          border: "none",
        },
      },
    },
  },
  defaultVariants: {
    size: "md",
    variant: "solid",
  },
});
