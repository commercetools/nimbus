import { defineSlotRecipe } from "@chakra-ui/react/styled-system";

/**
 * Recipe configuration for the Splitter component.
 *
 * Slots:
 * - `root` — flex container holding the two panes. Position-relative so the
 *   absolutely-positioned handle can sit on the boundary.
 * - `pane` — a resizable region; size is driven from props via inline style.
 *   The two panes together fill 100% of the root.
 * - `handle` — interactive separator the user drags. Positioned absolutely on
 *   the boundary between the panes (no flex track, so the panes' content
 *   touches edge-to-edge). The visible track stays transparent until hover or
 *   keyboard focus to keep the resting layout uncluttered. Hit area is
 *   expanded via a `_before` pseudo-element so the handle always meets the
 *   24×24 CSS-pixel touch target (WCAG 2.5.5) even when the visible track is
 *   thinner than that.
 *
 * Variants:
 * - `orientation`: `horizontal` (default) | `vertical` — flex direction +
 *   axis-specific handle dimensions.
 * - `size`: `sm` | `md` (default) | `lg` — visual thickness of the handle's
 *   track (only seen on hover/focus).
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/windowsplitter/
 */
export const splitterSlotRecipe = defineSlotRecipe({
  className: "nimbus-splitter",
  slots: ["root", "pane", "handle"],
  base: {
    root: {
      display: "flex",
      position: "relative",
      width: "100%",
      height: "100%",
      overflow: "hidden",
    },
    pane: {
      overflow: "auto",
      minWidth: 0,
      minHeight: 0,
    },
    handle: {
      position: "absolute",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "transparent",
      transitionProperty: "background-color",
      transitionDuration: "fast",
      zIndex: 1,
      // Expand the interactive hit area to at least 24x24 CSS pixels so the
      // handle meets WCAG 2.5.5 even when the visible track is thinner.
      _before: {
        content: '""',
        position: "absolute",
        top: "50%",
        left: "50%",
        minWidth: "600",
        minHeight: "600",
        width: "100%",
        height: "100%",
        transform: "translate(-50%, -50%)",
      },
      _hover: {
        backgroundColor: "neutral.6",
      },
      _focusVisible: {
        layerStyle: "focusRing",
        backgroundColor: "neutral.6",
      },
      "&[data-disabled='true']": {
        // The handle track is invisible at rest, so a disabled affordance
        // (reduced opacity / not-allowed cursor) has nothing to attach to and
        // would only surface a misleading cursor. Just neutralize the resize
        // cursor and keep the track from appearing on hover.
        cursor: "default",
        _hover: { backgroundColor: "transparent" },
      },
      "&[data-resize-locked='true']": {
        // While a pane is collapsed the handle can't resize (see
        // splitter.handle.tsx). Drop the resize cursor so the affordance matches
        // the behavior; the track still shows on hover/focus so the handle stays
        // discoverable for Enter (toggle) and double-click (restore).
        cursor: "default",
      },
    },
  },
  variants: {
    orientation: {
      horizontal: {
        root: { flexDirection: "row" },
        handle: {
          top: 0,
          height: "100%",
          cursor: "col-resize",
          transform: "translateX(-50%)",
        },
      },
      vertical: {
        root: { flexDirection: "column" },
        handle: {
          left: 0,
          width: "100%",
          cursor: "row-resize",
          transform: "translateY(-50%)",
        },
      },
    },
    size: {
      sm: {},
      md: {},
      lg: {},
    },
  },
  compoundVariants: [
    // Horizontal handle thickness per size variant.
    {
      orientation: "horizontal",
      size: "sm",
      css: { handle: { width: "100" } },
    },
    {
      orientation: "horizontal",
      size: "md",
      css: { handle: { width: "200" } },
    },
    {
      orientation: "horizontal",
      size: "lg",
      css: { handle: { width: "300" } },
    },
    // Vertical handle thickness per size variant.
    { orientation: "vertical", size: "sm", css: { handle: { height: "100" } } },
    { orientation: "vertical", size: "md", css: { handle: { height: "200" } } },
    { orientation: "vertical", size: "lg", css: { handle: { height: "300" } } },
  ],
  defaultVariants: {
    orientation: "horizontal",
    size: "md",
  },
});
