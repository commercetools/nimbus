import { defineSlotRecipe } from "@chakra-ui/react/styled-system";

/**
 * Recipe configuration for the Item component.
 *
 * A single slot recipe drives all Item parts. The root is laid out as one
 * `flex-wrap` row so that `header` and `footer` (which set `flex-basis: 100%`)
 * occupy their own full-width bands above/below the media·content·actions row.
 *
 * `Item.Media` needs a `variant` (`default | icon | image`) that is independent
 * of the root's `variant`, so it is driven by a `data-variant` attribute on the
 * media slot rather than a recipe variant (which would collide with the root's
 * `variant` prop across the shared slot-recipe context).
 */
export const itemRecipe = defineSlotRecipe({
  // Only the parts that live *inside* the row share the recipe context.
  // `Item.Group` wraps rows (it is a parent of `Item.Root`, not a child), and
  // `Item.Separator` reuses the standalone Nimbus `Separator`, so neither is a
  // context slot here — they style themselves.
  slots: [
    "root",
    "header",
    "media",
    "content",
    "title",
    "description",
    "actions",
    "footer",
  ],

  className: "nimbus-item",

  base: {
    root: {
      colorPalette: "slate",
      display: "flex",
      flexWrap: "wrap",
      alignItems: "center",
      gap: "var(--item-gap)",
      p: "var(--item-padding)",
      width: "100%",
      borderRadius: "300",
      // Link-mode defaults: keep the anchor visually identical to the div and
      // let the recipe (not the browser) own its appearance. A plain <div>
      // ignores these; they only take visible effect once the root is an <a>.
      color: "inherit",
      textDecoration: "none",
      textAlign: "start",
      outline: "none",
      _focusVisible: {
        focusRing: "outside",
      },
      "&:is(a)": {
        cursor: "pointer",
        transitionProperty: "background-color, border-color",
        transitionDuration: "fast",
        _hover: {
          backgroundColor: "colorPalette.2",
        },
      },
    },

    // Full-width band above the row.
    header: {
      flexBasis: "100%",
      display: "flex",
      alignItems: "center",
      minWidth: 0,
    },

    // Fixed, non-shrinking leading slot.
    media: {
      display: "flex",
      flexShrink: 0,
      alignItems: "center",
      justifyContent: "center",
      color: "colorPalette.11",
      "& svg": {
        pointerEvents: "none",
      },
      "&[data-variant='icon']": {
        boxSize: "600",
        "& svg": {
          boxSize: "500",
        },
      },
      "&[data-variant='image']": {
        boxSize: "1000",
        borderRadius: "200",
        overflow: "hidden",
        "& img": {
          boxSize: "100%",
          objectFit: "cover",
        },
      },
    },

    // Growing middle column.
    content: {
      display: "flex",
      flex: "1",
      flexDirection: "column",
      gap: "spacing.50",
      // Allow long titles/descriptions to wrap/truncate instead of forcing the
      // row wider than its container.
      minWidth: 0,
    },

    title: {
      textStyle: "sm",
      fontWeight: "500",
      color: "colorPalette.12",
    },

    description: {
      textStyle: "sm",
      color: "colorPalette.11",
    },

    // Trailing slot for interactive controls.
    actions: {
      display: "flex",
      flexShrink: 0,
      alignItems: "center",
      gap: "spacing.100",
      marginInlineStart: "auto",
    },

    // Full-width band below the row.
    footer: {
      flexBasis: "100%",
      display: "flex",
      alignItems: "center",
      minWidth: 0,
    },
  },

  variants: {
    size: {
      xs: {
        root: {
          "--item-gap": "spacing.200",
          "--item-padding": "spacing.200",
        },
      },
      sm: {
        root: {
          "--item-gap": "spacing.300",
          "--item-padding": "spacing.300",
        },
      },
      md: {
        root: {
          "--item-gap": "spacing.400",
          "--item-padding": "spacing.400",
        },
      },
    },

    variant: {
      plain: {
        root: {
          backgroundColor: "transparent",
        },
      },
      outline: {
        root: {
          border: "solid-25",
          borderColor: "colorPalette.6",
        },
      },
      subtle: {
        root: {
          backgroundColor: "colorPalette.2",
        },
      },
    },
  },

  defaultVariants: {
    size: "md",
    variant: "plain",
  },
});
