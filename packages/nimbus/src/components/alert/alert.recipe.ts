import { defineSlotRecipe } from "@chakra-ui/react/styled-system";

const alertVariants = {
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
} as const;

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
      display: "grid",
      gridTemplateColumns: "auto 1fr auto",
      gap: "200",
      width: "100%",
      alignItems: "start",
    },
    icon: {
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
    actions: {
      gridColumn: "2",
      order: "3",
    },
    dismissButton: {
      gridColumn: "3",
      gridRow: "1",
    },
  },

  variants: alertVariants,
});

export type AlertVariant = keyof typeof alertVariants.variant;
