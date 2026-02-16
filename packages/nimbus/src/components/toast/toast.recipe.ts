import { defineSlotRecipe } from "@chakra-ui/react/styled-system";

/**
 * Recipe configuration for the Toast component.
 * Defines the styling variants and base styles using Chakra UI's recipe system.
 *
 * Registered under the "toast" key to override Chakra's default toast recipe,
 * allowing Chakra's built-in Toast components to use Nimbus styles directly.
 *
 * Color palette mappings:
 * - info → info (blue)
 * - success → positive (green)
 * - warning → warning (amber)
 * - error → critical (red)
 *
 * Variants:
 * - solid: Bold colored background with contrast text (default)
 * - subtle: Subtle background with border
 * - accent-start: Subtle background with a colored accent line on the inline-start edge (via inset box-shadow)
 */
export const toastRecipe = defineSlotRecipe({
  slots: [
    "root",
    "indicator",
    "title",
    "description",
    "actionTrigger",
    "closeTrigger",
  ],
  // Unique class name prefix for the component
  className: "nimbus-toast",

  // Base styles applied to all instances of the component
  base: {
    root: {
      display: "grid",
      gridTemplateColumns: "auto 1fr auto",
      gridTemplateRows: "auto auto",
      gridColumnGap: "200",
      gridRowGap: "0",
      width: "400px",
      alignItems: "start",
      px: "400",
      py: "300",
      borderRadius: "100",
      boxShadow: "1",
      position: "relative",

      // Animation styles consuming Ark UI's CSS custom properties
      pointerEvents: "auto",
      translate: "var(--x) var(--y)",
      scale: "var(--scale)",
      opacity: "var(--opacity)",
      height: "var(--height)",
      willChange: "translate, opacity, scale",
      transition:
        "translate {durations.slower}, scale {durations.slower}, opacity {durations.slower}, height {durations.slower}",
      transitionTimingFunction: "cubic-bezier(0.21, 1.02, 0.73, 1)",
      _closed: {
        transition:
          "translate {durations.slower}, scale {durations.slower}, opacity {durations.moderate}",
        transitionTimingFunction: "cubic-bezier(0.06, 0.71, 0.55, 1)",
      },
    },
    indicator: {
      gridColumn: "1",
      gridRow: "1",

      "& svg": {
        width: "600",
        height: "600",
      },
    },
    title: {
      gridColumn: "2",
      gridRow: "1",
      textStyle: "md",
      fontWeight: "600",
    },
    description: {
      gridColumn: "2",
      gridRow: "2",
      textStyle: "sm",
    },
    actionTrigger: {
      gridColumn: "3",
      gridRow: "1 / -1",
      alignSelf: "center",
    },
    closeTrigger: {
      position: "absolute",
      top: "-300",
      right: "-300",
      outline: "1px solid {colors.bg}",
    },
  },

  variants: {
    variant: {
      solid: {
        root: {
          backgroundColor: "colorPalette.9",
          focusRing: "outside",
        },
        indicator: {
          "& svg": {
            color: "colorPalette.contrast",
          },
        },
        title: {
          color: "colorPalette.contrast",
        },
        description: {
          color: "colorPalette.contrast",
        },
        actionTrigger: {
          // TODO: override, dependency on button a button variant that might change
          "&:not(&:hover)": {
            color: "colorPalette.contrast",
            borderColor: "colorPalette.contrast",
          },
        },
      },
      subtle: {
        root: {
          backgroundColor: "colorPalette.2",
          boxShadow:
            "inset 0 0 0 1px var(--nimbus-colors-color-palette-5), {shadows.1}",
        },
        indicator: {
          "& svg": {
            color: "colorPalette.11",
          },
        },
        title: {
          color: "colorPalette.11",
        },
        description: {
          color: "colorPalette.12",
        },
      },
      "accent-start": {
        root: {
          backgroundColor: "neutral.2",
          // Accent line on the inline-start edge via inset box-shadow
          // (no real border, so it doesn't affect layout).
          boxShadow:
            "inset 3px 0 0 0 var(--nimbus-colors-color-palette-9), inset 0 0 0 1px var(--nimbus-colors-neutral-5), {shadows.1}",
        },
        indicator: {
          "& svg": {
            color: "colorPalette.11",
          },
        },
        title: {
          color: "neutral.12",
        },
        description: {
          color: "neutral.11",
        },
      },
    },
  },

  defaultVariants: {
    variant: "accent-start",
  },
});
