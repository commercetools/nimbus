## 1. Types and Prop Plumbing

- [x] 1.1 Add `draggableKeys?: Set<string>` with JSDoc to the `DataTable` and `DataTable.Root` props in `data-table.types.ts`
- [x] 1.2 Add `isDragDisabled: boolean` with JSDoc to `DataTableRowRenderProps`
- [x] 1.3 Pass `draggableKeys` from `DataTable` and `DataTable.Root` into the stable context (added to `DataTableContextValue` and `contextValue` in `data-table.root.tsx`; `data-table.context.tsx` needed no edit)

## 2. Tests First (Stories with Play Functions)

- [x] 2.1 Add a drag story file section: one draggable row among fixed rows; ArrowUp/ArrowDown reach every row
- [x] 2.2 Play function: click and Enter on a non-draggable row call `onRowAction` once
- [x] 2.3 Play function: no drag starts from a non-draggable row (keyboard covered; pointer drag not covered)
- [x] 2.4 Play function: a keyboard drop after a non-draggable row works; `onReorder` never receives a key outside `draggableKeys` (pointer drops and drops before a fixed row not covered)
- [x] 2.5 Play function: empty set renders no drag button; `undefined` keeps every row draggable
- [x] 2.6 Play function: a row in `disabledKeys` is never draggable (`isDisabled` row data not covered) even when listed in `draggableKeys`
- [x] 2.7 Render-count story: changing `draggableKeys` re-renders only rows whose flag changed
- [ ] 2.8 Run the new stories and confirm they fail before implementation (skipped: code was written before the stories; stories now pass)

## 3. Implementation

- [x] 3.1 In `data-table.table.tsx`, wrap `dragAndDropHooks.useDraggableItem` and return React Aria's "disabled" result for keys not in `draggableKeys` (confirm the expected shape against the installed `react-aria-components`)
- [x] 3.2 In `data-table.body.tsx`, compute `isDragDisabled` per row from a ref and add `draggableKeys` to the `RaTableBody` `dependencies`
- [x] 3.3 In `data-table.row.tsx`, accept `isDragDisabled` and render an empty drag cell (sticky class kept, no `IconButton`)
- [x] 3.4 Confirm `disabledBehavior="all"` and disabled-row behavior are unchanged
- [x] 3.5 Run the stories from section 2 and make them pass

## 4. Documentation

- [x] 4.1 Update `data-table.dev.mdx`: `draggableKeys` usage, `isDragDisabled`, `getDropOperation`, stable `Set` advice
- [x] 4.2 Document the limits: selection and expandable rows are not supported with `draggableKeys`; `onReorder` reports displayed order when sorting is on
- [x] 4.3 Update `data-table.a11y.mdx` (keyboard reach of non-draggable rows, drops by keyboard)
- [x] 4.4 Update the designer docs (`data-table.mdx` / guidelines) with the per-row drag behavior
- [x] 4.5 Add a consumer example to `data-table.docs.spec.tsx` and run it
- [x] 4.6 Check `.claude/skills/`, `.claude/commands/` and `docs/` for references to DataTable drag that need the same update

## 5. Release and Verification

- [x] 5.1 Add a minor changeset for `@commercetools/nimbus` written from the consumer's view
- [x] 5.2 Run `pnpm --filter @commercetools/nimbus typecheck:dev` and lint (ESLint run on the data-table directory only, not the whole repo)
- [x] 5.3 Run the data-table tests and the docs spec (run with `test:dev` against source, not the built bundle)
- [ ] 5.4 Run the `nimbus-reviewer` agent on the change
