import { defineSlotRecipe } from "@chakra-ui/react/styled-system";

/**
 * Recipe configuration for the Select component.
 * Defines the styling variants and base styles using Chakra UI's recipe system.
 */
export const selectSlotRecipe = defineSlotRecipe({
  slots: [
    "root",
    "leadingElement",
    "trigger",
    "triggerButton",
    "triggerLabel",
    "trailingElement",
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
      "&[data-disabled='true']": {
        layerStyle: "disabled",
        pointerEvents: "none",
        bg: "neutral.3",
      },
    },
    // The field container. Non-interactive: it owns the chrome, while the
    // button below owns the interaction. This lets the clear button, chevron and
    // a consumer-provided trailing element sit beside the button in normal flow
    // instead of being absolutely positioned over it.
    trigger: {
      cursor: "button",
      display: "inline-flex",
      alignItems: "center",
      // Containing block for the trigger button's stretched hit area below.
      position: "relative",
      borderRadius: "200",
      color: "neutral.12",
      width: "100%",
      boxShadow: "inset 0 0 0 var(--border-width) var(--border-color)",

      focusRing: "outside",
      _focusWithin: {
        layerStyle: "focusRing",
      },

      '& [slot="description"]': {
        display: "none",
      },

      "[data-invalid] &": {
        "--border-width": "sizes.50",
        "--border-color": "colors.critical.7",
      },
    },
    // The interactive trigger. Transparent and unpainted - it grows to fill
    // whatever the sibling controls leave, so clicking anywhere in the field
    // except those controls still opens the listbox.
    triggerButton: {
      cursor: "button",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "flex-start",
      flex: "1",
      minWidth: 0,
      bg: "transparent",
      border: "none",
      color: "inherit",
      font: "inherit",
      textAlign: "left",
      userSelect: "none",
      padding: 0,
      // The ring is drawn by the container via _focusWithin.
      focusRing: "none",

      // Extends the pressable area across the whole field. Pseudo-elements are
      // not event targets, so React Aria still sees a normal press on the
      // button; siblings that need their own clicks are raised above it.
      _after: {
        content: '""',
        position: "absolute",
        inset: 0,
      },
    },
    leadingElement: {
      display: "flex",
      alignItems: "center",
      color: "neutral.11",
    },
    trailingElement: {
      display: "flex",
      alignItems: "center",
      color: "neutral.11",
      flexShrink: 0,
      // Above the trigger button's stretched hit area.
      position: "relative",
      zIndex: 1,
    },
    triggerLabel: {
      color: "neutral.12",
      textAlign: "left",
      flex: "1",
      minWidth: 0,
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

      "&[data-disabled='true']": {
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
          // Deliberately asymmetric. The overlay this layout replaced was
          // positioned `right="400"` regardless of size, so sm has always inset
          // its controls by 16px while padding its content by 12px. Kept so sm
          // stays pixel-identical to the previous layout - do not "correct" it
          // to `px` without re-baselining sm.
          pl: "300",
          pr: "400",
          gap: "100",
          h: "800",
          textStyle: "sm",
        },
        triggerButton: {
          gap: "100",
        },
        leadingElement: {
          "& > svg": {
            boxSize: "400",
          },
        },
        trailingElement: {
          "& > svg": {
            boxSize: "400",
          },
        },
      },
      md: {
        root: {},
        trigger: {
          px: "400",
          gap: "200",
          h: "1000",
          textStyle: "md",
        },
        triggerButton: {
          gap: "200",
        },
        leadingElement: {
          "& > svg": {
            boxSize: "500",
          },
        },
        trailingElement: {
          "& > svg": {
            boxSize: "500",
          },
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
