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
      flat: {
        root: { px: "300", py: "200" },
      },
      outlined: {
        root: {
          px: "300",
          py: "200",
          backgroundColor: "colorPalette.2",
          boxShadow: "inset 0 0 0 1px {colors.colorPalette.5}",
        },
      },
      "accent-start": {
        root: {
          px: "300",
          py: "200",
          backgroundColor: "neutral.2",
          boxShadow:
            "inset 4px 0 0 0 {colors.colorPalette.9}, inset 0 0 0 1px {colors.neutral.5}",
          _rtl: {
            boxShadow:
              "inset -4px 0 0 0 {colors.colorPalette.9}, inset 0 0 0 1px {colors.neutral.5}",
          },
        },
        title: { color: "neutral.12" },
        description: { color: "neutral.11" },
        dismissButton: { colorPalette: "neutral" },
      },
    },
  },
});
