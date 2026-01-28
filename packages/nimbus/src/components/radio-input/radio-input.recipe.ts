import { defineSlotRecipe } from "@chakra-ui/react/styled-system";

const radioInputVariants = {
  orientation: {
    horizontal: {
      root: {
        flexDirection: "row",
        gap: "600",
      },
    },
    vertical: {
      root: {
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "400",
      },
    },
  },
} as const;

/**
 * Recipe configuration for the RadioInput component.
 * Defines the styling variants and base styles using Chakra UI's recipe system.
 */
export const radioInputSlotRecipe = defineSlotRecipe({
  slots: ["root", "option"],
  // Unique class name prefix for the component
  className: "nimbus-radio-input",

  base: {
    root: {
      colorPalette: "primary",
      display: "inline-flex",
      flexDirection: "row",
      alignItems: "center",
      verticalAlign: "top",
    },
    option: {
      gap: "200",
      flexShrink: 0,
      whiteSpace: "nowrap",
      userSelect: "none",
      position: "relative",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",

      "& > svg": {
        width: "500",
        height: "500",
        color: "neutral.9",

        "&:hover": {
          color: "neutral.10",
        },
      },

      "&[data-selected] > svg": {
        color: "colorPalette.9",
      },

      ["&[data-disabled='true']"]: {
        layerStyle: "disabled",
      },
      // Sets the text & svg color
      ["&[data-invalid='true']"]: {
        color: "critical.9",
        "& > svg": {
          color: "critical.9",
        },
      },
      "&[data-focus] > svg": {
        outline: "2px solid var(--focus-ring-color, ##AFBBFF)",
        outlineOffset: "1px",
        borderRadius: "50%",
      },
    },
  },
  variants: radioInputVariants,
  defaultVariants: {
    orientation: "vertical",
  },
});

export type RadioInputOrientation = keyof typeof radioInputVariants.orientation;
