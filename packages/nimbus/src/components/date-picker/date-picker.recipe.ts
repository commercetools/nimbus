import { defineSlotRecipe } from "@chakra-ui/react";

/**
 * Recipe configuration for the DatePicker component.
 * Defines the styling variants and base styles using Chakra UI's recipe system.
 */
export const datePickerRecipe = defineSlotRecipe({
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
      //outline: "1px solid deeppink",
      display: "inline-block",
    },
    group: {
      //outline: "1px solid seagreen",
      position: "relative",
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
        group: {
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
