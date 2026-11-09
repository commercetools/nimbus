## Why

`DataTable` drag and drop is on for all rows or for none. React Aria has no
per-row drag option. Its only per-row switch is `disabledKeys`, and Nimbus sets
`disabledBehavior="all"` (`data-table.table.tsx`). A table with one draggable
row among fixed rows (the ranking prototype, FEC-1442) must put every other row
in `disabledKeys`. Arrow keys then skip those rows, so a keyboard user can reach
only one row, and the drag handles of the fixed rows must be hidden with CSS.

Jira: FEC-1482.

## What Changes

- Add prop `draggableKeys?: Set<string>` to `DataTable` and `DataTable.Root`.
  - `undefined`: all rows are draggable (no change for existing tables).
  - A set: only the rows in the set are draggable. An empty set means no row is
    draggable.
- Add field `isDragDisabled: boolean` to `DataTableRowRenderProps`, next to
  `isPinned`.
- `DataTable.Table` wraps `dragAndDropHooks.useDraggableItem` and returns React
  Aria's own "disabled" result for rows that are not in the set.
- A row that is not draggable renders a disabled drag button labelled "Row
  cannot be reordered". The button is visually hidden (React Aria needs it in the
  DOM), the column stays aligned, and the button starts no drag.
- A row that is not draggable stays focusable, keeps `onRowAction`, and still
  accepts drops before and after it (pointer and keyboard).
- A drop lands between two rows. Whether the adjacent row is disabled or not
  draggable does not change whether the drop is accepted.
- A disabled row (`disabledKeys`, `isDisabled`) is never draggable.
  `disabledBehavior="all"` does not change.
- Changing `draggableKeys` re-renders only the rows whose flag changed.
- Documentation states:
  - Selection together with `draggableKeys` is not supported.
  - Expandable rows together with `draggableKeys` are not supported.
  - `onReorder` reports positions in the displayed order. This matters when
    column sorting is on.
  - Consumers can reject specific drop positions with `getDropOperation` from
    `useDragAndDrop`.
- Add stories with play functions, update `data-table.dev.mdx`, the a11y docs,
  the designer docs, and `data-table.docs.spec.tsx`. Add a minor changeset.

No breaking change: the new prop is optional and the default keeps today's
behavior.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `nimbus-data-table`: adds a requirement for per-row drag control through
  `draggableKeys` and `isDragDisabled`.

## Impact

- `packages/nimbus/src/components/data-table/data-table.types.ts`: new prop,
  new render-prop field.
- `packages/nimbus/src/components/data-table/data-table.tsx`,
  `components/data-table.root.tsx`, `components/data-table.context.tsx`: pass
  `draggableKeys` to the table and body.
- `components/data-table.table.tsx`, `components/data-table.body.tsx`,
  `components/data-table.row.tsx`: per-row drag logic and the disabled drag
  button.
- `data-table.i18n.ts` and `packages/i18n/data/*.json`: the `dragRowDisabled`
  message.
- Stories, `data-table.dev.mdx`, `data-table.a11y.mdx`, `data-table.mdx`,
  `data-table.docs.spec.tsx`, one changeset in `.changeset/`.

## Out of Scope

- Selection and expandable rows combined with `draggableKeys`: documented as
  unsupported, no code rule.
- Column sort and drag rules: documentation note only.
- Keeping the dragged row visible and scrolling to it: FEC-1483 and FEC-1484.
