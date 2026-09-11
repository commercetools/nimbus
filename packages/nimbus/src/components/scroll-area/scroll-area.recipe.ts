import { defineSlotRecipe } from "@chakra-ui/react/styled-system";

/**
 * Recipe configuration for the ScrollArea component.
 * Overrides Chakra UI's default scrollArea recipe with Nimbus design tokens.
 *
 * Two independent variant groups drive the look and behavior:
 * - `variant` — the visual style (`solid` | `inset` | `overlay` | `glass`).
 * - `scrollbarVisibility` — whether the bar auto-hides (`auto-hide`, the
 *   default) or stays permanently visible (`always`). The deprecated
 *   `variant="always"` maps onto `scrollbarVisibility="always"`.
 *
 * Thumb thickness stays constant across visual variants: `size` sets the
 * visible thumb thickness (`--scroll-area-thumb-size`) and each inset variant
 * only pads around it (`--scroll-area-thumb-inset`), so the track/hit-area
 * grows by the padding rather than the thumb shrinking.
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
      // Visible thumb thickness (from the `size` variant) and the padding an
      // inset visual adds around it (from the `variant` group). The track /
      // hit-area is the sum, so the visible thumb size is constant per `size`.
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
      // Auto-hide reveal/hide is a fade: the `auto-hide` visibility variant
      // animates opacity between 0 and 1 over this transition.
      transition: "opacity 200ms ease",
      position: "relative",
      // Paint above viewport content (e.g. sticky headers with z-index)
      zIndex: "1",
      margin: "var(--scroll-area-scrollbar-margin)",
      // Opacity (auto-hide vs. always-visible) is owned entirely by the
      // `scrollbarVisibility` variant group, so exactly one `opacity` rule
      // applies to this element. Setting a base `opacity` here as well would put
      // two equal-specificity rules on the element, where CSS source order — not
      // which variant is active — would decide the winner.
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
      // Resting thumb clears ~3:1 against light surfaces (neutral.9 ≈ 3.3:1 on
      // white; neutral.7 was ~1.3:1 and read as washed-out). Darkens further on
      // hover/active for feedback. Both steps are theme-aware.
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
      // Inset the thumb within the track: a transparent border plus
      // `content-box` clipping makes the painted thumb thinner than its
      // hit-area without shrinking the element (no layout shift). The inset is
      // `0px` for the `solid` variant, so it fills the track edge-to-edge.
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
    // Visual style of the scrollbar.
    variant: {
      // Grey track, thumb fills it edge-to-edge (the original look, default).
      solid: {
        scrollbar: {
          bg: "neutral.4",
        },
      },
      // Grey track with an inset, floating pill thumb.
      inset: {
        root: {
          "--scroll-area-thumb-inset": "2px",
        },
        scrollbar: {
          bg: "neutral.4",
        },
      },
      // No track — only the floating thumb shows (overlay look).
      overlay: {
        root: {
          "--scroll-area-thumb-inset": "2px",
        },
        scrollbar: {
          bg: "transparent",
        },
      },
      // Translucent, frosted track that blurs the content behind it.
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
    // Whether the bar auto-hides or stays visible. Exposed as the public
    // `scrollbarVisibility` prop; the deprecated `variant="always"` also maps
    // onto `always`.
    scrollbarVisibility: {
      // Auto-hide: bar transparent until `useScrollbarAutoHide` toggles
      // `data-scrollbar-visible` on the root (real activity + an idle timer;
      // the hook owns the delay, so no CSS transition-delay). The reveal
      // selector outranks the base `opacity: 0` by specificity, so it wins
      // whenever the attribute is present regardless of source order.
      "auto-hide": {
        scrollbar: {
          opacity: "0",
          // While hidden the bar is invisible, so it must not be hit-testable —
          // otherwise its widened `_before` hit strip would silently swallow
          // clicks on the content it overlays (there is no reserved gutter in
          // this mode). `pointer-events` is restored the moment the bar is
          // revealed (or dragged), so grabbing the visible thumb still works.
          pointerEvents: "none",
          // Direct-child combinator, not descendant: a nested ScrollArea inside
          // this one's content must not be revealed by this root's attribute.
          // The scrollbar is a direct child of its own root.
          "[data-scrollbar-visible] > &": {
            opacity: "1",
            pointerEvents: "auto",
          },
          // Keep the bar visible and interactive while the thumb is dragged,
          // regardless of the idle timer (a drag also fires viewport `scroll`,
          // so this is a safeguard rather than the primary mechanism).
          "&[data-dragging]": {
            opacity: "1",
            pointerEvents: "auto",
          },
        },
        corner: {
          opacity: "0",
          pointerEvents: "none",
          "[data-scrollbar-visible] &": {
            opacity: "1",
            pointerEvents: "auto",
          },
        },
      },
      always: {
        viewport: {
          // Create a gutter so the permanently visible scrollbar doesn't
          // overlay content.
          // - Vertical scrollbar (Y overflow): use width calc — works because
          //   width always resolves against a definite parent.
          // - Horizontal scrollbar (X overflow): use flex + margin — height
          //   calc doesn't work because the root's height comes from maxHeight,
          //   and CSS % heights require an explicit parent height property.
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
