# Change: Add PageContent Compound Component

## Why

Consumers need a layout component to constrain page content width and arrange
content in single or multi-column layouts. Currently, MC provides three separate
components (`PageContentWide`, `PageContentNarrow`, `PageContentFull`) with an
implicit children-splitting API. Nimbus needs a single, composable compound
component that consolidates all three variants with an explicit compound API.

## What Changes

- **NEW** `PageContent` compound component with `Root` and `Column` parts
- **NEW** `nimbusPageContent` slot recipe with `variant` (wide/narrow/full),
  `columns` (1, 1/1, 2/1), and `gap` (sm, md) variants
- **NEW** `PageContent.Column` supports `sticky` prop typed as
  `boolean | ConditionalValue<UtilityValues["top"]>` for sticky sidebar
- **NEW** Responsive behavior: multi-column collapses to single column on small
  screens
- **MODIFIED** `packages/nimbus/src/components/index.ts` adds PageContent export
- **MODIFIED** `packages/nimbus/src/theme/slot-recipes/index.ts` registers
  `nimbusPageContent` recipe

## Impact

- Affected specs: none (new component)
- Affected code:
  - `packages/nimbus/src/components/page-content/` (new)
  - `packages/nimbus/src/components/index.ts` (export added)
  - `packages/nimbus/src/theme/slot-recipes/index.ts` (recipe registered)
