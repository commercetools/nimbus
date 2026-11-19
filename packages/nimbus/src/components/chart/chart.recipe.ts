import { defineSlotRecipe } from "@chakra-ui/react/styled-system";

/**
 * Recipe configuration for the shared chart parts (container, legend,
 * tooltip, empty state), and for the Recharts elements inside the container.
 *
 * Recharts draws plain SVG with its own class names. The root styles them with
 * descendant selectors, so grid lines, axes and tick text use Nimbus tokens
 * and follow light and dark mode. Series colors are not set here: they come
 * from `var(--nimbus-colors-<palette>-9)` on each shape.
 * Text uses `fg` and `fg.subtle`, both at least 4.5:1 against `bg`.
 */
export const chartSlotRecipe = defineSlotRecipe({
  className: "nimbus-chart",

  slots: [
    "root",
    "plot",
    "empty",
    "legend",
    "legendItem",
    "legendSwatch",
    "tooltip",
    "tooltipLabel",
    "tooltipItem",
    "tooltipValue",
  ],

  base: {
    root: {
      "--chart-swatch-size": "0.625em",
      "@supports (width: round(1px, 1px))": {
        "--chart-swatch-size": "round(0.625em, 1px)",
      },
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: "{spacing.200}",
      width: "100%",
      color: "fg",
      textStyle: "xs",

      // Recharts internals
      "& .recharts-wrapper": {
        // Tooltip and legend sit inside the wrapper, so it must not clip them
        overflow: "visible",
      },
      "& .recharts-cartesian-grid line": {
        stroke: "{colors.neutral.4}",
        strokeWidth: "1px",
      },
      "& .recharts-polar-grid-concentric-polygon, & .recharts-polar-grid-concentric-circle, & .recharts-polar-grid-angle line":
        {
          stroke: "{colors.neutral.4}",
          strokeWidth: "1px",
        },
      "& .recharts-cartesian-axis-line, & .recharts-cartesian-axis-tick-line": {
        stroke: "transparent",
      },
      "& .recharts-cartesian-axis-tick-value, & .recharts-polar-angle-axis-tick-value, & .recharts-polar-radius-axis-tick-value, & .recharts-label":
        {
          fill: "{colors.fg.subtle}",
          fontSize: "{fontSizes.300}",
        },
      // Recharts puts the tab stop on the svg (and the wrapper). Use the shared
      // focus ring instead of a hand-written outline.
      "& .recharts-surface, & .recharts-wrapper": {
        focusVisibleRing: "outside",
      },
    },

    // Holds the chart, skeleton or empty state. The aspect ratio keeps it from
    // collapsing to zero height when the parent has no height. The legend sits
    // below it and adds its own height.
    plot: {
      position: "relative",
      width: "100%",
      aspectRatio: "wide",
    },

    empty: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      height: "100%",
      color: "fg.subtle",
      textStyle: "sm",
      textAlign: "center",
    },

    legend: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "center",
      columnGap: "1em",
      rowGap: "0.25em",
      listStyle: "none",
      margin: 0,
      padding: 0,
      color: "fg.subtle",
    },

    legendItem: {
      display: "inline-flex",
      alignItems: "center",
      gap: "0.5em",
    },

    legendSwatch: {
      display: "inline-block",
      flexShrink: 0,
      width: "var(--chart-swatch-size)",
      height: "var(--chart-swatch-size)",
      borderRadius: "{radii.50}",
      // The color is set inline from the series config
      backgroundColor: "currentColor",
      // Keep the swatch color in forced-colors mode (Windows High Contrast).
      // Without it the swatch can vanish and color would be the only cue left.
      forcedColorAdjust: "none",
    },

    tooltip: {
      display: "flex",
      flexDirection: "column",
      gap: "{spacing.100}",
      minWidth: "8rem",
      paddingX: "{spacing.300}",
      paddingY: "{spacing.200}",
      backgroundColor: "bg",
      color: "fg",
      border: "1px solid",
      borderColor: "border",
      borderRadius: "{radii.200}",
      boxShadow: "{shadows.3}",
      textStyle: "xs",
    },

    tooltipLabel: {
      color: "fg",
      fontWeight: "500",
    },

    tooltipItem: {
      display: "flex",
      alignItems: "center",
      gap: "0.5em",
      color: "fg.subtle",
    },

    tooltipValue: {
      marginInlineStart: "auto",
      paddingInlineStart: "1em",
      color: "fg",
      fontVariantNumeric: "tabular-nums",
      fontWeight: "500",
    },
  },
});
