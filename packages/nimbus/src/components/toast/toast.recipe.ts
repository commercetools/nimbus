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
      minWidth: "320px",
      maxWidth: "560px",
      alignItems: "start",
      border: "solid-25",
      borderColor: "colorPalette.5",
      backgroundColor: "colorPalette.2",
      padding: "200",
      borderRadius: "200",
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
        color: "colorPalette.11",
      },
    },
    title: {
      gridColumn: "2",
      order: "1",
      color: "colorPalette.11",
    },
    description: {
      gridColumn: "2",
      order: "2",
      color: "colorPalette.11",
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

  variants: {},
});
