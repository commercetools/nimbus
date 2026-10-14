## MODIFIED Requirements

### Requirement: Performance Optimization
The component SHALL virtualize rows when the consumer sets `isVirtualized` on
`DataTable` or `DataTable.Root`. Without `isVirtualized` the component SHALL
render every row, as before.

#### Scenario: Virtual scrolling
- **WHEN** `isVirtualized` is set and the table has a bounded height
- **THEN** only the rows in view, plus React Aria's overscan, SHALL be in the DOM
- **AND** the grid's `aria-rowcount` SHALL equal the number of rows plus the header row
- **AND** scrolling SHALL render the rows that come into view
- **AND** rows of different heights SHALL be measured after render, so they do not overlap or clip

#### Scenario: Not virtualized by default
- **WHEN** `isVirtualized` is not set
- **THEN** every row SHALL be in the DOM
- **AND** the table SHALL render native table elements

### Requirement: Optimized Rendering
The component SHALL optimize for large datasets.

#### Scenario: Render optimization
- **WHEN** data contains 1000+ rows and `isVirtualized` is set
- **THEN** SHALL render only visible rows
- **AND** SHALL memoize cell renderers
- **AND** SHALL batch state updates

## ADDED Requirements

### Requirement: Virtualization Props
`DataTable` and `DataTable.Root` SHALL accept `isVirtualized` and
`virtualizerOptions`. `virtualizerOptions` SHALL be typed as
`VirtualizerTableLayoutOptions`. Neither prop SHALL be forwarded to the DOM.

#### Scenario: Compound API
- **WHEN** a consumer composes `DataTable.Root`, `.Table`, `.Header` and `.Body` with custom `DataTable.Row` and `DataTable.Cell` and sets `isVirtualized` on the Root
- **THEN** the table SHALL render only the rows in view
- **AND** the custom rows and cells SHALL render as they do without virtualization

#### Scenario: Custom options
- **WHEN** `virtualizerOptions` sets `estimatedRowHeight` or `rowHeight`
- **THEN** the table layout SHALL use these values over the defaults

#### Scenario: Options without isVirtualized
- **WHEN** `virtualizerOptions` is set and `isVirtualized` is not
- **THEN** the component SHALL warn in development that the options have no effect

### Requirement: Virtualized Defaults
The estimated row and header heights SHALL be derived from the recipe's tokens
for each `density`, so single-line rows do not shift the scroll height while
they are measured.

#### Scenario: Estimates match the rendered rows
- **WHEN** a virtualized table renders single-line rows in each density
- **THEN** the estimated row height and header height SHALL equal the rendered heights within 1 px

### Requirement: Virtualized Styling Contract
A virtualized DataTable SHALL set `data-virtualized` on its root element. The
recipe SHALL style the virtualized table so that it looks the same as the
non-virtualized one.

#### Scenario: Data attribute
- **WHEN** `isVirtualized` is set
- **THEN** the root element SHALL have the `data-virtualized` attribute
- **AND** without `isVirtualized` it SHALL NOT have it

#### Scenario: Row and header size
- **WHEN** a virtualized table renders
- **THEN** each row SHALL be as tall as its cells
- **AND** the header SHALL be as tall as its column headers
- **AND** rows SHALL be separated by the same border as in the non-virtualized table

#### Scenario: Row backgrounds
- **WHEN** a row is selected, or a custom row sets `bg`
- **THEN** the background SHALL show behind every cell of the row

### Requirement: Features When Virtualized
The component SHALL keep these features working when virtualized: sorting,
selection, keyboard navigation, column resizing, the sticky header, nested
content, pinned rows, drag and drop, row activation, the empty state, the
footer, truncation and density.

#### Scenario: Selection survives scrolling
- **WHEN** a row is selected, scrolled out of view and back
- **THEN** it SHALL still be selected

#### Scenario: Row activation
- **WHEN** the user clicks a non-interactive part of a row, or presses Enter on a focused row or cell, in a virtualized table with `onRowAction`
- **THEN** `onRowAction` SHALL be called once with that row

#### Scenario: Frozen columns on the left
- **WHEN** a virtualized table with drag, selection or expand columns scrolls sideways
- **THEN** those columns SHALL stay in the DOM and stay at the left edge, in the header and in every rendered row

#### Scenario: Sticky header
- **WHEN** a virtualized table with a bounded height scrolls down
- **THEN** the header SHALL stay visible at the top

#### Scenario: Nested content
- **WHEN** a row with nested content is expanded in a virtualized table
- **THEN** the nested row SHALL render below it, as tall as its content

#### Scenario: Pinned rows
- **WHEN** a row is pinned in a virtualized table
- **THEN** it SHALL move to the top and show the pinned outline

### Requirement: Virtualization Limitations Documented
The DataTable documentation SHALL describe virtualization as experimental and
SHALL list its limitations.

#### Scenario: Documentation content
- **WHEN** the documentation describes `isVirtualized`
- **THEN** it SHALL state that the table needs a bounded height (`maxHeight`) to scroll itself
- **AND** it SHALL state that the pin column does not stay at the right edge while the table scrolls sideways
- **AND** it SHALL state that browser find cannot reach rows that are not rendered
- **AND** it SHALL state that CSS written for table elements does not apply to a virtualized table
