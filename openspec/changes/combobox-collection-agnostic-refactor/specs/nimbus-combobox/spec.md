## ADDED Requirements

### Requirement: Pluggable Collection Renderer

The ComboBox SHALL accept any collection component (ListBox, GridList, Tree)
as the popover content, not only ListBox.

#### Scenario: Tree collection

- **WHEN** a `Tree.Root` is rendered inside `ComboBox.Popover`
- **THEN** SHALL display hierarchical suggestions
- **AND** expand/collapse SHALL work within the popover
- **AND** selection SHALL propagate to ComboBox's `onSelectionChange`

#### Scenario: GridList collection

- **WHEN** a `GridList.Root` is rendered inside `ComboBox.Popover`
- **THEN** SHALL display grid-based suggestions
- **AND** keyboard navigation SHALL use GridList's 2D arrow key pattern
- **AND** selection SHALL propagate to ComboBox's `onSelectionChange`

#### Scenario: Default ListBox collection

- **WHEN** `ComboBox.ListBox` or `ListBox.Root` is rendered inside `ComboBox.Popover`
- **THEN** SHALL behave identically to the current ComboBox
- **AND** all existing features (sections, filtering, async) SHALL work

### Requirement: Autocomplete Integration

The ComboBox SHALL use React Aria's Autocomplete internally for filtering and
virtual focus, replacing the current custom implementation.

#### Scenario: Client-side filtering

- **WHEN** user types in the ComboBox input
- **THEN** Autocomplete SHALL filter the collection items
- **AND** virtual focus SHALL allow arrow key navigation while input retains focus

#### Scenario: Async loading

- **WHEN** `asyncConfig` is provided
- **THEN** Autocomplete SHALL operate in controlled input mode
- **AND** async debouncing and loading states SHALL be preserved

### Requirement: Virtualizer Compatibility

The ComboBox SHALL work with a Virtualizer-wrapped collection inside the popover.

#### Scenario: Virtualized dropdown

- **WHEN** a `Virtualizer` wraps the collection inside `ComboBox.Popover`
- **THEN** SHALL render only visible items
- **AND** filtering SHALL trigger Virtualizer re-layout
- **AND** keyboard navigation SHALL work across virtualized items

### Requirement: Backwards Compatible API

The ComboBox public API SHALL remain backwards compatible.

#### Scenario: Existing consumer code

- **WHEN** consumer uses `ComboBox.Root`, `ComboBox.Trigger`, `ComboBox.Popover`,
  `ComboBox.ListBox`, `ComboBox.Option`, `ComboBox.Section`
- **THEN** SHALL work without any code changes
- **AND** all existing props, callbacks, and behaviors SHALL be preserved

## MODIFIED Requirements

### Requirement: Option Collection

The component SHALL manage collection of options.

#### Scenario: Static options

- **WHEN** children contain ComboBox.Option components
- **THEN** SHALL render options in dropdown
- **AND** SHALL filter based on input value

#### Scenario: Dynamic options

- **WHEN** items prop is provided with data array
- **THEN** SHALL render options from data
- **AND** SHALL use render props for option content
- **AND** SHALL support collection-based rendering

#### Scenario: Option sections

- **WHEN** ComboBox.Section components are used
- **THEN** SHALL render grouped options with headers
- **AND** SHALL maintain filtering within groups

#### Scenario: Any collection type

- **WHEN** a Tree.Root, GridList.Root, or ListBox.Root is rendered inside ComboBox.Popover
- **THEN** SHALL connect to Autocomplete for filtering and virtual focus
- **AND** selection from any collection type SHALL propagate to onSelectionChange
