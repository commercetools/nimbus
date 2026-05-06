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
      // Free-form content: when no slot children are present anywhere
      // inside Card.Root, padding lives on Root itself so direct
      // children don't render flush against the border. Slots own
      // their own padding (see below), so the selector only matches
      // the no-slots case. `:has()` matches at any depth, which is
      // intentional: a slot wrapped in another element still pads
      // itself.
      "&:not(:has(.nimbus-card__header, .nimbus-card__body, .nimbus-card__footer))":
        {
          p: "var(--card-spacing)",
        },
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
      // Class names are Chakra-generated as `${className}__${slotName}`,
      // so these selectors depend on `className: "nimbus-card"` (above)
      // and the slot names in the `slots` array.
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

    // Variant naming encodes the three independent visual axes that
    // designers expose in Figma: outlined (border yes/no), elevated
    // (shadow yes/no), muted (background default/muted). All eight
    // permutations are enumerated explicitly so the prop surface stays
    // a single `variant` enum (no compositional booleans).
    variant: {
      plain: {
        root: {
          backgroundColor: "bg",
        },
      },
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
      "outlined-elevated": {
        root: {
          border: "solid-25",
          borderColor: "colorPalette.6",
          shadow: "1",
          backgroundColor: "bg",
        },
      },
      muted: {
        root: {
          backgroundColor: "colorPalette.2",
        },
      },
      "outlined-muted": {
        root: {
          border: "solid-25",
          borderColor: "colorPalette.6",
          backgroundColor: "colorPalette.2",
        },
      },
      "elevated-muted": {
        root: {
          shadow: "1",
          backgroundColor: "colorPalette.2",
        },
      },
      "outlined-elevated-muted": {
        root: {
          border: "solid-25",
          borderColor: "colorPalette.6",
          shadow: "1",
          backgroundColor: "colorPalette.2",
        },
      },
    },
  },

  defaultVariants: {
    size: "md",
    variant: "outlined",
  },
});
