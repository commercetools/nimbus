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
      // overflow: "hidden", // Removed to allow focus ring to be visible
    },
    group: {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-start",
      border: "solid-25",
      borderColor: "neutral.7",
      borderRadius: "200",
      background: "neutral.1",
      px: "300",
      gap: 0,
      height: "1000", // Default to md size height
      boxSizing: "border-box",
      position: "relative", // Ensure stacking context for border
      _hover: {
        background: "primary.2",
      },
      // 3-layer box-shadow for focus ring: border (2px), white gap (5px), and primary color ring (8px)
      _focusWithin: {
        boxShadow: `0 0 0 2px {colors.neutral.7}, 0 0 0 5px #fff, 0 0 0 8px {colors.primary.7}`,
      },

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
        background: "none",
      },
      // Ensure the Group component aligns content to the start
      '& > [role="group"]': {
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        width: "full",
      },
      // Prevent segmentGroup from covering the group's border:
      // - boxSizing: 'border-box' ensures padding/margins are included in height calculation
      // - height: 'calc(100% - 1px)' makes segmentGroup slightly shorter so the group's border remains visible
      // - background: 'transparent' ensures no background covers the border
      '& [class*="nimbus-date-input__segmentGroup"]': {
        border: "none",
        boxShadow: "none",
        borderRadius: 0,
        px: 0,
        width: "auto",
        minWidth: 0,
        flex: "0 0 auto",
        margin: 0,
        background: "transparent",
        position: "relative",
        zIndex: 1,
        boxSizing: "border-box",
        height: "calc(100% - 1px)", // Prevent covering group border
        justifyContent: "flex-start", // Ensure content aligns to the start
        // Remove individual DateInput focus rings - only show DateRangePicker's unified focus ring
        "&[data-focus-within='true']": {
          outline: "none",
          boxShadow: "none",
        },
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
        ml: 0,
        color: "primary.7",
        alignSelf: "center",
      },
    },
    trigger: {
      position: "absolute",
      right: "400",
      top: "100",
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
