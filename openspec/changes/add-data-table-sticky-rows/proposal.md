## Why

Design requires that chosen rows stay visible when the user scrolls them out of
view. `DataTable` has nothing for this: pinning moves a row to the top of the
order, but it does not keep a row on screen. The ranking prototype (FEC-1442)
used `position: sticky` on the row's cells and turned it off, with the note
"Works in Chrome; behaves differently in Safari / Firefox / Windows."

Jira: FEC-1484. This is change 3 of 3, after per-row drag (FEC-1482, PR #2160)
and scroll to row (FEC-1483, PR #2169). PR #2169 prepares for this change: its
offset calculation takes a `topInset` and a `bottomInset`, so the sticky stacks
can be added in one place.

## What Changes

- Add prop `stickyRows?: Set<string>` to `DataTable` and `DataTable.Root`. It
  holds row ids. A row in the set stays visible at the top or bottom edge of the
  scroll area when it is scrolled out of view.
- Add field `isSticky: boolean` to `DataTableRowRenderProps`.
- The row element (`tr`) gets `position: sticky`. Several sticky rows stack at
  the top edge, below the header, and at the bottom edge, in row order. The
  offsets are measured with a `ResizeObserver` and written as internal CSS
  variables.
- Stacking order: a stuck row uses z-index 14, and the header moves from 14
  to 15.
- A sticky row has a built-in highlight: a slight background change, one step up
  in the color scale (`neutral.2`). Frozen cells mirror it.
- The root gets `scroll-padding-top` and `scroll-padding-bottom` from the
  measured stack heights, so arrow-key focus never ends behind a stack.
- `apiRef.scrollToRow` adds the stack heights to its insets. A sticky row that
  is stuck is already in place: the Promise resolves `true` and the table does
  not scroll.
- Sticky rows need `maxHeight`, as the sticky header does. In development, a
  warning appears when `stickyRows` is set without `maxHeight`, and when a stack
  is taller than half of the visible height.
- Add stories with play functions, Chromatic snapshots (stuck at the top, stuck
  at the bottom), a hand-written section in `data-table.dev.mdx`, a docs test,
  and a minor changeset.

No breaking change: the new prop and the new field are optional or additive. The
only visible change for existing tables is the header z-index (14 to 15).

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `nimbus-data-table`: adds requirements for sticky rows, including how
  `scrollToRow` treats the sticky stacks. The `scrollToRow` requirement is
  written as an addition, because the main spec gets the `scrollToRow`
  requirements only when #2169 is archived.

## Impact

- `packages/nimbus/src/components/data-table/data-table.types.ts`: new prop, new
  render prop field.
- `data-table.recipe.ts`: sticky row styles, the highlight, the header z-index,
  `scroll-padding` on the root.
- `components/data-table.root.tsx`, `components/data-table.row.tsx`,
  `components/data-table.body.tsx`: pass `isSticky`, measure the stacks, write
  the CSS variables.
- `hooks/use-data-table-api.ts` (`getScrollInsets`): add the stack heights.
- New hook for stack measurement, with a unit test.
- Stories, `data-table.dev.mdx`, `data-table.docs.spec.tsx`, one changeset in
  `.changeset/`.

## Out of Scope

- Virtualized tables. PR #2062 is closed; virtualization needs its own change
  when it returns, and sticky rows that are not in the DOM are not specified
  here.
- A separate "stuck" look. The ticket planned one with `scroll-state()`
  container queries, which only Chromium supports. This change ships one
  highlight for every sticky row, stuck or not.
- Changing the drop behavior over the stack. Pointer drops follow React Aria's
  default, and the docs say so.
