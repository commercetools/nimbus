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
      border: "1px solid",
      borderColor: "neutral.7",
      borderRadius: "300",
      boxShadow: "lg",
      p: "400",
      zIndex: 50,
      minWidth: "280px",

      "&[data-entering]": {
        animationName: "fade-in, scale-in",
        animationDuration: "150ms",
      },

      "&[data-exiting]": {
        animationName: "fade-out, scale-out",
        animationDuration: "100ms",
      },
    },
    calendar: {
      display: "flex",
      flexDirection: "column",
      gap: "300",
    },
    calendarHeader: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      mb: "200",

      "& button": {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "800",
        height: "800",
        borderRadius: "200",
        bg: "transparent",
        border: "none",
        cursor: "pointer",
        color: "neutral.11",

        "&:hover": {
          bg: "primary.2",
          color: "primary.11",
        },

        "&[data-pressed='true']": {
          bg: "primary.3",
        },

        "&[data-focus-visible='true']": {
          outlineWidth: "var(--focus-ring-width)",
          outlineColor: "var(--focus-ring-color)",
          outlineStyle: "var(--focus-ring-style)",
          outlineOffset: "var(--focus-ring-offset)",
        },
      },

      "& h2": {
        fontSize: "md",
        fontWeight: "semibold",
        color: "neutral.12",
        margin: 0,
      },
    },
    calendarGrid: {
      borderCollapse: "collapse",
      width: "100%",

      "& th": {
        textAlign: "center",
        fontSize: "sm",
        fontWeight: "medium",
        color: "neutral.11",
        pb: "200",
        width: "36px",
        height: "32px",
      },
    },
    calendarCell: {
      textAlign: "center",
      p: 0,

      "& button": {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "36px",
        height: "36px",
        borderRadius: "200",
        bg: "transparent",
        border: "none",
        cursor: "pointer",
        fontSize: "sm",
        color: "neutral.12",
        fontVariantNumeric: "tabular-nums",

        "&:hover": {
          bg: "primary.2",
          color: "primary.11",
        },

        "&[data-pressed='true']": {
          bg: "primary.3",
        },

        "&[data-focus-visible='true']": {
          outlineWidth: "var(--focus-ring-width)",
          outlineColor: "var(--focus-ring-color)",
          outlineStyle: "var(--focus-ring-style)",
          outlineOffset: "var(--focus-ring-offset)",
        },

        "&[data-selected='true']": {
          bg: "primary.9",
          color: "primary.contrast",

          "&:hover": {
            bg: "primary.10",
          },
        },

        "&[data-disabled='true']": {
          opacity: 0.5,
          cursor: "not-allowed",

          "&:hover": {
            bg: "transparent",
            color: "neutral.12",
          },
        },

        "&[data-outside-month='true']": {
          color: "neutral.8",
        },

        "&[data-unavailable='true']": {
          color: "critical.9",
          textDecoration: "line-through",

          "&:hover": {
            bg: "critical.2",
            color: "critical.11",
          },
        },
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
