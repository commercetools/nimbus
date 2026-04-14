import { defineSlotRecipe } from "@chakra-ui/react/styled-system";

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
    header: {
      p: "var(--card-spacing)",
      width: "100%",
    },
    body: {
      p: "var(--card-spacing)",
      width: "100%",
      // When directly preceded by header, collapse top padding (header's
      // bottom padding provides the gap). When a non-slot element like
      // Separator sits between them, both slots keep full padding for
      // visually balanced spacing around the element.
      ".nimbus-card__header + &": { pt: 0 },
    },
    footer: {
      p: "var(--card-spacing)",
      width: "100%",
      // Same adjacent-sibling collapsing as body — see comment above.
      ".nimbus-card__header + &": { pt: 0 },
      ".nimbus-card__body + &": { pt: 0 },
    },
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
