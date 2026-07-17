import { defineSlotRecipe } from "@chakra-ui/react/styled-system";

/**
 * Recipe configuration for the ListBox component.
 * Defines the styling variants and base styles using Chakra UI's slot recipe
 * system. A ListBox is a scrollable list of options that allows single or
 * multiple selection, optionally organized into sections.
 *
 * @see {@link https://nimbus.docs.commercetools.com/components/list-box}
 */
export const listBoxSlotRecipe = defineSlotRecipe({
  slots: ["root", "item", "section", "sectionHeader"],
  // Unique class name prefix for the component
  className: "nimbus-list-box",

  base: {
    root: {
      display: "flex",
      flexDirection: "column",
      width: "100%",
      // No forced `overflow` — consumers that need a scrollable list can set
      // `maxHeight` + `overflow="auto"` on `ListBox.Root` themselves.
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
      minHeight: "var(--list-box-row-min-height)",
      paddingInline: "var(--list-box-padding-inline)",
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
    },

    section: {
      display: "flex",
      flexDirection: "column",
    },

    sectionHeader: {
      fontWeight: "600",
      color: "fg.muted",
      paddingInline: "var(--list-box-padding-inline)",
      textTransform: "uppercase",
      fontSize: "300",
      lineHeight: "400",
    },
  },

  variants: {
    size: {
      sm: {
        root: {
          "--list-box-row-min-height": "sizes.800",
          "--list-box-padding-inline": "spacing.200",
        },
        item: {
          fontSize: "350",
          lineHeight: "400",
        },
      },
      md: {
        root: {
          "--list-box-row-min-height": "sizes.1000",
          "--list-box-padding-inline": "spacing.300",
        },
        item: {
          fontSize: "400",
          lineHeight: "500",
        },
      },
      lg: {
        root: {
          "--list-box-row-min-height": "sizes.1200",
          "--list-box-padding-inline": "spacing.400",
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
