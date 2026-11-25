## Context

`DataTable` forwards `dragAndDropHooks` to React Aria's `Table`
(`components/data-table.table.tsx`). Drag is all rows or none. The only per-row
switch in React Aria is `disabledKeys`, and Nimbus uses `disabledBehavior="all"`,
so a disabled row is also skipped by keyboard navigation and cannot be clicked.
A drop lands between two rows, so a disabled row next to a drop position does
not stop the drop. The ranking prototype (FEC-1442) needs one draggable row
among fixed rows that stay reachable and do not block drops.

Existing structure this change builds on:

- `DataTable.Body` builds `DataTableRowRenderProps` per row (`isExpanded`,
  `isPinned`, ...) and lists the values that re-render rows in the
  `dependencies` array of `RaTableBody`.
- `DataTable.Row` renders the drag cell when `useTableOptions().allowsDragging`
  is true (`components/data-table.row.tsx`).
- `DataTable.Table` receives `disabledKeys` from context and passes
  `dragAndDropHooks` through.

## Goals / Non-Goals

**Goals:**

- A consumer marks which rows can be dragged, with one optional prop.
- Rows that cannot be dragged keep keyboard focus, `onRowAction`, and drop
  behavior.
- A drop between two rows works whatever the state of the rows on either side.
- No change for existing tables (`draggableKeys` is `undefined`).
- Changing `draggableKeys` re-renders only rows whose flag changed.

**Non-Goals:**

- Code rules for selection or expandable rows combined with `draggableKeys`
  (documented as unsupported).
- Column sort and drag rules (documentation note only).
- Keeping the dragged row visible or scrolling to it (FEC-1483, FEC-1484).

## Decisions

### 1. A `draggableKeys` allow-list, not a per-row flag or `disabledKeys`

`draggableKeys?: Set<string>` where `undefined` means all rows. An allow-list
matches the ticket and the use case (few draggable rows among many fixed rows).
Rejected: reusing `disabledKeys` (breaks keyboard navigation and drops, the
original problem); a per-row `isDraggable` on row data (rows are domain objects
that Nimbus does not extend).

### 2. Wrap `dragAndDropHooks.useDraggableItem` in `DataTable.Table`

`DataTable.Table` replaces `dragAndDropHooks` with a copy whose
`useDraggableItem` checks the key against `draggableKeys`. For a key that is not
in the set it returns React Aria's own "disabled" result instead of drag props.
The row stays a collection item, so focus, row actions and drop target logic
are untouched. A row in `disabledKeys` stays disabled by React Aria and is never
draggable, regardless of `draggableKeys`.

Rejected: changing `disabledBehavior` (changes behavior for all tables); hiding
handles with CSS (a keyboard user could still start a drag).

### 3. `isDragDisabled` computed in `DataTable.Body`

`Body` sets `isDragDisabled = draggableKeys !== undefined &&
!draggableKeys.has(rowKey)` in `DataTableRowRenderProps`, read through a ref like
`pinnedRows` and `expanded`. `draggableKeys` joins the `RaTableBody`
`dependencies` array. Because the value passed to each row is a boolean, `memo`
on `DataTable.Row` skips every row whose flag did not change.

Open point: the `dependencies` array re-evaluates the row render function for
all rows when the set identity changes. Row `memo` then limits the actual
re-render to rows with a changed boolean. Verify this with a render-count story,
as in the `reduce-data-table-render-cost` change.

### 4. Disabled drag button for rows that are not draggable

`DataTable.Row` renders the drag `IconButton` (`slot="drag"`) in every row when
`allowsDragging` is true. When `isDragDisabled` is true, the button is disabled,
its label is "Row cannot be reordered" (`dragRowDisabled` message), and it is
wrapped in `VisuallyHidden`. React Aria needs the button in the DOM, but sighted
users see no handle on a row that cannot be dragged. Screen readers still find
the labelled control. The cell keeps its sticky class, so column width and
alignment do not change.

### 5. Selection and expandable rows are documented, not enforced

Per the ticket, no runtime rule. The docs state both combinations are
unsupported.

## Risks / Trade-offs

- [React Aria internal behavior of `useDraggableItem` for a "disabled" result may
  differ by version] → Verified in `react-aria` 3.53.1: the disabled result is
  `dragProps: {}` and `dragButtonProps` with `isDisabled: true`. The wrapper
  returns exactly that. Story play functions cover focus, `onRowAction` and
  drops on a non-draggable row.
- [React Aria logs a development warning, "Draggable items in a Table must
  contain a <Button slot=\"drag\">", once per row that renders no drag button]
  → Not applicable: every row renders a `slot="drag"` button (Decision 4).
  React Aria logs this warning only when a dragged row has no `slot="drag"`
  button. Development only (`NODE_ENV !== 'production'`).
- [Consumers pass a new `Set` on every render] → All rows are re-evaluated but
  only changed rows re-render; document that a stable `Set` (`useMemo`) is
  preferred.
- [`onReorder` order differs from data order when sorting is on] → Documented
  note only.

## Open Questions

None. Rows outside `draggableKeys` render a disabled button (Decision 4), so
every row has a drag button and React Aria does not log its development warning.
