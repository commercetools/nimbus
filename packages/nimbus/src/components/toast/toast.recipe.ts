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
      gap: "200",
      width: "100%",
      maxWidth: "400px",
      alignItems: "start",
      px: "400",
      py: "300",
      borderRadius: "100",
      boxShadow: "md",
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
      marginTop: "50",
      "& svg": {
        width: "500",
        height: "500",
      },
    },
    title: {
      gridColumn: "2",
      order: "1",
      textStyle: "lg",
      fontWeight: "600",
    },
    description: {
      gridColumn: "2",
      order: "2",
    },
    actionTrigger: {
      gridColumn: "2",
      order: "3",
      justifySelf: "start",
    },
    closeTrigger: {
      gridColumn: "3",
      gridRow: "1",
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
        actionTrigger: {},
        closeTrigger: {
          color: "colorPalette.contrast",
        },
      },
      subtle: {
        root: {
          border: "solid-25",
          borderColor: "colorPalette.5",
          backgroundColor: "colorPalette.2",
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
          color: "colorPalette.11",
        },
      },
      "accent-start": {
        root: {
          backgroundColor: "colorPalette.2",
          // Accent line on the inline-start edge via inset box-shadow
          // (no real border, so it doesn't affect layout).
          boxShadow: "inset 3px 0 0 0 var(--nimbus-colors-color-palette-9)",
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
          color: "colorPalette.11",
        },
      },
    },
  },

  defaultVariants: {
    variant: "solid",
  },
});
