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

      // --- Leading-control layout --------------------------------------------
      // Every leading control — the selection checkbox, the drag handle, and the
      // expand/collapse chevron — is framed in an identical, centered box of
      // `--tree-control-size` (see `itemContent`). Uniform boxes mean their
      // left edges and glyph centers align automatically, so a nested row's
      // control sits directly under its parent's chevron with no per-mode
      // offset/size compensation. The indent step is simply one control column
      // plus the inter-control gap.
      "--tree-control-gap": "{spacing.100}",
      "--tree-indent-step":
        "calc(var(--tree-control-size) + var(--tree-control-gap))",

      // No forced `overflow` — it would create a scroll container that clips the
      // drop-target / focus outlines drawn at the rows' edges. Consumers that
      // need a scrollable tree can set `maxHeight` + `overflow="auto"` on
      // `Tree.Root` themselves.
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
      // Draggable rows: the whole row is the pointer drag source (React Aria
      // makes the row `draggable` and disables pointer events on the handle, so
      // the grab affordance belongs on the row). Interactive children (chevron,
      // checkbox) sit on top and keep their own cursors.
      "&[data-allows-dragging]": {
        cursor: "grab",
      },
      // Drag-and-drop states
      "&[data-dragging]": {
        opacity: "0.6",
        cursor: "grabbing",
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
      gap: "var(--tree-control-gap)",
      width: "100%",
      pr: "200",
      py: "var(--tree-row-padding-y)",
      // Visual indentation by nesting level. React Aria sets `--tree-item-level`
      // (1-based depth) on each row; the content is offset proportionally.
      // The base offset gives the leading control (checkbox/chevron) room from
      // the row's edge.
      pl: "calc({spacing.200} + (var(--tree-item-level, 1) - 1) * var(--tree-indent-step))",

      // Uniform leading-control column. The checkbox (`slot='selection'`), the
      // drag handle (`slot='drag'`), and the chevron are all framed in the same
      // centered box so their boxes and glyph centers line up. `minW`/`minH`
      // overrides let the drag-handle `IconButton` (intrinsically 24px) shrink
      // to the column at `sm`; `p: 0` makes its hover surface match the box.
      "& [slot='selection'], & [slot='drag']": {
        boxSize: "var(--tree-control-size)",
        minWidth: "var(--tree-control-size)",
        minHeight: "var(--tree-control-size)",
        flexShrink: 0,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 0,
      },
    },

    indicator: {
      all: "unset",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      // Box matches the shared control column; the glyph itself renders at
      // `--tree-indicator-size` (per-size icon size) centered within it.
      boxSize: "var(--tree-control-size)",
      color: "neutral.11",
      cursor: "pointer",
      borderRadius: "100",

      "& svg": {
        boxSize: "var(--tree-indicator-size)",
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
          // Shared leading-control column: every control (checkbox, drag
          // handle, chevron) is framed in a 24px box at `md`.
          "--tree-control-size": "sizes.600",
          // Chevron glyph size (the icon inside the control box).
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
          // Shared leading-control column: every control is framed in a 20px
          // box at `sm`.
          "--tree-control-size": "sizes.500",
          // Chevron glyph size (the icon inside the control box).
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
