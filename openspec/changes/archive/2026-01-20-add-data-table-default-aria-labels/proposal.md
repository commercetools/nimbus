# Proposal: Add default aria-labels to DataTable components

## Summary

Add default localized `aria-label` attributes to `DataTable.Table`,
`DataTable.Header`, and `DataTable.Body` components, with optional props to
override.

## Problem

The DataTable subcomponents (`Table`, `Header`, `Body`) render without
`aria-label` attributes by default. This causes:

1. Accessibility warnings from React Aria during testing
2. Non-compliance with WCAG 2.1 AA requirements for labeling table regions
3. Screen readers unable to announce table structure meaningfully

```tsx
// Before: No way to provide aria-label, components render unlabeled
<DataTable.Root columns={columns} rows={rows}>
  <DataTable.Table>
    <DataTable.Header />
    <DataTable.Body />
  </DataTable.Table>
</DataTable.Root>
```

## Solution

Add optional `aria-label` props to `DataTable.Table`, `DataTable.Header`, and
`DataTable.Body` that fall back to localized default labels when not provided.

```tsx
// After: Components have sensible defaults, can be overridden
<DataTable.Root columns={columns} rows={rows}>
  <DataTable.Table aria-label="Custom table label">
    <DataTable.Header /> {/* Uses default: "Data table header" */}
    <DataTable.Body /> {/* Uses default: "Data table body" */}
  </DataTable.Table>
</DataTable.Root>
```

Additionally, add `aria-label` to the Manager drawer and `tabListAriaLabel` to
the settings tabs for complete accessibility coverage.

## Scope

- **In scope**:
  - Adding `aria-label` prop to `DataTable.Table`, `DataTable.Header`,
    `DataTable.Body`
  - Adding default localized fallback labels via i18n
  - Adding `aria-label` to Manager drawer content
  - Adding `settingsTabsAriaLabel` i18n message for Manager tabs
- **Out of scope**:
  - Changes to other DataTable subcomponents
  - Changes to column-level accessibility (already handled)

## Impact

- **Breaking changes**: None (new optional props with backward-compatible
  defaults)
- **Migration required**: None
- **Dependencies**: Requires `tabListAriaLabel` prop on Tabs component
  (implemented in separate proposal)
- **Affected specs**: `nimbus-data-table`
