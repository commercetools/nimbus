import { defineSlotRecipe } from "@chakra-ui/react/styled-system";

/**
 * Recipe configuration for the GridList component.
 * Defines the styling variants and base styles using Chakra UI's slot recipe
 * system. A GridList is a scrollable list of interactive rows that allows
 * single or multiple selection, with optional drag-and-drop reordering.
 *
 * @see {@link https://nimbus.docs.commercetools.com/components/grid-list}
 */
export const gridListSlotRecipe = defineSlotRecipe({
  slots: ["root", "item"],
  // Unique class name prefix for the component
  className: "nimbus-grid-list",

  base: {
    root: {
      display: "flex",
      flexDirection: "column",
      width: "100%",
      // No forced `overflow` — consumers that need a scrollable list can set
      // `maxHeight` + `overflow="auto"` on `GridList.Root` themselves.
      outline: "none",
      color: "fg",
      gap: "0",

      // Keyboard focus on the list container
      "&[data-focus-visible]": {
        focusRing: "outside",
      },

      // Empty state (renderEmptyState)
      "&[data-empty]": {
        alignItems: "center",
        justifyContent: "center",
        color: "neutral.11",
        fontStyle: "italic",
        py: "400",
      },
    },

    item: {
      display: "flex",
      alignItems: "center",
      width: "100%",
      minHeight: "var(--grid-list-row-min-height)",
      paddingInline: "var(--grid-list-padding-inline)",
      borderRadius: "200",
      cursor: "pointer",
      outline: "none",
      position: "relative",
      color: "fg",
      transition: "background-color 150ms ease, color 150ms ease",

      // Hover
      "&[data-hovered]": {
        bg: "primary.1",
      },
      // Focused (keyboard navigation)
      "&[data-focused]": {
        focusRing: "inside",
      },
      // Selected
      "&[data-selected]": {
        bg: "primary.2",
      },
      // Disabled
      "&[data-disabled]": {
        layerStyle: "disabled",
      },
      // Drag state
      "&[data-dragging]": {
        opacity: "0.5",
      },
      // Drop target
      "&[data-drop-target]": {
        bg: "primary.2",
        outlineStyle: "dashed",
        outlineColor: "primary.7",
        outlineWidth: "2px",
      },
    },
  },

  variants: {
    size: {
      sm: {
        root: {
          "--grid-list-row-min-height": "sizes.800",
          "--grid-list-padding-inline": "spacing.200",
        },
        item: {
          fontSize: "350",
          lineHeight: "400",
        },
      },
      md: {
        root: {
          "--grid-list-row-min-height": "sizes.1000",
          "--grid-list-padding-inline": "spacing.300",
        },
        item: {
          fontSize: "400",
          lineHeight: "500",
        },
      },
      lg: {
        root: {
          "--grid-list-row-min-height": "sizes.1200",
          "--grid-list-padding-inline": "spacing.400",
        },
        item: {
          fontSize: "450",
          lineHeight: "600",
        },
      },
    },
  },

  defaultVariants: {
    size: "md",
  },
});
