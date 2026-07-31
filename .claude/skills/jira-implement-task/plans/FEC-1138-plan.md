# FEC-1138: DataTable Compound Sub-Components Plan

## Branch: `FEC-1138-datatable-compound-subcomponents`

## Summary

Expose DataTable's internal building blocks (`Row`, `Cell`, `Column`) on the
`DataTable` namespace and add stories + tests proving the compound composition
pattern works for custom layouts.

## Tasks

### Task 1: Add Row, Cell, Column to DataTable namespace and exports

**Files:**

- `packages/nimbus/src/components/data-table/data-table.tsx` — add `Row`,
  `Cell`, `Column` to `Object.assign` + docgen exports
- `packages/nimbus/src/components/data-table/index.ts` — re-export sub-component
  types needed for composition
- `packages/nimbus/src/components/data-table/data-table.types.ts` — no changes
  expected (types already exported)

**Acceptance:**

- `DataTable.Row`, `DataTable.Cell`, `DataTable.Column` are accessible
- Existing `DataTable` usage unchanged (no breaking changes)
- `typecheck:dev` passes

### Task 2: Add compound composition stories with play function tests

**Files:**

- `packages/nimbus/src/components/data-table/data-table.stories.tsx`

**Stories to add:**

1. `CompoundBasic` — demonstrates
   `DataTable.Root > DataTable.Table > DataTable.Header + DataTable.Body`
   pattern (already possible, but no story for it)
2. `CompoundCustomRow` — demonstrates using `DataTable.Row` and `DataTable.Cell`
   directly for custom row rendering with injected content
3. `CompoundCustomHeader` — demonstrates using `DataTable.Column` directly for
   custom header rendering

**Acceptance:**

- Each story renders correctly
- Play functions verify rendering and interactions
- `pnpm test:dev` passes for the stories file

### Task 3: Verify no regressions in existing DataTable stories

**Acceptance:**

- All existing DataTable stories pass
- No breaking changes to pre-composed `DataTable` API
