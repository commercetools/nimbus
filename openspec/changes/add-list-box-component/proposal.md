# Proposal: Add ListBox component

## Why

Nimbus has no standalone selection-list component. Today the React Aria
`ListBox` primitive is wrapped privately and separately inside two components —
`select/components/select.options.tsx` wraps `RaListBox` for the Select
dropdown, and `combobox/components/combobox.list-box.tsx` wraps it again for
ComboBox — so the same list surface, option styling, selection affordance, and
section handling are implemented twice and cannot be reused on their own.

Consumers who need a plain selection list (settings/filter lists, list pickers,
transfer lists, command palettes) have nothing to reach for. FEC-1139 asks us
to close that gap, and it is also the building block that later tickets depend
on: it is a Jira predecessor of the Phase 2 Autocomplete behaviour primitive and
the Phase 3 ComboBox and Select "Autocomplete + Virtualizer" compositions.

Two research passes ground this proposal (see `design.md` for the full record):

- A multi-source study of how mature design systems present a selection list
  (React Aria/Spectrum, GitHub Primer, Shopify Polaris, Material UI, Carbon).
  Saved at `docs/research/list-box-variants.research.md`.
- An inspection of Nimbus's existing Select / ComboBox / Menu / Popover code to
  fix the visual conventions the new component must match.

The headline finding: React Aria reuses **one** `ListBox` component as the popup
content of Select, ComboBox, and Autocomplete. So Nimbus should build one
ListBox — not a reduced "embedded-only" variant — styled so it reads well both
standalone and inside an overlay.

## What Changes

- **Add a new `ListBox` compound component** under
  `packages/nimbus/src/components/list-box/`, wrapping React Aria's `ListBox`,
  `ListBoxItem`, and `ListBoxSection`.
  - Compound API: `ListBox.Root`, `ListBox.Item`, `ListBox.Section`.
  - Single and multiple selection.
  - Section grouping with headers.
  - Keyboard navigation and type-ahead (from React Aria).
  - Drag-and-drop via `dragAndDropHooks` (from React Aria).
  - Rich item content: leading media (icon/avatar), primary label + secondary
    description text, and trailing content.
  - Async / infinite loading via React Aria's `ListBoxLoadMoreItem`, and a
    styled empty state via `renderEmptyState`.
- **Visual variants** (the point of the ticket — see `design.md` §Variants):
  - `size` — the shared Nimbus size scale (essential; ticket-committed).
  - `variant` — `card` (default: bordered/elevated surface for standalone use)
    vs `plain` (bare list, for embedding inside an already-carded popover).
  - Mode-driven **selection affordance**: single-select → full-row highlight;
    multiple-select → leading checkbox — matching the existing
    Select/ComboBox/Menu convention so ListBox can later back them.
  - `density` — `comfortable` (default) vs `compact` (nice-to-have).
- **Register** the new slot recipe as `nimbusListBox` in
  `packages/nimbus/src/theme/slot-recipes/index.ts` and export the component
  from `packages/nimbus/src/index.ts`.
- **Add i18n** for the default empty-state message
  (`Nimbus.ListBox.emptyState`).
- **Documentation + stories + tests**: consumer docs (`.dev.mdx` +
  `.docs.spec.tsx`), designer/a11y guidelines, and Storybook stories that both
  play-test every mechanic and display every visual permutation.

No existing component is modified in this change. Making Select and ComboBox
consume the new ListBox internally is deliberately **out of scope** (see
Impact → Sequencing); this change adds the component and its own surface.

## Capabilities

### New Capabilities

- `nimbus-list-box`: a standalone, accessible selection-list component built on
  React Aria's ListBox — selection, sections, rich item content, keyboard
  navigation, drag-and-drop, size / container / density variants, and empty /
  loading / disabled states.

### Modified Capabilities

None.

## Impact

**Specs**

- `openspec/specs/nimbus-list-box/spec.md` — new capability (created on archive
  from this change's `specs/nimbus-list-box/spec.md`).

**Code (all additive)**

- New `packages/nimbus/src/components/list-box/` directory (recipe, slots,
  types, main component + sub-components, i18n, stories, docs).
- `packages/nimbus/src/theme/slot-recipes/index.ts` — one registration line.
- `packages/nimbus/src/index.ts` — one export line.
- A minor changeset (new component; consumer-visible addition).

**Sequencing**

- Making Select and ComboBox render the new `ListBox` internally (replacing
  their two private `RaListBox` wrappers) is a **follow-up refactor**, not part
  of this change. Doing it here would turn an additive change into a
  behaviour-risking refactor of two shipping components and expand the review
  surface well beyond the ticket. This change establishes the component and its
  contract first; the consolidation can then be a mechanical, separately
  reviewable step.

**No impact**

- No change to Select, ComboBox, Menu, or Popover behaviour or output.
- No breaking changes.
