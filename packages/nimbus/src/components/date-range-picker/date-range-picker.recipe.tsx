import { defineSlotRecipe } from "@chakra-ui/react/styled-system";

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
    },

    group: {
      "--border-width": "{sizes.25}",
      "--border-color": "{colors.neutral.7}",
      // ========================================
      // BASE LAYOUT & VISUAL PROPERTIES
      // ========================================
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-start",
      boxShadow: "inset 0 0 0 var(--border-width) var(--border-color)",
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
        outlineWidth: "var(--focus-ring-width)",
        outlineColor: "var(--focus-ring-color)",
        outlineStyle: "var(--focus-ring-style)",
        outlineOffset: "var(--focus-ring-offset)",
      },

      // ========================================
      // DATA STATES
      // ========================================
      // Invalid state styling
      "&[data-invalid='true']": {
        "--border-width": "{sizes.50}",
        "--border-color": "{colors.critical.7}",
        color: "critical.11",
        alignItems: "center",
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
          px: "300",
          _hover: {
            bg: "primary.2",
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
