import { defineSlotRecipe } from "@chakra-ui/react";

/**
 * Recipe configuration for the DatePickerInput component.
 * Defines the styling variants and base styles using Chakra UI's recipe system.
 */
export const datePickerInputRecipe = defineSlotRecipe({
  // Unique class name prefix for the component
  className: "nimbus-date-picker-input",
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
      //outline: "1px solid deeppink",
      display: "inline-block",
    },
    group: {
      //outline: "1px solid seagreen",
      position: "relative",
      "& .nimbus-date-input__root": {
        mr: "1200",
      },
    },
    trigger: {
      position: "absolute",
      right: "400",
      top: "100",
      //outline: "1px solid red",
    },
    popover: {
      bg: "neutral.1",
      boxShadow: "4",

      borderRadius: "300",
      width: "354px",

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

  // Available variants for customizing the component's appearance
  variants: {
    // Size variants from smallest to largest
    size: {
      sm: {
        trigger: {
          top: "50",
        },
      },
      md: {
        trigger: {
          top: "100",
        },
      },
    },
    variant: {
      solid: {},
      ghost: {
        trigger: {
          bg: "transparent",
        },
      },
    },
  },
  defaultVariants: {
    size: "md",
  },
});
