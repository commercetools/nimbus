import { defineSlotRecipe } from "@chakra-ui/react/styled-system";

/**
 * Recipe configuration for the GridList component.
 *
 * Items have no container (no border or background) at rest. The recipe styles
 * the interaction states React Aria exposes as data attributes: hover, pressed,
 * focus-visible, selected, disabled, dragging and drop target.
 *
 * The built-in drag handle and selection checkbox are Nimbus components marked
 * with React Aria slots; they are positioned through `[slot=...]` selectors, not
 * their own recipe slots. The `size` variant sets the item padding and the
 * default gap. The drag handle size is set in the component, and the checkbox
 * keeps its one size at every GridList size.
 */
export const gridListSlotRecipe = defineSlotRecipe({
  slots: ["root", "item", "itemContent", "emptyState"],
  className: "nimbus-grid-list",

  base: {
    // RA <GridList>, rendered through SimpleGrid (which sets the columns)
    root: {
      colorPalette: "primary",
      color: "neutral.12",
      // Containing block for the drop indicator, which is taken out of flow
      position: "relative",
      // Keyboard-only focus ring (React Aria sets [data-focus-visible])
      focusVisibleRing: "outside",
      // The list as a whole is a drop target while dragging over it
      "&[data-drop-target]": {
        outline: "solid-50",
        outlineColor: "primary.9",
        outlineOffset: "-2px",
      },
      // React Aria inserts a drop indicator element between items while
      // dragging. In a CSS grid it would take a cell and push the items, so it
      // leaves the layout flow. Its position is shown as an inset edge on the
      // neighbouring item instead: before the next item, or after the previous
      // one. A grid shows a vertical edge (flipped in right-to-left); a stack
      // shows a horizontal line between rows.
      "& > .react-aria-DropIndicator": {
        position: "absolute",
        width: "0",
        height: "0",
        overflow: "visible",
      },
      "& > .react-aria-DropIndicator[data-drop-target] + [role='row']": {
        boxShadow: "inset 2px 0 0 {colors.primary.9}",
        _rtl: { boxShadow: "inset -2px 0 0 {colors.primary.9}" },
      },
      "& > [role='row']:has(+ .react-aria-DropIndicator[data-drop-target])": {
        boxShadow: "inset -2px 0 0 {colors.primary.9}",
        _rtl: { boxShadow: "inset 2px 0 0 {colors.primary.9}" },
      },
      "&[data-layout='stack'] > .react-aria-DropIndicator[data-drop-target] + [role='row']":
        {
          boxShadow: "inset 0 2px 0 {colors.primary.9}",
          _rtl: { boxShadow: "inset 0 2px 0 {colors.primary.9}" },
        },
      "&[data-layout='stack'] > [role='row']:has(+ .react-aria-DropIndicator[data-drop-target])":
        {
          boxShadow: "inset 0 -2px 0 {colors.primary.9}",
          _rtl: { boxShadow: "inset 0 -2px 0 {colors.primary.9}" },
        },
    },
    // RA <GridListItem>
    item: {
      // Keyboard-only focus ring (see root). Pointer affordances are gated on
      // [data-hovered], which React Aria sets only on actionable items
      // (selectable, or with onAction), so a plain display item stays inert.
      focusVisibleRing: "outside",
      display: "flex",
      alignItems: "center",
      gap: "200",
      minWidth: 0,
      cursor: "default",
      color: "neutral.12",
      // No container at rest. The radius gives the focus ring and the selected
      // tint a shape.
      bg: "transparent",
      borderRadius: "200",
      outline: "none",
      transitionProperty: "background-color, box-shadow",
      transitionDuration: "fast",
      _motionReduce: {
        transitionProperty: "none",
      },

      "&[data-hovered]": {
        bg: "primary.2",
        cursor: "pointer",
      },
      "&[data-pressed]": {
        bg: "primary.3",
      },
      // Selected: a tint plus an inset edge, so the state does not rely on the
      // tint alone.
      "&[data-selected]": {
        bg: "primary.3",
        boxShadow: "inset 0 0 0 {sizes.25} {colors.primary.9}",
      },
      "&[data-disabled]": {
        layerStyle: "disabled",
      },
      "&[data-dragging]": {
        opacity: "0.6",
      },

      // Built-in controls (React Aria slots) keep their size.
      '& [slot="drag"]': {
        flexShrink: 0,
      },
      '& [slot="selection"]': {
        flexShrink: 0,
      },
    },
    // Wraps the consumer content next to the built-in controls
    itemContent: {
      flex: "1",
      minWidth: 0,
    },
    // renderEmptyState content. Spans the whole grid.
    emptyState: {
      gridColumn: "1 / -1",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      color: "neutral.11",
      textStyle: "sm",
      p: "400",
    },
  },

  variants: {
    // Item padding and the default gap between items. A `gap` prop on the root
    // overrides the gap.
    size: {
      sm: {
        root: { gap: "100" },
        item: { px: "200", py: "100" },
      },
      md: {
        root: { gap: "200" },
        item: { px: "300", py: "200" },
      },
      lg: {
        root: { gap: "300" },
        item: { px: "400", py: "300" },
      },
    },
  },

  defaultVariants: {
    size: "md",
  },
});
