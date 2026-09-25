## Context

See `proposal.md` — Why. The constraint every decision below follows from is
React Aria's key resolution, verbatim from `useCachedChildren.mjs`:

```js
let id = rendered.props.id ?? item?.key ?? item?.id;
```

The first term wins, so a component that wants to control identity must put an
`id` on the rendered element. There is no key-extractor prop in
`react-aria-components`; `getKey` exists only on `react-stately` data hooks
(`useListData`, `useTreeData`, `useAsyncList`), where it locates items in a data
store, not nodes in a collection.

`DataTable` renders three collections: rows (`DataTable.Body`), columns
(`DataTable.Header`) and cells (`DataTable.Row`). Before this change, identity
was also decided in four unconnected places: React Aria's collection key,
literal `row.id` at 18 sites in Nimbus, DOM ids built from `row.id`, and the
consumer's key sets (`expandedRows`, `pinnedRows`, `disabledKeys`).

## Goals / Non-Goals

**Goals:**

- One identity per row and per column, used by every feature
- React Aria's per-item render cache keeps working
- Failures that cannot be prevented are named in development, not left to
  surface as unrelated React Aria errors

**Non-Goals:**

- A `getKey` prop on `DataTable`
- Changing the `createArrayHandlers` default
- Fixing `getKey` on `ComboBox` / `DraggableList` (FEC-1357)

## Decisions

**Set the `id` where the element is created, not inside the leaf component.**
`DataTable.Body` renders `<DataTableRow id={row.id}>` and, for a custom body,
adds the `id` with `cloneElement` only when the returned element has none.
`DataTable.Header` renders `<DataTableColumn id={column.id}>`.

Two alternatives were built and rejected:

- _Wrap each row as `{ id, row }` before passing it to `RaTableBody`_ (#1987).
  It re-keys correctly, but `useCachedChildren` caches rendered children in a
  `WeakMap` keyed by the item object. Fresh wrappers miss that cache, and
  because `CollectionBuilder` passes `addIdAndValue: true`, the wrapper also
  became each row's `value`, invalidating the cell cache too.
  `PerfRowMemoization` fails on it: `expected "1" to be "2"`.
- _Write `id={row.id}` after the prop spread inside `DataTable.Row` /
  `DataTable.Column`._ It fixes the node key but not React Aria's derived key,
  which is also the React `key`: two rows sharing a business key produced
  `Encountered two children with the same key, 'dup'` on reorder. It also
  overrode any `id` a consumer set on purpose.

**Cells get no `id`.** React Aria matches cells to columns itself. Forcing an
`id` on cells broke that mapping and failed 53 of 54 stories.

**Column `id` is set unconditionally in the header, not in `DataTableColumn`.**
Internal columns (drag handle, selection, expand, pin) render `DataTableColumn`
without a `column`; clobbering their generated id with `undefined` collapsed
every column into one node (`Found 7 cells and 1 columns`).

**Row identity is resolved in one place and read from the row data.**
`utils/row-keys.utils.ts` defines `defaultGetRowKey` (`row.id`, deliberately no
`row.key` fallback). `DataTable.Root` publishes it as a stable `getRowKey` on
the existing context, and all 18 former `row.id` sites use it, including
`sortRows`, which takes it as an argument.

The row data is the only place identity can live. `DataTable.Body` computes
`isExpanded` / `isPinned` and passes them _into_ the custom renderer, and
`sortRows` partitions pinned rows before any element exists. An `id` returned
_by_ the renderer comes too late for either. An intermediate revision read the
key back from the rendered element's `id`; with a custom id, expansion and
pinning then toggled under a name the body never checked, and the row neither
expanded nor pinned.

**A custom element `id` is unsupported and warns, instead of being honoured.**
Three options were considered:

| Option                                           | Effect                                                                |
| ------------------------------------------------ | --------------------------------------------------------------------- |
| Honour it for selection only, document the split | One row, two names                                                    |
| **Unsupported; warn in development**             | One identity; set it in the data                                      |
| Add a `getKey` prop                              | The only way a custom identity works everywhere without changing data |

The warning was chosen. Consumers can still choose any identifier —
`rows.map((v) => ({ ...v, id: v.sku }))` — and every feature follows it.

**No `getKey` prop.** It was built and then removed before merge. The survey
found zero uses of `getKey` on any Nimbus component, and every dynamic
collection item in consumer code already sets `id=` by hand, which is what
React Aria documents. The `getKey` built also did not unlock rows without an
`id`, because `DataTableRowItem` still requires one. Both sibling
implementations (`ComboBox`, `DraggableList`) ignore `getKey` in common cases
(FEC-1357). Adding a second way to express identity, in the place two earlier
attempts got it wrong, had no demand behind it. It can be added later without
breaking anything.

**Keep the `createArrayHandlers` default; make a mismatch loud.** The default
`(item) => item.key ?? item.id` is correct for collections genuinely keyed by
`key`. Flipping it would silently break those, with nothing to warn about.
Keeping it and warning moves the failure to the group we can detect: when an
operation matches no item and the items carry both fields, the warning says the
collection is keyed by `id` and shows `createArrayHandlers(setItems, (item) =>
item.id)`.

**Minor, not patch or major.** Patch excludes new behavior
(`docs/changeset-conventions.md:78`) and the conventions say to prefer minor
when in doubt (`:85-86`). The repository has shipped comparable changes as
minor; its only major is the 3.0.0 `Card` rework.

## Risks / Trade-offs

- **Stored selection or disabled keys built from business keys stop matching**
  → Listed in the changeset. The survey found no consumer using either.
- **Rows sharing an `id` but differing in `key` now collide** → They violate
  the documented contract; the new development warning names them.
- **`idScope` on `DataTable.Body` no longer scopes row keys**, because
  React Aria applies it only when `rendered.props.id == null` → Not part of the
  typed API (`TS2322` today), so only untyped callers could reach it.
- **Survey limits** → 13 repositories found by GitHub code search, default
  branches only. The changeset carries full migration steps for anyone else.
