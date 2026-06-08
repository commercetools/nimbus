import { defineSlotRecipe } from "@chakra-ui/react/styled-system";

/**
 * Recipe configuration for the Tree component.
 * Defines the styling variants and base styles using Chakra UI's slot recipe
 * system. Styling is token-based and derived from existing Nimbus list /
 * accordion patterns (no Figma specs exist yet).
 */
export const treeSlotRecipe = defineSlotRecipe({
  slots: ["root", "item", "itemContent", "indicator"],
  // Unique class name prefix for the component
  className: "nimbus-tree",

  base: {
    root: {
      display: "flex",
      flexDirection: "column",
      width: "100%",
      overflow: "auto",
      outline: "none",
      color: "fg",

      // Keyboard focus on the tree container
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

      // Drop target highlight for drops on the tree root
      "&[data-drop-target]": {
        outline: "2px solid",
        outlineColor: "primary.9",
        outlineOffset: "-2px",
        borderRadius: "200",
      },

      // Drop indicator line shown between rows during drag-and-drop. React Aria
      // renders it as a zero-height element with the default `react-aria-*`
      // class; style it with Nimbus tokens and indent it to the target's level.
      // Aligns with the row content's leading edge at the same level (matches
      // the `itemContent` paddingInlineStart so the line sits under the chevron).
      "& [class*='react-aria-DropIndicator'][data-drop-target]": {
        outline: "2px solid",
        outlineColor: "primary.9",
        borderRadius: "full",
        marginInlineStart:
          "calc({spacing.400} + (var(--tree-item-level, 1) - 1) * var(--tree-indent-step))",
        marginInlineEnd: "200",
      },
    },

    item: {
      display: "flex",
      alignItems: "center",
      width: "100%",
      minHeight: "var(--tree-row-min-height)",
      borderRadius: "200",
      cursor: "default",
      outline: "none",
      position: "relative",
      color: "fg",
      transition: "background-color 150ms ease, color 150ms ease",

      // Hover
      "&[data-hovered]": {
        bg: "primary.2",
      },
      // Pressed (click / activation feedback)
      "&[data-pressed]": {
        bg: "primary.3",
      },
      // Selected (single or multiple)
      "&[data-selected]": {
        bg: "primary.3",
      },
      // Keyboard focus
      "&[data-focus-visible]": {
        focusRing: "inside",
      },
      // Disabled
      "&[data-disabled]": {
        layerStyle: "disabled",
      },
      // Linkable rows
      "&[data-href]": {
        cursor: "pointer",
      },
      // Drag-and-drop states
      "&[data-dragging]": {
        opacity: "0.6",
      },
      "&[data-drop-target]": {
        bg: "primary.2",
        outline: "2px solid",
        outlineColor: "primary.9",
        outlineOffset: "-2px",
      },

      // Expand/collapse chevron visibility + rotation, driven by the row's own
      // data-attributes (the chevron cannot read these itself in CSS). Scoped to
      // the tree's own indicator slot class so it never affects a selection
      // checkbox (whose internal indicator also uses `data-slot="indicator"`).
      "& .nimbus-tree__indicator": {
        visibility: "hidden",
      },
      "&[data-has-child-items] .nimbus-tree__indicator": {
        visibility: "visible",
      },
      "&[data-expanded] .nimbus-tree__indicator svg": {
        transform: "rotate(90deg)",
      },
    },

    itemContent: {
      display: "flex",
      alignItems: "center",
      gap: "100",
      width: "100%",
      pe: "200",
      py: "var(--tree-row-padding-y)",
      // Visual indentation by nesting level. React Aria sets `--tree-item-level`
      // (1-based depth) on each row; the content is offset proportionally.
      // The base offset gives the leading control (checkbox/chevron) room from
      // the row's edge.
      paddingInlineStart:
        "calc({spacing.400} + (var(--tree-item-level, 1) - 1) * var(--tree-indent-step))",
    },

    indicator: {
      all: "unset",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      boxSize: "var(--tree-indicator-size)",
      color: "neutral.11",
      cursor: "pointer",
      borderRadius: "100",

      "& svg": {
        boxSize: "100%",
        transition: "transform 200ms ease",
      },

      "&[data-focus-visible]": {
        focusRing: "outside",
      },
    },
  },

  variants: {
    size: {
      md: {
        root: {
          "--tree-row-min-height": "sizes.1000",
          // One indent level = the leading control column (selection checkbox,
          // ~spacing.600) + the row gap (spacing.100), so a child's leading
          // control aligns directly under its parent's chevron.
          "--tree-indent-step": "calc({spacing.600} + {spacing.100})",
          "--tree-indicator-size": "sizes.500",
          "--tree-row-padding-y": "spacing.200",
        },
        item: {
          fontSize: "400",
          lineHeight: "500",
        },
      },
      sm: {
        root: {
          "--tree-row-min-height": "sizes.800",
          "--tree-indent-step": "calc({spacing.600} + {spacing.100})",
          "--tree-indicator-size": "sizes.400",
          "--tree-row-padding-y": "spacing.100",
        },
        item: {
          fontSize: "350",
          lineHeight: "400",
        },
      },
    },
  },

  defaultVariants: {
    size: "md",
  },
});
