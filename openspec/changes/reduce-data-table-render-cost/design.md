## Context

This change builds on `fix-data-table-behaviour-gaps` (FEC-1346, #2015), which
already removed the always-present nested row (ticket section 2: the nested row
exists only while its row is expanded, and the `display: none` rule is gone)
and the commented-out `layerStyle` lines.

`DataTable.Root` provides four contexts: `DataTableContext` (configuration),
`InteractionContext` (sorted and filtered rows, sort descriptor, expanded and
pinned rows), `TableSelectionContext` and `CustomSettingsContext`.
`useDataTableContext()` merges the first three.

Versions checked: `react-aria-components@1.21.1`, `react-aria@3.52.1`.

## Goals / Non-Goals

**Goals:**

- A row interaction renders the rows it changes, not the header, the column
  headers, `DataTable.Manager` or the other rows.
- A new `rows`, `columns` or `visibleColumns` array that holds the same items
  renders no row.
- No public API change and no visual change.
- Each render claim is measured, and guarded by a story that fails on the
  previous code.

**Non-Goals:**

- Virtualisation (FEC-1145).
- Debouncing `search`. It changes when results appear, which is behaviour, not
  render cost. The consumer owns the search field and can debounce it or pass a
  value from `useDeferredValue`; the docs say so.
- Keeping `nestedKey` row objects stable while a sort is active. `nestedKey`
  is deprecated (FEC-1346); D5 covers the cases without a reordering.

## Decisions

### D1 — Components read only the context they need

Header, `DataTable.Manager`, the layout settings panel and `DataTable.Column`
read `useStableDataTableContext()`. `DataTable.Table` reads the configuration
and the interaction context separately. `DataTable.Body` already read the
interaction context; it now reads the configuration without the merge.
`useStableDataTableContext()` returns a type without the interaction and
selection fields, so reading one of them from it is a type error, not
`undefined` at runtime.

`DataTable.Column` does not subscribe to the interaction context for the sort
icon. React Aria passes `sortDirection` to the column's render function, set
only for the sorted column, and derives it from the same comparison it uses for
`aria-sort` (`state.sortDescriptor?.column === column.key`,
`react-aria-components` `Table.mjs`). So the icon and `aria-sort` cannot
disagree.

`useDataTableContext()` stays, unchanged, for consumers
(`DataTable.useDataTableContext`). No DataTable component calls it.

### D2 — A row context without `columns` and `rows`

`DataTable.Row` reads `DataTableRowContext`, which holds only what a row
renders from: `activeColumns`, `search`, the callbacks and flags. `columns` and
`rows` are not in it. A row gets its own data from the `row` prop, so a change
to one row object renders only that row.

**Alternative rejected:** keep one context and drop `columns` and `rows` from
it. `DataTable.Manager` needs `columns`, and `DataTable.Table` needs `rows` for
`disabledKeys="all"`.

### D3 — Arrays keep their identity while their items are the same

`useStableArray` returns the previous array when the new one holds the same
items in the same order (`Object.is`). Root applies it to `rows`, `columns`,
`visibleColumns` and the computed `pinnedRowIds`. The returned array always has
the items of the current input, so a stale ref can only choose an identity,
never content.

Changing a row object in place and passing a new array does not update the
cell. This was already the case before the change: React Aria caches each row's
cells by the row object (`useCachedChildren`). Verified in Chromium with a
story that mutates a row and passes `[...data]`, on the old and the new code.

### D4 — Pinned position flags only for pinned rows

`isFirstPinned`, `isLastPinned` and `isSinglePinned` are `false` for rows that
are not pinned. Before, `pinnedIdx` was `-1` for them and
`-1 === pinnedRowIds.length - 1` held while nothing was pinned, so pinning the
first row changed a prop on every row. Positions come from a `Map` built once
per change.

`pinnedRowIds` comes from `sortedRows` (the rows on screen) instead of `rows`.
A pinned row that the search hides is no longer counted as first or last.

### D5 — `nestedKey` rows keep their object when nothing changed

`sortRows` copied every row with `nestedKey` content on every sort, pin or
search, and `filterRows` copied matching rows even when their nested content
was unchanged. Both now return the row itself when its nested rows keep the
same items in the same order.

### D6 — Recipe: one header definition, a named z-index scale

The header styles existed twice: a `& .data-table-header` block in the `root`
slot and the `header` slot. Both target the same `<thead>`. FEC-1346 had set
both z-index values to 14, so the only difference was that the root copy set
`zIndex` on a non-sticky `<thead>` too, where it has no effect. The root copy
is removed; the `header` slot keeps `zIndex.header` inside `[data-sticky]`.

All z-index values are named in one `zIndex` object at the top of the recipe,
lowest first, with the reason for each level.

**Pinned rows keep their lower level.** The `& .data-table-row-pinned` block
repeated the four offset rules of `& .data-table-row` (pinned rows have both
classes), so those copies are removed. It also set `zIndex: 3` on every frozen
cell of a pinned row, while other rows use 11 and 12. That rule dates from
#411, when the pinned outline was drawn on the row itself; FEC-1346 moved the
outline to a layer above all frozen cells. Measured today, the only visible
effect is that in a pinned row the expand cell covers the selection cell's
scroll shadow. The level is kept, so nothing changes visually, and it is now
one explicit rule that does not depend on CSS order. Aligning pinned rows with
the others is a follow-up with an intended visual change.

**Evidence.** Computed styles of every element and its `::before`/`::after`
were recorded in six table setups (drag, selection, expand and pin columns in
different combinations, pinned, disabled, expanded and custom-background rows)
at rest, scrolled, with a hovered header and with a hovered row, before and
after the recipe change. The only difference: the pin cell of a pinned row no
longer has `left: 0` (it keeps `right: 0`). As the last column it can never
reach the left edge, and screenshots of three setups at scroll start, middle
and end are byte-identical before and after.

Other recipe decisions:

- `+` becomes `~` in the header offset selectors, as in the body. Offsets are
  unchanged (same computed `left` values).
- `300ms` → `{durations.slow}`, `100ms` → `{durations.faster}`, `6px` →
  `spacing.150`, `16px` → `sizes.400`, `fontWeight: 600` → `"600"`. The easing
  curve `cubic-bezier(0.4, 0, 0.2, 1)` and the truncation `maxWidth: 200px`
  stay: no token has these values.
- `--pinned-shadow-*` → `--data-table-pinned-shadow-*`, `--dt-row-bg` →
  `--data-table-row-bg` (`recipes.md`: custom properties are namespaced with
  the component name).
- `selectionCell` and `nestedIcon` slots removed; they had no usage.
- `density.default` is empty (the base cell padding is the default), and
  `defaultVariants` is set.
- **Declined:** removing one of the two `truncated` checks (the row adds
  `.truncated-cell` only when truncated, and the `truncated` variant gates the
  rule again). Removing the variant changes the exported
  `DataTableRootSlotProps`; removing the class check puts a
  `truncated-cell` class on cells that are not truncated. The double check has
  no runtime cost.

### D7 — `@supportsStyleProps` on the exported `memo` component

The ticket asked for the component JSDoc directly above `DataTableRowInner`.
`react-docgen-typescript` reads the exported `DataTableRow = memo(...)`
statement instead: with the block above `DataTableRowInner`, the parsed
`DataTable.Row` still had no description and no tags. With the block on the
export, it has both. The two `@param e` blocks on `clickTimeoutRef` and
`hasNestedContent` are merged into the `handleRowClick` doc, together with the
React Aria rationale (react-spectrum#7962).

### D8 — Stories split by topic with the same title

`data-table.stories.tsx` (8,762 lines) is split into nine files named
`data-table.{topic}.stories.tsx`. All use the title `Components/DataTable`, so
the sidebar entry and every story id (title + export name) stay the same, and
Chromatic compares each story with its existing baseline. Storybook merges the
docs entries of CSF files with the same title. Helpers used by several files
moved to `utils/data-table.test-utils.ts`,
`utils/data-table.test-component.tsx` and `data-table.test-data.tsx`, following
`docs/component-guidelines.md`.

**Alternative rejected:** a title per topic (`Components/DataTable/Pinning`).
It changes every story id, so Chromatic would see 92 new stories without
baselines.

## Risks / Trade-offs

- **Stable arrays hide in-place mutation.** Already the case before (D3).
  The docs now say to replace a changed row with a new object.
- **An inline `renderNestedContent` renders every row again.** It is in the
  row context, and unlike the event callbacks it is not read through a ref: a
  ref would keep showing the old nested content when the function changes,
  because the rows would not render again. The docs say to create it once.
  Measured with a temporary story: a new function on every parent render
  renders 5 of 5 rows again; a new `expandedRows` Set with the same keys
  renders none, because rows receive `isExpanded` as a boolean prop.
- **Renamed CSS custom properties.** A consumer that overrides
  `--dt-row-bg` or `--pinned-shadow-*` must rename it. They were not
  documented. The changeset names both.
- **Same title in several story files** is new in this repo. It is documented
  in `docs/file-type-guidelines/stories.md`.

## Follow-ups

- Pinned rows: use the same frozen-cell levels as other rows, so the selection
  cell's scroll shadow shows in pinned rows too (visual change, D6).
