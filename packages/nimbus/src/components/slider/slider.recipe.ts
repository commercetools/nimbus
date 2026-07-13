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
      // Use `focusVisibleRing`, not `focusRing`: React Aria focus lives on the
      // visually-hidden inner <input>, so the styled thumb div never matches
      // native `:focus`. React Aria instead marks the div with
      // `data-focus-visible` (same convention as the `data-hovered`/
      // `data-dragging` selectors below). `focusVisibleRing` keys off
      // `&:is(:focus-visible, [data-focus-visible])`, which that attribute
      // satisfies; plain `focusRing` keys off `&:is(:focus, [data-focus])`,
      // which nothing here ever carries — so the ring never showed.
      focusVisibleRing: "outside",

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
      // Re-assert the border width too (not just color): the `enclosed`
      // variant drops the thumb border, and borderColor alone would
      // be invisible without a width to paint.
      "[data-invalid='true'] &": {
        border: "solid-50",
        borderColor: "critical.7",
      },
    },
    tick: {
      position: "absolute",
      top: "50%",
      width: "50",
      height: "var(--slider-tick-length)",
      // Default (unfilled) ticks sit on the `neutral.6` track. Ticks that
      // land on the fill get `data-filled` from slider-base and flip to
      // `colorPalette.contrast`, the token designed to read against the
      // `colorPalette.9` fill — this same mid neutral washes out on the
      // saturated fill, worst in dark mode.
      backgroundColor: "neutral.9",
      transform: "translate(-50%, -50%)",
      pointerEvents: "none",

      "&[data-filled='true']": {
        backgroundColor: "colorPalette.contrast",
      },

      // A tick directly under the thumb is drawn over the white knob (ticks
      // paint above the thumbs), where the fill-tuned `colorPalette.contrast`
      // can vanish — white-on-white in light mode. Use a knob-aware neutral:
      // `neutral.11` is dark on the light knob and light on the dark knob. This
      // rule follows the `data-filled` one on purpose — the on-thumb tick is
      // both on the fill and under the thumb, and at equal specificity source
      // order makes on-thumb win.
      "&[data-on-thumb='true']": {
        backgroundColor: "neutral.11",
      },

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
        height: "50",
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
      // Base look — no overrides. Declared so `plain` is a valid, default value.
      plain: {},

      // Thick, contained "bar" (iOS-style): track as tall as the thumb with a
      // shadowed white thumb inside it. Sizing keys off the existing
      // --slider-thumb-size var so it still scales with `size`.
      enclosed: {
        track: {
          // Inset the *interactive* track by the thumb radius on each end.
          // React Aria measures this element's rect to map a pointer to a value
          // AND to position the thumbs (see react-aria's `useSlider` /
          // `useSliderThumb`), so insetting it makes React Aria's own math
          // produce the contained layout: clicks, drags, ticks and the rendered
          // thumb all share one coordinate system, and clicking a tick lands the
          // thumb on it. No JS compensation needed. The visible bar is painted
          // full-width by `::before`, reaching back over the inset so the thumb
          // stays contained at the extremes. The `neutral.6` background moves to
          // that pseudo-element; the track itself is transparent and lets its
          // fill/thumb overflow into the caps.
          height: "var(--slider-thumb-size)",
          width: "calc(100% - var(--slider-thumb-size))",
          marginInline: "calc(var(--slider-thumb-size) / 2)",
          backgroundColor: "transparent",
          overflow: "visible",

          // The bar spans the full width, reaching S/2 past the inset track on
          // each end. It keeps pointer events (a click on a pseudo-element
          // targets its host — the track), so clicking a cap beyond the first/
          // last tick still reaches React Aria, which clamps the out-of-range
          // position to min/max instead of doing nothing.
          "&::before": {
            content: '""',
            position: "absolute",
            insetBlock: "0",
            insetInline: "calc(var(--slider-thumb-size) / -2)",
            borderRadius: "full",
            backgroundColor: "neutral.6",
          },

          '&[data-orientation="vertical"]': {
            width: "var(--slider-thumb-size)",
            height: "calc(100% - var(--slider-thumb-size))",
            marginInline: "0",
            marginBlock: "calc(var(--slider-thumb-size) / 2)",
            "&::before": {
              insetInline: "0",
              insetBlock: "calc(var(--slider-thumb-size) / -2)",
            },
          },
        },
        thumb: {
          // Full bar-thickness box with a transparent border: the border is the
          // visible gap ("halo") between the white knob and the bar edges,
          // uniform on every side. `backgroundClip: padding-box` keeps the white
          // fill inside the border so the border stays truly transparent — the
          // enclosed fill (sized in slider-base.tsx to reach the thumb's outer
          // edge) shows through it as a thin primary ring around the knob,
          // including at value 0. Containment is handled by the inset track
          // above, so React Aria's native centering already keeps the thumb
          // inside the bar — no margin correction here.
          boxSize: "var(--slider-thumb-size)",
          borderWidth: "{spacing.50}",
          borderStyle: "solid",
          borderColor: "transparent",
          backgroundClip: "padding-box",
          shadow: "1",
        },
      },
    },
  },
  compoundVariants: [
    // The enclosed variant is dimensionally a Switch: a track as tall as the
    // thumb, with the thumb filling that height (see switch.recipe.ts). Adopt
    // the Switch's size tokens so an enclosed slider and a switch of the same
    // size read as one control family — sm `sizes.400` (16px), md `sizes.600`
    // (24px). sm already matches via the `size` scale above; only md needs to
    // move off the shared `sizes.500` (20px) up to `sizes.600`. `--slider-thumb-
    // size` drives both the enclosed bar height and the thumb (and, via calc,
    // the inset interactive track + fill cup), so overriding it here rescales
    // the whole enclosed anatomy coherently. Scoped to `variant: enclosed` so
    // the plain variant keeps its current size until we align it separately.
    {
      variant: "enclosed",
      size: "md",
      css: {
        root: {
          "--slider-thumb-size": "sizes.600",
        },
      },
    },
  ],
  defaultVariants: {
    size: "md",
    variant: "plain",
  },
});
