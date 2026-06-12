## ADDED Requirements

### Requirement: Collection Filtering

The Autocomplete component SHALL filter any child collection component based on
text input from any child text input component.

#### Scenario: Client-side filtering

- **WHEN** `filter` prop is provided
- **AND** user types in the child input
- **THEN** SHALL filter the child collection's items using the filter function
- **AND** items not matching SHALL be hidden
- **AND** SHALL work with ListBox, GridList, Menu, Tree, Table, and TagGroup

#### Scenario: Async loading

- **WHEN** `filter` prop is NOT provided
- **AND** `inputValue` and `onInputChange` props are provided
- **THEN** SHALL operate in controlled mode
- **AND** consumer SHALL manage filtering externally (e.g. via `useAsyncList`)

#### Scenario: Empty results

- **WHEN** filtering produces zero matching items
- **AND** the child collection has a `renderEmptyState` prop
- **THEN** the collection SHALL render its empty state

### Requirement: Virtual Focus

The Autocomplete SHALL support virtual focus — arrow key navigation in the
collection while the text input retains DOM focus.

#### Scenario: Arrow key navigation

- **WHEN** the child input is focused
- **AND** user presses ArrowDown
- **THEN** SHALL visually indicate the next item in the collection as focused
- **AND** DOM focus SHALL remain on the input element
- **AND** `aria-activedescendant` SHALL reference the focused item

#### Scenario: Selection via Enter

- **WHEN** a collection item is virtually focused
- **AND** user presses Enter
- **THEN** SHALL trigger the item's action or selection

#### Scenario: Disable virtual focus

- **WHEN** `disableVirtualFocus` prop is set
- **THEN** SHALL NOT use virtual focus
- **AND** user SHALL tab between input and collection for focus

### Requirement: Cross-Boundary Context

The Autocomplete SHALL connect input and collection components via React Aria
context, regardless of intervening DOM boundaries.

#### Scenario: Popover boundary

- **WHEN** the child input is outside a Popover
- **AND** the child collection is inside a Popover
- **THEN** Autocomplete SHALL still connect them
- **AND** filtering and virtual focus SHALL work across the boundary

### Requirement: Input Compatibility

The Autocomplete SHALL work with TextField, SearchField, or any React Aria
input.

#### Scenario: SearchField child

- **WHEN** a `SearchField` is a child of Autocomplete
- **THEN** SHALL use its value for filtering
- **AND** clear button in SearchField SHALL reset the filter

#### Scenario: TextField child

- **WHEN** a `TextField` is a child of Autocomplete
- **THEN** SHALL use its value for filtering
