# Specification: DataTable Component

## Purpose

The DataTable component provides an advanced, accessible data grid with sorting, filtering, column management, virtualization, and keyboard navigation. It follows ARIA grid pattern with extensive customization options.

**Component:** `DataTable`
**Package:** `@commercetools/nimbus`
**Type:** Complex compound component
**React Aria:** Uses `Table` components from react-aria-components
**i18n:** 31 messages (highest in package)
## Requirements
### Requirement: Data Binding
The component SHALL render tabular data from array of objects.

#### Scenario: Data prop
- **WHEN** data prop is provided with array of row objects
- **THEN** SHALL render one row per data item
- **AND** SHALL support any object shape
- **AND** SHALL re-render when data changes

### Requirement: Column Configuration
The component SHALL support column definitions.

#### Scenario: Column definition
- **WHEN** columns prop defines table structure
- **THEN** SHALL render header cell per column
- **AND** SHALL extract cell value via column.accessor
- **AND** SHALL support custom cell rendering via column.Cell
- **AND** SHALL support column.Header for custom header content

### Requirement: Column Sorting
The component SHALL support single and multi-column sorting.

#### Scenario: Sort activation
- **WHEN** user clicks sortable column header
- **THEN** SHALL toggle sort direction (none → asc → desc → none)
- **AND** SHALL apply sort icon indicator
- **AND** SHALL call onSortChange callback with sort state

#### Scenario: Multi-column sort
- **WHEN** user Shift+clicks additional column headers
- **THEN** SHALL add column to sort chain
- **AND** SHALL show sort order numbers on headers
- **AND** SHALL sort by primary, then secondary, then tertiary columns

#### Scenario: Keyboard sorting
- **WHEN** column header is focused and user presses Enter or Space
- **THEN** SHALL toggle sort direction
- **AND** SHALL announce sort change to screen readers

### Requirement: Column Filtering
The component SHALL support per-column filtering.

#### Scenario: Filter input
- **WHEN** column has filterable={true}
- **THEN** SHALL provide filter input in column header
- **AND** SHALL filter rows matching filter value
- **AND** SHALL support custom filter functions per column

#### Scenario: Filter application
- **WHEN** user types in filter input
- **THEN** SHALL debounce filter application
- **AND** SHALL show filtered row count
- **AND** SHALL call onFilterChange callback

### Requirement: Column Visibility
The component SHALL allow showing/hiding columns.

#### Scenario: Column visibility menu
- **WHEN** column management is enabled
- **THEN** SHALL provide menu to toggle column visibility
- **AND** SHALL save column visibility state
- **AND** SHALL maintain at least one visible column
- **AND** SHALL provide "Show All" / "Hide All" options

#### Scenario: Column reordering
- **WHEN** user drags column header
- **THEN** SHALL allow reordering columns
- **AND** SHALL show drop indicator during drag
- **AND** SHALL call onColumnOrderChange callback
- **AND** SHALL persist new column order

### Requirement: Column Resizing
The component SHALL support column width adjustment.

#### Scenario: Resize handle
- **WHEN** column has resizable={true}
- **THEN** SHALL show resize handle at column edge
- **AND** user SHALL drag to adjust width
- **AND** SHALL not allow width below minimum
- **AND** SHALL call onColumnResize callback

### Requirement: Row Selection
The component SHALL support single and multi-row selection.

#### Scenario: Single selection
- **WHEN** selectionMode="single"
- **THEN** SHALL allow selecting one row at a time
- **AND** clicking row SHALL select it and deselect others
- **AND** Space key SHALL toggle selection

#### Scenario: Multiple selection
- **WHEN** selectionMode="multiple"
- **THEN** SHALL show checkbox column
- **AND** header checkbox SHALL select/deselect all
- **AND** row checkboxes SHALL toggle individual rows
- **AND** Shift+click SHALL select range
- **AND** Ctrl/Cmd+click SHALL toggle individual rows

#### Scenario: Selection state
- **WHEN** selection changes
- **THEN** SHALL call onSelectionChange callback with selected keys
- **AND** SHALL support controlled selection (selectedKeys prop)
- **AND** SHALL support uncontrolled selection (defaultSelectedKeys)

### Requirement: Paginated Display
The component SHALL support pagination for large datasets.

#### Scenario: Page controls
- **WHEN** pagination is enabled
- **THEN** SHALL show Pagination component below table
- **AND** SHALL support page size selection
- **AND** SHALL show current page and total pages
- **AND** SHALL navigate via page buttons

#### Scenario: Pagination state
- **WHEN** page changes
- **THEN** SHALL call onPageChange callback
- **AND** SHALL support controlled pagination (page, pageSize props)
- **AND** SHALL reset to page 1 when filtering changes

### Requirement: Performance Optimization
The component SHALL virtualize rows for large datasets.

#### Scenario: Virtual scrolling
- **WHEN** virtualization is enabled and dataset is large
- **THEN** SHALL render only visible rows
- **AND** SHALL provide smooth scrolling
- **AND** SHALL maintain scroll position during updates
- **AND** SHALL support variable row heights

### Requirement: Display Density
The component SHALL support multiple density levels.

#### Scenario: Density options
- **WHEN** density prop is set
- **THEN** SHALL support: compact, normal, comfortable
- **AND** SHALL adjust row height and padding
- **AND** SHALL provide density menu control
- **AND** SHALL persist density preference

### Requirement: Grid Navigation
The component SHALL support 2D keyboard navigation per ARIA grid pattern.

#### Scenario: Cell navigation
- **WHEN** table has focus and user presses arrow keys
- **THEN** ArrowRight SHALL move focus to next cell
- **AND** ArrowLeft SHALL move to previous cell
- **AND** ArrowDown SHALL move to cell below
- **AND** ArrowUp SHALL move to cell above
- **AND** SHALL wrap at edges or stop at boundaries

#### Scenario: Row navigation
- **WHEN** focus is on first cell and user presses ArrowLeft
- **THEN** SHALL focus entire row
- **AND** ArrowUp/Down SHALL navigate between rows
- **AND** ArrowRight SHALL enter row and focus first cell

#### Scenario: Page navigation
- **WHEN** user presses PageUp/PageDown
- **THEN** SHALL scroll one page up/down
- **AND** SHALL maintain column focus
- **WHEN** user presses Home/End
- **THEN** Home SHALL focus first cell in row
- **AND** End SHALL focus last cell in row
- **AND** Ctrl+Home SHALL focus first cell in table
- **AND** Ctrl+End SHALL focus last cell in table

### Requirement: No Data Display
The component SHALL handle empty data gracefully.

#### Scenario: Empty data
- **WHEN** data array is empty
- **THEN** SHALL show emptyState content if provided
- **OR** default "No data" message
- **AND** SHALL still show column headers
- **AND** SHALL maintain table structure

### Requirement: Loading Indication
The component SHALL show loading state during data fetch.

#### Scenario: Loading display
- **WHEN** loading={true}
- **THEN** SHALL show LoadingSpinner overlay
- **AND** SHALL disable interactions
- **AND** SHALL maintain table dimensions

### Requirement: Row Expansion
The component SHALL support expandable row details with controlled and uncontrolled state management.

#### Scenario: Expand control
- **WHEN** row has expandable content
- **THEN** SHALL show expand/collapse icon
- **AND** clicking icon SHALL toggle expansion
- **AND** SHALL render expanded content in spanning row

#### Scenario: Uncontrolled expansion (default)
- **WHEN** no `expanded` prop is provided
- **THEN** expansion state SHALL be managed internally
- **AND** `defaultExpanded` SHALL set initial expansion state if provided
- **AND** user interactions SHALL update internal state directly

#### Scenario: Controlled expansion
- **WHEN** `expanded` prop is provided
- **THEN** component SHALL reflect the provided expansion state
- **AND** SHALL NOT manage expansion state internally
- **AND** parent component SHALL be responsible for state updates

#### Scenario: Expansion change notification
- **WHEN** expansion state changes via user interaction
- **THEN** SHALL call `onExpandChange` with the new expansion state
- **AND** callback SHALL receive full `Record<string, boolean>` state

### Requirement: ARIA Grid Pattern
The component SHALL implement ARIA grid pattern per nimbus-core standards.

#### Scenario: Grid roles
- **WHEN** table renders
- **THEN** SHALL use role="grid"
- **AND** rows SHALL use role="row"
- **AND** cells SHALL use role="gridcell"
- **AND** column headers SHALL use role="columnheader"

#### Scenario: State announcements
- **WHEN** sort/filter/selection changes
- **THEN** SHALL announce changes to screen readers
- **AND** SHALL use aria-live regions
- **AND** SHALL provide column sort indicators via aria-sort

### Requirement: Localized Messages
The component SHALL use i18n for all user-facing text per nimbus-core standards.

#### Scenario: Translatable strings
- **WHEN** component renders
- **THEN** SHALL use i18n messages from data-table.i18n.ts
- **AND** SHALL translate: column menu labels, density options, filter placeholders, empty state, pagination text, selection indicators
- **AND** 31 messages SHALL cover all UI text

### Requirement: Multi-Slot Recipe
The component SHALL use extensive multi-slot recipe per nimbus-core standards.

#### Scenario: Slot configuration
- **WHEN** table renders
- **THEN** SHALL apply dataTable slot recipe from theme/slot-recipes/data-table.ts
- **AND** SHALL style slots: root, table, thead, tbody, tr, th, td, cell, headerCell, sortIcon, filterInput, checkbox, expandIcon, emptyState, loadingOverlay
- **AND** SHALL support density variants in recipe

### Requirement: Optimized Rendering
The component SHALL optimize for large datasets.

#### Scenario: Render optimization
- **WHEN** data contains 1000+ rows
- **THEN** SHALL use virtualization to render only visible rows
- **AND** SHALL memoize cell renderers
- **AND** SHALL batch state updates
- **AND** SHALL maintain 60fps scrolling

### Requirement: Component Aria Labels

The DataTable subcomponents SHALL have accessible labels for screen reader
identification.

#### Scenario: Default table label

- **WHEN** DataTable.Table renders without explicit aria-label
- **THEN** SHALL apply default localized label "Data table"
- **AND** label SHALL be customizable via aria-label prop

#### Scenario: Default header label

- **WHEN** DataTable.Header renders without explicit aria-label
- **THEN** SHALL apply default localized label "Data table header"
- **AND** label SHALL be customizable via aria-label prop

#### Scenario: Default body label

- **WHEN** DataTable.Body renders without explicit aria-label
- **THEN** SHALL apply default localized label "Data table body"
- **AND** label SHALL be customizable via aria-label prop

#### Scenario: Manager drawer label

- **WHEN** DataTable.Manager drawer opens
- **THEN** Drawer.Content SHALL have aria-label using "settings" i18n message
- **AND** Settings tabs SHALL have accessible label via tabListAriaLabel

#### Scenario: Custom label override

- **WHEN** component receives explicit aria-label prop
- **THEN** SHALL use provided label instead of default
- **AND** SHALL not apply localized default

