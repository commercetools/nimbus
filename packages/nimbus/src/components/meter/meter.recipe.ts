import { defineSlotRecipe } from "@chakra-ui/react/styled-system";

/**
 * Recipe configuration for the Meter component.
 * Defines the styling variants and base styles using Chakra UI's slot recipe system.
 *
 * Two independent axes: `size` sets the bar (height, radius, segment gap) in
 * fixed tokens, and `textStyle` sets the text. Spacing and the legend swatch
 * are in `em`, so they follow the text.
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
      "--meter-swatch-size": "0.625em",
      // Whole pixels keep the swatch edges sharp. Without the check, browsers
      // without `round()` would draw no swatch at all
      "@supports (width: round(1px, 1px))": {
        "--meter-swatch-size": "round(0.625em, 1px)",
      },
      position: "relative",
      width: "100%",
      display: "flex",
      flexDirection: "column",
      gap: "0.5em",
      color: "var(--meter-text-color)",
    },

    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "baseline",
      gap: "0.5em",
    },

    label: {},

    value: {
      fontVariantNumeric: "tabular-nums",
      // Keeps the value at the end of the header, also without a label
      marginInlineStart: "auto",
      // A value such as "62 GB" must not break onto two lines
      whiteSpace: "nowrap",
      flexShrink: 0,
    },

    track: {
      display: "flex",
      // Gap keeps adjacent segments distinguishable, even with similar colors
      gap: "var(--meter-segment-gap)",
      backgroundColor: "var(--meter-track-bg)",
      borderRadius: "var(--meter-radius)",
      overflow: "hidden",
      width: "100%",
      height: "var(--meter-height)",
    },

    segment: {
      backgroundColor: "colorPalette.9",
      height: "100%",
      // Lets segments give up gap space to fill the whole track
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
      columnGap: "1em",
      rowGap: "0.25em",
      listStyle: "none",
      margin: 0,
      padding: 0,
    },

    legendItem: {
      display: "inline-flex",
      alignItems: "center",
      gap: "0.375em",
    },

    legendSwatch: {
      display: "inline-block",
      flexShrink: 0,
      width: "var(--meter-swatch-size)",
      height: "var(--meter-swatch-size)",
      borderRadius: "{radii.50}",
      backgroundColor: "colorPalette.9",
    },
  },

  // Available variants for customizing the component's appearance
  variants: {
    // Bar thickness only; the text is set by `textStyle`
    size: {
      // Dense contexts: tables, sidebars, several meters in a card
      sm: {
        root: {
          "--meter-height": "{spacing.100}",
          "--meter-radius": "{radii.50}",
          "--meter-segment-gap": "{spacing.25}",
        },
      },
      // Standard page content
      md: {
        root: {
          "--meter-height": "{spacing.200}",
          "--meter-radius": "{radii.50}",
          "--meter-segment-gap": "{spacing.50}",
        },
      },
      // The meter is the main focus of the view
      lg: {
        root: {
          "--meter-height": "{spacing.300}",
          "--meter-radius": "{radii.50}",
          "--meter-segment-gap": "{spacing.50}",
        },
      },
    },

    // Text of label, value and legend; the default follows `size` (see
    // METER_DEFAULT_TEXT_STYLES)
    textStyle: {
      xs: { root: { textStyle: "xs" } },
      sm: { root: { textStyle: "sm" } },
      md: { root: { textStyle: "md" } },
      // Takes font size and line height from the surrounding text
      inherit: { root: {} },
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
          columnGap: "1em",
          rowGap: "0.5em",
        },
        track: {
          flex: 1,
        },
        value: {
          // With tabular numbers every digit is 1ch wide, so the widest
          // percent ("100 %" with a space, as in German) fits in 5ch. Meters
          // in a column then get the same track width. Longer values grow.
          minWidth: "5ch",
          textAlign: "end",
        },
        legend: {
          flexBasis: "100%",
        },
      },
      stacked: {
        root: {
          flexDirection: "column",
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
