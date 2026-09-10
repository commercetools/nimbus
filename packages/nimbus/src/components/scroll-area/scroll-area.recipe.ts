import { defineSlotRecipe } from "@chakra-ui/react/styled-system";

/**
 * Recipe configuration for the ScrollArea component.
 * Overrides Chakra UI's default scrollArea recipe with Nimbus design tokens.
 */
export const scrollAreaSlotRecipe = defineSlotRecipe({
  className: "nimbus-scroll-area",
  slots: ["root", "viewport", "content", "scrollbar", "thumb", "corner"],
  base: {
    root: {
      display: "flex",
      flexDirection: "column",
      width: "100%",
      height: "100%",
      position: "relative",
      overflow: "hidden",
      "--scroll-area-scrollbar-margin": "{sizes.50}",
      "--scroll-area-scrollbar-click-area":
        "calc(var(--scroll-area-scrollbar-size) + calc(var(--scroll-area-scrollbar-margin) * 2))",
      _focusWithin: {
        "&:has(:focus-visible)": {
          outlineWidth: "var(--focus-ring-width, 1px)",
          outlineColor: "var(--focus-ring-color)",
          outlineStyle: "var(--focus-ring-style, solid)",
          outlineOffset: "2px",
        },
      },
    },
    viewport: {
      display: "flex",
      flexDirection: "column",
      height: "100%",
      width: "100%",
      borderRadius: "inherit",
      outline: "none",
      WebkitOverflowScrolling: "touch",
      scrollbarWidth: "none",
      "&::-webkit-scrollbar": {
        display: "none",
      },
    },
    content: {
      minWidth: "100%",
    },
    scrollbar: {
      display: "flex",
      userSelect: "none",
      touchAction: "none",
      borderRadius: "full",
      transition: "opacity 150ms 300ms",
      position: "relative",
      // Paint above viewport content (e.g. sticky headers with z-index)
      zIndex: "1",
      margin: "var(--scroll-area-scrollbar-margin)",
      // Hide each scrollbar when its own axis isn't overflowing. Zag sets
      // `data-overflow-x` / `data-overflow-y` on the scrollbar reflecting the
      // current viewport state, so a vertical scrollbar with no Y overflow
      // (and vice versa) should not paint even if the other axis overflows.
      "&[data-orientation=vertical]:not([data-overflow-y])": {
        display: "none",
      },
      "&[data-orientation=horizontal]:not([data-overflow-x])": {
        display: "none",
      },
      bg: "neutral.4",
      "--scroll-area-thumb-bg": "{colors.neutral.7}",
      "&:is(:hover, :active)": {
        "--scroll-area-thumb-bg": "{colors.neutral.9}",
      },
      _before: {
        content: '""',
        position: "absolute",
      },
      _vertical: {
        width: "var(--scroll-area-scrollbar-size)",
        flexDirection: "column",
        "&::before": {
          width: "var(--scroll-area-scrollbar-click-area)",
          height: "100%",
          insetInlineStart: "calc(var(--scroll-area-scrollbar-margin) * -1)",
        },
      },
      _horizontal: {
        height: "var(--scroll-area-scrollbar-size)",
        flexDirection: "row",
        "&::before": {
          height: "var(--scroll-area-scrollbar-click-area)",
          width: "100%",
          top: "calc(var(--scroll-area-scrollbar-margin) * -1)",
        },
      },
    },
    thumb: {
      borderRadius: "inherit",
      bg: "var(--scroll-area-thumb-bg)",
      transition: "backgrounds",
      _vertical: { width: "full" },
      _horizontal: { height: "full" },
    },
    corner: {
      bg: "neutral.3",
      margin: "var(--scroll-area-scrollbar-margin)",
      opacity: 0,
      transition: "opacity 150ms 300ms",
    },
  },
  variants: {
    variant: {
      hover: {
        // Reveal is driven by `useScrollbarAutoHide`, which toggles
        // `data-scrollbar-visible` on the root from real activity (mouse enter,
        // mouse movement, scrolling) plus an idle timer — not off Zag's
        // `data-hover`, which stays set while a resting pointer sits inside.
        // The hook owns the hide delay, so there is no CSS transition-delay
        // here (the base slot's 300ms delay is overridden to a plain fade).
        scrollbar: {
          opacity: "0",
          transition: "opacity 150ms",
          "[data-scrollbar-visible] &": {
            opacity: "1",
          },
          // Keep the bar visible while the thumb is being dragged, regardless
          // of the idle timer. A drag also fires viewport `scroll`, so this is
          // a safeguard rather than the primary mechanism.
          "&[data-dragging]": {
            opacity: "1",
          },
        },
        corner: {
          opacity: "0",
          transition: "opacity 150ms",
          "[data-scrollbar-visible] &": {
            opacity: "1",
          },
        },
      },
      always: {
        viewport: {
          // Create gutter so the permanently visible scrollbar
          // doesn't overlay content.
          // - Vertical scrollbar (Y overflow): use width calc — works
          //   because width always resolves against a definite parent.
          // - Horizontal scrollbar (X overflow): use flex + margin —
          //   height calc doesn't work because the root's height
          //   comes from maxHeight, and CSS % heights require an
          //   explicit parent height property.
          flex: "1",
          minHeight: "0",
          "&[data-overflow-y]": {
            width:
              "calc(100% - var(--scroll-area-scrollbar-size) - var(--scroll-area-scrollbar-margin) * 2)",
          },
          "&[data-overflow-x]": {
            marginBottom:
              "calc(var(--scroll-area-scrollbar-size) + var(--scroll-area-scrollbar-margin) * 2)",
          },
        },
        scrollbar: {
          opacity: "1",
        },
        corner: {
          opacity: 1,
        },
      },
    },
    size: {
      xs: {
        root: {
          "--scroll-area-scrollbar-size": "{sizes.100}",
        },
      },
      sm: {
        root: {
          "--scroll-area-scrollbar-size": "{sizes.150}",
        },
      },
      md: {
        root: {
          "--scroll-area-scrollbar-size": "{sizes.200}",
        },
      },
      lg: {
        root: {
          "--scroll-area-scrollbar-size": "{sizes.300}",
        },
      },
    },
  },
  defaultVariants: {
    size: "sm",
    variant: "hover",
  },
});
