import { defineSlotRecipe } from "@chakra-ui/react/styled-system";

/**
 * Recipe configuration for the Alert component.
 * Defines the styling variants and base styles using Chakra UI's recipe system.
 */
export const alertRecipe = defineSlotRecipe({
  slots: ["root", "title", "description", "icon", "actions", "dismissButton"],
  className: "nimbus-alert",

  base: {
    root: {
      width: "100%",
      border: "solid-25",
      borderColor: "transparent",
      px: "300",
      py: "200",
      borderRadius: "200",

      display: "grid",
      gridTemplateColumns: "auto 1fr auto",
      alignItems: "start",
    },
    icon: {
      gridColumn: "1",
      gridRow: "1",
      height: "1lh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginInlineEnd: "200",
      "& svg": {
        width: "1.25em",
        height: "1.25em",
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
      marginTop: "200",
      marginBottom: "200",
      display: "flex",
      alignItems: "center",
      gap: "200",
      flexWrap: "wrap",
    },
    dismissButton: {
      gridColumn: "3",
      gridRow: "1",
      height: "1lh",
      display: "flex",
      alignItems: "center",
      marginInlineStart: "200",
    },
  },

  variants: {
    variant: {
      flat: {},
      outlined: {
        root: {
          borderColor: "colorPalette.5",
          backgroundColor: "colorPalette.2",
        },
      },
      "accent-start": {
        root: {
          backgroundColor: "neutral.2",
          borderColor: "neutral.5",
          boxShadow: "inset 3px 0 0 0 {colors.colorPalette.9}",
          _rtl: { boxShadow: "inset -3px 0 0 0 {colors.colorPalette.9}" },
        },
        title: { color: "neutral.12" },
        description: { color: "neutral.11" },
        dismissButton: { colorPalette: "neutral" },
      },
    },
  },

  defaultVariants: {
    variant: "outlined",
  },
});
