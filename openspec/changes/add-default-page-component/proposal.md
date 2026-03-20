# Change: Add DefaultPage Compound Component

## Why

Consumers migrating from Merchant Center Application Kit need a Nimbus
replacement for eight page layout components: `TabularDetailPage`,
`InfoDetailPage`, `CustomFormDetailPage`, `FormDetailPage` (detail variants) and
`FormMainPage`, `InfoMainPage`, `TabularMainPage`, `CustomFormMainPage` (main
variants). These eight components share the same structural layout — header,
scrollable content, optional footer — but were separate implementations with
overlapping APIs and built-in form controls.

Nimbus consolidates all eight into a single `DefaultPage` compound component.
The only structural difference between "detail" and "main" pages was back
navigation, which is now an optional `BackLink` sub-component. When present, CSS
`:has()` rules automatically adjust the header grid layout.

## What Changes

- **NEW** `DefaultPage` compound component with `Root`, `Header`, `BackLink`,
  `Title`, `Subtitle`, `Actions`, `TabNav`, `Content`, and `Footer` parts
- **NEW** `nimbusDefaultPage` slot recipe with CSS grid root layout
  (`auto 1fr auto`), CSS grid header with `:has()` rules for BackLink and
  TabNav, and `stickyHeader` / `stickyFooter` variant props
- **NEW** i18n support for back link default accessible name ("Go back") with
  translations in de, en, es, fr-FR, pt-BR
- **NEW** `BackLink` uses React Aria `useLink` hook for accessible link behavior
- **NEW** `Actions` slot for action buttons alongside the title, positioned via
  CSS grid
- **NEW** `TabNav` sub-component for tab navigation in the header; when present,
  CSS `:has()` automatically removes header `paddingBottom`
- **NEW** `stickyHeader` and `stickyFooter` variant props on Root
- **MODIFIED** `packages/nimbus/src/components/index.ts` adds DefaultPage export
- **MODIFIED** `packages/nimbus/src/theme/slot-recipes/index.ts` registers
  `nimbusDefaultPage` recipe

## Deviations from Original Proposals

This component consolidates two earlier proposals (`add-detail-page-component`
and `add-main-page-component`) into a single unified component:

- **BackLink is optional**: Omit for main-level pages, include for detail views.
  CSS `:has(.nimbus-default-page__backLink)` adjusts the grid when present.
- **Actions slot** (renamed from `HeaderActions` in the DetailPage proposal):
  Uses the simpler name from the MainPage proposal.
- **Content is a plain scrollable container**: Does NOT wrap `PageContent`
  internally (deviating from the MainPage proposal). Consumers compose
  `PageContent` inside `DefaultPage.Content` when they need width constraints.
- **TabNav sub-component**: New addition not in either original proposal.
  Provides a layout slot for tab navigation in the header.
- **Sticky variants**: New addition not in either original. Allows header and/or
  footer to stick during scroll.
- **Root uses CSS grid** (`auto 1fr auto`): Adopted from the MainPage proposal.
  More natural than flexbox for the header/content/footer pattern.

## Impact

- Affected specs: none (new component)
- Supersedes: `add-detail-page-component`, `add-main-page-component`
- Affected code:
  - `packages/nimbus/src/components/default-page/` (new)
  - `packages/nimbus/src/components/index.ts` (export added)
  - `packages/nimbus/src/theme/slot-recipes/index.ts` (recipe registered)
  - `packages/i18n/data/core.json` (back link message added)
