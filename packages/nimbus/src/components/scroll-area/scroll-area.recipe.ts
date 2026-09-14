import { defineSlotRecipe } from "@chakra-ui/react/styled-system";

/**
 * Recipe for the ScrollArea component — overrides Chakra's default scrollArea
 * recipe with Nimbus design tokens.
 *
 * Two independent variant groups: `variant` is the visual style
 * (`solid` | `inset` | `overlay` | `glass`); `scrollbarVisibility` is auto-hide
 * vs. always-visible (the deprecated `variant="always"` maps onto it).
 *
 * `size` sets the visible thumb thickness; each inset variant only pads around
 * it, so the track/hit-area grows by the padding rather than the thumb shrinking.
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
      // Track/hit-area = visible thumb size + inset padding on both sides.
      "--scroll-area-thumb-inset": "0px",
      "--scroll-area-scrollbar-size":
        "calc(var(--scroll-area-thumb-size) + var(--scroll-area-thumb-inset) * 2)",
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
      transition: "opacity 200ms ease",
      position: "relative",
      // Paint above viewport content (e.g. sticky headers).
      zIndex: "1",
      margin: "var(--scroll-area-scrollbar-margin)",
      // Opacity is owned solely by the `scrollbarVisibility` group; a base
      // `opacity` here would tie on specificity and let source order decide.
      // Hide a scrollbar when its own axis isn't overflowing (Zag sets
      // `data-overflow-x`/`-y` on it per the current viewport state).
      "&[data-orientation=vertical]:not([data-overflow-y])": {
        display: "none",
      },
      "&[data-orientation=horizontal]:not([data-overflow-x])": {
        display: "none",
      },
      // neutral.9 clears ~3:1 on light surfaces (neutral.7 was ~1.3:1 and read
      // washed-out); darkens on hover/active. Both steps are theme-aware.
      "--scroll-area-thumb-bg": "{colors.neutral.9}",
      "&:is(:hover, :active)": {
        "--scroll-area-thumb-bg": "{colors.neutral.11}",
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
      // Transparent border + `content-box` clip make the painted thumb thinner
      // than its hit-area with no layout shift (`0px` inset = fills the track).
      border: "var(--scroll-area-thumb-inset) solid transparent",
      backgroundClip: "content-box",
      transition: "backgrounds",
      _vertical: { width: "full" },
      _horizontal: { height: "full" },
    },
    corner: {
      bg: "neutral.3",
      margin: "var(--scroll-area-scrollbar-margin)",
      transition: "opacity 200ms ease",
      // Opacity owned by the `scrollbarVisibility` group (see the scrollbar note).
    },
  },
  variants: {
    variant: {
      solid: {
        scrollbar: {
          bg: "neutral.4",
        },
      },
      inset: {
        root: {
          "--scroll-area-thumb-inset": "2px",
        },
        scrollbar: {
          bg: "neutral.4",
        },
      },
      overlay: {
        root: {
          "--scroll-area-thumb-inset": "2px",
        },
        scrollbar: {
          bg: "transparent",
        },
      },
      glass: {
        root: {
          "--scroll-area-thumb-inset": "2px",
        },
        scrollbar: {
          bg: "bg/60",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        },
      },
    },
    scrollbarVisibility: {
      // Bar starts transparent; `useScrollbarAutoHide` toggles
      // `data-scrollbar-visible` on the root (the hook owns the idle delay). The
      // reveal selector outranks the base `opacity: 0` by specificity.
      "auto-hide": {
        scrollbar: {
          opacity: "0",
          // Not hit-testable while hidden, or its widened `_before` strip would
          // swallow clicks on overlaid content (no gutter here). Restored on reveal.
          pointerEvents: "none",
          // Direct-child (`>`), not descendant: a nested ScrollArea must not be
          // revealed by this root's attribute.
          "[data-scrollbar-visible] > &": {
            opacity: "1",
            pointerEvents: "auto",
          },
          // Keep visible/interactive while dragging, regardless of the idle
          // timer (a drag also fires viewport `scroll`, so this is a safeguard).
          "&[data-dragging]": {
            opacity: "1",
            pointerEvents: "auto",
          },
        },
        corner: {
          opacity: "0",
          pointerEvents: "none",
          // Direct-child combinator, like the scrollbar above.
          "[data-scrollbar-visible] > &": {
            opacity: "1",
            pointerEvents: "auto",
          },
        },
      },
      always: {
        viewport: {
          // Reserve a gutter so the always-visible bar doesn't overlay content.
          // Vertical: width calc (width resolves against a definite parent).
          // Horizontal: flex + margin, because a % height needs an explicit
          // parent height and the root's height comes from maxHeight.
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
          "--scroll-area-thumb-size": "{sizes.100}",
        },
      },
      sm: {
        root: {
          "--scroll-area-thumb-size": "{sizes.150}",
        },
      },
      md: {
        root: {
          "--scroll-area-thumb-size": "{sizes.200}",
        },
      },
      lg: {
        root: {
          "--scroll-area-thumb-size": "{sizes.300}",
        },
      },
    },
  },
  defaultVariants: {
    size: "sm",
    variant: "solid",
    scrollbarVisibility: "auto-hide",
  },
});
