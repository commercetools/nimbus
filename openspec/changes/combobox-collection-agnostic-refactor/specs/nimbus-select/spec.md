## ADDED Requirements

### Requirement: Searchable Select

The Select SHALL support optional search/filtering via Autocomplete composition.

#### Scenario: Autocomplete inside popover

- **WHEN** consumer wraps `Select.Options` in `<Autocomplete>` with a
  `SearchField` inside `Select.Popover`
- **THEN** SHALL filter options based on search input
- **AND** virtual focus SHALL navigate filtered options
- **AND** selection SHALL work as normal

#### Scenario: Standard select unchanged

- **WHEN** no Autocomplete wrapper is used
- **THEN** SHALL behave identically to the current Select
- **AND** no search input SHALL be rendered

### Requirement: Virtualizer Compatibility

The Select SHALL work with a Virtualizer-wrapped ListBox inside the popover.

#### Scenario: Virtualized options

- **WHEN** a `Virtualizer` wraps `Select.Options` inside `Select.Popover`
- **THEN** SHALL render only visible options
- **AND** keyboard navigation SHALL work across virtualized items
- **AND** selection SHALL work as normal

### Requirement: Backwards Compatible API

The Select public API SHALL remain backwards compatible.

#### Scenario: Existing consumer code

- **WHEN** consumer uses `Select.Root`, `Select.Trigger`, `Select.Popover`,
  `Select.Options`, `Select.Option`
- **THEN** SHALL work without any code changes
