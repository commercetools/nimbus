## 1. Key rows and columns by id (commit 2)

- [x] 1.1 In `data-table.body.tsx`, render `<DataTableRow id={row.id}>`; for a custom body, add `id` with `cloneElement` only when the returned element has none
- [x] 1.2 In `data-table.header.tsx`, render `<DataTableColumn id={column.id}>`; leave `DataTableColumn` and internal columns unchanged
- [x] 1.3 Leave cells unkeyed
- [x] 1.4 Make `Base` assert the key `onSelectionChange` reports, not only checkbox state
- [x] 1.5 Add business-key stories: key/column-id collision, selection reports ids, custom body, column sorting reports ids, duplicate business keys survive sort, `disabledKeys` really disables, `data-key` equals ids
- [x] 1.6 Document `id` as the only identity in `data-table.dev.mdx`; add minor changeset with a consumer checklist

## 2. Explain drag-and-drop key mismatches (commit 3)

- [x] 2.1 In `state-handlers.ts`, keep the `createArrayHandlers` default; warn in development when `onReorder`, `onInsertItems` or `onRemoveItems` match no item, naming the `key`/`id` cause when the items carry both
- [x] 2.2 Add unit tests: default still prefers `key`; each operation warns with the fix; explicit `getKey` stays quiet; no false blame for single-field items
- [x] 2.3 Document passing `getKey` for `DataTable` in `use-drag-and-drop.mdx`

## 3. Resolve row identity in one place (commit 4)

- [x] 3.1 Add `utils/row-keys.utils.ts` with `defaultGetRowKey` (`row.id`, no `key` fallback)
- [x] 3.2 Publish a stable `getRowKey` on `DataTableContext`; migrate all 18 `row.id` sites, including `sortRows`
- [x] 3.3 Add `RowIdentityComesFromRowData`: identity set in the data drives selection, expansion and pinning

## 4. Development warnings (commit 5)

- [x] 4.1 Add pure `findRowKeyProblems` / `formatRowKeyProblems`; warn from `DataTable.Root` on duplicate or empty ids
- [x] 4.2 Warn from `DataTable.Row` when a custom body renders it with an `id` different from `getRowKey(row)`
- [x] 4.3 Stories `CustomRowIdOnElementWarns` (row still expands and pins), `DefaultRowIdDoesNotWarn`, `DuplicateRowKeysWarnInDevelopment`; record warnings with `spyOn` in `beforeEach` with a cleanup
- [x] 4.4 Unit tests in `row-keys.utils.spec.ts`
- [x] 4.5 Document identity-from-data and both warnings in `data-table.dev.mdx` and the changeset

## 5. Validation

- [x] 5.1 `pnpm test:dev packages/nimbus/src/components/data-table` — all pass
- [x] 5.2 Every business-key story fails against `origin/main`'s components
- [x] 5.3 `CustomRowIdOnElementWarns` fails when `DataTable.Row` reads its key from the element `id` ("Details for a1" never appears)
- [x] 5.4 `PerfRowMemoization` passes; fails against #1987's wrapper approach
- [x] 5.5 ComboBox, DraggableList and `use-drag-and-drop` suites unaffected
- [x] 5.6 `pnpm --filter @commercetools/nimbus typecheck:dev`, eslint and prettier clean on every commit
- [x] 5.7 `pnpm exec openspec validate fix-data-table-row-identity --type change --strict` passes
