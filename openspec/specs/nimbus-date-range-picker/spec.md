# Specification: DateRangePicker Component

## Overview

The DateRangePicker component provides an accessible date range selection control combining dual text inputs with calendar popup, following ARIA date picker pattern. It allows users to select a start and end date through either direct input or visual calendar selection.

**Component:** `DateRangePicker`
**Package:** `@commercetools/nimbus`
**Type:** Multi-slot component
**React Aria:** Uses `DateRangePicker` from react-aria-components
**i18n:** 13 messages (clearSelection, openCalendar, clearInput, startTime, startTimeHour, startTimeHourMinute, startTimeHourMinuteSecond, endTime, endTimeHour, endTimeHourMinute, endTimeHourMinuteSecond, startTimeLabel, endTimeLabel)

## Purpose

To provide an accessible, internationalized date range picker interface combining dual date inputs with range calendar popup, enabling users to select start and end dates with optional time selection, keyboard navigation, screen reader support, and locale-aware formatting per WCAG 2.1 AA standards.

## Requirements

### Requirement: Date Range Value Handling
The component SHALL manage date range values using RangeValue objects.

#### Scenario: Controlled mode
- **WHEN** value and onChange props are provided
- **THEN** value SHALL be RangeValue<DateValue> object with start and end properties
- **AND** start SHALL be CalendarDate, CalendarDateTime, or ZonedDateTime
- **AND** end SHALL be CalendarDate, CalendarDateTime, or ZonedDateTime
- **AND** SHALL call onChange with new RangeValue on selection
- **AND** SHALL not update internal state

#### Scenario: Uncontrolled mode
- **WHEN** defaultValue prop is provided without value
- **THEN** SHALL initialize with default date range
- **AND** SHALL manage state internally
- **AND** optional onChange SHALL receive updates

#### Scenario: Incomplete range handling
- **WHEN** only start date or end date is provided
- **THEN** clear button SHALL be hidden
- **AND** clear button SHALL have aria-hidden="true"
- **AND** SHALL allow calendar selection to complete range

### Requirement: Dual Date Input Fields
The component SHALL provide separate text inputs for start and end dates.

#### Scenario: Start date input
- **WHEN** date range picker renders
- **THEN** SHALL show start date input with slot="start"
- **AND** SHALL show date segments for month, day, year
- **AND** each segment SHALL be individually editable
- **AND** Tab key SHALL move between segments
- **AND** segments SHALL use locale-appropriate order

#### Scenario: End date input
- **WHEN** date range picker renders
- **THEN** SHALL show end date input with slot="end"
- **AND** SHALL show date segments for month, day, year
- **AND** SHALL be positioned after start date with en dash separator
- **AND** separator SHALL be "–" (en dash) with aria-hidden="true"

#### Scenario: Date input keyboard interaction
- **WHEN** segment is focused
- **THEN** typing numbers SHALL update segment value
- **AND** ArrowUp/Down SHALL increment/decrement value
- **AND** SHALL cycle through valid values
- **AND** SHALL auto-advance to next segment when complete
- **AND** SHALL navigate between start and end inputs via Tab

#### Scenario: Locale formatting
- **WHEN** locale prop is provided via React Aria context
- **THEN** SHALL format dates according to locale
- **AND** SHALL use locale-specific segment order (e.g., DD/MM/YYYY vs MM/DD/YYYY)
- **AND** SHALL use locale-specific separators
- **AND** SHALL apply to both start and end inputs

### Requirement: Range Calendar Popup
The component SHALL provide range calendar popup for visual date range selection.

#### Scenario: Open calendar
- **WHEN** user clicks calendar button
- **THEN** SHALL open calendar popover
- **AND** SHALL display RangeCalendar component
- **AND** SHALL show current month or selected range's month
- **AND** SHALL position popup at "bottom end" placement
- **AND** calendar button SHALL use i18n aria-label "Open calendar"

#### Scenario: Calendar button behavior
- **WHEN** calendar button is pressed
- **THEN** SHALL blur any active input segment
- **AND** SHALL toggle calendar popover open state
- **AND** SHALL use CalendarMonth icon
- **AND** SHALL be positioned in trigger slot overlay

#### Scenario: Date range selection
- **WHEN** user clicks dates in calendar
- **THEN** first click SHALL set start date
- **AND** second click SHALL set end date
- **AND** SHALL populate both inputs with selected dates
- **AND** SHALL highlight range between dates
- **AND** SHALL call onChange handler with RangeValue

#### Scenario: Calendar close behavior
- **WHEN** granularity is "day"
- **THEN** SHALL close calendar after complete range selection (default behavior)
- **AND** shouldCloseOnSelect prop SHALL control this behavior
- **WHEN** granularity includes time units (hour, minute, second)
- **THEN** SHALL NOT close calendar automatically
- **AND** SHALL allow time input in footer

### Requirement: Time Input (DateTime mode)
The component SHALL optionally support time input for both start and end dates.

#### Scenario: DateTime mode activation
- **WHEN** granularity prop includes time units
- **THEN** SHALL show time input footer in calendar popover
- **AND** SHALL display separate time inputs for start and end
- **AND** SHALL support hour, minute, second fields based on granularity
- **AND** SHALL support 12-hour or 24-hour format based on locale or hourCycle prop

#### Scenario: Start time input
- **WHEN** time input footer renders
- **THEN** SHALL show start time input with slot="startTimeInput"
- **AND** SHALL display label "Start time" from i18n
- **AND** SHALL update start date time value on change
- **AND** SHALL use appropriate aria-label based on granularity
- **AND** aria-label SHALL use startTime, startTimeHour, startTimeHourMinute, or startTimeHourMinuteSecond message

#### Scenario: End time input
- **WHEN** time input footer renders
- **THEN** SHALL show end time input with slot="endTimeInput"
- **AND** SHALL display label "End time" from i18n
- **AND** SHALL update end date time value on change
- **AND** SHALL use appropriate aria-label based on granularity
- **AND** aria-label SHALL use endTime, endTimeHour, endTimeHourMinute, or endTimeHourMinuteSecond message

#### Scenario: Time input auto-focus
- **WHEN** user selects complete date range from calendar
- **THEN** SHALL auto-focus first time input segment
- **AND** SHALL only focus if no time segment currently has focus
- **AND** SHALL use 50ms delay to ensure DOM readiness
- **AND** SHALL focus first spinbutton role element in time input container

#### Scenario: Time value synchronization
- **WHEN** date range selection changes
- **THEN** SHALL extract time values from start and end dates
- **AND** SHALL pass time values to respective TimeInput components
- **AND** SHALL update RangeValue when time inputs change
- **AND** SHALL preserve existing time when only date changes

### Requirement: Date Range Constraints
The component SHALL enforce date range constraints.

#### Scenario: Minimum date
- **WHEN** minValue prop is set
- **THEN** SHALL prevent selection of dates before minimum
- **AND** SHALL disable dates before minimum in calendar
- **AND** SHALL validate both start and end dates against minimum

#### Scenario: Maximum date
- **WHEN** maxValue prop is set
- **THEN** SHALL prevent selection of dates after maximum
- **AND** SHALL disable dates after maximum in calendar
- **AND** SHALL validate both start and end dates against maximum

#### Scenario: Unavailable dates
- **WHEN** isDateUnavailable function is provided
- **THEN** SHALL disable dates that return true
- **AND** SHALL skip unavailable dates during keyboard navigation in calendar
- **AND** SHALL pass function to RangeCalendar component

### Requirement: Clear Functionality
The component SHALL provide date range clearing capability.

#### Scenario: Clear button display
- **WHEN** both start and end dates have complete values
- **THEN** SHALL show clear button
- **AND** SHALL use Close icon
- **AND** SHALL position button in trigger slot before calendar button
- **AND** clear button SHALL use i18n aria-label "Clear input value"

#### Scenario: Clear button action
- **WHEN** clear button is clicked
- **THEN** SHALL clear both start and end date values
- **AND** SHALL call onChange with null
- **AND** SHALL call dateRangePickerState.setValue(null)
- **AND** SHALL hide clear button after clearing

#### Scenario: Clear button hidden state
- **WHEN** range is incomplete (missing start or end date)
- **THEN** SHALL apply style display: none to clear button
- **AND** SHALL set aria-hidden="true"
- **AND** SHALL not be accessible to screen readers or keyboard

### Requirement: Validation
The component SHALL validate date range input.

#### Scenario: Required validation
- **WHEN** required={true} is set
- **THEN** SHALL require complete date range selection
- **AND** SHALL show required indicator
- **AND** SHALL set aria-required="true"
- **AND** SHALL apply to both start and end inputs

#### Scenario: Invalid date
- **WHEN** input contains invalid date
- **THEN** SHALL show validation error
- **AND** SHALL apply error styling to group container
- **AND** SHALL set data-invalid="true" attribute
- **AND** SHALL increase border width and change color to critical

#### Scenario: Range validation
- **WHEN** end date is before start date
- **THEN** SHALL show validation error
- **AND** SHALL set data-invalid="true"
- **AND** SHALL apply error styling

### Requirement: Interactive States
The component SHALL support multiple interaction states per nimbus-core standards.

#### Scenario: Disabled state
- **WHEN** disabled={true} is set
- **THEN** SHALL apply disabled styling
- **AND** SHALL disable both date inputs
- **AND** SHALL disable calendar and clear buttons
- **AND** SHALL prevent all interactions
- **AND** SHALL set aria-disabled="true"

#### Scenario: Read-only state
- **WHEN** readOnly={true} is set
- **THEN** SHALL display date range without edit controls
- **AND** SHALL prevent editing and calendar opening
- **AND** SHALL set aria-readonly="true"
- **AND** SHALL apply to both inputs

#### Scenario: Focus state
- **WHEN** any input segment receives focus
- **THEN** SHALL apply focus ring to group container
- **AND** focus ring SHALL use _focusWithin styling
- **AND** SHALL meet 3:1 contrast ratio
- **AND** SHALL use focus ring tokens (width, color, style, offset)

#### Scenario: Hover state
- **WHEN** user hovers over input group
- **THEN** SHALL change background to primary.2
- **AND** SHALL apply to entire group container
- **AND** SHALL not apply when disabled

### Requirement: Size Variants
The component SHALL support multiple size variants per nimbus-core standards.

#### Scenario: Size variants
- **WHEN** size prop is set
- **THEN** SHALL support: sm, md
- **AND** SHALL adjust group height (sm: 800, md: 1000)
- **AND** SHALL adjust button sizes (sm: 2xs, md: xs)
- **AND** SHALL adjust trigger button positioning
- **AND** SHALL forward size to DateInput components
- **AND** md SHALL be default size

### Requirement: Visual Variants
The component SHALL support multiple visual variants per nimbus-core standards.

#### Scenario: Solid variant
- **WHEN** variant="solid" (default)
- **THEN** group SHALL have neutral.1 background
- **AND** SHALL have visible border (neutral.7)
- **AND** SHALL show clear visual boundaries

#### Scenario: Ghost variant
- **WHEN** variant="ghost"
- **THEN** group SHALL have transparent background
- **AND** SHALL maintain padding and layout
- **AND** _hover SHALL change to primary.2 background

### Requirement: Accessibility
The component SHALL implement ARIA date picker pattern per nimbus-core standards.

#### Scenario: Date field roles
- **WHEN** date range picker renders
- **THEN** both date inputs SHALL use role="group" for segment containers
- **AND** each segment SHALL be keyboard focusable
- **AND** SHALL provide accessible labels for segments
- **AND** SHALL announce date range context to screen readers

#### Scenario: Calendar dialog
- **WHEN** calendar opens
- **THEN** SHALL use role="dialog" for popover
- **AND** SHALL trap focus within calendar and time inputs
- **AND** SHALL provide accessible grid navigation
- **AND** Escape key SHALL close calendar

#### Scenario: Button accessibility
- **WHEN** buttons render
- **THEN** calendar button SHALL have accessible label "Open calendar"
- **AND** clear button SHALL have accessible label "Clear input value"
- **AND** buttons SHALL be keyboard accessible
- **AND** buttons SHALL have proper focus indicators

#### Scenario: Time input accessibility
- **WHEN** time inputs render
- **THEN** start time SHALL have label "Start time" visible
- **AND** start time input SHALL have appropriate aria-label based on granularity
- **AND** end time SHALL have label "End time" visible
- **AND** end time input SHALL have appropriate aria-label based on granularity
- **AND** each time segment SHALL have role="spinbutton"

### Requirement: Internationalized Labels
The component SHALL use i18n for all user-facing text per nimbus-core standards.

#### Scenario: Localized messages
- **WHEN** component renders
- **THEN** SHALL use i18n messages from date-range-picker.i18n.ts
- **AND** SHALL translate: clearSelection, openCalendar, clearInput
- **AND** SHALL translate: startTime, startTimeHour, startTimeHourMinute, startTimeHourMinuteSecond
- **AND** SHALL translate: endTime, endTimeHour, endTimeHourMinute, endTimeHourMinuteSecond
- **AND** SHALL translate: startTimeLabel, endTimeLabel
- **AND** SHALL support all Nimbus locales (en, de, es, fr-FR, pt-BR)

### Requirement: Multi-Slot Recipe
The component SHALL use multi-slot recipe per nimbus-core standards.

#### Scenario: Slot styling
- **WHEN** component renders
- **THEN** SHALL apply dateRangePicker slot recipe from theme/slot-recipes/date-range-picker.ts
- **AND** SHALL style: root, group, trigger, popover, calendar slots
- **AND** SHALL support size variants (sm, md)
- **AND** SHALL support visual variants (solid, ghost)

#### Scenario: Trigger overlay positioning
- **WHEN** trigger buttons render
- **THEN** SHALL position absolutely within group
- **AND** SHALL use right: 400 positioning
- **AND** SHALL adjust top position based on size (sm: 50, md: 100)
- **AND** clear button SHALL appear before calendar button

#### Scenario: Popover animations
- **WHEN** popover opens
- **THEN** SHALL animate with fade-in and scale-in
- **AND** animation duration SHALL be "fast"
- **WHEN** popover closes
- **THEN** SHALL animate with fade-out and scale-out
- **AND** animation duration SHALL be "faster"

### Requirement: Timezone Support
The component SHALL support timezone-aware dates.

#### Scenario: ZonedDateTime
- **WHEN** value type is ZonedDateTime
- **THEN** SHALL handle timezone conversion
- **AND** SHALL display dates in specified timezone
- **AND** SHALL forward hideTimeZone prop to DateInput and TimeInput components
- **AND** SHALL use React Aria's timezone utilities

#### Scenario: Hide timezone option
- **WHEN** hideTimeZone={true} is set
- **THEN** SHALL hide timezone information in date inputs
- **AND** SHALL hide timezone in time inputs
- **AND** SHALL forward to both start and end inputs
- **AND** SHALL forward to footer time inputs

### Requirement: Hour Cycle Configuration
The component SHALL support 12-hour and 24-hour time formats.

#### Scenario: Hour cycle prop
- **WHEN** hourCycle prop is set to 12 or 24
- **THEN** SHALL forward to DateInput components
- **AND** SHALL forward to TimeInput components in footer
- **AND** SHALL override locale default
- **AND** SHALL apply to both start and end time inputs

#### Scenario: AM/PM display
- **WHEN** hourCycle is 12 or locale uses 12-hour format
- **THEN** SHALL show AM/PM selector in time inputs
- **AND** SHALL use day period segment in date inputs (if time included)

### Requirement: Popover State Management
The component SHALL support controlled and uncontrolled popover state.

#### Scenario: Controlled popover
- **WHEN** isOpen and onOpenChange props are provided
- **THEN** SHALL control popover open state externally
- **AND** SHALL call onOpenChange when state changes
- **AND** SHALL not manage open state internally

#### Scenario: Uncontrolled popover
- **WHEN** defaultOpen prop is provided
- **THEN** SHALL initialize popover state
- **AND** SHALL manage open state internally
- **AND** optional onOpenChange SHALL receive updates

### Requirement: Form Integration
The component SHALL integrate with HTML forms per nimbus-core standards.

#### Scenario: Form submission
- **WHEN** component is in a form
- **THEN** SHALL include start and end dates in form data as ISO 8601 strings
- **AND** SHALL use name prop as field name base
- **AND** SHALL validate before submission
- **AND** SHALL forward form-related props to React Aria DateRangePicker

### Requirement: Style Props Support
The component SHALL support Chakra style props per nimbus-core standards.

#### Scenario: Style props forwarding
- **WHEN** component receives Chakra style props
- **THEN** SHALL extract style props using extractStyleProps utility
- **AND** SHALL forward to DateRangePickerRootSlot
- **AND** SHALL support spacing props (margin, padding)
- **AND** SHALL support layout props (width, height, display)
- **AND** SHALL support color props

### Requirement: Multi-Layer Component Structure
The component SHALL follow multi-layered architecture per nimbus-core standards.

#### Scenario: Component composition
- **WHEN** component renders
- **THEN** SHALL wrap React Aria DateRangePicker with DateRangePickerRootSlot
- **AND** SHALL use DateRangePickerCustomContext for slot injection
- **AND** SHALL use DateRangePickerGroupSlot for input container
- **AND** SHALL use DateRangePickerTriggerSlot for buttons
- **AND** SHALL use DateRangePickerPopoverSlot for calendar container
- **AND** SHALL use DateRangePickerCalendarSlot for RangeCalendar
- **AND** SHALL follow pattern: RAC → Chakra Slots → Nimbus

#### Scenario: Prop handling sequence
- **WHEN** component receives props
- **THEN** SHALL split recipe variant props first (size, variant)
- **AND** SHALL extract style props second
- **AND** SHALL forward style props to root slot
- **AND** SHALL forward functional props to React Aria DateRangePicker
- **AND** SHALL use useSlotRecipe hook for recipe management

### Requirement: Custom Context Provider
The component SHALL use custom context for slot-based prop injection.

#### Scenario: Button context slots
- **WHEN** DateRangePickerCustomContext renders
- **THEN** SHALL provide calendarToggle slot for calendar button
- **AND** calendarToggle SHALL blur active element on press
- **AND** SHALL provide clear slot for clear button
- **AND** clear slot SHALL call setValue(null) on press
- **AND** clear slot SHALL hide when range is incomplete

#### Scenario: TimeField context slots
- **WHEN** DateRangePickerCustomContext renders
- **THEN** SHALL provide startTimeInput slot for start time
- **AND** startTimeInput SHALL update start date time value
- **AND** SHALL provide endTimeInput slot for end time
- **AND** endTimeInput SHALL update end date time value
- **AND** SHALL extract time values from DateValue objects

#### Scenario: Context value management
- **WHEN** custom context manages time values
- **THEN** SHALL check if date has hour property to determine time support
- **AND** SHALL use date.set() to update time components
- **AND** SHALL preserve date components when updating time
- **AND** SHALL call dateRangePickerState.setValue() with new RangeValue

### Requirement: Date Input Styling
The component SHALL style DateInput components consistently.

#### Scenario: Plain variant inputs
- **WHEN** DateInput components render
- **THEN** both SHALL use variant="plain"
- **AND** SHALL have width="auto"
- **AND** SHALL integrate seamlessly into group container
- **AND** SHALL share size from parent

#### Scenario: Input separator
- **WHEN** separator renders between inputs
- **THEN** SHALL use en dash character "–"
- **AND** SHALL have aria-hidden="true"
- **AND** SHALL use neutral.11 color
- **AND** SHALL have userSelect="none"
- **AND** SHALL use slot={null} to prevent React Aria slot conflicts
- **AND** SHALL use px="150" spacing

### Requirement: Close on Select Behavior
The component SHALL intelligently control calendar close behavior.

#### Scenario: Day granularity close behavior
- **WHEN** granularity="day"
- **THEN** SHALL respect shouldCloseOnSelect prop value
- **AND** default behavior SHALL close on complete range selection
- **AND** user can override with shouldCloseOnSelect prop

#### Scenario: Time granularity close behavior
- **WHEN** granularity includes time units
- **THEN** SHALL force shouldCloseOnSelect to false
- **AND** SHALL keep calendar open for time input
- **AND** SHALL override any prop value
- **AND** user must manually close or press Escape
