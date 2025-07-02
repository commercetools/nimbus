import { defineSlotRecipe } from "@chakra-ui/react";

/**
 * Recipe configuration for the ProgressBar component.
 * Defines the styling variants and base styles using Chakra UI's slot recipe system.
 */
export const progressBarSlotRecipe = defineSlotRecipe({
  className: "nimbus-progress-bar",

  slots: ["root", "track", "fill", "label", "value"],

  // Base styles applied to all instances of the component
  base: {
    root: {
      position: "relative",
      width: "100%",
      display: "flex",
      flexDirection: "column",
      gap: "200",
    },

    track: {
      backgroundColor: "colorPalette.3",
      borderRadius: "200",
      overflow: "hidden",
      position: "relative",
      width: "100%",
    },

    fill: {
      bgImage:
        "linear-gradient(90deg, {colors.colorPalette.6}, {colors.colorPalette.9}, {colors.colorPalette.6})",
      backgroundSize: "200% 100%",
      height: "100%",
      borderRadius: "200",
      transition: "width 0.3s ease-in-out",

      "&[data-complete='false']": {
        animation: "gradient-shimmer 4s ease-in-out infinite",
      },
      "&[data-complete='true']": {
        animation: "none",
      },
      "&[data-indeterminate='true']": {
        animation: "progress-indeterminate 2s ease-in-out infinite",
        width: "40% !important",
      },
    },

    label: {
      fontSize: "350",
      fontWeight: "500",
      color: "neutral.12",
    },

    value: {
      fontSize: "350",
      fontWeight: "500",
      color: "neutral.12",
    },
  },

  // Available variants for customizing the component's appearance
  variants: {
    size: {
      "2xs": {
        track: {
          height: "200",
        },
        label: {
          fontSize: "300",
        },
        value: {
          fontSize: "300",
        },
      },
      md: {
        track: {
          height: "400",
        },
        label: {
          fontSize: "350",
        },
        value: {
          fontSize: "350",
        },
      },
    },

    variant: {
      solid: {
        // Uses the current default styling (gradient fill)
      },
      contrast: {
        track: {
          backgroundColor: "colorPalette.contrast/15",
        },
        fill: {
          //bgImage: "none",
          //backgroundColor: "colorPalette.contrast",
          bgImage:
            "linear-gradient(90deg, {colors.colorPalette.contrast/25}, {colors.colorPalette.contrast}, {colors.colorPalette.contrast/25})",
        },
        label: {
          color: "colorPalette.contrast",
        },
        value: {
          color: "colorPalette.contrast",
        },
      },
    },

    layout: {
      plain: {
        label: {
          display: "none",
        },
        value: {
          display: "none",
        },
      },
      inline: {
        root: {
          flexDirection: "row",
          alignItems: "center",
          gap: "400",
        },
        track: {
          flex: 1,
        },
      },
      stacked: {
        root: {
          flexDirection: "column",
          gap: "200",
        },
        text: {
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        },
      },
    },
  },

  // Default variant values when not explicitly specified
  defaultVariants: {
    size: "md",
    colorPalette: "primary",
    variant: "solid",
    layout: "stacked",
  },
});
