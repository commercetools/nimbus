# Design: ScrollableRegion

## Architecture Decision: Hook + Component Split

The implementation is split into two layers:

1. **`useScrollableRegion` hook** — encapsulates all overflow detection,
   debouncing, ARIA attribute management, focus ring logic, and dev-mode
   warnings. This allows consumers to apply scrollable-region a11y to any
   existing element (e.g., a compound component slot) without introducing an
   extra DOM wrapper or recipe conflicts.

2. **`ScrollableRegion` component** — a thin `forwardRef` wrapper that calls
   the hook and renders the appropriate element (`<section>` or `<div>`) with
   all attributes applied automatically. For standalone use when the consumer
   does not already have a styled container.

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
2. On each observation, a debounced check (default 100ms) compares
   `scrollHeight > clientHeight`.
3. When overflow state changes, React state updates and `containerProps` are
   recomputed.

### Why ResizeObserver over scroll events?

`ResizeObserver` fires when the container or its content changes size, which is
the actual trigger for overflow changes. Scroll events fire during scrolling
but do not indicate whether overflow exists. `ResizeObserver` is also more
efficient — it batches observations and does not fire on every pixel of scroll.

## Focus Ring Strategy

The hook uses `useFocusRing()` from `react-aria` to detect keyboard-only focus.
When `isFocusVisible` is true, inline styles are applied matching the codebase's
CSS custom properties:

- `outlineWidth: var(--focus-ring-width)`
- `outlineColor: var(--focus-ring-color)`
- `outlineStyle: var(--focus-ring-style)`
- `outlineOffset: -2px` (inset to prevent clipping by `overflow`)

Inline styles are used instead of a recipe because:
- The hook must work on any element, not just recipe-styled ones
- Focus ring styles are conditional on both overflow AND keyboard focus
- The codebase already defines these CSS variables globally

## Conditional Semantics

| State | `role="region"` | `role="group"` (default) |
|-------|-----------------|--------------------------|
| Overflowing | `<section>` + `aria-label`/`aria-labelledby` + `tabIndex={0}` | `<div role="group">` + `aria-label`/`aria-labelledby` + `tabIndex={0}` |
| Not overflowing | `<div>` (no role, no tabIndex) | `<div>` (no role, no tabIndex) |

When not overflowing, all landmark semantics are removed to avoid "landmark
noise" — screen reader users would otherwise encounter landmarks for regions
that do not require keyboard interaction.

## Developer Guardrails

In development mode (`process.env.NODE_ENV !== "production"`), the hook logs a
`console.warn` when:
- The element overflows
- Neither `aria-label` nor `aria-labelledby` is provided

This catches a11y violations early without impacting production bundle size.
