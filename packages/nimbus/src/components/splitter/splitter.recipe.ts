import { defineSlotRecipe } from "@chakra-ui/react/styled-system";

/**
 * Recipe configuration for the Splitter component.
 *
 * Slots:
 * - `root` — flex container holding the two panes and the handle.
 * - `pane` — a resizable region; size is driven from props via inline style.
 * - `handle` — interactive separator the user drags. Carries the focus ring,
 *   hover state, and disabled visuals. Hit area is expanded via a pseudo-element
 *   so even thin visual handles meet the 24×24 CSS-pixel touch target.
 *
 * Variants:
 * - `orientation`: `horizontal` (default) | `vertical` — flex direction +
 *   cursor + axis-specific handle dimensions.
 * - `size`: `sm` | `md` (default) | `lg` — visual thickness of the handle.
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
      flex: "none",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      backgroundColor: "transparent",
      transitionProperty: "background-color",
      transitionDuration: "fast",
      zIndex: 1,
      // Expand the interactive hit area to meet the 24x24 CSS pixel touch
      // target requirement (WCAG 2.5.5), even when the visible track is thin.
      _before: {
        content: '""',
        position: "absolute",
        inset: 0,
        minWidth: "600",
        minHeight: "600",
        // Center the expanded hit area on the visible track.
        transform: "translate(0, 0)",
      },
      _hover: {
        backgroundColor: "neutral.6",
      },
      _focusVisible: {
        layerStyle: "focusRing",
        backgroundColor: "neutral.6",
      },
      "&[data-disabled='true']": {
        layerStyle: "disabled",
        _hover: { backgroundColor: "transparent" },
      },
    },
  },
  variants: {
    orientation: {
      horizontal: {
        root: { flexDirection: "row" },
        handle: { height: "100%", cursor: "col-resize" },
      },
      vertical: {
        root: { flexDirection: "column" },
        handle: { width: "100%", cursor: "row-resize" },
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
