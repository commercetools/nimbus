import { defineSlotRecipe } from "@chakra-ui/react";

/**
 * Recipe configuration for the Alert component.
 * Defines the styling variants and base styles using Chakra UI's recipe system.
 */
export const alertRecipe = defineSlotRecipe({
  slots: ["root", "title", "description", "icon", "actions", "dismiss"],
  // Unique class name prefix for the component
  className: "bleh-ui-alert",

  // Base styles applied to all instances of the component
  base: {
    root: {
      display: "inline-flex",
      flexDirection: "row",
      gap: "8px",
      width: "100%",
    },
    // TODO: figure out how to get this spacing to work
    // TODO: also colors aren't working
    icon: {
      "& svg": {
        width: "20px",
        height: "20px",
      },
    },
  },

  // Available variants for customizing the component's appearance
  variants: {
    tone: {
      primary: {
        root: { colorPalette: "primary" },
        icon: { colorPalette: "primary" },
        dismiss: { colorPalette: "primary" },
        title: { colorPalette: "primary" },
        description: { colorPalette: "primary" },
        actions: { colorPalette: "primary" },
      },
      critical: {
        root: { colorPalette: "error" },
        icon: { colorPalette: "error" },
        dismiss: { colorPalette: "error" },
        title: { colorPalette: "error" },
        description: { colorPalette: "error" },
        actions: { colorPalette: "error" },
      },
      neutral: {
        root: { colorPalette: "neutral" },
        icon: { colorPalette: "neutral" },
        dismiss: { colorPalette: "neutral" },
        title: { colorPalette: "neutral" },
        description: { colorPalette: "neutral" },
        actions: { colorPalette: "neutral" },
      },
    },

    // Visual style variants
    variant: {
      plain: {},
      solid: {
        root: {
          border: "solid-25",
          borderColor: "colorPalette.5",
          backgroundColor: "colorPalette.2",
          padding: "8px",
          borderRadius: "8px",
        },
      },
    },
  },
});
