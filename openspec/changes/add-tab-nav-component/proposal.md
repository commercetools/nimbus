# Change: Add TabNav component

## Why

Page-level navigation in ModalPage, MainPage, and DetailPage headers needs
tab-styled links with correct navigation semantics. The existing `Tabs`
component uses `role="tablist"` and roving tabindex — correct for content
panels, wrong for route-based navigation links.

Using `Tabs` for page-header navigation produces incorrect keyboard behaviour:
arrow key presses move focus within the strip but navigate to nothing, actively
confusing keyboard and screen reader users. Bootstrap explicitly warns against
this pattern; Material UI has an acknowledged open bug for the same mistake in
their "NavTabs" example.

## What Changes

- **NEW** `TabNav` compound component: `TabNav.Root` (`<nav>`) + `TabNav.Item` (`<a>`)
- `TabNav.Item` uses `aria-current="page"` for the active item (not `aria-selected`)
- Sequential Tab key navigation — no roving tabindex, no arrow-key cycling
- Accepts `variant` prop (default: `"tabs"`) for visual variants
- Visual appearance matches the Tabs tab strip (underline style)
- `TabNav.Root` wraps `TabNavRootSlot` (renders `<nav>` landmark)
- `TabNav.Item` wraps `TabNavItemSlot` (renders `<a>` element) using `useLink` from `react-aria` (same pattern as the `Link` component) for consistent press/focus handling; event handler types are sourced from `AriaLinkOptions`

## Impact

- Affected specs: tab-nav (new capability)
- Affected code:
  - **NEW**: `packages/nimbus/src/components/tab-nav/` (all files)
  - **MODIFIED**: `packages/nimbus/src/components/index.ts` (export added)
  - **MODIFIED**: `packages/nimbus/src/theme/slot-recipes/index.ts` (recipe registered as `nimbusTabNav`)
