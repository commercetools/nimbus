import { defineRecipe } from "@chakra-ui/react/styled-system";

/**
 * Recipe configuration for the ActivityIndicator component.
 *
 * The three dots are `<circle>`s inside a single square `<svg>` (viewBox
 * `0 0 24 24`), so the indicator is sized exactly like an icon / LoadingSpinner:
 * the `size` variant sets the root's `width`/`height` and the SVG scales to fit.
 * `inherit` ties the size to the surrounding `font-size` (`1em`) for inline use
 * next to text; the fixed sizes reuse LoadingSpinner's scale points so the
 * footprint matches a spinner in shared slots.
 */
export const activityIndicatorRecipe = defineRecipe({
  className: "nimbus-activity-indicator",

  base: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: "0",

    "& circle": {
      // `fill` is set per `variant` below (plain vs contrast).
      // Percentage translate in the bounce resolves against the dot's own box.
      transformBox: "fill-box",
      animationName: "activity-bounce",
      animationDuration: "0.9s",
      animationIterationCount: "infinite",
      animationTimingFunction: "ease-in-out",
    },

    // Staggered delays produce the sequential "wave". The animation drives
    // opacity while playing; the static opacities below are the resting look
    // (used under reduced motion, where the bounce is replaced by a pulse).
    "& circle[data-dot='0']": { opacity: "0.4", animationDelay: "0s" },
    "& circle[data-dot='1']": { opacity: "0.6", animationDelay: "0.15s" },
    "& circle[data-dot='2']": { opacity: "0.8", animationDelay: "0.3s" },

    "@media (prefers-reduced-motion: reduce)": {
      "& circle": {
        animationName: "pulse",
        animationDuration: "1.4s",
      },
    },
  },

  variants: {
    size: {
      // Scales with the surrounding font-size for inline use next to text.
      inherit: { width: "1em", height: "1em" },
      // Fixed icon sizes — same scale points as LoadingSpinner so the footprint
      // matches a spinner in shared slots (e.g. input start/end icons).
      "2xs": { width: "350", height: "350" },
      xs: { width: "500", height: "500" },
      sm: { width: "600", height: "600" },
      md: { width: "800", height: "800" },
      lg: { width: "1000", height: "1000" },
    },

    // Selects which step of the active `colorPalette` fills the dots:
    // `plain` for neutral/page backgrounds, `contrast` for sitting on a solid
    // `colorPalette.9`-style fill (auto black/white per palette).
    variant: {
      plain: { "& circle": { fill: "colorPalette.11" } },
      contrast: { "& circle": { fill: "colorPalette.contrast" } },
    },
  },

  defaultVariants: {
    size: "inherit",
    variant: "plain",
  },
});
