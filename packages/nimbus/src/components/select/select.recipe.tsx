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
  className: "nimbus-select",

  // Base styles applied to all instances of the component
  base: {
    // RA <Select>
    root: {
      colorPalette: "primary",
      display: "inline-block",
      position: "relative",
      maxWidth: "100%",
      borderRadius: "200",
      // [data-focused]
      // [data-focus-visible]
      // [data-open]
      // [data-invalid]
      // [data-required]
      "&[data-disabled]": {
        layerStyle: "disabled",
        pointerEvents: "none",
      },
    },
    trigger: {
      cursor: "button",
      display: "inline-flex",
      focusRing: "outside",
      alignItems: "center",
      justifyContent: "flex-start",
      borderRadius: "200",
      color: "neutral.12",
      width: "100%",
      userSelect: "none",
      boxShadow: "inset 0 0 0 var(--border-width) var(--border-color)",

      '& [slot="description"]': {
        display: "none",
      },

      "[data-invalid] &": {
        "--border-width": "sizes.50",
        "--border-color": "colors.critical.7",
      },

      // [data-hovered]
      // [data-pressed]
      // [data-focused]
      // [data-focus-visible]
      // [data-disabled]
      // [data-pending]
    },
    triggerLabel: {
      // *Magic*
      // the trigger-label defines the overall width of the select,
      // but since we position 2 buttons/icons next to it, we need to account for
      // their width as well and reserve some space for them
      // = label-button-gap + button-size + icon-size
      // = 8px + 24px + 24px
      // = 56px * 25 = 1400 token
      "--button-safespace": "sizes.1400",
      color: "neutral.12",
      textAlign: "left",
      marginRight: "var(--button-safespace)",
      maxWidth: "100%",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",

      "&[data-placeholder]": {
        opacity: 0.5,
      },
      "[data-invalid] &": {
        color: "critical.11",
      },
    },
    // Popover
    options: {
      "--scrollbar-color": "colors.neutral.8",
      "--scrollbar-bg": "colors.neutral.3",

      bg: "bg",
      borderRadius: "200",
      boxShadow: "5",
      minWidth: "var(--trigger-width)",
      p: "200",
      focusRing: "outside",
      maxHeight: "40svh",
      overflowY: "auto",
      scrollbarWidth: "thin",
      scrollbarColor: "var(--scrollbar-color) var(--scrollbar-bg)",
      // [data-trigger="..."]
      // [data-placement="left | right | top | bottom"]
      // [data-entering]
      // [data-exiting]
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
      borderColor: "neutral.3",
      mx: "-200",
      mt: "200",
      mb: "300",
    },
    // ListBoxItem
    option: {
      focusRing: "outside",
      cursor: "menuitem",
      color: "neutral.12",
      textStyle: "sm",
      p: "200",
      borderRadius: "200",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      '&[aria-selected="true"]': {
        bg: "primary.3",
      },
      '&[data-focused="true"]': {
        bg: "primary.2",
      },
      '& [slot="label"]': {
        display: "block",
      },

      '& [slot="description"]': {
        display: "block",
        color: "neutral.11",
        textStyle: "xs",
      },

      '&[data-disabled="true"]': {
        layerStyle: "disabled",
      },
    },
  },

  // Available variants for customizing the component's appearance
  variants: {
    // Size variants from smallest to largest
    size: {
      sm: {
        root: {},
        trigger: {
          h: "800",
          px: "400",
          textStyle: "sm",
        },
      },
      md: {
        root: {},
        trigger: {
          h: "1000",
          px: "400",
          textStyle: "md",
        },
      }, // Medium
    },

    // Visual style variants
    variant: {
      outline: {
        root: {
          bg: "primary.1",
          "&:hover": {
            bg: "primary.2",
          },
        },
        trigger: {
          "--border-width": "sizes.25",
          "--border-color": "colors.neutral.7",
        },
      },
      ghost: {
        root: {
          bg: "transparent",
          "&:hover": {
            bg: "primaryAlpha.2",
          },
        },
        trigger: {
          "--border-width": "sizes.25",
          "--border-color": "transparent",
        },
      },
    },
  },

  // Default variant values when not explicitly specified
  defaultVariants: {
    size: "md",
    variant: "outline",
  },
});
