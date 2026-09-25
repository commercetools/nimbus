import { defineSlotRecipe } from "@chakra-ui/react/styled-system";

/**
 * Recipe configuration for the Meter component.
 * Defines the styling variants and base styles using Chakra UI's slot recipe system.
 */
export const meterSlotRecipe = defineSlotRecipe({
  className: "nimbus-meter",

  slots: [
    "root",
    "header",
    "label",
    "value",
    "track",
    "segment",
    "legend",
    "legendItem",
    "legendSwatch",
  ],

  // Base styles applied to all instances of the component
  base: {
    root: {
      "--meter-text-color": "{colors.neutral.12}",
      "--meter-track-bg": "{colors.neutralAlpha.3}",
      position: "relative",
      width: "100%",
      display: "flex",
      flexDirection: "column",
      gap: "200",
    },

    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "baseline",
      gap: "200",
    },

    label: {
      color: "var(--meter-text-color)",
      fontSize: "var(--meter-font-size)",
      lineHeight: "var(--meter-line-height)",
    },

    value: {
      color: "var(--meter-text-color)",
      fontSize: "var(--meter-font-size)",
      lineHeight: "var(--meter-line-height)",
      fontVariantNumeric: "tabular-nums",
      // Keeps the value at the end of the header, also without a label
      marginInlineStart: "auto",
    },

    track: {
      display: "flex",
      // Gap keeps adjacent segments distinguishable, even with similar colors
      gap: "50",
      backgroundColor: "var(--meter-track-bg)",
      borderRadius: "var(--meter-radius)",
      overflow: "hidden",
      width: "100%",
      height: "var(--meter-height)",
    },

    segment: {
      // Step 11 is the lowest step that keeps >= 3:1 against the track for
      // every palette in light and dark mode (WCAG 2.1 SC 1.4.11)
      backgroundColor: "colorPalette.11",
      height: "100%",
      // Lets segments give up the gap space when they fill the whole track
      flexShrink: 1,
      minWidth: 0,
      borderRadius: "var(--meter-radius)",
      transitionProperty: "width",
      transitionDuration: "moderate",
      transitionTimingFunction: "ease-in-smooth",
      _motionReduce: {
        transition: "none",
      },
    },

    legend: {
      display: "flex",
      flexWrap: "wrap",
      columnGap: "400",
      rowGap: "100",
      listStyle: "none",
      margin: 0,
      padding: 0,
    },

    legendItem: {
      display: "inline-flex",
      alignItems: "center",
      gap: "100",
      color: "var(--meter-text-color)",
      fontSize: "var(--meter-font-size)",
      lineHeight: "var(--meter-line-height)",
    },

    legendSwatch: {
      display: "inline-block",
      flexShrink: 0,
      width: "var(--meter-swatch-size)",
      height: "var(--meter-swatch-size)",
      borderRadius: "full",
      backgroundColor: "colorPalette.11",
    },
  },

  // Available variants for customizing the component's appearance
  variants: {
    size: {
      "2xs": {
        root: {
          "--meter-radius": "{radii.300}",
          "--meter-font-size": "{fontSizes.350}",
          "--meter-height": "{sizes.300}",
          "--meter-line-height": "{fontSizes.500}",
          "--meter-swatch-size": "{sizes.200}",
        },
      },
      md: {
        root: {
          "--meter-radius": "{radii.600}",
          "--meter-font-size": "{fontSizes.400}",
          "--meter-height": "{sizes.600}",
          "--meter-line-height": "{fontSizes.600}",
          "--meter-swatch-size": "{sizes.300}",
        },
      },
    },

    layout: {
      minimal: {
        header: {
          display: "none",
        },
      },
      inline: {
        root: {
          flexDirection: "row",
          flexWrap: "wrap",
          alignItems: "center",
          columnGap: "400",
          rowGap: "200",
        },
        track: {
          flex: 1,
        },
        legend: {
          flexBasis: "100%",
        },
      },
      stacked: {
        root: {
          flexDirection: "column",
          gap: "200",
        },
      },
    },
  },

  // Default variant values when not explicitly specified
  defaultVariants: {
    size: "md",
    layout: "stacked",
  },
});
