## Context

CRAFT-1711 migrated DataTable styling from class-based selectors in the root
slot to proper Chakra slot recipes. Two intended behaviours from CRAFT-1691
(which had just merged) silently regressed during that migration:

1. Clickable rows lost their `cursor: pointer` — the new `row` slot recipe had
   a `&[data-clickable='true']` rule queued up, but no code path ever set
   `data-clickable` on the rendered row, so the rule never matched.
2. Text in cells became unselectable — the new `row` slot was authored with
   `userSelect: "none"`, contradicting the still-present class-based
   `userSelect: "text"` declaration in the root slot. The slot won, so users
   could no longer select/copy cell text.
3. Cells advertised `cursor: text` over content while `userSelect: "none"`
   prevented actual selection, sending a misleading affordance signal.

Alongside this regression, several adjacent UX issues were grouped into the
same fix: a dead `isRowClickable` prop in the types, a non-toggling pin
button using `IconButton` instead of `IconToggleButton`, focus rings firing
on mouse press instead of keyboard, and the column resizer divider being
invisible to keyboard users.

GitHub issue: commercetools/nimbus#1319. Shipped in commit `391cd7a70`
(PR #1326): "fix(data-table): restore clickable row cursor and text
selection".

## Approach

All fixes are local to the `data-table` component package; no consumer API
breaks (except removal of an unused prop).

- **Row cursor**: in `data-table.row.tsx`, set
  `data-clickable={!!onRowClick && !isDisabled}` on the `<RaRow>` element so
  the existing `&[data-clickable='true'] { cursor: pointer }` rule in the
  `row` slot of `data-table.recipe.ts` activates. The disabled rule
  (`&[data-disabled='true'] { cursor: not-allowed }`) takes precedence because
  the disabled state explicitly excludes the clickable attribute.
- **Text selection**: leave the row slot's child cells with the browser
  default (no `userSelect: "none"` override), aligning with CRAFT-1691's
  intent. The explicit `cursor="text"` on the cell content `<Box>` is
  removed; the browser supplies a natural I-beam over text and the row's
  `cursor: pointer` applies over the surrounding non-text area.
- **Dead prop removal**: drop `isRowClickable` from `DataTableContextValue`
  and `DataTableProps` in `data-table.types.ts`. `onRowClick` is the sole
  source of truth for clickability.
- **Pin toggle semantics**: in `data-table.row.tsx`, render pin control as
  `IconToggleButton` with `isSelected={isPinned}` and an `onChange` handler so
  assistive tech receives `aria-pressed`.
- **Keyboard-only focus**: in `data-table.recipe.ts`, swap `focusRing:
  "outside"` for `focusVisibleRing: "inside"` on the row, cell, and column
  header slots (lines ~240/249/297/328). Chakra's `focusVisibleRing` resolves
  to `:focus-visible` styling.
- **Resizer discoverability**: add a `& th:has([data-focused='true'])
  .data-table-column-divider` rule (line ~226) so the divider becomes visible
  whenever React Aria sets `data-focused` on the resizer inside a header
  cell.

## Alternatives Considered

- Reverting the CRAFT-1711 slot migration to restore class-based selectors —
  rejected because the slot recipe is the canonical Chakra v3 pattern and
  reverting would undo the architectural improvement.
- Keeping `isRowClickable` as an explicit boolean override of `onRowClick` —
  rejected; two prop sources for one behaviour invites drift and existing
  consumers never wired it up.

## Risks / Trade-offs

- Removing `isRowClickable` is technically a public type change. Acceptable
  because the prop was never consumed by the component and shipping with a
  dead prop is itself a bug.
- Switching to `:focus-visible` means users navigating with assistive
  pointing devices that don't trigger `:focus-visible` heuristics won't see
  focus rings on click — this matches modern UX conventions and the
  accessibility guideline that focus rings should be keyboard-only.
- Letting the browser pick the cursor over text means slight per-browser
  variation in the I-beam shape; preferable to a misleading static cursor.
