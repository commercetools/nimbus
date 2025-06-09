import { defineSlotRecipe } from "@chakra-ui/react";

/**
 * Recipe configuration for the RadioInput component.
 * Defines the styling variants and base styles using Chakra UI's recipe system.
 */
export const radioInputSlotRecipe = defineSlotRecipe({
  slots: ["root", "label", "indicator"],
  // Unique class name prefix for the component
  className: "nimbus-radio-input",

  base: {
    root: {
      colorPalette: "primary",
      display: "inline-flex",
      gap: "200",
      alignItems: "center",
      verticalAlign: "top",
      borderRadius: "300",

      ["&[data-disabled='true']"]: {
        layerStyle: "disabled",
      },
    },
    label: {
      flexShrink: 0,
      whiteSpace: "nowrap",
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
      borderRadius: "300",
      focusRing: "outside",
      borderColor: "neutral.9",
      bg: "transparent",
      color: "neutral.9",
      "&:hover": {
        color: "neutral.10",
      },
      "&[data-selected='true']": {
        color: "primary.9",
      },

      ["&[data-invalid='true']"]: {
        bg: "transparent",
        borderColor: "critical.9",
        color: "critical.11",

        "&:hover": {
          borderColor: "critical.10",
          color: "critical.10",
        },
      },
    },
  },
});
