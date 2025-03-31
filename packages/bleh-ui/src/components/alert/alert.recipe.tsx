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
    icon: {
      "& svg": {
        width: "20px",
        height: "20px",
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

  variants: {
    tone: {
      critical: {
        root: { colorPalette: "error" },
        icon: { colorPalette: "error" },
        dismiss: { colorPalette: "error" },
        title: { colorPalette: "error" },
        description: { colorPalette: "error" },
        actions: { colorPalette: "error" },
      },
      info: {
        root: { colorPalette: "blue" },
        icon: { colorPalette: "blue" },
        dismiss: { colorPalette: "blue" },
        title: { colorPalette: "blue" },
        description: { colorPalette: "blue" },
        actions: { colorPalette: "blue" },
      },
      warning: {
        root: { colorPalette: "amber" },
        icon: { colorPalette: "amber" },
        dismiss: { colorPalette: "amber" },
        title: { colorPalette: "amber" },
        description: { colorPalette: "amber" },
        actions: { colorPalette: "amber" },
      },
      positive: {
        root: { colorPalette: "grass" },
        icon: { colorPalette: "grass" },
        dismiss: { colorPalette: "grass" },
        title: { colorPalette: "grass" },
        description: { colorPalette: "grass" },
        actions: { colorPalette: "grass" },
      },
    },

    // Visual style variants
    variant: {
      plain: {},
      solid: {
        // TODO: This should conditionally incorporate the `Card` component
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
