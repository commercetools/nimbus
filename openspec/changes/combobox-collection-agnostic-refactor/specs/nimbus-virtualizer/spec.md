## ADDED Requirements

### Requirement: Virtualized Rendering

The Virtualizer component SHALL render only visible items in a scrollable
collection, wrapping React Aria's Virtualizer.

#### Scenario: List virtualization

- **WHEN** `Virtualizer` wraps a ListBox with `layout={ListLayout}`
- **THEN** SHALL only render items visible in the scroll viewport
- **AND** SHALL maintain correct scroll height for the full item count
- **AND** keyboard navigation SHALL work across virtualized items

#### Scenario: Grid virtualization

- **WHEN** `Virtualizer` wraps a GridList with `layout={GridLayout}`
- **THEN** SHALL arrange items in a responsive grid
- **AND** SHALL only render visible grid cells
- **AND** column count SHALL adjust based on container width and `minItemSize`

#### Scenario: Waterfall virtualization

- **WHEN** `Virtualizer` wraps a GridList with `layout={WaterfallLayout}`
- **THEN** SHALL arrange variable-height items in a masonry layout
- **AND** SHALL only render visible items

#### Scenario: Table virtualization

- **WHEN** `Virtualizer` wraps a DataTable with `layout={TableLayout}`
- **THEN** SHALL only render visible rows
- **AND** column headers SHALL remain visible during scroll
- **AND** column resizing SHALL continue to work

#### Scenario: Tree virtualization

- **WHEN** `Virtualizer` wraps a Tree with `layout={ListLayout}`
- **THEN** SHALL only render visible tree nodes
- **AND** expand/collapse SHALL trigger re-layout
- **AND** keyboard navigation SHALL work across virtualized nodes

### Requirement: Layout Options

The Virtualizer SHALL accept layout-specific options.

#### Scenario: Fixed row size

- **WHEN** `layoutOptions={{ rowSize: 48 }}` is provided to ListLayout
- **THEN** SHALL use 48px as the fixed row height
- **AND** scrollbar size SHALL be calculated from item count × row size

#### Scenario: Estimated row size

- **WHEN** `layoutOptions={{ estimatedRowSize: 60 }}` is provided
- **THEN** SHALL use 60px as the estimated height for variable-height rows
- **AND** scrollbar SHALL adjust as actual heights are measured

#### Scenario: Horizontal orientation

- **WHEN** `layoutOptions={{ orientation: 'horizontal' }}` is provided
- **THEN** SHALL virtualize along the horizontal axis
- **AND** collection component SHALL use matching `orientation` prop

### Requirement: Layout Re-exports

Nimbus SHALL re-export React Aria's layout classes for consumer convenience.

#### Scenario: Import from nimbus

- **WHEN** consumer imports `{ Virtualizer, ListLayout, GridLayout, WaterfallLayout, TableLayout }`
- **THEN** all SHALL be importable from `@commercetools/nimbus`
- **AND** SHALL match the React Aria Components API exactly

### Requirement: Composition with Autocomplete

The Virtualizer SHALL work correctly when the collection is also wrapped in
Autocomplete.

#### Scenario: Filtered virtualized list

- **WHEN** Autocomplete filters a virtualized ListBox
- **THEN** Virtualizer SHALL re-layout based on the filtered item count
- **AND** scroll position SHALL reset to top on filter change
- **AND** virtual focus SHALL work on filtered + virtualized items
