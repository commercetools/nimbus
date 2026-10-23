import { defineSlotRecipe } from "@chakra-ui/react/styled-system";

/**
 * Recipe configuration for the Meter component.
 * Defines the styling variants and base styles using Chakra UI's slot recipe system.
 *
 * Each part has a fixed grid area, so `layout` places the parts no matter in
 * which order they are written. Spacing comes from margins on the parts, not
 * from grid `gap`, so a part that is left out leaves no empty space. Spacing
 * and the legend swatch are in `em`, so they follow the text.
 */
export const meterSlotRecipe = defineSlotRecipe({
  className: "nimbus-meter",

  slots: [
    "root",
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
      display: "grid",
      color: "var(--meter-text-color)",
    },

    label: {
      gridArea: "label",
    },

    value: {
      gridArea: "value",
      fontVariantNumeric: "tabular-nums",
      textAlign: "end",
      // A value such as "62 GB" must not break onto two lines
      whiteSpace: "nowrap",
    },

    track: {
      gridArea: "track",
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
      // The width already leaves room for the gaps (see Meter.Track)
      flexShrink: 0,
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
      gridArea: "legend",
      display: "flex",
      flexWrap: "wrap",
      columnGap: "1em",
      rowGap: "0.25em",
      listStyle: "none",
      margin: 0,
      marginTop: "0.5em",
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
    // Bar thickness, and the default text style that matches it. The
    // `textStyle` style prop on Root or on one part changes the text.
    size: {
      // Dense contexts: tables, sidebars, several meters in a card
      sm: {
        root: {
          "--meter-height": "{spacing.100}",
          "--meter-radius": "{radii.50}",
          "--meter-segment-gap": "{spacing.25}",
          textStyle: "xs",
        },
      },
      // Standard page content
      md: {
        root: {
          "--meter-height": "{spacing.200}",
          "--meter-radius": "{radii.50}",
          "--meter-segment-gap": "{spacing.50}",
          textStyle: "sm",
        },
      },
      // The meter is the main focus of the view
      lg: {
        root: {
          "--meter-height": "{spacing.300}",
          "--meter-radius": "{radii.50}",
          "--meter-segment-gap": "{spacing.50}",
          textStyle: "md",
        },
      },
    },

    layout: {
      // Label and value on one line above the track, legend below
      stacked: {
        root: {
          gridTemplateAreas: `"label value" "track track" "legend legend"`,
          gridTemplateColumns: "minmax(0, 1fr) auto",
        },
        label: {
          alignSelf: "baseline",
          marginBottom: "0.5em",
        },
        value: {
          alignSelf: "baseline",
          marginBottom: "0.5em",
          marginInlineStart: "0.5em",
        },
      },
      // Label, track and value on one line, legend below
      inline: {
        root: {
          gridTemplateAreas: `"label track value" "legend legend legend"`,
          gridTemplateColumns: "auto minmax(0, 1fr) auto",
          alignItems: "center",
        },
        label: {
          marginInlineEnd: "1em",
        },
        value: {
          marginInlineStart: "1em",
          // With tabular numbers every digit is 1ch wide, so the widest
          // percent ("100 %" with a space, as in German) fits in 5ch. Meters
          // in a column then get the same track width. Longer values grow.
          minWidth: "5ch",
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
