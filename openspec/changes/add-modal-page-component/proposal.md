# Change: Add ModalPage Compound Component

## Why

Consumers migrating from Merchant Center Application Kit need a Nimbus
replacement for three modal page components: `FormModalPage`,
`InfoModalPage`, and `TabularModalPage`. These share the same structural
layout — fullscreen overlay with top bar, header, scrollable content, and
optional footer — but were separate implementations with overlapping APIs
and built-in form controls.

Nimbus consolidates all three into a single `ModalPage` compound component.
The page pattern (form, info, tabular) is expressed through composition of
sub-components rather than separate component variants.

## What Changes

- **NEW** `ModalPage` compound component with `Root`, `TopBar`, `Header`,
  `Title`, `Subtitle`, `Actions`, `TabNav`, `Content`, and `Footer` parts
- **NEW** `nimbusModalPage` slot recipe with structured layout (TopBar /
  Header / Content / Footer), scrollable content area, and footer with
  built-in button spacing
- **NEW** i18n support for back button accessible name ("Go back to
  {previousPathLabel}") with translations
- **NEW** `TopBar` with breadcrumb navigation (previous path label,
  separator, current path label) and accessible back button that receives
  focus on open
- **NEW** `TabNav` sub-component for tabular page patterns; when present,
  header bottom padding is automatically removed
- **NEW** Stacked modal depth — each nested ModalPage appears visually
  indented relative to its parent, providing a clear cue of nesting hierarchy
- **NEW** Controlled-only API (`isOpen` + `onClose`) — no uncontrolled mode
- **NEW** Backdrop click is disabled to prevent accidental data loss on
  full-page forms; Escape key remains active
- **MODIFIED** `packages/nimbus/src/components/index.ts` adds ModalPage
  export
- **MODIFIED** `packages/nimbus/src/theme/slot-recipes/index.ts` registers
  `nimbusModalPage` recipe

## Impact

- Affected specs: none (new component)
- Affected code:
  - `packages/nimbus/src/components/modal-page/` (new)
  - `packages/nimbus/src/components/index.ts` (export added)
  - `packages/nimbus/src/theme/slot-recipes/index.ts` (recipe registered)
  - `packages/i18n/data/core.json` (back button message added)
