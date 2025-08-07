import { defineSlotRecipe } from "@chakra-ui/react/styled-system";
/**
 * Recipe configuration for the Alert component.
 * Defines the styling variants and base styles using Chakra UI's recipe system.
 */
export const alertRecipe = defineSlotRecipe({
  slots: ["root", "title", "description", "icon", "actions", "dismissButton"],
  // Unique class name prefix for the component
  className: "nimbus-alert",

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
        root: { colorPalette: "critical" },
      },
      info: {
        root: { colorPalette: "info" },
      },
      warning: {
        root: { colorPalette: "amber" },
      },
      positive: {
        root: { colorPalette: "positive" },
      },
    },

    variant: {
      flat: {},
      outlined: {
        root: {
          border: "solid-25",
          borderColor: "colorPalette.5",
          backgroundColor: "colorPalette.2",
          padding: "200",
          borderRadius: "200",
        },
      },
    },
  },
});
