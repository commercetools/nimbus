# Design: ScrollableRegion

## Architecture Decision: Hook + Component Split

The implementation is split into two layers:

1. **`useScrollableRegion` hook** (internal) — encapsulates overflow detection,
   debouncing, and dev-mode warnings. Always applies ARIA `role` and accessible
   name; conditionally adds `tabIndex` when overflowing. Does not handle focus
   ring — that is the component's responsibility. Used internally by Nimbus
   components that need scrollable-region a11y on existing elements (e.g.,
   compound component slots). Not exported to consumers — the API will
   stabilize through internal usage before being promoted to the public API.

2. **`ScrollableRegion` component** — a thin wrapper that calls the hook and
   renders `chakra.section` for `role="region"` or `chakra.div` for
   `role="group"`. Applies a keyboard-only focus ring via Chakra's
   `focusVisibleRing="outside"`. Accepts all Chakra style props. For standalone
   use when the consumer does not already have a styled container.

### Why not just a component?

Compound component parts (e.g., `Dialog.Body`) already have their own recipes
and slot elements. Wrapping them in `<ScrollableRegion>` would add an unwanted
DOM node and risk recipe style conflicts. The hook lets consumers spread
`containerProps` onto the existing element.

### Why not just a hook?

The component provides a convenient, zero-config way to create a scrollable
container when no existing element is available. It covers the common case
where a developer just needs "a box that scrolls accessibly."

## Overflow Detection Strategy

1. A `ResizeObserver` monitors the target element.
2. On each observation, a debounced check (default 100ms) compares scroll
   dimensions to client dimensions on the axis enabled by the `scrollable`
   prop.
3. When overflow state changes, React state updates and `containerProps` are
   recomputed.

The `scrollable` prop controls which axis is checked and how CSS overflow is
applied:

| Value | CSS applied | Axes checked |
|---|---|---|
| `"auto"` (default) | `overflow: auto` | both |
| `"scroll"` | `overflow: scroll` | both |
| `"x-auto"` | `overflowX: auto; overflowY: hidden` | horizontal |
| `"x-scroll"` | `overflowX: scroll; overflowY: hidden` | horizontal |
| `"y-auto"` | `overflowX: hidden; overflowY: auto` | vertical |
| `"y-scroll"` | `overflowX: hidden; overflowY: scroll` | vertical |
| `"none"` | `overflow: hidden` | none |

### Why ResizeObserver over scroll events?

`ResizeObserver` fires when the container or its content changes size, which is
the actual trigger for overflow changes. Scroll events fire during scrolling
but do not indicate whether overflow exists. `ResizeObserver` is also more
efficient — it batches observations and does not fire on every pixel of scroll.

## Focus Ring Strategy

The focus ring is handled by the `ScrollableRegion` component, not the hook.
The component applies Chakra's `focusVisibleRing="outside"` style prop, which
generates a `:focus-visible` CSS rule using the global focus ring design tokens.
This keeps the hook focused on behavior (overflow detection, ARIA, tabIndex)
and leaves presentation to the component layer.

## Conditional Semantics

| State | `role="region"` | `role="group"` (default) |
|-------|-----------------|--------------------------|
| Overflowing | `<section role="region">` + `aria-label`/`aria-labelledby` + `tabIndex={0}` | `<div role="group">` + `aria-label`/`aria-labelledby` + `tabIndex={0}` |
| Not overflowing | `<section role="region">` + `aria-label`/`aria-labelledby` (no tabIndex) | `<div role="group">` + `aria-label`/`aria-labelledby` (no tabIndex) |

Role and accessible name are always applied so the landmark doesn't
appear/disappear as content resizes, which would be jarring for screen reader
users. Only `tabIndex` toggles based on overflow state — the element is only
keyboard-reachable when there is actually content to scroll.

## Developer Guardrails

In development mode (`process.env.NODE_ENV !== "production"`), the hook logs a
`console.warn` when:
- `role` is `"region"`
- Neither `aria-label` nor `aria-labelledby` is provided

This catches a11y violations early without impacting production bundle size.
