# Specification: RangeCalendar Component

## Overview

The RangeCalendar component provides an accessible calendar grid for date range selection, following ARIA grid pattern with comprehensive keyboard navigation. It allows users to select a contiguous range of dates (start and end) with visual feedback for the entire range.

**Component:** `RangeCalendar`
**Package:** `@commercetools/nimbus`
**Type:** Multi-slot component
**React Aria:** Uses `RangeCalendar` from react-aria-components
**i18n:** Uses component-specific messages for navigation controls

## Purpose

To provide an accessible, internationalized calendar interface for selecting date ranges, enabling users to pick start and end dates with visual feedback for the entire range. The component supports keyboard navigation, screen readers, multiple months display, date constraints, and locale-aware formatting per WCAG 2.1 AA standards.

## Requirements

### Requirement: Month View
The component SHALL display calendar dates in month grid.

#### Scenario: Current month
- **WHEN** component renders without value
- **THEN** SHALL display current month
- **AND** SHALL show all dates in month
- **AND** SHALL show padding dates from previous/next months
- **AND** SHALL distinguish padding dates visually

#### Scenario: Selected range month
- **WHEN** value prop contains date range
- **THEN** SHALL display month containing range
- **AND** SHALL highlight entire range from start to end date
- **AND** SHALL visually distinguish start date, end date, and dates in between

### Requirement: Range Selection
The component SHALL support selecting a date range with start and end dates.

#### Scenario: Controlled mode
- **WHEN** value and onChange props are provided
- **THEN** value SHALL be RangeValue object with start and end DateValue objects
- **AND** SHALL highlight start date with distinctive styling
- **AND** SHALL highlight end date with distinctive styling
- **AND** SHALL highlight all dates between start and end
- **AND** SHALL call onChange with RangeValue when range is modified

#### Scenario: Uncontrolled mode
- **WHEN** defaultValue prop is provided without value
- **THEN** SHALL initialize with default range selection
- **AND** SHALL manage state internally
- **AND** SHALL call onChange when range is modified

#### Scenario: Click selection start
- **WHEN** user clicks first date cell
- **THEN** SHALL set that date as range start
- **AND** SHALL apply start date styling
- **AND** SHALL not call onChange yet (incomplete range)

#### Scenario: Click selection end
- **WHEN** user clicks second date cell after start is set
- **THEN** SHALL set that date as range end
- **AND** SHALL apply end date styling
- **AND** SHALL highlight all dates between start and end
- **AND** SHALL call onChange with complete RangeValue

#### Scenario: Range modification
- **WHEN** user clicks date with existing range selected
- **THEN** SHALL start new range from clicked date
- **AND** SHALL clear previous range styling
- **AND** SHALL wait for second click to complete new range

### Requirement: Range Highlighting
The component SHALL provide clear visual feedback for selected ranges.

#### Scenario: Start date styling
- **WHEN** range has start date
- **THEN** start date SHALL have primary background color
- **AND** SHALL have contrast text color
- **AND** SHALL have left border radius
- **AND** SHALL have no right border radius (connects to range)

#### Scenario: End date styling
- **WHEN** range has end date
- **THEN** end date SHALL have primary background color
- **AND** SHALL have contrast text color
- **AND** SHALL have right border radius
- **AND** SHALL have no left border radius (connects to range)

#### Scenario: Single day range
- **WHEN** start date equals end date
- **THEN** date SHALL have full border radius on all sides
- **AND** SHALL have primary background color
- **AND** SHALL have contrast text color

#### Scenario: Range middle dates
- **WHEN** dates are between start and end
- **THEN** SHALL have light primary background color
- **AND** SHALL have no border radius (connects range visually)
- **AND** SHALL distinguish from start/end dates

#### Scenario: Range spanning columns
- **WHEN** range spans multiple weeks
- **THEN** first date in each week SHALL have left border radius
- **AND** last date in each week SHALL have right border radius
- **AND** SHALL maintain continuous visual connection

### Requirement: Month/Year Navigation
The component SHALL provide navigation controls per nimbus-core standards.

#### Scenario: Previous/Next month navigation
- **WHEN** user clicks previous month button
- **THEN** SHALL navigate to previous month
- **AND** SHALL maintain range selection if dates are visible
- **AND** SHALL provide internationalized aria-label
- **WHEN** user clicks next month button
- **THEN** SHALL navigate to next month

#### Scenario: Previous/Next year navigation
- **WHEN** user clicks previous year button
- **THEN** SHALL navigate to same month in previous year
- **AND** SHALL provide internationalized aria-label
- **WHEN** user clicks next year button
- **THEN** SHALL navigate to same month in next year

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
- **AND** SHALL wrap to next week/month at edges
- **WHEN** user presses ArrowLeft
- **THEN** SHALL move focus to previous day
- **AND** SHALL wrap to previous week/month at edges
- **WHEN** user presses ArrowDown
- **THEN** SHALL move focus to same weekday next week
- **AND** SHALL wrap to next month at month end
- **WHEN** user presses ArrowUp
- **THEN** SHALL move focus to same weekday previous week
- **AND** SHALL wrap to previous month at month start

#### Scenario: Home and End keys
- **WHEN** user presses Home
- **THEN** SHALL move focus to first day of current week
- **WHEN** user presses End
- **THEN** SHALL move focus to last day of current week

#### Scenario: Range selection with keyboard
- **WHEN** date is focused and user presses Space or Enter
- **THEN** SHALL select that date as range start if no range exists
- **AND** SHALL select that date as range end if start exists
- **AND** SHALL call onChange handler with complete range

### Requirement: Date Range Validation
The component SHALL enforce date constraints per nimbus-core standards.

#### Scenario: Minimum date
- **WHEN** minValue prop is set
- **THEN** SHALL disable dates before minimum
- **AND** SHALL prevent range selection starting before minimum
- **AND** SHALL apply disabled styling to unavailable dates
- **AND** SHALL skip disabled dates during keyboard navigation
- **AND** SHALL prevent month navigation beyond minimum

#### Scenario: Maximum date
- **WHEN** maxValue prop is set
- **THEN** SHALL disable dates after maximum
- **AND** SHALL prevent range selection ending after maximum
- **AND** SHALL apply disabled styling to unavailable dates
- **AND** SHALL skip disabled dates during keyboard navigation
- **AND** SHALL prevent month navigation beyond maximum

#### Scenario: Unavailable dates in range
- **WHEN** isDateUnavailable function is provided
- **THEN** SHALL disable dates that return true
- **AND** SHALL apply unavailable styling
- **AND** SHALL skip during keyboard navigation
- **AND** default behavior SHALL prevent ranges containing unavailable dates

### Requirement: Non-Contiguous Range Support
The component SHALL optionally allow ranges containing unavailable dates.

#### Scenario: Allow non-contiguous ranges
- **WHEN** allowsNonContiguousRanges={true}
- **THEN** SHALL allow range selection spanning unavailable dates
- **AND** SHALL maintain visual range highlighting across gaps
- **AND** SHALL still apply disabled styling to unavailable dates
- **AND** SHALL include unavailable dates in RangeValue span

### Requirement: Multi-Month Display
The component SHALL optionally display multiple consecutive months.

#### Scenario: Visible duration configuration
- **WHEN** visibleDuration prop is set with months count
- **THEN** SHALL display specified number of consecutive months
- **AND** SHALL arrange months horizontally in grid
- **AND** SHALL show month title above each grid
- **AND** SHALL synchronize navigation across all visible months

#### Scenario: Single month paging
- **WHEN** visibleDuration is set and pageBehavior="single"
- **THEN** navigation buttons SHALL move by one month at a time
- **AND** SHALL slide visible months window by one

#### Scenario: Visible month paging
- **WHEN** visibleDuration is set and pageBehavior="visible"
- **THEN** navigation buttons SHALL move by number of visible months
- **AND** SHALL jump to completely new set of months

#### Scenario: Range across multiple months
- **WHEN** visible months > 1 and range spans months
- **THEN** SHALL highlight range continuously across month boundaries
- **AND** SHALL apply proper start/end styling
- **AND** SHALL maintain visual connection between months

### Requirement: Week Display Options
The component SHALL support week configuration per nimbus-core standards.

#### Scenario: First day of week
- **WHEN** firstDayOfWeek prop is provided
- **THEN** SHALL start week on specified day ("sun", "mon", etc.)
- **AND** SHALL adjust column headers accordingly
- **AND** SHALL override locale default

#### Scenario: Locale-based week start
- **WHEN** firstDayOfWeek is not provided
- **THEN** SHALL use locale-appropriate week start day
- **AND** SHALL adjust automatically for different locales

### Requirement: Date Highlighting
The component SHALL support highlighting special dates per nimbus-core standards.

#### Scenario: Today indicator
- **WHEN** calendar includes today's date
- **THEN** SHALL highlight today with special background styling
- **AND** SHALL distinguish from selected range
- **AND** today styling SHALL have lower priority than selection

#### Scenario: Hover state
- **WHEN** user hovers over date cell
- **THEN** SHALL show hover feedback
- **AND** SHALL apply light primary background
- **AND** SHALL apply border radius

#### Scenario: Focus indicator
- **WHEN** date receives keyboard focus
- **THEN** SHALL show focus ring indicator
- **AND** SHALL meet 3:1 contrast ratio
- **AND** SHALL be distinguishable from selection

### Requirement: Internationalization
The component SHALL format dates per locale per nimbus-core standards.

#### Scenario: Month and weekday names
- **WHEN** locale is provided via NimbusI18nProvider
- **THEN** SHALL display month names in locale language
- **AND** SHALL display weekday abbreviations in locale
- **AND** SHALL use locale-appropriate date formatting

#### Scenario: Navigation button labels
- **WHEN** component renders navigation controls
- **THEN** SHALL provide internationalized aria-labels
- **AND** SHALL use messages from range-calendar.i18n.ts
- **AND** SHALL support all Nimbus locales (en, de, es, fr-FR, pt-BR)

#### Scenario: Calendar system
- **WHEN** locale uses non-Gregorian calendar
- **THEN** SHALL support alternative calendar systems via React Aria
- **AND** SHALL display appropriate month lengths
- **AND** SHALL handle locale-specific calendar rules

### Requirement: ARIA Grid Pattern
The component SHALL implement ARIA grid pattern per nimbus-core standards.

#### Scenario: Grid structure roles
- **WHEN** calendar renders
- **THEN** calendar container SHALL have role="grid"
- **AND** week rows SHALL have role="row"
- **AND** date cells SHALL have role="gridcell"
- **AND** column headers SHALL have proper ARIA labels

#### Scenario: Date cell labels
- **WHEN** screen reader reads date
- **THEN** SHALL announce full date (e.g., "Monday, January 15, 2024")
- **AND** SHALL announce if date is range start
- **AND** SHALL announce if date is range end
- **AND** SHALL announce if date is in selected range
- **AND** SHALL announce if date is unavailable
- **AND** SHALL announce if date is today

#### Scenario: Navigation control labels
- **WHEN** navigation controls render
- **THEN** previous month button SHALL have accessible label
- **AND** next month button SHALL have accessible label
- **AND** previous year button SHALL have accessible label
- **AND** next year button SHALL have accessible label
- **AND** month/year heading SHALL be readable by screen readers

#### Scenario: Focus management
- **WHEN** component receives focus
- **THEN** SHALL focus appropriate date (start date, today, or first available)
- **AND** SHALL maintain focus during keyboard navigation
- **AND** SHALL provide visible focus indicator

### Requirement: Interactive States
The component SHALL support multiple calendar states per nimbus-core standards.

#### Scenario: Disabled calendar
- **WHEN** isDisabled={true} is set
- **THEN** SHALL disable all date selections
- **AND** SHALL disable navigation controls
- **AND** SHALL apply disabled styling to entire component
- **AND** SHALL still be focusable for accessibility

#### Scenario: Read-only calendar
- **WHEN** isReadOnly={true} is set
- **THEN** SHALL display dates without allowing selection changes
- **AND** SHALL allow navigation controls
- **AND** SHALL allow focus but prevent range modification
- **AND** SHALL display existing range normally

### Requirement: Multi-Slot Recipe
The component SHALL use multi-slot recipe per nimbus-core standards.

#### Scenario: Slot styling
- **WHEN** calendar renders
- **THEN** SHALL apply rangeCalendar slot recipe from theme/slot-recipes/range-calendar.ts
- **AND** SHALL style: root, header, grids, monthTitle, grid, gridHeader, headerCell, gridBody, bodyCell slots
- **AND** SHALL support data attributes for conditional styling (data-today, data-selected, data-selection-start, data-selection-end, data-focused, data-hovered)
- **AND** SHALL support responsive sizing via Chakra style props

#### Scenario: Range visual continuity
- **WHEN** range styling applies
- **THEN** first column cells SHALL have left border radius
- **AND** last column cells SHALL have right border radius
- **AND** middle row cells SHALL have no border radius
- **AND** SHALL create continuous visual range appearance

### Requirement: Value Format
The component SHALL provide appropriate value formats per nimbus-core standards.

#### Scenario: RangeValue structure
- **WHEN** onChange is called
- **THEN** SHALL provide RangeValue object with start and end properties
- **AND** start SHALL be CalendarDate from @internationalized/date
- **AND** end SHALL be CalendarDate from @internationalized/date
- **AND** both dates SHALL include year, month, day properties
- **AND** SHALL support conversion to ISO strings

#### Scenario: Null value handling
- **WHEN** no range is selected
- **THEN** value SHALL be null
- **AND** onChange SHALL be called with null when range is cleared
- **AND** component SHALL display no selection

### Requirement: Header Navigation Layout
The component SHALL provide month and year navigation in header.

#### Scenario: Single month header
- **WHEN** visibleDuration is 1 month (default)
- **THEN** SHALL show month navigation buttons (left/right)
- **AND** SHALL show current month name
- **AND** SHALL show year navigation buttons (left/right)
- **AND** SHALL show current year
- **AND** SHALL use separate controls for month and year

#### Scenario: Multi-month header
- **WHEN** visibleDuration is greater than 1 month
- **THEN** SHALL show range navigation buttons for all visible months
- **AND** SHALL show month range label (e.g., "January - March")
- **AND** SHALL show year navigation buttons
- **AND** SHALL synchronize navigation across all visible months

#### Scenario: Month range label
- **WHEN** multiple months are visible
- **THEN** SHALL display "StartMonth - EndMonth" or "StartMonth Year - EndMonth Year"
- **AND** SHALL format month names per locale
- **AND** SHALL update label when navigating

### Requirement: Incomplete Range Handling
The component SHALL handle partial range selection appropriately.

#### Scenario: Single date selected
- **WHEN** user has selected start date but not end date
- **THEN** SHALL highlight only start date
- **AND** SHALL apply start date styling
- **AND** SHALL not call onChange (incomplete range)
- **AND** SHALL wait for second selection

#### Scenario: Hover preview during selection
- **WHEN** start date is selected and user hovers over potential end date
- **THEN** MAY show temporary range preview
- **AND** SHALL distinguish preview from confirmed selection
- **AND** SHALL not affect actual value until click

### Requirement: Week Start Configuration
The component SHALL allow custom week start day configuration.

#### Scenario: Custom week start day
- **WHEN** firstDayOfWeek prop is set to specific day
- **THEN** SHALL start all weeks on specified day
- **AND** SHALL reorder weekday headers accordingly
- **AND** SHALL maintain proper date grid alignment
- **AND** SHALL override locale default

#### Scenario: Invalid week start day
- **WHEN** firstDayOfWeek is invalid value
- **THEN** SHALL fall back to locale default
- **OR** SHALL handle according to React Aria behavior

### Requirement: Multi-Layer Structure
The component SHALL follow multi-layered architecture per nimbus-core standards.

#### Scenario: Component composition
- **WHEN** component renders
- **THEN** SHALL wrap React Aria RangeCalendar with Chakra slot
- **AND** SHALL use RangeCalendarCustomContext for slot injection
- **AND** SHALL use RangeCalendarHeader for navigation controls
- **AND** SHALL use RangeCalendarGrids for calendar grid rendering
- **AND** SHALL follow pattern: RAC → Chakra → Nimbus

#### Scenario: Style prop handling
- **WHEN** component receives props
- **THEN** SHALL split recipe variant props first
- **AND** SHALL extract Chakra style props second
- **AND** SHALL forward style props to RangeCalendarRootSlot
- **AND** SHALL forward functional props to React Aria RangeCalendar
