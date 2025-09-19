import { defineSlotRecipe } from "@chakra-ui/react/styled-system";

export const collapsibleMotionSlotRecipe = defineSlotRecipe({
  slots: ["root", "trigger", "content"],
  className: "collapsibleMotion",
  base: {
    // Root slot - minimal container styles
    root: {
      // No special styling needed for the root container
    },

    // Trigger slot - button/trigger element styles
    trigger: {
      cursor: "pointer",
      // Optional: Add expanded state styling
      "&[aria-expanded='true']": {
        // Consumers can override this in their own styling
      },
    },

    // Content slot - the animated container
    content: {
      // Static animation styles that don't change
      transition:
        "height var(--animation-duration) cubic-bezier(0.4, 0, 0.2, 1)",
      overflow: "hidden",

      // State-based visibility rules
      // When collapsed with no minHeight, hide content completely
      "&[data-expanded='false'][data-min-height='0']": {
        visibility: "hidden",
      },

      // When collapsed but has minHeight, keep content visible
      "&[data-expanded='false']:not([data-min-height='0'])": {
        visibility: "visible",
      },

      // When expanded, always visible
      "&[data-expanded='true']": {
        visibility: "visible",
      },
    },
  },

  variants: {
    // Animation speed variants using CSS custom properties
    animationSpeed: {
      fast: {
        content: {
          "--animation-duration": "100ms",
        },
      },
      normal: {
        content: {
          "--animation-duration": "200ms",
        },
      },
      slow: {
        content: {
          "--animation-duration": "300ms",
        },
      },
    },
  },

  defaultVariants: {
    animationSpeed: "normal",
  },
});

export type CollapsibleMotionSlotRecipe = typeof collapsibleMotionSlotRecipe;
