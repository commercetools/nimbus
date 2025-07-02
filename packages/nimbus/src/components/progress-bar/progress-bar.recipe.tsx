import { defineSlotRecipe } from "@chakra-ui/react";

/**
 * Recipe configuration for the ProgressBar component.
 * Defines the styling variants and base styles using Chakra UI's slot recipe system.
 */
export const progressBarSlotRecipe = defineSlotRecipe({
  className: "nimbus-progress-bar",

  slots: ["root", "track", "fill", "text", "label", "value"],

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
      backgroundColor: "colorPalette.9",
      height: "100%",
      borderRadius: "200",
      transition: "width 0.3s ease-in-out",

      "&[data-indeterminate='true']": {
        animation: "progress-indeterminate 1.5s ease-in-out infinite",
        width: "40% !important",
      },
    },

    text: {
      colorPalette: "neutral",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
    },

    label: {
      fontSize: "350",
      fontWeight: "500",
      color: "colorPalette.12",
    },

    value: {
      fontSize: "350",
      fontWeight: "500",
      color: "colorPalette.12",
    },
  },

  // Available variants for customizing the component's appearance
  variants: {
    size: {
      "2xs": {
        track: {
          height: "200",
        },
        text: {
          fontSize: "300",
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
        text: {
          fontSize: "350",
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
      hidden: {
        text: {
          display: "none",
        },
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
        text: {
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          minWidth: "max-content",
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
    variant: "stacked",
  },
});
