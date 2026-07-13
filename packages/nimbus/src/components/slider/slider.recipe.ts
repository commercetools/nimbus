import { defineSlotRecipe } from "@chakra-ui/react/styled-system";

/**
 * Recipe for Slider / RangeSlider components.
 * Slots map onto React Aria Slider anatomy. Sizes and orientation are
 * variants; fill length/position is applied by React Aria's SliderFill,
 * so the recipe only styles appearance, not fill geometry. No visible
 * label or static value output — the current value is shown in a
 * per-thumb tooltip instead, so the root is a flex track container.
 */
export const sliderSlotRecipe = defineSlotRecipe({
  className: "nimbus-slider",
  slots: ["root", "track", "fill", "thumb", "tick", "tickLabel"],
  base: {
    root: {
      colorPalette: "primary",
      display: "flex",
      alignItems: "center",
      width: "100%",
      minHeight: "var(--slider-thumb-size)",
      userSelect: "none",
      touchAction: "none",

      '&[data-orientation="vertical"]': {
        width: "auto",
        height: "var(--slider-vertical-length, 200px)",
        flexDirection: "column",
        justifyContent: "center",
      },

      "&[data-disabled='true']": {
        layerStyle: "disabled",
        pointerEvents: "none",
      },
    },
    track: {
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

      // React Aria positions the thumb on the main axis only (inline `left`
      // for horizontal, `top` for vertical) and defers cross-axis centering to
      // CSS. Supply it here; React Aria's inline main-axis value wins over
      // this via inline-style specificity, so this only fills the cross axis
      // and stays RTL-safe.
      //
      // Unlike root/track/fill, React Aria's SliderThumb does not put
      // `data-orientation` on itself (only `data-hovered`/`data-dragging`/
      // `data-focused`/`data-focus-visible`/`data-disabled` — see
      // react-aria-components' `SliderThumb`), so the vertical override below
      // must ancestor-scope off `root`/`track`, the same way `tick` does.
      top: "50%",
      '[data-orientation="vertical"] &': {
        insetInlineStart: "50%",
      },

      "&[data-hovered='true']": {
        backgroundColor: "colorPalette.2",
      },
      "&[data-dragging='true']": {
        backgroundColor: "colorPalette.3",
        transform: "scale(1.1)",
      },
      // `data-invalid` lives on the root (React Aria's Slider has no
      // validation state of its own — see slider-base.tsx), so the thumb
      // reacts to its ancestor via this scoped selector rather than its own
      // attribute.
      // Re-assert the border width too (not just color): the `minimal` and
      // `enclosed` variants drop the thumb border, and borderColor alone would
      // be invisible without a width to paint.
      "[data-invalid='true'] &": {
        border: "solid-50",
        borderColor: "critical.7",
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

      // The tick is a plain div we render ourselves (not a React Aria
      // element), so it never receives `data-orientation` on itself — only
      // ancestors like `root`/`track`/`fill` do (see how those slots above
      // use the self selector `&[data-orientation="vertical"]`). Ancestor-
      // scope this override instead. `slider-base.tsx` positions the tick's
      // main axis via inline `bottom` (not `top`) when vertical, so `top`
      // must be cleared to `auto` here or the static `top: 50%` above would
      // win the over-constrained top/bottom/height conflict.
      '[data-orientation="vertical"] &': {
        top: "auto",
        insetInlineStart: "50%",
        width: "var(--slider-tick-length)",
        height: "2px",
        transform: "translate(-50%, 50%)",
      },
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
    // CSS custom properties only cascade from ancestor to descendant, so
    // --slider-track-thickness/--slider-thumb-size are declared on `root`
    // (an ancestor of track/thumb/fill) rather than on the slots that
    // consume them — that also lets root's own `minHeight` above resolve
    // the thumb size, instead of resolving to nothing because thumb (a
    // descendant) can't push a value up to its ancestor.
    size: {
      sm: {
        root: {
          "--slider-track-thickness": "sizes.100",
          "--slider-thumb-size": "sizes.400",
          "--slider-tick-length": "sizes.150",
        },
      },
      md: {
        root: {
          "--slider-track-thickness": "sizes.150",
          "--slider-thumb-size": "sizes.500",
          "--slider-tick-length": "sizes.200",
        },
      },
    },

    variant: {
      // Base look — no overrides. Declared so `solid` is a valid, default value.
      solid: {},

      // Transparent, bordered track and hollow (bordered) progress; thumb keeps
      // the base white-with-colored-border treatment.
      outline: {
        track: {
          backgroundColor: "transparent",
          border: "solid-25",
          borderColor: "colorPalette.7",
        },
        fill: {
          backgroundColor: "transparent",
          border: "solid-25",
          borderColor: "colorPalette.9",
        },
      },

      // Ultra-thin hairline track with a small solid colored thumb dot.
      // Track/fill thickness is set directly on the slot (not via the shared
      // size var) so it does not race with the `size` variant group.
      minimal: {
        track: {
          height: "2px",
          '&[data-orientation="vertical"]': { width: "2px", height: "100%" },
        },
        fill: {
          height: "2px",
          '&[data-orientation="vertical"]': { width: "2px", height: "auto" },
        },
        thumb: {
          boxSize: "calc(var(--slider-thumb-size) * 0.6)",
          backgroundColor: "colorPalette.9",
          border: "none",
        },
      },

      // Thick, contained "bar" (iOS-style): track as tall as the thumb, and a
      // shadowed white thumb inset so it sits inside the bar. Sizing keys off
      // the existing --slider-thumb-size var so it still scales with `size`.
      enclosed: {
        track: {
          height: "var(--slider-thumb-size)",
          '&[data-orientation="vertical"]': {
            width: "var(--slider-thumb-size)",
            height: "100%",
          },
        },
        fill: {
          height: "var(--slider-thumb-size)",
          '&[data-orientation="vertical"]': {
            width: "var(--slider-thumb-size)",
            height: "auto",
          },
        },
        thumb: {
          boxSize: "calc(var(--slider-thumb-size) - {spacing.100})",
          border: "none",
          shadow: "1",
        },
      },
    },
  },
  defaultVariants: {
    size: "md",
    variant: "solid",
  },
});
