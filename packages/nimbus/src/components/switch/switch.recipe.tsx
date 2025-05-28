import { defineSlotRecipe } from "@chakra-ui/react";

/**
 * Recipe configuration for the Switch component.
 * Defines the styling variants and base styles using Chakra UI's recipe system.
 */
export const switchSlotRecipe = defineSlotRecipe({
  slots: ["root", "label", "track", "thumb"],
  // Unique class name prefix for the component
  className: "nimbus-switch",

  base: {
    root: {
      colorPalette: "primary",
      display: "inline-flex",
      gap: "200",
      alignItems: "center",
      verticalAlign: "top",
      cursor: "pointer",
      borderRadius: "full",

      ["&[data-disabled='true']"]: {
        layerStyle: "disabled",
        pointerEvents: "none",
      },
    },
    label: {
      flexShrink: 0,
      userSelect: "none",
      color: "neutral.11",
      fontSize: "var(--label-font-size)",
    },
    track: {
      colorPalette: "neutral",
      focusRing: "outside",
      position: "relative",
      display: "flex",
      alignItems: "center",
      flexShrink: 0,
      width: "var(--track-width)",
      height: "var(--track-height)",
      borderRadius: "calc(var(--track-height) / 2)",
      backgroundColor: "colorPalette.5",
      transition: "background-color 0.2s",

      ["&[data-selected='true']"]: {
        colorPalette: "primary",
        backgroundColor: "colorPalette.9",
      },

      "&:hover": {
        backgroundColor: "colorPalette.7",

        ["&[data-selected='true']"]: {
          backgroundColor: "colorPalette.10",
        },
      },
    },
    thumb: {
      position: "absolute",
      borderRadius: "full",
      border: "solid-50",
      borderColor: "primary.9",
      backgroundColor: "neutral.1",
      transition: "all 0.2s",
      boxSize: "var(--thumb-size)",

      ["&[data-selected='false']"]: {
        left: "0",
      },

      ["&[data-selected='true']"]: {
        left: "calc(100% - var(--thumb-size))",
      },
    },
  },
  variants: {
    size: {
      sm: {
        track: {
          "--track-height": "sizes.400",
          "--track-width": "sizes.700",
        },
        thumb: {
          "--thumb-size": "sizes.400",
        },
        label: {
          "--label-font-size": "fontSizes.350",
        },
      },
      md: {
        track: {
          "--track-height": "sizes.600",
          "--track-width": "sizes.1100",
        },
        thumb: {
          "--thumb-size": "sizes.600",
        },
        label: {
          "--label-font-size": "fontSizes.400",
        },
      },
    },
  },
  defaultVariants: {
    size: "md",
  },
});
