import { defineSlotRecipe } from "@chakra-ui/react/styled-system";

/**
 * Recipe for Slider / RangeSlider components.
 * Slots map onto React Aria Slider anatomy. Sizes and orientation are
 * variants; fill length/position is applied by React Aria's SliderFill,
 * so the recipe only styles appearance, not fill geometry.
 */
export const sliderSlotRecipe = defineSlotRecipe({
  className: "nimbus-slider",
  slots: [
    "root",
    "label",
    "output",
    "track",
    "fill",
    "thumb",
    "tick",
    "tickLabel",
  ],
  base: {
    root: {
      colorPalette: "primary",
      display: "grid",
      gridTemplateAreas: `"label output" "track track"`,
      gridTemplateColumns: "1fr auto",
      alignItems: "center",
      columnGap: "200",
      width: "100%",
      userSelect: "none",
      touchAction: "none",

      '&[data-orientation="vertical"]': {
        gridTemplateAreas: `"output" "track"`,
        gridTemplateColumns: "auto",
        width: "auto",
        height: "var(--slider-vertical-length, 200px)",
        justifyItems: "center",
      },

      "&[data-disabled='true']": {
        layerStyle: "disabled",
        pointerEvents: "none",
      },
    },
    label: {
      gridArea: "label",
      fontSize: "350",
      color: "neutral.11",
      userSelect: "none",
    },
    output: {
      gridArea: "output",
      justifySelf: "end",
      fontSize: "350",
      color: "neutral.11",
      fontVariantNumeric: "tabular-nums",
    },
    track: {
      gridArea: "track",
      position: "relative",
      display: "flex",
      alignItems: "center",
      borderRadius: "full",
      backgroundColor: "neutral.6",
      width: "100%",
      height: "var(--slider-track-thickness)",
      cursor: "pointer",

      '&[data-orientation="vertical"]': {
        flexDirection: "column",
        width: "var(--slider-track-thickness)",
        height: "100%",
      },

      "&[data-disabled='true']": {
        cursor: "default",
      },
    },
    fill: {
      position: "absolute",
      borderRadius: "full",
      backgroundColor: "colorPalette.9",
      height: "var(--slider-track-thickness)",
      top: "0",
      left: "0",

      '&[data-orientation="vertical"]': {
        width: "var(--slider-track-thickness)",
        height: "auto",
        left: "0",
        bottom: "0",
        top: "auto",
      },
    },
    thumb: {
      boxSize: "var(--slider-thumb-size)",
      borderRadius: "full",
      backgroundColor: "neutral.1",
      border: "solid-50",
      borderColor: "colorPalette.9",
      transition: "background-color 0.15s, transform 0.15s",
      focusRing: "outside",

      "&[data-hovered='true']": {
        backgroundColor: "colorPalette.2",
      },
      "&[data-dragging='true']": {
        backgroundColor: "colorPalette.3",
        transform: "scale(1.1)",
      },
    },
    tick: {
      position: "absolute",
      top: "50%",
      width: "2px",
      height: "var(--slider-tick-length)",
      backgroundColor: "neutral.8",
      transform: "translate(-50%, -50%)",
      pointerEvents: "none",
    },
    tickLabel: {
      position: "absolute",
      top: "calc(50% + var(--slider-tick-length))",
      fontSize: "300",
      color: "neutral.11",
      transform: "translateX(-50%)",
      whiteSpace: "nowrap",
      pointerEvents: "none",
    },
  },
  variants: {
    size: {
      sm: {
        track: { "--slider-track-thickness": "sizes.100" },
        thumb: { "--slider-thumb-size": "sizes.400" },
        root: { "--slider-tick-length": "sizes.150" },
      },
      md: {
        track: { "--slider-track-thickness": "sizes.150" },
        thumb: { "--slider-thumb-size": "sizes.500" },
        root: { "--slider-tick-length": "sizes.200" },
      },
    },
  },
  defaultVariants: {
    size: "md",
  },
});
