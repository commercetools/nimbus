# Change: Add ScrollableRegion hook and component

## Why

Containers with `overflow: auto` or `overflow: scroll` are inaccessible to
keyboard-only and screen reader users unless they contain focusable elements.
Users cannot scroll through static text, log output, or non-interactive content
without a mouse. This is a common gap across the codebase (e.g., Dialog.Body,
MainPage.Content, and any custom scrollable area).

WCAG 2.1 SC 2.1.1 (Keyboard) requires that all functionality be operable via
keyboard. A scrollable container that can only be scrolled with a mouse fails
this criterion.

## What Changes

- **NEW** `useScrollableRegion` hook (internal) in `packages/nimbus/src/hooks/use-scrollable-region/`
  - Detects overflow via `ResizeObserver` with debounced evaluation
  - Always applies ARIA `role` and accessible name; conditionally adds
    `tabIndex` when overflowing
  - Returns `ref`, `isOverflowing`, and spread-ready `containerProps`
  - Internal to Nimbus — used by `ScrollableRegion` and future compound
    component integrations (e.g., `Dialog.Body`)

- **NEW** `ScrollableRegion` component in `packages/nimbus/src/components/scrollable-region/`
  - Thin wrapper that subscribes to the hook
  - Renders `<section>` for `role="region"`, `<div>` for `role="group"`
    via `chakra.section`/`chakra.div`
  - Applies keyboard-only focus ring via Chakra's `focusVisibleRing`
  - Accepts all Chakra style props (`p`, `bg`, `maxH`, etc.)
  - Accepts standard HTML attributes and `children`

No recipe file — the hook provides all required styles via `containerProps`.
No slots — single-element component. No i18n — no user-facing strings.

## Impact

- Affected specs: nimbus-scrollable-region (new capability)
- Affected code:
  - **NEW**: `packages/nimbus/src/hooks/use-scrollable-region/` (all files)
  - **NEW**: `packages/nimbus/src/components/scrollable-region/` (all files)
  - **MODIFIED**: `packages/nimbus/src/components/index.ts` (export added)
