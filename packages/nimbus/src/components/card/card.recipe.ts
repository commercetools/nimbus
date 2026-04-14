import { defineSlotRecipe } from "@chakra-ui/react/styled-system";

const slotPadding = {
  px: "var(--card-padding)",
  _first: { pt: "var(--card-padding)" },
  _last: { pb: "var(--card-padding)" },
};

/**
 * Recipe configuration for the Card component.
 * Defines the styling variants and base styles using Chakra UI's recipe system.
 */
export const cardRecipe = defineSlotRecipe({
  slots: ["root", "header", "body", "footer"],

  className: "nimbus-card",

  base: {
    root: {
      colorPalette: "slate",
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      borderRadius: "300",
      focusVisibleRing: "outside",
    },
    header: slotPadding,
    body: slotPadding,
    footer: slotPadding,
  },

  variants: {
    size: {
      sm: {
        root: { gap: "100", "--card-padding": "spacing.200" },
      },
      md: {
        root: { gap: "200", "--card-padding": "spacing.400" },
      },
      lg: {
        root: { gap: "400", "--card-padding": "spacing.600" },
      },
    },

    variant: {
      outlined: {
        root: {
          border: "solid-25",
          borderColor: "colorPalette.3",
          backgroundColor: "bg",
        },
      },
      elevated: {
        root: {
          shadow: "1",
          backgroundColor: "bg",
        },
      },
      filled: {
        root: {
          backgroundColor: "colorPalette.2",
        },
      },
      plain: {
        root: {
          backgroundColor: "bg",
        },
      },
    },
  },

  defaultVariants: {
    size: "md",
    variant: "outlined",
  },
});
