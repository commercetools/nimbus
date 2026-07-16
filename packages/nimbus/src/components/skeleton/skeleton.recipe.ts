import { defineRecipe } from "@chakra-ui/react/styled-system";

/**
 * Recipe configuration for the Skeleton component.
 * Defines the styling variants and base styles using Chakra UI's recipe system.
 *
 * Animations:
 * - pulse: reuses the existing `pulse` keyframe (opacity oscillation)
 * - wave: uses the `skeleton-wave` keyframe with an `::after` gradient sweep
 * - none: no animation
 *
 * The wave shimmer highlight color uses a CSS custom property
 * `--skeleton-shimmer-color` with a `_dark` override for proper dark-mode support.
 * All animations are disabled under `prefers-reduced-motion`.
 */
export const skeletonRecipe = defineRecipe({
  className: "nimbus-skeleton",

  // Base styles applied to all instances of the component
  base: {
    display: "block",
    backgroundColor: "{colors.neutralAlpha.3}",
    overflow: "hidden",
    position: "relative",

    // Disable all animation and remove ::after sweep when user prefers reduced
    // motion. `!important` is required: the `animation` variant rule sets
    // (pulse/wave) are emitted as a more-specific rule than this base block, so
    // a plain `animation: none` would not win the cascade. This guarantees the
    // spec requirement that Skeleton does NOT animate under reduced motion,
    // regardless of the `animation` prop value.
    _motionReduce: {
      animation: "none !important",
      "&::after": {
        display: "none !important",
      },
    },
  },

  // Available variants for customizing the component's appearance
  variants: {
    // Named square size aligned with the Avatar scale (2xs = 24px, xs = 32px,
    // md = 40px), applied as equal width + height. Opt-in — there is no default
    // size variant, so an un-sized Skeleton is still driven by width/height /
    // boxSize style props. `SkeletonCircle` inherits this to size its circle.
    // Values are the sizing-scale token keys (as strings, the Nimbus recipe
    // convention). Kept in sync with `avatar.recipe.ts`' `size` variant.
    size: {
      "2xs": { width: "600", height: "600" },
      xs: { width: "800", height: "800" },
      md: { width: "1000", height: "1000" },
    },

    shape: {
      rectangle: {
        borderRadius: "{radii.100}",
      },
      circle: {
        borderRadius: "full",
        aspectRatio: "1 / 1",
      },
    },

    animation: {
      pulse: {
        animation: "pulse 2s ease-in-out infinite",
      },
      wave: {
        // Define the shimmer highlight color as a CSS custom property so it can
        // be overridden for dark mode. These raw rgba() literals are an
        // intentional exception to the "tokens only" rule: the shimmer is a
        // translucent white overlay sweeping across the base color, and there is
        // no semantic white-alpha token scale to express it (mirrors the raw
        // rgba `--ring-color` in theme/global-css.ts).
        "--skeleton-shimmer-color": "rgba(255, 255, 255, 0.6)",
        _dark: {
          "--skeleton-shimmer-color": "rgba(255, 255, 255, 0.13)",
        },
        "&::after": {
          content: '""',
          position: "absolute",
          top: "0",
          left: "0",
          right: "0",
          bottom: "0",
          backgroundImage:
            "linear-gradient(90deg, transparent, var(--skeleton-shimmer-color), transparent)",
          animation: "skeleton-wave 1.6s ease-in-out 0.5s infinite",
        },
      },
      none: {
        animation: "none",
      },
    },
  },

  // Default variant values when not explicitly specified
  defaultVariants: {
    shape: "rectangle",
    animation: "pulse",
  },
});
