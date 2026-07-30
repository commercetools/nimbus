# FEC-1137: DataTable Row Detail Panels (renderDetails)

**Branch**: `FEC-1137-datatable-render-details` **Base**: `main`

## Summary

Add a `renderDetails(row)` prop that renders a full-width detail panel below a
row when clicked. Internal toggle state manages which rows have their details
expanded.

## Tasks

### Task 1: Add types and context wiring

**Files**: `data-table.types.ts`, `data-table.context.tsx`,
`data-table.root.tsx`

1. Add `renderDetails`, `detailExpandedRows`, and `toggleDetails` to
   `DataTableContextValue`
2. Add `detailExpandedRows` to `InteractionContextValue` (follows `expanded`
   pattern)
3. Destructure `renderDetails` in root, add internal `detailExpandedRows`
   state + `toggleDetails` callback
4. Pass through context values

**Test**: Story that provides `renderDetails` and verifies context values reach
the row (tested via rendering the detail panel in Task 2).

### Task 2: Render detail panel row in data-table.row.tsx

**Files**: `data-table.row.tsx`, `data-table.body.tsx`

1. Read `renderDetails`, `toggleDetails` from context
2. Accept `isDetailExpanded` prop (passed from body, same as `isExpanded`)
3. When `renderDetails` is provided and row is detail-expanded, render a
   full-width `<RaRow>` + `<DataTableCell colSpan={...}>` with
   `renderDetails(row)` content
4. When `renderDetails` is present, clicking a row toggles
   `toggleDetails(row.id)` (integrates into existing click handler)
5. Update body to pass `isDetailExpanded` from `detailExpandedRows`

### Task 3: Add recipe styling for detail panel

**Files**: `data-table.recipe.ts`

1. Add `data-detail-row-expanded` data attribute pattern (mirrors
   `data-nested-row-expanded`)
2. Style the detail cell (left accent border like nested rows)
3. Ensure hover styles exclude detail rows

### Task 4: Story with play function

**Files**: `data-table.stories.tsx`

1. Create `RowDetailPanels` story demonstrating `renderDetails`
2. Play function tests: click to open, click to close, detail spans all columns
3. Test coexistence with selection and nested expansion
