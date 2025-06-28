import { defineRecipe } from "@chakra-ui/react";

/**
 * Recipe configuration for the Popover component.
 * Defines the styling variants and base styles using Chakra UI's recipe system.
 */
export const popoverRecipe = defineRecipe({
  // Unique class name prefix for the component
  className: "nimbus-popover",

  // Base styles applied to all instances of the component
  base: {
    "--scrollbar-color": "colors.neutral.8",
    "--scrollbar-bg": "colors.neutral.3",

    bg: "neutral.1",
    borderRadius: "200",
    boxShadow: "6",
    border: "solid-25",
    borderColor: "neutral.8",
    maxHeight: "40svh",
    overflow: "auto",
    scrollbarWidth: "thin",
    scrollbarColor: "var(--scrollbar-color) var(--scrollbar-bg)",
    focusRing: "outside",
    p: "400",

    // Animation states
    "&[data-entering]": {
      animationName: "fade-in, scale-in",
      animationDuration: "fast",
    },
    "&[data-exiting]": {
      animationName: "fade-out, scale-out",
      animationDuration: "faster",
    },
  },
});
