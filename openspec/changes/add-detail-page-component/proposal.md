# Change: Add DetailPage Compound Component

## Why

Consumers migrating from Merchant Center Application Kit need a Nimbus
replacement for `TabularDetailPage`, `InfoDetailPage`, `CustomFormDetailPage`,
and `FormDetailPage`. These four components share the same structural layout —
back navigation, header, scrollable content, optional footer — but were separate
implementations. Nimbus consolidates them into a single compound component with
composable parts.

## What Changes

- **NEW** `DetailPage` compound component with `Root`, `Header`, `BackLink`,
  `Title`, `Subtitle`, `HeaderActions`, `Content`, and `Footer` parts
- **NEW** `nimbusDetailPage` slot recipe with CSS grid header layout and flex
  column root for scroll propagation
- **NEW** i18n support for back link default accessible name ("Go back") with
  translations in de, en, es, fr-FR, pt-BR
- **NEW** `BackLink` uses React Aria `useLink` hook for accessible link behavior
- **NEW** `HeaderActions` slot for action buttons alongside the title, positioned
  via CSS grid named areas
- **MODIFIED** `packages/nimbus/src/components/index.ts` adds DetailPage export
- **MODIFIED** `packages/nimbus/src/theme/slot-recipes/index.ts` registers
  `nimbusDetailPage` recipe

## Deviations from CRAFT-2166

The Jira ticket specified `DetailPage.Content` wrapping `PageContent` with a
pass-through `variant` prop. The implementation does **not** couple Content to
PageContent — it is a plain scrollable container. Consumers compose `PageContent`
inside `DetailPage.Content` themselves when they need width constraints. This
keeps the components decoupled and composable.

The ticket also described Tabs placed "between header and footer" as siblings.
The implementation places Tabs **inside** `DetailPage.Content` to maintain a
single `<main>` landmark and proper scroll propagation.

## Impact

- Affected specs: none (new component)
- Affected code:
  - `packages/nimbus/src/components/detail-page/` (new)
  - `packages/nimbus/src/components/index.ts` (export added)
  - `packages/nimbus/src/theme/slot-recipes/index.ts` (recipe registered)
  - `packages/i18n/data/core.json` (back link message added)
