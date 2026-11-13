## Why

`DataTable` has no way to scroll to a row. The ranking prototype (FEC-1442)
finds the row through React Aria's `data-key` attribute, which Nimbus does not
document, and tries again for up to 60 animation frames. That approach cannot
reach a row that is not in the DOM, which is the normal case once the table is
virtualized (Nimbus PR #2062).

Jira: FEC-1483. This is change 2 of 3 after per-row drag (FEC-1482) and before
sticky rows (FEC-1484).

## What Changes

- Add prop `apiRef?: Ref<DataTableApi>` to `DataTable` and `DataTable.Root`. The
  existing `ref` stays the root element.
- `DataTableApi` has two methods:
  - `scrollToRow(key, { align, behavior, focus }): Promise<boolean>`
  - `getScrollContainer(): HTMLDivElement | null` (returns the root element)
- `align` is `"start"`, `"center"`, `"end"` or `"nearest"`. The default is
  `"nearest"`: a row that is fully visible does not scroll. The header never
  covers the row. The first and last rows stop at the edges.
- `behavior` defaults to `"auto"` (instant). `"smooth"` becomes instant when the
  user prefers reduced motion.
- The Promise resolves `true` when the row is at its final position.
- The Promise resolves `false` for a key that is not a shown row: unknown,
  hidden by `search`, or a nested child row. It also resolves `false`, with a
  development warning, when `DataTable.Root` is mounted without
  `DataTable.Table`.
- The Promise rejects with a `DOMException` named `"AbortError"` when a newer
  call replaces it, and when the table unmounts.
- `scrollToRow` always sets React Aria's focused key. It moves DOM focus only
  with `focus: true`. For a disabled row it scrolls and resolves `true`, but
  does not change focus, and warns in development if `focus: true` was passed.
- Add stories with play functions, a hand-written section in
  `data-table.dev.mdx` with a `catch` example that ignores `AbortError`, a docs
  test, and a minor changeset.

No breaking change: the new prop is optional.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `nimbus-data-table`: adds a requirement for scrolling to a row through
  `apiRef`.

## Impact

- `packages/nimbus/src/components/data-table/data-table.types.ts`: new prop, new
  types `DataTableApi` and `DataTableScrollToRowOptions`, internal registry
  field in the context type.
- `components/data-table.root.tsx`: creates the handle and the registry.
- `components/data-table.row.tsx`, `components/data-table.header.tsx`,
  `components/data-table.cell.tsx`: register the row element, the header element
  and React Aria's table state.
- New `utils/scroll-to-row.utils.ts` and `hooks/use-data-table-api.ts`, each
  with a unit test.
- Stories, `data-table.dev.mdx`, `data-table.docs.spec.tsx`, one changeset in
  `.changeset/`.

## Out of Scope

- Sticky rows and subtracting sticky stacks from the scroll offset: FEC-1484.
  The offset calculation is kept in one small function with `topInset` and
  `bottomInset` so FEC-1484 can add the stacks.
- Virtualized tables: PR #2062 defines how long the Promise waits while rows are
  measured.
