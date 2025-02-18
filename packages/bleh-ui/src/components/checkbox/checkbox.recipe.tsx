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
      fontSize: "350",
      lineHeight: "400",
      fontWeight: "400",
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

      "&:hover": {
        borderColor: "neutral.10",
      },

      ["&[data-invalid='true']"]: {
        bg: "transparent",
        borderColor: "error.9",
        color: "error.11",
        "&:hover": {
          borderColor: "error.10",
        },
      },

      ["&[data-selected='true'], &[data-indeterminate='true']"]: {
        bg: "colorPalette.9",
        borderColor: "colorPalette.9",
        color: "colorPalette.contrast",

        "&:hover": {
          bg: "colorPalette.10",
          borderColor: "colorPalette.10",
        },

        "&[data-invalid='true']": {
          bg: "error.9",
          borderColor: "error.9",
          color: "error.contrast",
          "&:hover": {
            borderColor: "error.10",
            bg: "error.10",
          },
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
