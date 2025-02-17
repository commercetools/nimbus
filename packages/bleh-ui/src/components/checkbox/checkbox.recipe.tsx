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
      display: "inline-flex",
      gap: "200",
      alignItems: "center",
      verticalAlign: "top",
      ["&[data-disabled='true']"]: {
        layerStyle: "disabled",
      },
    },
    label: {
      flexShrink: 0,
      fontWeight: "500",
      userSelect: "none",
      _disabled: {
        layerStyle: "disabled",
      },
    },
    indicator: {
      "--bd-color": "colors.neutral.9",
      "--bg-color": "colors.transparent",
      "--fg-color": "colors.neutral.11",
      display: "flex",
      flexShrink: 0,
      border: "solid-50",
      borderRadius: "50",
      alignItems: "center",
      justifyContent: "center",
      focusRing: "outside",
      borderColor: "var(--bd-color)",
      bg: "var(--bg-color)",
      color: "var(--fg-color)",
      _icon: {
        w: "350",
        h: "350",
      },

      ["&[data-selected='true'], &[data-indeterminate='true']"]: {
        "--bd-color": "colors.primary.9",
        "--bg-color": "colors.primary.9",
        "--fg-color": "colors.primary.contrast",

        "&[data-invalid='true']": {
          "--bg-color": "colors.error.9",
        },
      },
      ["&[data-invalid='true']"]: {
        "--bd-color": "colors.error.9",
        "--bg-color": "transparent",
        "--fg-color": "colors.error.contrast",
      },
    },
  },
  variants: {
    size: {
      md: {
        root: {},
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
