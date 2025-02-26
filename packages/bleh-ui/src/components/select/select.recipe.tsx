import { defineSlotRecipe } from "@chakra-ui/react";

/**
 * Recipe configuration for the Select component.
 * Defines the styling variants and base styles using Chakra UI's recipe system.
 */
export const selectSlotRecipe = defineSlotRecipe({
  slots: [
    "root",
    "trigger",
    "triggerLabel",
    "options",
    "optionGroup",
    "option",
  ],
  // Unique class name prefix for the component
  className: "bleh-ui-select",

  // Base styles applied to all instances of the component
  base: {
    root: {
      colorPalette: "primary",
      display: "inline-block",
      position: "relative",
      height: "1000",
      minWidth: "7200",
      maxWidth: "100%",
    },
    trigger: {
      cursor: "button",
      display: "inline-flex",
      focusRing: "outside",
      alignItems: "flex-start",
      borderRadius: "200",
      color: "neutral.12",
      width: "100%",

      "& span": {
        display: "inline-block",
        my: "auto",
      },
      '& [slot="description"]': {
        display: "none",
      },
    },
    triggerLabel: {
      width: "calc(100% - 48px)",
      textAlign: "left",

      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
    // Popover
    options: {
      bg: "bg",
      borderRadius: "200",
      boxShadow: "5",
      minWidth: "var(--trigger-width)",
      p: "200",
      focusRing: "outside",
      maxHeight: "40svh",
      overflowY: "auto",
      "--scrollbar-color": "colors.neutral.8",
      "--scrollbar-bg": "colors.neutral.3",
      scrollbarWidth: "thin",
      scrollbarColor: "var(--scrollbar-color) var(--scrollbar-bg)",
    },
    // Option group header
    optionGroup: {
      textStyle: "xs",
      color: "neutral.11",
      fontWeight: "600",
      lineHeight: "350",
      letterSpacing: "25",
      textTransform: "uppercase",
      p: "200",
      borderBottom: "solid-25",
      borderColor: "neutral.6",
      mx: "-200",
      mt: "200",
      mb: "300",
    },
    option: {
      focusRing: "outside",
      color: "neutral.12",
      textStyle: "sm",
      p: "200",
      borderRadius: "200",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",

      '&[aria-selected="true"], &[data-focused="true"]': {
        bg: "primary.4",
      },

      '& [slot="label"]': {
        display: "block",
      },

      '& [slot="description"]': {
        display: "block",
        color: "neutral.11",
        textStyle: "xs",
      },
    },
  },

  // Available variants for customizing the component's appearance
  variants: {
    // Size variants from smallest to largest
    size: {
      md: {
        trigger: {
          h: "1000",
          px: "400",
          textStyle: "md",
        },
      }, // Medium
      sm: {
        trigger: {
          h: "800",
          px: "400",
          textStyle: "sm",
        },
      }, // Medium
    },

    // Visual style variants
    variant: {
      solid: {
        trigger: {
          bg: "bg",
          border: "solid-25",
          borderColor: "neutral.7",
          "&:hover": {
            bg: "primary.2",
          },
        },
      },
      ghost: {
        trigger: {
          bg: "transparent",
          border: "solid-25",
          borderColor: "transparent",
          "&:hover": {
            bg: "primary.alpha",
          },
        },
      },
    },
  },

  // Default variant values when not explicitly specified
  defaultVariants: {
    size: "md",
    variant: "solid",
  },
});
