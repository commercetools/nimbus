import { defineSlotRecipe } from "@chakra-ui/react/styled-system";

const slotSpacing = {
  px: "var(--card-spacing)",
  _first: { pt: "var(--card-spacing)" },
  _last: { pb: "var(--card-spacing)" },
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
      gap: "var(--card-spacing)",
      borderRadius: "300",
      focusVisibleRing: "outside",
    },
    header: slotSpacing,
    body: slotSpacing,
    footer: slotSpacing,
  },

  variants: {
    size: {
      sm: {
        root: { "--card-spacing": "spacing.300" },
      },
      md: {
        root: { "--card-spacing": "spacing.400" },
      },
      lg: {
        root: { "--card-spacing": "spacing.600" },
      },
    },

    variant: {
      outlined: {
        root: {
          border: "solid-25",
          borderColor: "colorPalette.6",
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
