import { defineSlotRecipe } from "@chakra-ui/react/styled-system";

/**
 * Recipe configuration for the DatePicker component.
 * Defines the styling variants and base styles using Chakra UI's recipe system.
 */
export const datePickerSlotRecipe = defineSlotRecipe({
  // Unique class name prefix for the component
  className: "nimbus-date-picker",
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

  // Base styles applied to all instances of the component
  base: {
    root: {
      display: "inline-block",
      overflow: "hidden",
    },
    group: {
      position: "relative",
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
    // Size variants from smallest to largest
    size: {
      sm: {
        group: {},
        trigger: {
          top: "50",
        },
      },
      md: {
        group: {},
        trigger: {
          top: "100",
        },
      },
    },
    variant: {
      // those need to exist, as the date-input has and needs those variants
      solid: {},
      ghost: {},
    },
  },
  defaultVariants: {
    size: "md",
  },
});
