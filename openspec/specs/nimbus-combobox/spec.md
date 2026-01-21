# Specification: ComboBox Component

## Purpose

The ComboBox component provides an accessible autocomplete/typeahead selection
control that combines text input with dropdown list, following ARIA combobox
pattern. It enables users to search, filter, and select from a collection of
options with comprehensive keyboard navigation, validation support, and full
accessibility compliance.

**Component:** `ComboBox` **Package:** `@commercetools/nimbus` **Type:**
Multi-slot component **React Aria:** Uses `ComboBox` from react-aria-components
**i18n:** 6 messages (toggleOptions, clearInputValue, suggestionsAvailable,
etc.)

## Requirements

### Requirement: Single Selection with Input

The component SHALL combine text input with selection capability.

#### Scenario: Controlled mode

- **WHEN** selectedKey and onSelectionChange props are provided
- **THEN** SHALL render with selected option
- **AND** SHALL display selected option text in input
- **AND** SHALL call onSelectionChange when selection changes

#### Scenario: Uncontrolled mode

- **WHEN** defaultSelectedKey prop is provided
- **THEN** SHALL initialize with default selection
- **AND** SHALL manage state internally

#### Scenario: Input value

- **WHEN** inputValue and onInputChange props are provided
- **THEN** SHALL control input text independently from selection
- **AND** SHALL call onInputChange on every keystroke
- **AND** SHALL support free-form text entry

### Requirement: Option Filtering

The component SHALL filter options based on user input.

#### Scenario: Text-based filtering

- **WHEN** user types in input
- **THEN** SHALL filter options matching input text
- **AND** SHALL use case-insensitive matching by default
- **AND** SHALL show filtered results in dropdown

#### Scenario: Custom filter function

- **WHEN** custom filter function is provided
- **THEN** SHALL use function to determine option visibility
- **AND** SHALL support advanced filtering logic
- **AND** SHALL receive input value and option as parameters

#### Scenario: No matches

- **WHEN** no options match filter
- **THEN** SHALL show "No results" message
- **AND** SHALL use i18n message from combobox.i18n.ts
- **AND** SHALL keep dropdown open

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

### Requirement: Keyboard Interaction

The component SHALL support comprehensive keyboard navigation per nimbus-core
standards.

#### Scenario: Option navigation

- **WHEN** dropdown is open and user presses ArrowDown
- **THEN** SHALL focus next option
- **WHEN** user presses ArrowUp
- **THEN** SHALL focus previous option
- **WHEN** user presses Home
- **THEN** SHALL focus first option
- **WHEN** user presses End
- **THEN** SHALL focus last option

#### Scenario: Selection

- **WHEN** option is focused and user presses Enter
- **THEN** SHALL select option
- **AND** SHALL populate input with option text
- **AND** SHALL close dropdown

#### Scenario: Escape key

- **WHEN** dropdown is open and user presses Escape
- **THEN** SHALL close dropdown
- **AND** SHALL restore previous selection (if exists)
- **OR** clear input (if no selection)

#### Scenario: Tab key

- **WHEN** user presses Tab
- **THEN** SHALL close dropdown
- **AND** SHALL move focus to next element
- **AND** SHALL commit current highlighted option

### Requirement: Clear Button

The component SHALL provide input clearing capability.

#### Scenario: Clear button visibility

- **WHEN** input has value or selection exists
- **THEN** SHALL show clear button
- **AND** SHALL hide clear button when no value or selection

#### Scenario: Clear button in multi-select mode

- **WHEN** user clicks clear button in multi-select mode
- **THEN** SHALL clear all selected items
- **AND** SHALL clear input text
- **AND** SHALL keep dropdown/menu OPEN
- **AND** SHALL maintain focus on input field
- **AND** SHALL reset filter (show all available options)
- **AND** SHALL allow user to continue selecting without reopening menu

#### Scenario: Clear button in single-select mode

- **WHEN** user clicks clear button in single-select mode
- **THEN** SHALL clear selected item
- **AND** SHALL clear input text
- **AND** SHALL keep dropdown/menu OPEN if input is focused
- **AND** SHALL maintain focus on input field
- **AND** SHALL show all available options

#### Scenario: Clear button callback behavior

- **WHEN** clear button is clicked
- **THEN** SHALL call onInputChange with empty string
- **AND** SHALL call onSelectionChange with appropriate empty value:
  - Multi-select: empty array `[]`
  - Single-select: `null`

#### Scenario: Clear button accessibility

- **WHEN** component renders with value/selection
- **THEN** clear button SHALL use i18n aria-label "Clear selection"
- **AND** SHALL be keyboard accessible
- **AND** SHALL not trigger blur event on input when clicked
- **AND** SHALL not cause menu to close

#### Scenario: Clear button focus management

- **WHEN** clear button is clicked
- **THEN** SHALL maintain input focus (not transfer focus to button)
- **AND** SHALL ensure blur handler does not interpret click as focus loss
- **AND** SHALL keep menu open by preventing blur-triggered closure

#### Scenario: Keyboard-based clearing

- **WHEN** input is empty and user presses Backspace
- **THEN** SHALL clear last selected item (multi-select) or selection
  (single-select)
- **AND** SHALL keep menu open if menu was already open
- **AND** SHALL maintain input focus

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

### Requirement: Input Validation

The component SHALL validate selection and input state.

#### Scenario: Required validation

- **WHEN** required={true} is set
- **THEN** SHALL require selection or input value
- **AND** SHALL show required indicator
- **AND** SHALL set aria-required="true"

#### Scenario: Invalid state

- **WHEN** validation fails
- **THEN** SHALL apply error styling
- **AND** SHALL show error message
- **AND** SHALL set aria-invalid="true"

#### Scenario: Free-form input validation

- **WHEN** allowsCustomValue={true}
- **THEN** SHALL accept non-option values
- **AND** SHALL validate custom input
- **WHEN** allowsCustomValue={false} (default)
- **THEN** SHALL require selection from options

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

### Requirement: Async Data Loading

The component SHALL support async option loading.

#### Scenario: Loading indication

- **WHEN** loading={true} is set
- **THEN** SHALL show loading spinner in dropdown
- **AND** SHALL show loading message
- **AND** SHALL use i18n message "Loading suggestions"
- **AND** SHALL disable option selection while loading

### Requirement: Size Options

The component SHALL support multiple size variants per nimbus-core standards.

#### Scenario: Size variants

- **WHEN** size prop is set
- **THEN** SHALL support: sm, md, lg
- **AND** SHALL adjust input height, padding, font size, and button sizes
- **AND** md SHALL be default size

### Requirement: ARIA Combobox Pattern

The component SHALL implement ARIA combobox pattern per nimbus-core standards.

#### Scenario: Combobox roles

- **WHEN** component renders
- **THEN** input SHALL have role="combobox"
- **AND** SHALL set aria-expanded to reflect dropdown state
- **AND** SHALL set aria-controls to reference dropdown ID
- **AND** dropdown SHALL have role="listbox"
- **AND** options SHALL have role="option"

#### Scenario: Active descendant

- **WHEN** option is focused via keyboard
- **THEN** SHALL set aria-activedescendant on input
- **AND** SHALL reference focused option ID

#### Scenario: State announcements

- **WHEN** filtered results update
- **THEN** SHALL announce result count to screen readers
- **AND** SHALL use aria-live region
- **AND** SHALL use i18n message "N suggestions available"

### Requirement: Internationalized Labels

The component SHALL use i18n for screen reader text per nimbus-core standards.

#### Scenario: Localized messages

- **WHEN** component renders
- **THEN** SHALL use i18n messages from combobox.i18n.ts
- **AND** SHALL translate: toggleOptions, clearInputValue, suggestionsAvailable,
  noResults, loadingSuggestions, filterOptions

### Requirement: Multi-Slot Recipe

The component SHALL use multi-slot recipe per nimbus-core standards.

#### Scenario: Slot styling

- **WHEN** component renders
- **THEN** SHALL apply combobox slot recipe from theme/slot-recipes/combobox.ts
- **AND** SHALL style: root, label, inputWrapper, input, toggleButton,
  clearButton, dropdown, option, section, noResults, loadingState, helperText,
  errorText slots
- **AND** SHALL support size variants

### Requirement: Form Compatibility

The component SHALL integrate with HTML forms per nimbus-core standards.

#### Scenario: Form submission

- **WHEN** component is in a form
- **THEN** SHALL include selected value in form data
- **AND** SHALL use name prop as field name
- **AND** SHALL submit input value if allowsCustomValue={true}
