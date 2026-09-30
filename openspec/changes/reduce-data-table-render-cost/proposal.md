## Why

The second half of the DataTable audit (FEC-1347). Row interactions rendered
far more than the row they changed. Measured on a 30-row, 5-column table with
render counters in each component:

| Action                                                                           | Before                                                          | After                                   |
| -------------------------------------------------------------------------------- | --------------------------------------------------------------- | --------------------------------------- |
| Expand one row                                                                   | Manager 1, Table 1, Header 1, column headers 8, Body 1, rows 1  | Table 1, Body 1, rows 1                 |
| Pin one row                                                                      | Manager 1, Table 1, Header 1, column headers 8, Body 1, rows 30 | Table 1, Body 1, rows 1                 |
| Sort by a column                                                                 | Manager 1, Table 1, Header 1, column headers 8, Body 1          | Table 1, Body 1                         |
| Parent renders with new `rows`, `columns` and `visibleColumns` arrays, same items | Table 1, Header 1, column headers 6, Body 1, rows 30            | Table 1, Header 1, column headers 1, Body 1, rows 0 |

The table has a selection, an expand and a pin column (8 column headers).
"Column headers" counts `DataTable.Column` renders. After the change, sorting
still updates each header's sort icon: React Aria calls the header's render
function with the new `sortDirection`, without rendering `DataTable.Column`.

Three causes:

- Header, column headers, `DataTable.Manager` and the layout panel read
  `useDataTableContext()`, which merges the configuration with the interaction
  state. Any expand, pin or sort re-rendered them.
- `DataTable.Body` told every row that is not pinned `isLastPinned: true`
  while no row was pinned (`-1 === pinnedRowIds.length - 1`). Pinning the first
  row flipped that prop on every row, so `memo` missed on all of them.
- The row context held `columns` and `rows`. A new array with the same items
  created a new context value, which re-renders every row whatever `memo` says.

A correctness bug sat next to it: `pinnedRowIds` came from the unfiltered
`rows`. With rows 1 and 2 pinned and a search that hides row 1, row 2 was
treated as the last of two pinned rows and lost the top edge of its outline.
Confirmed in Chromium (`PinnedRowOutlineFollowsSearch`).

The recipe had duplicated rules, an undocumented z-index ladder, hardcoded
durations and sizes, un-namespaced CSS custom properties and two dead slots.
`stories.tsx` had grown to 8,762 lines.

## What Changes

- DataTable's own components read only the context they need. A new
  row-only context leaves out `columns` and `rows`.
- `rows`, `columns` and `visibleColumns` keep their previous array while its
  items are the same (`useStableArray`). So does `pinnedRowIds`.
- `isFirstPinned`, `isLastPinned` and `isSinglePinned` are `false` for rows
  that are not pinned.
- Pinned positions come from the rows on screen, and are looked up in a `Map`
  instead of an `indexOf` per pinned row.
- The column header takes its sort state from React Aria's render props.
- `sortRows` and `filterRows` keep a `nestedKey` row object when its nested
  rows did not change.
- Recipe: one header definition, a named z-index scale, duration and size
  tokens, `--data-table-*` custom properties, dead slots and duplicate rules
  removed, `defaultVariants` added.
- `@supportsStyleProps` reaches the docs for `DataTable.Row`; misplaced JSDoc
  in `row.tsx` reattached.
- Stories split into nine topic files with the same title, so story ids and
  Chromatic baselines stay.
- `constants.tsx` and `utils/rows.utils.tsx` renamed to `.ts`; the header slot
  is typed as `thead`.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `nimbus-data-table`: adds "Render Isolation" (what a row interaction and a
  new array may re-render) and "Pinned Row Outline" (the outline follows the
  rows on screen).

## Impact

- **Code**: `components/data-table.{context,root,body,row,header,column,table,manager.lazy,layout-settings-panel}.tsx`,
  new `hooks/use-stable-array.ts`, `utils/rows.utils.ts`,
  `data-table.recipe.ts`, `data-table.slots.tsx`, `data-table.types.ts`,
  `data-table.tsx`.
- **Tests**: `RowInteractionsRenderOnlyThatRow`,
  `InlineArraysKeepRowsMemoized`, `PinnedRowOutlineFollowsSearch`;
  `use-stable-array.spec.ts`, `rows.utils.spec.ts`. Each new story fails on the
  previous code.
- **Docs**: "When rows render again" in `data-table.dev.mdx`; "Splitting a
  large stories file" in `docs/file-type-guidelines/stories.md` and the
  `writing-stories` skill.
- **Public API**: unchanged, except `DataTableHeaderSlotProps`, which is now
  `HTMLChakraProps<"thead">` (the element it always rendered).
- **Visual**: none intended. Computed styles and screenshots were compared
  before and after the recipe change; see design.md, D6.
