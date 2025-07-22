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
      // overflow: "hidden", // comment out to allow focus ring to be visible
    },

    group: {
      // ========================================
      // BASE LAYOUT & VISUAL PROPERTIES
      // ========================================
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-start",
      border: "solid-25",
      borderColor: "neutral.7",
      borderRadius: "200",
      bg: "neutral.1",
      px: "300",
      gap: 0,
      position: "relative", // Ensure stacking context for border

      // ========================================
      // INTERACTIVE STATES
      // ========================================
      _hover: {
        bg: "primary.2",
      },
      // Focus ring with transparent gap
      _focusWithin: {
        boxShadow: `0 0 0 1px {colors.neutral.7}`,
        outline: `3px solid {colors.primary.7}`,
        outlineOffset: "3px",
      },

      // ========================================
      // DATA STATES
      // ========================================
      // Invalid state styling
      "&[data-invalid='true']": {
        color: "critical.11",
        alignItems: "center",
        boxShadow: "0 0 0 {sizes.50} {colors.critical.7}",
      },

      // ========================================
      // DATE SEGMENT GROUP STYLING
      // ========================================
      '& [class*="nimbus-date-input__segmentGroup"]': {
        boxShadow: "none",
        px: 0,
        margin: 0,
        bg: "transparent",

        // Prevent covering group border (slightly shorter height)
        height: "calc(100% - 1px)",

        // Remove individual DateInput focus rings, we only show unified group focus ring
        "&[data-focus-within='true']": {
          outline: "none",
          boxShadow: "none",
        },
      },

      // ========================================
      // UI ELEMENT STYLING
      // ========================================
      // Style the date range separator (i.e. "–" between dates)
      '& > span[aria-hidden="true"]': {
        color: "neutral.8",
        px: 0,
        mx: 0,
        userSelect: "none",
        fontWeight: 400,
        fontSize: "md",
      },
    },
    trigger: {
      position: "absolute",
      right: "400",
      top: "100",
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
    size: {
      sm: {
        group: {
          height: "800", // Match DateInput sm height
          pr: "calc({spacing.1400} + {spacing.400})", // Smaller right padding for sm size
        },
        trigger: {
          top: "50",
        },
      },
      md: {
        group: {
          height: "1000", // Match DateInput md height
          pr: "calc({spacing.1600} + {spacing.200} + {spacing.400})", // Right padding for trigger buttons
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
          bg: "transparent",
          border: "none",
          px: "300",
          _hover: {
            bg: "primary.2",
            borderRadius: "200",
          },
          _focusWithin: {
            borderRadius: "200",
            outline: `3px solid {colors.primary.7}`,
            outlineOffset: "3px",
          },
        },
      },
    },
  },
  defaultVariants: {
    size: "md",
    variant: "solid",
  },
});
