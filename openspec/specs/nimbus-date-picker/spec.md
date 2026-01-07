# Specification: DatePicker Component

## Purpose

The DatePicker component provides an accessible date selection control combining text input with calendar popup. It enables users to select dates through direct text input with locale-aware formatting, keyboard navigation with auto-advancing segments, and an optional calendar popup for visual selection. The component supports date constraints, time selection in DateTime mode, timezone handling, and follows WCAG 2.1 AA accessibility standards with React Aria patterns.

## Requirements

### Requirement: Date Value Handling
The component SHALL manage date values using CalendarDate objects.

#### Scenario: Controlled mode
- **WHEN** value and onChange props are provided
- **THEN** value SHALL be CalendarDate, CalendarDateTime, or ZonedDateTime
- **AND** SHALL call onChange with new date object on selection
- **AND** SHALL not update internal state

#### Scenario: Uncontrolled mode
- **WHEN** defaultValue prop is provided without value
- **THEN** SHALL initialize with default date
- **AND** SHALL manage state internally
- **AND** optional onChange SHALL receive updates

### Requirement: Date Input
The component SHALL provide text input for date entry.

#### Scenario: Date segments
- **WHEN** date input renders
- **THEN** SHALL show separate segments for month, day, year
- **AND** each segment SHALL be individually editable
- **AND** Tab key SHALL move between segments
- **AND** segments SHALL use locale-appropriate order

#### Scenario: Keyboard input
- **WHEN** segment is focused
- **THEN** typing numbers SHALL update segment value
- **AND** ArrowUp/Down SHALL increment/decrement value
- **AND** SHALL cycle through valid values
- **AND** SHALL auto-advance to next segment when complete

#### Scenario: Locale formatting
- **WHEN** locale prop is provided (via React Aria context)
- **THEN** SHALL format date according to locale
- **AND** SHALL use locale-specific segment order (e.g., DD/MM/YYYY vs MM/DD/YYYY)
- **AND** SHALL use locale-specific separators

### Requirement: Calendar Display
The component SHALL provide calendar popup for visual date selection.

#### Scenario: Open calendar
- **WHEN** user clicks calendar button
- **THEN** SHALL open calendar popup
- **AND** SHALL show current month or selected date's month
- **AND** SHALL position popup below input (or above if space limited)
- **AND** calendar button SHALL use i18n aria-label "Open calendar"

#### Scenario: Date selection
- **WHEN** user clicks date in calendar
- **THEN** SHALL select date
- **AND** SHALL populate input with selected date
- **AND** SHALL close calendar
- **AND** SHALL call onChange handler

#### Scenario: Calendar navigation
- **WHEN** calendar is open
- **THEN** SHALL provide month/year navigation controls
- **AND** SHALL support keyboard navigation (arrow keys)
- **AND** SHALL support today button to jump to current date

### Requirement: Time Selection
The component SHALL optionally support time input.

#### Scenario: DateTime mode
- **WHEN** granularity prop includes time units
- **THEN** SHALL show time input fields
- **AND** SHALL support hour, minute, second fields based on granularity
- **AND** SHALL support 12-hour or 24-hour format based on locale
- **AND** SHALL show AM/PM selector for 12-hour format

#### Scenario: Time field labels
- **WHEN** time fields render
- **THEN** hour field SHALL use i18n aria-label "Enter time hour"
- **AND** minute field SHALL use i18n aria-label "Enter time minute"
- **AND** second field SHALL use i18n aria-label "Enter time second"
- **AND** period field SHALL use i18n aria-label "Enter time day period"

### Requirement: Date Range Validation
The component SHALL enforce date constraints.

#### Scenario: Minimum date
- **WHEN** minValue prop is set
- **THEN** SHALL prevent selection of dates before minimum
- **AND** SHALL disable dates before minimum in calendar
- **AND** SHALL validate input against minimum

#### Scenario: Maximum date
- **WHEN** maxValue prop is set
- **THEN** SHALL prevent selection of dates after maximum
- **AND** SHALL disable dates after maximum in calendar
- **AND** SHALL validate input against maximum

#### Scenario: Unavailable dates
- **WHEN** isDateUnavailable function is provided
- **THEN** SHALL disable dates that return true
- **AND** SHALL skip unavailable dates during keyboard navigation

### Requirement: Clear Button
The component SHALL provide date clearing capability.

#### Scenario: Clear button
- **WHEN** input has value and isClearable={true}
- **THEN** SHALL show clear button
- **AND** clicking SHALL clear date value
- **AND** SHALL call onChange with null
- **AND** SHALL focus input after clearing
- **AND** clear button SHALL use i18n aria-label "Clear input"

### Requirement: Date Validation
The component SHALL validate date input.

#### Scenario: Required validation
- **WHEN** required={true} is set
- **THEN** SHALL require date selection
- **AND** SHALL show required indicator
- **AND** SHALL set aria-required="true"

#### Scenario: Invalid date
- **WHEN** input contains invalid date
- **THEN** SHALL show validation error
- **AND** SHALL apply error styling
- **AND** SHALL set aria-invalid="true"

#### Scenario: Out of range
- **WHEN** date is outside min/max range
- **THEN** SHALL show validation error
- **AND** SHALL prevent calendar selection

### Requirement: Interactive States
The component SHALL support multiple interaction states per nimbus-core standards.

#### Scenario: Disabled state
- **WHEN** disabled={true} is set
- **THEN** SHALL apply disabled styling
- **AND** SHALL disable input segments and calendar button
- **AND** SHALL prevent all interactions
- **AND** SHALL set aria-disabled="true"

#### Scenario: Read-only state
- **WHEN** readOnly={true} is set
- **THEN** SHALL display date without edit controls
- **AND** SHALL prevent editing and calendar opening
- **AND** SHALL set aria-readonly="true"

### Requirement: Size Options
The component SHALL support multiple size variants per nimbus-core standards.

#### Scenario: Size variants
- **WHEN** size prop is set
- **THEN** SHALL support: sm, md, lg
- **AND** SHALL adjust input height, padding, font size, and button sizes
- **AND** md SHALL be default size

### Requirement: ARIA Date Picker Pattern
The component SHALL implement ARIA date picker pattern per nimbus-core standards.

#### Scenario: Date field roles
- **WHEN** date input renders
- **THEN** SHALL use role="group" for segment container
- **AND** each segment SHALL be keyboard focusable
- **AND** SHALL provide accessible labels for segments

#### Scenario: Calendar dialog
- **WHEN** calendar opens
- **THEN** SHALL use role="dialog" via React Aria
- **AND** SHALL trap focus within calendar
- **AND** SHALL provide accessible grid navigation

#### Scenario: Label association
- **WHEN** label prop is provided
- **THEN** SHALL associate with date field
- **AND** SHALL use aria-labelledby

### Requirement: Internationalized Labels
The component SHALL use i18n for screen reader text per nimbus-core standards.

#### Scenario: Localized messages
- **WHEN** component renders
- **THEN** SHALL use i18n messages from date-picker.i18n.ts
- **AND** SHALL translate: enterTimeHour, enterTimeMinute, enterTimeSecond, enterTimeDayPeriod, openCalendar, clearInput

### Requirement: Multi-Slot Recipe
The component SHALL use multi-slot recipe per nimbus-core standards.

#### Scenario: Slot styling
- **WHEN** component renders
- **THEN** SHALL apply datePicker slot recipe from theme/slot-recipes/date-picker.ts
- **AND** SHALL style: root, label, inputGroup, segment, separator, calendarButton, clearButton, calendar, helperText, errorText slots
- **AND** SHALL support size variants

### Requirement: Timezone Handling
The component SHALL support timezone-aware dates.

#### Scenario: ZonedDateTime
- **WHEN** value type is ZonedDateTime
- **THEN** SHALL handle timezone conversion
- **AND** SHALL display date in specified timezone
- **AND** SHALL use React Aria's timezone utilities

### Requirement: Form Compatibility
The component SHALL integrate with HTML forms per nimbus-core standards.

#### Scenario: Form submission
- **WHEN** component is in a form
- **THEN** SHALL include ISO 8601 date string in form data
- **AND** SHALL use name prop as field name
- **AND** SHALL validate before submission
