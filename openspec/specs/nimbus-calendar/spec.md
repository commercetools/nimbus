# Specification: Calendar Component

## Overview

The Calendar component provides an accessible calendar grid for date selection, following ARIA grid pattern with comprehensive keyboard navigation.

**Component:** `Calendar`
**Package:** `@commercetools/nimbus`
**Type:** Multi-slot component
**React Aria:** Uses `Calendar` from react-aria-components
**i18n:** Shares messages with DatePicker component

## Purpose

The Calendar component enables users to navigate through dates and select specific dates in an accessible, keyboard-friendly manner. It provides a grid-based month view with support for date constraints, multi-month display, internationalization, and comprehensive ARIA labeling for screen reader users.

## Requirements

### Requirement: Month View
The component SHALL display calendar dates in month grid.

#### Scenario: Current month
- **WHEN** component renders without value
- **THEN** SHALL display current month
- **AND** SHALL show all dates in month
- **AND** SHALL show padding dates from previous/next months
- **AND** SHALL distinguish padding dates visually

#### Scenario: Selected date month
- **WHEN** value prop is provided
- **THEN** SHALL display month containing selected date
- **AND** SHALL highlight selected date

### Requirement: Single Date Selection
The component SHALL support selecting individual dates.

#### Scenario: Controlled mode
- **WHEN** value and onChange props are provided
- **THEN** value SHALL be CalendarDate object
- **AND** SHALL highlight selected date
- **AND** SHALL call onChange when date is selected

#### Scenario: Uncontrolled mode
- **WHEN** defaultValue prop is provided without value
- **THEN** SHALL initialize with default selection
- **AND** SHALL manage state internally

#### Scenario: Click selection
- **WHEN** user clicks date cell
- **THEN** SHALL select that date
- **AND** SHALL call onChange with CalendarDate object
- **AND** SHALL apply selected styling

### Requirement: Month/Year Navigation
The component SHALL provide navigation controls.

#### Scenario: Previous/Next month
- **WHEN** user clicks previous month button
- **THEN** SHALL navigate to previous month
- **AND** SHALL maintain or clear selection as appropriate
- **WHEN** user clicks next month button
- **THEN** SHALL navigate to next month

#### Scenario: Month/Year selector
- **WHEN** user clicks month/year header
- **THEN** SHALL show month/year picker
- **AND** SHALL allow jumping to any month/year
- **AND** SHALL support keyboard navigation in picker

#### Scenario: Keyboard month navigation
- **WHEN** user presses PageUp
- **THEN** SHALL navigate to previous month
- **WHEN** user presses PageDown
- **THEN** SHALL navigate to next month
- **WHEN** user presses Shift+PageUp
- **THEN** SHALL navigate to previous year
- **WHEN** user presses Shift+PageDown
- **THEN** SHALL navigate to next year

### Requirement: Grid Navigation
The component SHALL support 2D keyboard navigation per nimbus-core standards.

#### Scenario: Arrow key navigation
- **WHEN** date has focus and user presses ArrowRight
- **THEN** SHALL move focus to next day
- **WHEN** user presses ArrowLeft
- **THEN** SHALL move focus to previous day
- **WHEN** user presses ArrowDown
- **THEN** SHALL move focus to same weekday next week
- **WHEN** user presses ArrowUp
- **THEN** SHALL move focus to same weekday previous week
- **AND** SHALL wrap to previous/next month at edges

#### Scenario: Home and End keys
- **WHEN** user presses Home
- **THEN** SHALL move focus to first day of current week
- **WHEN** user presses End
- **THEN** SHALL move focus to last day of current week

#### Scenario: Date selection key
- **WHEN** date is focused and user presses Space or Enter
- **THEN** SHALL select that date
- **AND** SHALL call onChange handler

### Requirement: Date Range Validation
The component SHALL enforce date constraints.

#### Scenario: Minimum date
- **WHEN** minValue prop is set
- **THEN** SHALL disable dates before minimum
- **AND** SHALL apply disabled styling
- **AND** SHALL skip disabled dates during navigation
- **AND** SHALL prevent month navigation beyond minimum

#### Scenario: Maximum date
- **WHEN** maxValue prop is set
- **THEN** SHALL disable dates after maximum
- **AND** SHALL apply disabled styling
- **AND** SHALL skip disabled dates during navigation
- **AND** SHALL prevent month navigation beyond maximum

#### Scenario: Unavailable dates
- **WHEN** isDateUnavailable function is provided
- **THEN** SHALL disable dates that return true
- **AND** SHALL apply unavailable styling
- **AND** SHALL skip during keyboard navigation

### Requirement: Week Configuration
The component SHALL support week display options.

#### Scenario: Week numbers
- **WHEN** showWeekNumbers={true}
- **THEN** SHALL display week numbers in left column
- **AND** SHALL use ISO week numbering
- **AND** SHALL format according to locale

#### Scenario: First day of week
- **WHEN** locale is provided (via React Aria context)
- **THEN** SHALL start week on locale-appropriate day
- **AND** SHALL adjust column headers accordingly

### Requirement: Multi-Month Display
The component SHALL optionally display multiple consecutive months.

#### Scenario: Visible months
- **WHEN** visibleMonths prop is set
- **THEN** SHALL display specified number of months
- **AND** SHALL arrange months horizontally or vertically
- **AND** navigation SHALL move by one month at a time

### Requirement: Date Highlighting
The component SHALL support highlighting special dates.

#### Scenario: Today indicator
- **WHEN** calendar includes today's date
- **THEN** SHALL highlight today with special styling
- **AND** SHALL distinguish from selected date

#### Scenario: Focused date
- **WHEN** date receives keyboard focus
- **THEN** SHALL show focus indicator
- **AND** SHALL meet 3:1 contrast ratio

### Requirement: Internationalization
The component SHALL format dates per locale per nimbus-core standards.

#### Scenario: Month and weekday names
- **WHEN** locale is provided
- **THEN** SHALL display month name in locale language
- **AND** SHALL display weekday abbreviations in locale
- **AND** SHALL use locale-appropriate date formatting

#### Scenario: Calendar system
- **WHEN** locale uses non-Gregorian calendar
- **THEN** SHALL support alternative calendar systems via React Aria
- **AND** SHALL display appropriate month lengths
- **AND** SHALL handle locale-specific holidays

### Requirement: ARIA Grid Pattern
The component SHALL implement ARIA grid pattern per nimbus-core standards.

#### Scenario: Grid roles
- **WHEN** calendar renders
- **THEN** calendar SHALL have role="grid"
- **AND** week rows SHALL have role="row"
- **AND** date cells SHALL have role="gridcell"
- **AND** column headers SHALL use proper ARIA labels

#### Scenario: Date labels
- **WHEN** screen reader reads date
- **THEN** SHALL announce full date (e.g., "Monday, January 15, 2024")
- **AND** SHALL announce selection state
- **AND** SHALL announce availability state

#### Scenario: Navigation labels
- **WHEN** navigation controls render
- **THEN** previous button SHALL have accessible label
- **AND** next button SHALL have accessible label
- **AND** month/year header SHALL be readable

### Requirement: Interactive States
The component SHALL support multiple calendar states per nimbus-core standards.

#### Scenario: Disabled calendar
- **WHEN** disabled={true} is set
- **THEN** SHALL disable all date selections
- **AND** SHALL disable navigation
- **AND** SHALL apply disabled styling

#### Scenario: Read-only calendar
- **WHEN** readOnly={true} is set
- **THEN** SHALL display dates without allowing selection
- **AND** SHALL allow navigation
- **AND** SHALL allow focus but prevent changes

### Requirement: Multi-Slot Recipe
The component SHALL use multi-slot recipe per nimbus-core standards.

#### Scenario: Slot styling
- **WHEN** calendar renders
- **THEN** SHALL apply calendar slot recipe from theme/slot-recipes/calendar.ts
- **AND** SHALL style: root, header, heading, prevButton, nextButton, grid, weekdayHeader, cell, today, selected, unavailable, outside slots
- **AND** SHALL support responsive sizing

### Requirement: Value Format
The component SHALL provide appropriate value formats.

#### Scenario: CalendarDate value
- **WHEN** onChange is called
- **THEN** SHALL provide CalendarDate object from @internationalized/date
- **AND** SHALL include year, month, day properties
- **AND** SHALL support conversion to ISO string
