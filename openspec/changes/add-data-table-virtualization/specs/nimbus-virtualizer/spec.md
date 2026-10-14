## MODIFIED Requirements

### Requirement: Internal Component

The `Virtualizer` component SHALL NOT be exported from `@commercetools/nimbus`.
Consumers SHALL virtualize only through a Nimbus collection's `isVirtualized`
prop. Of the Virtualizer's types, only `VirtualizerListLayoutOptions` and
`VirtualizerTableLayoutOptions` SHALL be exported.

#### Scenario: Component is not exported

- **WHEN** a consumer imports from `@commercetools/nimbus`
- **THEN** `Virtualizer`, its props type, its helpers, and React Aria's
  `ListLayout`, `GridLayout` and `TableLayout` SHALL NOT be exported

#### Scenario: Options type is exported

- **WHEN** a consumer imports the type `VirtualizerListLayoutOptions` from
  `@commercetools/nimbus`
- **THEN** the import SHALL resolve and SHALL type `virtualizerOptions`

#### Scenario: Table options type is exported

- **WHEN** a consumer imports the type `VirtualizerTableLayoutOptions` from
  `@commercetools/nimbus`
- **THEN** the import SHALL resolve and SHALL type the DataTable's
  `virtualizerOptions`

#### Scenario: Documentation status

- **WHEN** a collection documents `isVirtualized`
- **THEN** it SHALL mark the prop as experimental
- **AND** no documentation page SHALL describe the `Virtualizer` component
  itself

## ADDED Requirements

### Requirement: Sticky Table Columns

The table layout SHALL keep the columns that the collection names as sticky in
the DOM, in the header and in every rendered row, and SHALL position them
`sticky` at their column offset. The collection names them through an internal
`stickyColumns` prop. Consumers SHALL NOT be able to set it.

#### Scenario: Sticky columns survive horizontal scrolling

- **WHEN** a virtualized table with sticky columns at its start scrolls sideways
  past them
- **THEN** their header cells and body cells SHALL stay in the DOM
- **AND** they SHALL stay at their offset from the left edge

#### Scenario: No sticky columns by default

- **WHEN** no sticky columns are named
- **THEN** the table layout SHALL behave like React Aria's `TableLayout`
