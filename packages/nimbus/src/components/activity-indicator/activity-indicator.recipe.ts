import { defineRecipe } from "@chakra-ui/react/styled-system";

/**
 * Recipe configuration for the ActivityIndicator component.
 *
 * The dot geometry is defined once in em units (dot ≈ 0.375em, gap ≈ 0.25em),
 * so a single definition serves every size — the `size` variant only changes
 * the `font-size` the dots are relative to (and, for fixed sizes, reserves a
 * square icon-box footprint).
 */
export const activityIndicatorRecipe = defineRecipe({
  className: "nimbus-activity-indicator",

  base: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    verticalAlign: "middle",
    lineHeight: "1",

    // The row holding the three dots. In `inherit` mode it stays in normal
    // flow (intrinsic width). For fixed sizes it is lifted out of flow and
    // centered over the square box (see the fixed-size selector below) so the
    // wider-than-square dots overflow horizontally without expanding the box
    // content size or shifting siblings.
    "& [data-dots-row]": {
      display: "inline-flex",
      alignItems: "center",
    },

    "& [data-dot]": {
      display: "inline-block",
      flexShrink: "0",
      width: "0.375em",
      height: "0.375em",
      borderRadius: "full",
      backgroundColor: "colorPalette.11",
      animationName: "bounce",
      animationDuration: "1.4s",
      animationIterationCount: "infinite",
      animationTimingFunction: "ease-in-out",
    },
    "& [data-dot] + [data-dot]": {
      marginInlineStart: "0.25em",
    },

    // Staggered opacities + animation delays so the dots bounce in sequence.
    "& [data-dot='0']": { opacity: "0.4", animationDelay: "0s" },
    "& [data-dot='1']": { opacity: "0.6", animationDelay: "0.16s" },
    "& [data-dot='2']": { opacity: "0.8", animationDelay: "0.32s" },

    // Fixed sizes set the root to a relative square; the dots row is absolutely
    // centered over it so its width never participates in layout.
    "&[data-fixed-size] [data-dots-row]": {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
    },

    // Reduced motion: replace the bounce with a gentle opacity pulse so the
    // "working" state stays perceivable but unobtrusive.
    "@media (prefers-reduced-motion: reduce)": {
      "& [data-dot]": {
        animationName: "pulse",
        animationDuration: "1.4s",
      },
    },
  },

  variants: {
    size: {
      inherit: {
        fontSize: "inherit",
      },
      "2xs": {
        position: "relative",
        fontSize: "350",
        width: "350",
        height: "350",
      },
      xs: {
        position: "relative",
        fontSize: "500",
        width: "500",
        height: "500",
      },
      sm: {
        position: "relative",
        fontSize: "600",
        width: "600",
        height: "600",
      },
      md: {
        position: "relative",
        fontSize: "800",
        width: "800",
        height: "800",
      },
      lg: {
        position: "relative",
        fontSize: "1000",
        width: "1000",
        height: "1000",
      },
    },

    colorPalette: {
      primary: {
        colorPalette: "ctvioletAlpha",
      },
      white: {
        colorPalette: "whiteAlpha",
      },
    },
  },

  defaultVariants: {
    size: "inherit",
    colorPalette: "primary",
  },
});
