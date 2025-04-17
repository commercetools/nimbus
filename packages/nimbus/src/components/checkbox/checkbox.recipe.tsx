import { defineSlotRecipe } from "@chakra-ui/react";

/**
 * Recipe configuration for the Checkbox component.
 * Defines the styling variants and base styles using Chakra UI's recipe system.
 */
export const checkboxSlotRecipe = defineSlotRecipe({
  slots: ["root", "label", "indicator"],
  // Unique class name prefix for the component
  className: "nimbus-checkbox",

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
      userSelect: "none",
      color: "neutral.11",

      ["&[data-invalid='true']"]: {
        color: "critical.11",
      },
    },
    indicator: {
      position: "relative",
      display: "flex",
      flexShrink: 0,
      alignItems: "center",
      justifyContent: "center",
      border: "solid-50",
      borderRadius: "50",
      focusRing: "outside",
      borderColor: "neutral.9",
      bg: "transparent",
      color: "neutral.11",

      _icon: {
        w: "350",
        h: "350",
      },

      "&:hover": {
        borderColor: "neutral.10",
      },

      ["&[data-invalid='true']"]: {
        bg: "transparent",
        borderColor: "critical.9",
        color: "critical.11",

        "&:hover": {
          borderColor: "critical.10",
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
          bg: "critical.9",
          borderColor: "critical.9",
          color: "critical.contrast",

          "&:hover": {
            bg: "critical.10",
            borderColor: "critical.10",
          },
        },
      },
    },
  },
  variants: {
    size: {
      md: {
        label: {
          fontSize: "350",
          fontWeight: "400",
          lineHeight: "400",
        },
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
