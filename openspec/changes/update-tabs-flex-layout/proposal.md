# Change: Add flex growth and overflow handling to Tabs root

## Why

When Tabs is composed inside a flex-column parent (e.g., `DetailPage.Root`),
the Tabs root does not grow to fill available vertical space. This breaks the
scroll chain: content inside tab panels cannot scroll because the Tabs
container collapses to its intrinsic height instead of stretching to fill the
remaining space. The existing `width: 100%` on the root only handles the
horizontal axis.

This was discovered during the DetailPage migration (CRAFT-2166), where
`Tabs.Root` sits between a fixed header and footer inside a flex-column layout.
Without `flex: 1` and `minHeight: 0`, the content area does not scroll.

## What Changes

- Add `flex: 1` to Tabs root base styles so it grows to fill available space
  along the parent's flex axis
- Add `minHeight: 0` to Tabs root base styles to enable correct overflow
  behavior in nested flex containers (Firefox fix)

Both properties are additive and only take effect when Tabs is inside a flex
parent. In non-flex contexts, they have no visible impact.

## Impact

- Affected specs: `nimbus-tabs`
- Affected code: `packages/nimbus/src/components/tabs/tabs.recipe.ts`
- Risk: Low. `flex: 1` only activates in flex parents. `minHeight: 0` is a
  standard nested-flex fix with no visual side effects. The existing
  `width: 100%` already expressed the intent of "fill available space" on the
  horizontal axis; this extends the same intent to the vertical axis.
- Breaking: None. Tabs in non-flex parents are unaffected.
