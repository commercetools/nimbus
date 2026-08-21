import { defineSlotRecipe } from "@chakra-ui/react/styled-system";

/**
 * Recipe configuration for the Popover component.
 * Defines the styling variants and base styles using Chakra UI's slot recipe system.
 */
export const popoverSlotRecipe = defineSlotRecipe({
  slots: ["root", "trigger", "content", "dialog"],
  // Unique class name prefix for the component
  className: "nimbus-popover",

  // Base styles applied to all instances of the component
  base: {
    // `root` intentionally carries no styles. Popover.Root renders
    // RaDialogTrigger via `asChild`, and RaDialogTrigger mounts no DOM element,
    // so there is nothing for a class name to attach to. The slot exists only
    // so `withProvider` can install the slot-recipe context.
    root: {},
    trigger: {
      focusVisibleRing: "outside",
    },
    content: {
      bg: "bg",
      borderRadius: "200",
      boxShadow: "5",
      padding: "400",
      zIndex: 1,

      // Entry animation
      "&[data-entering]": {
        animationName: "fade-in, scale-in",
        animationDuration: "fast",
      },

      // Exit animation
      "&[data-exiting]": {
        animationName: "fade-out, scale-out",
        animationDuration: "faster",
      },
    },
    dialog: {
      // The dialog fills the content surface; padding lives on `content` so
      // consumers can zero it with a single style prop.
      outline: "none",
    },
  },
});
