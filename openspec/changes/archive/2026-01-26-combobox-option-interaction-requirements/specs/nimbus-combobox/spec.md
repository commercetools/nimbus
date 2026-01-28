## MODIFIED Requirements

### Requirement: Interactive States

The component SHALL support multiple interaction states per nimbus-core
standards.

#### Scenario: Disabled state

- **WHEN** disabled={true} is set
- **THEN** SHALL apply disabled styling
- **AND** SHALL disable input and toggle button
- **AND** SHALL prevent dropdown opening
- **AND** SHALL set aria-disabled="true"

#### Scenario: Read-only state

- **WHEN** readOnly={true} is set
- **THEN** SHALL display selected value
- **AND** SHALL prevent input editing
- **AND** SHALL prevent dropdown opening
- **AND** SHALL set aria-readonly="true"

#### Scenario: Option hover feedback

- **WHEN** user hovers mouse over an option in the dropdown
- **THEN** SHALL apply hover background styling (`primary.2`)
- **AND** SHALL display pointer cursor to indicate interactivity (per WAI-APG)
- **AND** hover styling SHALL be independent of keyboard focus state
- **AND** SHALL NOT apply hover styling to disabled options
- **AND** SHALL apply consistently across single-select and multi-select modes

## MODIFIED Requirements

### Requirement: Dropdown Opening

The component SHALL control dropdown visibility intelligently.

#### Scenario: Open on focus

- **WHEN** input receives focus
- **THEN** SHALL open dropdown
- **AND** SHALL show all options (if no filter applied)
- **OR** SHALL show filtered options

#### Scenario: Open on input

- **WHEN** user types in input
- **THEN** SHALL open dropdown if closed
- **AND** SHALL update filtered options
- **AND** SHALL highlight first matching option

#### Scenario: Toggle button

- **WHEN** user clicks dropdown toggle button
- **THEN** SHALL toggle dropdown open/closed
- **AND** button SHALL show chevron icon
- **AND** SHALL use i18n aria-label "Toggle options"

#### Scenario: Close on scroll

- **WHEN** dropdown is open and user scrolls the page
- **THEN** SHALL close the dropdown
- **AND** SHALL preserve current selection state
- **AND** SHALL allow user to reopen dropdown after scrolling
