import { defineSlotRecipe } from "@chakra-ui/react";

/**
 * Recipe configuration for the Alert component.
 * Defines the styling variants and base styles using Chakra UI's recipe system.
 */
export const alertRecipe = defineSlotRecipe({
  slots: ["root", "title", "description", "icon", "actions", "dismissButton"],
  // Unique class name prefix for the component
  className: "bleh-ui-alert",

  // Base styles applied to all instances of the component
  base: {
    root: {
      display: "inline-flex",
      flexDirection: "row",
      gap: "200",
      width: "100%",
    },
    icon: {
      marginTop: "50",
      "& svg": {
        width: "500",
        height: "500",
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
        dismissButton: { colorPalette: "error" },
        title: { colorPalette: "error" },
        description: { colorPalette: "error" },
        actions: { colorPalette: "error" },
      },
      info: {
        root: { colorPalette: "blue" },
        icon: { colorPalette: "blue" },
        dismissButton: { colorPalette: "blue" },
        title: { colorPalette: "blue" },
        description: { colorPalette: "blue" },
        actions: { colorPalette: "blue" },
      },
      warning: {
        root: { colorPalette: "amber" },
        icon: { colorPalette: "amber" },
        dismissButton: { colorPalette: "amber" },
        title: { colorPalette: "amber" },
        description: { colorPalette: "amber" },
        actions: { colorPalette: "amber" },
      },
      positive: {
        root: { colorPalette: "grass" },
        icon: { colorPalette: "grass" },
        dismissButton: { colorPalette: "grass" },
        title: { colorPalette: "grass" },
        description: { colorPalette: "grass" },
        actions: { colorPalette: "grass" },
      },
    },

    // These are empty on purpose - we branch off of them in the component implementation
    variant: {
      flat: {},
      outlined: {},
    },
  },
});
