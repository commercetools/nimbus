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
      display: "grid",
      gridTemplateColumns: "auto 1fr auto",
      gap: "200",
      width: "100%",
      alignItems: "start",
    },
    icon: {
      gridColumn: "1",
      gridRow: "1",
      /**
       * One text line tall. `lh` resolves against this slot's own computed
       * line height, which it inherits from the alert along with the font
       * size, so the box keeps matching the first line of text when either is
       * changed by a consumer or by the theme.
       *
       * Centring inside that box keeps the row honest: as a block box the svg
       * would sit on the text baseline and stretch the line box past its own
       * height.
       */
      height: "1lh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      "& svg": {
        // `1.25em` is 20px at the default font size, and follows the alert's
        // text when it changes — the `ActivityIndicator` `size="inherit"`
        // pattern.
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
    },
    dismissButton: {
      gridColumn: "3",
      gridRow: "1",
      // Boxed to the first text line for the same reason as the icon.
      height: "1lh",
      display: "flex",
      alignItems: "center",
    },
  },

  variants: {
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
