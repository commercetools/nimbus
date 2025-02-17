import { defineSlotRecipe } from "@chakra-ui/react";

/**
 * Recipe configuration for the Checkbox component.
 * Defines the styling variants and base styles using Chakra UI's recipe system.
 */
export const checkboxSlotRecipe = defineSlotRecipe({
  slots: ["root", "label", "indicator"],
  // Unique class name prefix for the component
  className: "bleh-ui-checkbox",

  base: {
    root: {
      colorPalette: "primary",
      display: "inline-flex",
      gap: "200",
      alignItems: "center",
      verticalAlign: "top",
      minWidth: "600",
      minHeight: "600",
      ["&[data-disabled='true']"]: {
        layerStyle: "disabled",
      },
    },
    label: {
      flexShrink: 0,
      fontWeight: "500",
      userSelect: "none",
      color: "neutral.11",
      ["&[data-invalid='true']"]: {
        color: "error.11",
      },
    },
    indicator: {
      display: "flex",
      flexShrink: 0,
      border: "solid-50",
      borderRadius: "50",
      alignItems: "center",
      justifyContent: "center",
      focusRing: "outside",
      borderColor: "neutral.9",
      bg: "transparent",
      color: "neutral.11",

      position: "relative",
      _icon: {
        w: "350",
        h: "350",
      },

      ["&[data-invalid='true']"]: {
        borderColor: "error.9",
        bg: "transparent",
        color: "error.11",
      },

      ["&[data-selected='true'], &[data-indeterminate='true']"]: {
        borderColor: "colorPalette.9",
        bg: "colorPalette.9",
        color: "colorPalette.contrast",

        "&[data-invalid='true']": {
          borderColor: "error.9",
          bg: "error.9",
          color: "error.contrast",
        },
      },
    },
  },
  variants: {
    size: {
      md: {
        label: { textStyle: "md" },
        indicator: {
          w: "400",
          h: "400",
          zIndex: 1,
          _after: {
            position: "absolute",
            content: "''",
            width: "600",
            height: "600",
            zIndex: 0,
          },
        },
      },
    },
  },
  defaultVariants: {
    size: "md",
  },
});
