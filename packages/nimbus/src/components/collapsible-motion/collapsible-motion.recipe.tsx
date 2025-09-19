import { defineSlotRecipe } from "@chakra-ui/react/styled-system";

// TODO:
// Just removed the animation logic
// Need to add it back, cleanly
// THEN, support minHeight
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

    // Content slot - basic container
    content: {
      // TODO: No animation styles - will be implemented later
    },
  },
});

export type CollapsibleMotionSlotRecipe = typeof collapsibleMotionSlotRecipe;
