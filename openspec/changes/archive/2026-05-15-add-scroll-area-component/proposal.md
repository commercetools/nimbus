# Change: Add ScrollArea layout component

## Why

Containers with `overflow: auto` or `overflow: scroll` are inaccessible to
keyboard-only and screen reader users unless they contain focusable elements.
Users cannot scroll through static text, log output, or non-interactive content
without a mouse. This is a common gap across the codebase (e.g., Dialog.Body,
MainPage.Content, and any custom scrollable area).

WCAG 2.1 SC 2.1.1 (Keyboard) requires that all functionality be operable via
keyboard. A scrollable container that can only be scrolled with a mouse fails
this criterion.

Additionally, the codebase lacked styled scrollbar overlays — native browser
scrollbars are visually inconsistent across platforms and do not follow Nimbus
design tokens.

## What Changes

- **NEW** `ScrollArea` component in `packages/nimbus/src/components/scroll-area/`
  - Single-element API that wraps Chakra UI's compound ScrollArea (powered by
    Ark UI / zag-js) — consumers write `<ScrollArea>` instead of assembling
    `Root > Viewport > Content > Scrollbar`
  - Custom Nimbus slot recipe with design token-based scrollbar styling
    (`neutral.4/7/9`), size variants (`xs`/`sm`/`md`/`lg`), and visibility
    variants (`hover`/`always`)
  - Conditional `tabIndex` via `useScrollAreaContext()` — viewport receives
    `tabIndex={0}` only when content overflows on either axis, satisfying the
    `scrollable-region-focusable` axe rule
  - Keyboard-only focus ring on root element using `_focusWithin` +
    `:has(:focus-visible)` pattern
  - `orientation` prop to control which scrollbar axes render (`vertical` |
    `horizontal` | `both`), defaulting to `"both"` so descendant overflow on
    either axis always surfaces a visible scrollbar indicator. Setting
    `orientation` to `"vertical"` or `"horizontal"` actively clips the
    opposite axis on the viewport.
  - Content wrapper is sized to the viewport by default (width and height)
    to preserve `width: 100%` sibling sizing and enable vertical centering of
    shorter children with flex/grid + `height: 100%`. For strict
    `orientation="horizontal"`, the wrapper keeps Zag's `min-width:
    fit-content` so rows of items scroll as usual.
  - Accepts all Chakra style props (`bg`, `maxH`, `w`, etc.) — padding
    props (`p`, `px`, `py`, etc.) are forwarded to the Content slot so they
    apply inside the scrollable area. `overflow`, `overflowX`, `overflowY`
    are removed from the prop surface because the component owns overflow
    internally and consumer values would break scroll behavior silently.
  - `ids` prop is limited to `root`, `viewport`, and `content` — the only
    parts the underlying state machine honors. Scrollbar and thumb elements
    are located by data attributes and cannot be renamed via `ids`.

No custom hook — overflow detection and scroll state are handled by Ark UI's
zag-js state machine internally. No i18n — no user-facing strings.

## Supersedes

This change supersedes the original `ScrollableRegion` proposal
(`add-scrollable-region-hook-and-component`) and PR #1295. Instead of building
a custom hook with `ResizeObserver` and a thin component wrapper, we proxy
Chakra UI's built-in ScrollArea which already provides overflow detection,
custom scrollbar overlays, and the underlying state machine. We add Nimbus
design tokens, keyboard accessibility fixes, and a simplified single-element
API on top.

## Impact

- Affected specs: nimbus-scroll-area (new capability)
- Affected code:
  - **NEW**: `packages/nimbus/src/components/scroll-area/` (all files)
  - **MODIFIED**: `packages/nimbus/src/components/index.ts` (export added)
  - **MODIFIED**: `packages/nimbus/src/theme/slot-recipes/index.ts` (recipe registered)
