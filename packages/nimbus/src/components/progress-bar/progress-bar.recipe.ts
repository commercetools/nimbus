import { defineSlotRecipe } from "@chakra-ui/react/styled-system";

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
      backgroundColor: "var(--progress-bar-track-bg)",
      borderRadius: "var(--progress-bar-radius)",
      overflow: "hidden",
      position: "relative",
      width: "100%",
      height: "var(--progress-bar-height)",
    },

    fill: {
      animation: "var(--progress-bar-animation)",
      bgImage:
        "linear-gradient(90deg, {colors.colorPalette.6}, {colors.colorPalette.9}, {colors.colorPalette.6})",
      backgroundSize: "200% 100%",
      height: "100%",
      borderRadius: "var(--progress-bar-radius)",
      transitionProperty: "width",
      transitionDuration: ".3s",
      transitionTimingFunction: "ease-in-smooth",
    },

    label: {
      color: "var(--progress-bar-text-color)",
      fontSize: "var(--progress-bar-font-size)",
      lineHeight: "var(--progress-bar-line-height)",
    },

    value: {
      color: "var(--progress-bar-text-color)",
      fontSize: "var(--progress-bar-font-size)",
      lineHeight: "var(--progress-bar-line-height)",
    },
  },

  // Available variants for customizing the component's appearance
  variants: {
    size: {
      "2xs": {
        root: {
          "--progress-bar-radius": "{radii.300}",
          "--progress-bar-font-size": "{fontSizes.350}",
          "--progress-bar-height": "{sizes.300}",
          "--progress-bar-line-height": "{fontSizes.500}",
        },
      },
      md: {
        root: {
          "--progress-bar-radius": "{radii.600}",
          "--progress-bar-font-size": "{fontSizes.400}",
          "--progress-bar-height": "{sizes.600}",
          "--progress-bar-line-height": "{fontSizes.600}",
        },
      },
    },

    isDynamic: {
      true: {
        fill: {
          "--progress-bar-animation":
            "gradient-shimmer 4s ease-in-out infinite",
          "&[data-complete='true']": {
            "--progress-bar-animation": "none",
          },
        },
      },
    },

    isIndeterminate: {
      true: {
        fill: {
          "--progress-bar-animation":
            "progress-indeterminate 2s ease-in-out infinite",
          width: "40% !important",
        },
      },
    },

    variant: {
      solid: {
        root: {
          "--progress-bar-text-color": "{colors.neutral.12}",
          "--progress-bar-track-bg": "{colors.neutralAlpha.3}",
        },
        // Uses the current default styling (gradient fill)
      },
      contrast: {
        root: {
          "--progress-bar-text-color": "{colors.colorPalette.contrast}",
          "--progress-bar-track-bg": "{colors.colorPalette.contrast/15}",
        },
        fill: {
          bgImage:
            "linear-gradient(90deg, {colors.colorPalette.contrast/25}, {colors.colorPalette.contrast}, {colors.colorPalette.contrast/25})",
        },
      },
    },

    layout: {
      minimal: {
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
  compoundVariants: [
    {
      isDynamic: true,
      isIndeterminate: true,
      css: {
        fill: {
          "--progress-bar-animation":
            "progress-indeterminate 2s ease-in-out infinite",
        },
      },
    },
  ],
});
