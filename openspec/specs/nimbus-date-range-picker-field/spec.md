# Specification: DateRangePickerField Component

## Overview

The DateRangePickerField component is a pre-composed field pattern that combines DateRangePicker with FormField to provide a complete, accessible date range selection form field with an intuitive flat API. It encapsulates label, hint text, error messaging, validation feedback, dual date inputs, calendar popup, and range selection functionality in a single component, reducing boilerplate code for common date range input scenarios.

**Component:** `DateRangePickerField`
**Package:** `@commercetools/nimbus`
**Type:** Pattern component (pre-composed field wrapper)
**Pattern:** Combines FormField + DateRangePicker composition
**Location:** `packages/nimbus/src/patterns/fields/date-range-picker-field/`

## Purpose

Provide a simplified, high-level API for creating complete date range selection form fields without manually composing FormField and DateRangePicker components. Offers an ergonomic interface for date range use cases including booking dates, report periods, event scheduling, and date filtering while maintaining full accessibility, internationalization, and error handling capabilities.

## Requirements

### Requirement: Component Composition
The component SHALL compose FormField.Root, FormField.Label, FormField.Input, FormField.Description, FormField.Error, FormField.InfoBox, and DateRangePicker.

#### Scenario: Component structure
- **WHEN** DateRangePickerField renders
- **THEN** SHALL render FormField.Root as outer wrapper
- **AND** SHALL render FormField.Label containing label prop
- **AND** SHALL render FormField.Input wrapping DateRangePicker component
- **AND** SHALL pass all DateRangePicker-specific props to DateRangePicker element
- **AND** SHALL pass all FormField-specific props to FormField.Root

#### Scenario: Internal composition
- **WHEN** component renders
- **THEN** DateRangePicker SHALL be wrapped in FormField.Input
- **AND** FormField SHALL handle ARIA associations automatically
- **AND** FormField SHALL coordinate label, input, description, and error rendering
- **AND** DateRangePicker SHALL receive field state from FormField via props cloning

#### Scenario: Single-component interface
- **WHEN** developer uses DateRangePickerField
- **THEN** SHALL accept flat props API (no nested components required)
- **AND** SHALL eliminate need for manual FormField composition
- **AND** SHALL provide same functionality as FormField + DateRangePicker combination
- **AND** SHALL be drop-in replacement for common date range field patterns

### Requirement: Label Prop and Rendering
The component SHALL require a label prop and render it via FormField.Label per nimbus-core standards.

#### Scenario: Label prop requirement
- **WHEN** DateRangePickerField is instantiated
- **THEN** label prop SHALL be required (TypeScript enforces)
- **AND** label SHALL accept ReactNode (string or JSX)
- **AND** component SHALL NOT render without label (accessibility requirement)

#### Scenario: Label rendering
- **WHEN** label prop is provided
- **THEN** SHALL render via FormField.Label component
- **AND** SHALL automatically associate with date range input group via aria-labelledby
- **AND** label SHALL be clickable to focus first date segment
- **AND** label element SHALL use semantic labeling

#### Scenario: Required indicator
- **WHEN** isRequired={true} is set
- **THEN** label SHALL display asterisk (*) indicator
- **AND** asterisk SHALL be styled per FormField recipe
- **AND** date range input group SHALL have aria-required="true"
- **AND** FormField SHALL handle required indicator rendering

### Requirement: Description Prop Support
The component SHALL support optional description prop for helper text per nimbus-core standards.

#### Scenario: Description rendering
- **WHEN** description prop is provided
- **THEN** SHALL render via FormField.Description component
- **AND** SHALL display below date range input element
- **AND** SHALL associate with input group via aria-describedby
- **AND** SHALL accept ReactNode (string or JSX)

#### Scenario: Description omission
- **WHEN** description prop is not provided
- **THEN** SHALL NOT render FormField.Description element
- **AND** SHALL not add description to aria-describedby
- **AND** component SHALL render without description text

#### Scenario: Description with errors
- **WHEN** both description and errors are present
- **THEN** SHALL render both description and error messages
- **AND** input group aria-describedby SHALL reference both elements
- **AND** FormField SHALL coordinate both associations

### Requirement: Info Prop for Contextual Help
The component SHALL support optional info prop for info box popover per nimbus-core standards.

#### Scenario: Info box rendering
- **WHEN** info prop is provided
- **THEN** SHALL render via FormField.InfoBox component
- **AND** SHALL display help icon button next to label
- **AND** info content SHALL appear in popover on button click
- **AND** SHALL accept ReactNode for info content

#### Scenario: Info box omission
- **WHEN** info prop is not provided
- **THEN** SHALL NOT render FormField.InfoBox
- **AND** SHALL NOT render help icon button
- **AND** label SHALL render without info trigger

#### Scenario: Info box accessibility
- **WHEN** info box is present and opened
- **THEN** info content SHALL be associated with input via aria-describedby
- **AND** info button SHALL have appropriate aria-label
- **AND** popover SHALL be keyboard accessible (Enter/Space to open, Escape to close)

### Requirement: Error Handling with FieldErrors
The component SHALL support errors prop using FieldErrors format with touched state per nimbus-core standards.

#### Scenario: Errors prop format
- **WHEN** errors prop is provided
- **THEN** SHALL accept FieldErrorsData type (Record<string, boolean>)
- **AND** SHALL support UI-Kit error format for compatibility
- **AND** SHALL only render truthy error values
- **AND** SHALL support all FieldErrorTypes (missing, invalid, format, etc.)

#### Scenario: Touched state control
- **WHEN** errors and touched props are provided
- **THEN** errors SHALL only display when touched={true}
- **AND** touched={false} SHALL hide error messages
- **AND** default touched value SHALL be false
- **AND** allows developers to control when validation errors appear

#### Scenario: Error rendering
- **WHEN** touched={true} and errors contain truthy values
- **THEN** SHALL render FormField.Error wrapping FieldErrors component
- **AND** FieldErrors SHALL render localized error messages
- **AND** SHALL display error icon with each message
- **AND** errors SHALL be associated with input group via aria-describedby

#### Scenario: Error omission
- **WHEN** touched={false} OR errors is undefined OR all errors are false
- **THEN** SHALL NOT render FormField.Error element
- **AND** SHALL NOT render FieldErrors component
- **AND** field SHALL not be in invalid state

#### Scenario: Custom error rendering
- **WHEN** renderError prop is provided
- **THEN** SHALL pass renderError to FieldErrors component
- **AND** renderError function SHALL receive error key
- **AND** renderError SHALL allow custom error message rendering
- **AND** SHALL override default localized messages when provided

### Requirement: Validation State Management
The component SHALL manage validation states and propagate to FormField per nimbus-core standards.

#### Scenario: Invalid state determination
- **WHEN** component renders
- **THEN** SHALL calculate invalid state as: (touched && hasErrors) || isInvalid
- **AND** hasErrors SHALL be true when errors object has truthy values
- **AND** isInvalid prop SHALL allow manual control of invalid state
- **AND** FormField.Root SHALL receive computed isInvalid value

#### Scenario: Required state
- **WHEN** isRequired prop is set
- **THEN** SHALL pass isRequired to FormField.Root
- **AND** FormField SHALL display required indicator in label
- **AND** DateRangePicker SHALL receive isRequired via props cloning
- **AND** date range input group SHALL have aria-required="true"

#### Scenario: Disabled state
- **WHEN** isDisabled prop is set
- **THEN** SHALL pass isDisabled to FormField.Root
- **AND** DateRangePicker SHALL receive isDisabled and be non-interactive
- **AND** date segments SHALL be disabled
- **AND** calendar button SHALL be disabled
- **AND** clear button SHALL be disabled
- **AND** FormField SHALL apply disabled styling

#### Scenario: Read-only state
- **WHEN** isReadOnly prop is set
- **THEN** SHALL pass isReadOnly to FormField.Root
- **AND** DateRangePicker SHALL receive isReadOnly
- **AND** date segments SHALL be focusable but non-editable
- **AND** date segments SHALL have readonly attribute
- **AND** calendar button SHALL be disabled in read-only state
- **AND** clear button SHALL be disabled in read-only state

### Requirement: DateRangePicker Props Passthrough
The component SHALL accept and forward all DateRangePicker props per nimbus-core standards.

#### Scenario: Value and onChange
- **WHEN** value and onChange props are provided
- **THEN** SHALL pass to DateRangePicker for controlled component pattern
- **AND** value SHALL be DateRange object with start and end properties
- **AND** start and end SHALL be CalendarDate, CalendarDateTime, or ZonedDateTime
- **AND** onChange SHALL receive DateRange object (not event)
- **AND** DateRangePicker SHALL update range on user input or calendar selection
- **AND** controlled pattern SHALL work as expected

#### Scenario: DefaultValue for uncontrolled mode
- **WHEN** defaultValue prop is provided without value
- **THEN** SHALL pass to DateRangePicker
- **AND** DateRangePicker SHALL initialize with default date range
- **AND** DateRangePicker SHALL manage own state internally
- **AND** onChange SHALL still fire on changes

#### Scenario: Dual date inputs rendering
- **WHEN** DateRangePicker is rendered
- **THEN** SHALL display start date input with date segments
- **AND** SHALL display en dash separator ("–") between inputs
- **AND** SHALL display end date input with date segments
- **AND** start input SHALL have slot="start"
- **AND** end input SHALL have slot="end"
- **AND** each date SHALL have segments for month, day, year (or locale-specific order)

#### Scenario: Calendar popup functionality
- **WHEN** user clicks calendar button
- **THEN** DateRangePicker SHALL open calendar popover
- **AND** calendar popover SHALL display RangeCalendar component
- **AND** user SHALL be able to select start and end dates visually
- **AND** first click SHALL set start date
- **AND** second click SHALL set end date
- **AND** SHALL close on range selection if granularity is "day"
- **AND** calendar button SHALL use CalendarMonth icon

#### Scenario: Clear button functionality
- **WHEN** date range has value (complete start and end dates)
- **THEN** SHALL display clear button (X icon)
- **AND** clear button SHALL be visible when range is complete
- **AND** clicking clear button SHALL clear both start and end dates
- **AND** clear button SHALL have localized aria-label
- **AND** clear button SHALL be hidden when range is incomplete

#### Scenario: Date range value structure
- **WHEN** value prop is set
- **THEN** value SHALL be object with start and end properties
- **AND** start SHALL be CalendarDate object from @internationalized/date
- **AND** end SHALL be CalendarDate object from @internationalized/date
- **AND** start and end SHALL represent start and end of range inclusively
- **AND** SHALL support CalendarDateTime for date+time ranges
- **AND** SHALL support ZonedDateTime for timezone-aware ranges

#### Scenario: Granularity prop
- **WHEN** granularity prop is provided
- **THEN** SHALL pass to DateRangePicker
- **AND** SHALL accept "day" | "hour" | "minute" | "second"
- **AND** default granularity SHALL be "day"
- **AND** time segments SHALL appear when granularity includes time
- **AND** calendar SHALL include time inputs in footer for time granularities

#### Scenario: MinValue and MaxValue constraints
- **WHEN** minValue or maxValue props are provided
- **THEN** SHALL pass to DateRangePicker
- **AND** SHALL constrain selectable date ranges
- **AND** dates before minValue SHALL be disabled in calendar
- **AND** dates after maxValue SHALL be disabled in calendar
- **AND** date input SHALL prevent invalid dates via keyboard
- **AND** SHALL use CalendarDate, CalendarDateTime, or ZonedDateTime objects

#### Scenario: IsDateUnavailable prop
- **WHEN** isDateUnavailable prop is provided
- **THEN** SHALL pass to DateRangePicker
- **AND** isDateUnavailable SHALL be function receiving DateValue
- **AND** SHALL return boolean indicating if date is unavailable
- **AND** unavailable dates SHALL be disabled in calendar
- **AND** allows custom date disabling logic (e.g., holidays, blackout dates)

#### Scenario: Locale-aware formatting
- **WHEN** DateRangePicker renders
- **THEN** SHALL format dates according to user locale
- **AND** SHALL use locale-specific segment order (MM/DD/YYYY vs DD/MM/YYYY)
- **AND** SHALL use locale-specific month names in calendar
- **AND** locale SHALL be provided via React Aria I18nProvider context
- **AND** SHALL support RTL layouts for RTL locales

#### Scenario: HideTimeZone prop
- **WHEN** hideTimeZone prop is provided
- **THEN** SHALL pass to DateRangePicker
- **AND** SHALL hide timezone display when using ZonedDateTime values
- **AND** timezone information SHALL not appear in date inputs
- **AND** time inputs in calendar footer SHALL not show timezone

#### Scenario: HourCycle prop
- **WHEN** hourCycle prop is provided
- **THEN** SHALL pass to DateRangePicker
- **AND** SHALL accept 12 | 24 values
- **AND** SHALL format time in 12-hour or 24-hour format
- **AND** SHALL apply to time segments in date inputs
- **AND** SHALL apply to time inputs in calendar footer

#### Scenario: Size prop
- **WHEN** size prop is provided
- **THEN** SHALL pass to both FormField.Root and DateRangePicker
- **AND** SHALL accept "sm" | "md" values
- **AND** default size SHALL be "md"
- **AND** FormField typography and DateRangePicker styling SHALL match size
- **AND** date segments, buttons, and calendar SHALL scale appropriately

#### Scenario: Direction prop
- **WHEN** direction prop is provided
- **THEN** SHALL pass to FormField.Root
- **AND** SHALL accept "row" | "column" values
- **AND** default direction SHALL be "column"
- **AND** SHALL control layout orientation of label and input
- **AND** "row" SHALL position label beside input
- **AND** "column" SHALL position label above input

#### Scenario: Style props
- **WHEN** style props (width, maxWidth, margin, etc.) are provided
- **THEN** SHALL pass to DateRangePicker element
- **AND** style props SHALL affect date range input group, not FormField wrapper
- **AND** SHALL support responsive style prop syntax
- **AND** SHALL support Chakra style prop system

#### Scenario: Other DateRangePicker props
- **WHEN** additional DateRangePicker props are spread via rest
- **THEN** SHALL pass name, id, defaultOpen, isOpen, onOpenChange, etc.
- **AND** SHALL support all valid DateRangePicker props
- **AND** SHALL maintain type safety via TypeScript

### Requirement: ID Prop for Custom Identification
The component SHALL support optional id prop for custom element identification per nimbus-core standards.

#### Scenario: Custom ID
- **WHEN** id prop is provided
- **THEN** SHALL pass to FormField.Root
- **AND** FormField SHALL apply id to date range input group
- **AND** label SHALL reference input group id via aria associations
- **AND** custom id SHALL override auto-generated id

#### Scenario: Auto-generated ID
- **WHEN** id prop is not provided
- **THEN** FormField SHALL auto-generate unique id
- **AND** auto-generated id SHALL associate label and input group
- **AND** SHALL maintain ARIA associations without manual id

#### Scenario: Error message ID generation
- **WHEN** errors are displayed
- **THEN** error container SHALL have id derived from field id
- **AND** error id SHALL follow pattern: {id}-errors
- **AND** error id SHALL be passed to FieldErrors component
- **AND** input group aria-describedby SHALL reference error id

### Requirement: Name Prop for Form Integration
The component SHALL support name prop for HTML form integration per nimbus-core standards.

#### Scenario: Name attribute
- **WHEN** name prop is provided
- **THEN** SHALL pass to DateRangePicker
- **AND** DateRangePicker SHALL set name on underlying input elements
- **AND** form submission SHALL include date range value with provided name
- **AND** SHALL support standard HTML form behavior

#### Scenario: Form submission
- **WHEN** DateRangePickerField is inside <form> element
- **THEN** date range inputs SHALL participate in form submission
- **AND** SHALL use name attribute as key in form data
- **AND** SHALL submit date range in appropriate format

### Requirement: TypeScript Type Safety
The component SHALL provide comprehensive type definitions per nimbus-core standards.

#### Scenario: Props type definition
- **WHEN** DateRangePickerFieldProps is defined
- **THEN** SHALL extend Omit<DateRangePickerProps, conflicting keys>
- **AND** SHALL pick specific FormFieldProps: isRequired, isInvalid, isDisabled, isReadOnly, id
- **AND** SHALL define own field-specific props: label, description, info, errors, touched, renderError, direction, size, name
- **AND** SHALL export DateRangePickerFieldProps interface

#### Scenario: Label prop type
- **WHEN** label prop is typed
- **THEN** SHALL be ReactNode (required)
- **AND** SHALL support string or JSX elements
- **AND** TypeScript SHALL enforce label presence

#### Scenario: Optional props types
- **WHEN** optional props are defined
- **THEN** description, info SHALL be ReactNode | undefined
- **AND** touched, isRequired, isDisabled, isReadOnly, isInvalid SHALL be boolean with defaults
- **AND** errors SHALL be FieldErrorsData | undefined
- **AND** renderError SHALL be (errorKey: string) => ReactNode
- **AND** name SHALL be string | undefined

#### Scenario: Size and direction prop types
- **WHEN** size and direction props are typed
- **THEN** size SHALL be "sm" | "md" with default "md"
- **AND** direction SHALL be "row" | "column" with default "column"
- **AND** SHALL match FormField and DateRangePicker size values

#### Scenario: DateRange value type
- **WHEN** value prop is typed
- **THEN** SHALL be DateRange | null | undefined
- **AND** DateRange SHALL be from react-aria-components
- **AND** SHALL have start and end properties of type DateValue
- **AND** DateValue SHALL support CalendarDate, CalendarDateTime, ZonedDateTime

### Requirement: Display Name
The component SHALL set displayName per nimbus-core standards.

#### Scenario: Display name assignment
- **WHEN** component is defined
- **THEN** SHALL set displayName = "DateRangePickerField"
- **AND** displayName SHALL aid debugging in React DevTools
- **AND** SHALL be set as static property on component function

### Requirement: Controlled Component Pattern
The component SHALL support controlled date range input pattern per nimbus-core standards.

#### Scenario: Controlled value
- **WHEN** value and onChange props are provided
- **THEN** component SHALL be fully controlled by parent
- **AND** value changes SHALL only occur via onChange callback
- **AND** onChange SHALL receive DateRange object parameter
- **AND** parent SHALL manage date range state
- **AND** DateRange object SHALL have start and end CalendarDate properties

#### Scenario: Uncontrolled with defaultValue
- **WHEN** defaultValue is provided without value
- **THEN** DateRangePicker SHALL be uncontrolled
- **AND** defaultValue SHALL set initial date range
- **AND** DateRangePicker SHALL manage own state internally
- **AND** onChange SHALL still fire on changes

#### Scenario: Fully uncontrolled
- **WHEN** neither value nor defaultValue provided
- **THEN** DateRangePicker SHALL be uncontrolled with empty initial range
- **AND** SHALL allow user input without parent state management
- **AND** onChange SHALL fire but not required for functionality

### Requirement: Keyboard Navigation
The component SHALL support keyboard interactions per nimbus-core standards.

#### Scenario: Tab navigation
- **WHEN** user presses Tab key
- **THEN** SHALL focus first date segment (start month) in logical tab order
- **AND** Tab SHALL move through date segments within start input
- **AND** Tab SHALL move from start input to end input segments
- **AND** Tab SHALL move through date segments within end input
- **AND** Tab SHALL move to calendar button
- **AND** Tab SHALL move to clear button (if visible)
- **AND** Tab SHALL move to info button (if present)
- **AND** Shift+Tab SHALL navigate in reverse order

#### Scenario: Label click focus
- **WHEN** user clicks label element
- **THEN** SHALL focus first date segment in start date input
- **AND** SHALL work via FormField's label/input association
- **AND** SHALL move cursor to first segment for editing

#### Scenario: Date segment editing
- **WHEN** date segment is focused
- **THEN** typing numbers SHALL update segment value
- **AND** ArrowUp/ArrowDown SHALL increment/decrement segment value
- **AND** segment SHALL cycle through valid values
- **AND** completing segment SHALL auto-advance to next segment
- **AND** Backspace SHALL clear segment and move to previous
- **AND** segment editing SHALL be provided by DateRangePicker

#### Scenario: Calendar keyboard control
- **WHEN** calendar is open and focused
- **THEN** Arrow keys SHALL navigate between dates
- **AND** Enter/Space SHALL select date for range
- **AND** PageUp/PageDown SHALL navigate between months
- **AND** Home/End SHALL navigate to start/end of week
- **AND** Escape SHALL close calendar without selection
- **AND** calendar keyboard control SHALL be provided by RangeCalendar

#### Scenario: Clear action keyboard
- **WHEN** clear button is focused
- **THEN** Enter or Space SHALL clear date range
- **AND** SHALL remove both start and end dates
- **AND** SHALL trigger onChange with null value

### Requirement: Accessibility Compliance
The component SHALL meet WCAG 2.1 AA standards per nimbus-core standards.

#### Scenario: Label association
- **WHEN** component renders
- **THEN** label SHALL be associated with date range input group via aria-labelledby
- **AND** clicking label SHALL focus first date segment
- **AND** screen readers SHALL announce label when input is focused
- **AND** FormField SHALL handle association automatically

#### Scenario: Description association
- **WHEN** description is provided
- **THEN** description SHALL be associated with input group via aria-describedby
- **AND** screen readers SHALL announce description when input is focused
- **AND** FormField SHALL handle association automatically

#### Scenario: Error message association
- **WHEN** errors are displayed
- **THEN** error messages SHALL be associated with input group via aria-describedby
- **AND** screen readers SHALL announce errors when input is focused
- **AND** error SHALL have role="alert" for immediate announcement
- **AND** FormField and FieldErrors SHALL handle associations automatically

#### Scenario: Required field announcement
- **WHEN** isRequired={true}
- **THEN** input group SHALL have aria-required="true"
- **AND** screen readers SHALL announce required state
- **AND** visual required indicator (*) SHALL be present in label

#### Scenario: Invalid state announcement
- **WHEN** field is invalid
- **THEN** input group SHALL have aria-invalid="true"
- **AND** screen readers SHALL announce invalid state
- **AND** error messages SHALL be announced via aria-describedby

#### Scenario: Date segment accessibility
- **WHEN** date segments render
- **THEN** each segment SHALL have role="spinbutton"
- **AND** segment SHALL have aria-valuenow with current value
- **AND** segment SHALL have aria-valuemin and aria-valuemax
- **AND** segment SHALL have aria-valuetext with formatted value
- **AND** screen readers SHALL announce segment type (month, day, year)

#### Scenario: Calendar button accessibility
- **WHEN** calendar button renders
- **THEN** calendar button SHALL have localized aria-label
- **AND** aria-label SHALL describe action (e.g., "Open calendar")
- **AND** button SHALL be keyboard accessible
- **AND** screen readers SHALL announce button purpose

#### Scenario: Clear button accessibility
- **WHEN** clear button is visible
- **THEN** clear button SHALL have localized aria-label
- **AND** aria-label SHALL describe clear action (e.g., "Clear selection")
- **AND** button SHALL be keyboard accessible
- **AND** screen readers SHALL announce button purpose

#### Scenario: Focus indicators
- **WHEN** date segments, buttons, or calendar receive focus
- **THEN** SHALL display visible focus ring meeting 3:1 contrast
- **AND** focus indicator SHALL be provided by DateRangePicker component
- **AND** SHALL be clearly distinguishable from unfocused state

### Requirement: Internationalization Support
The component SHALL support internationalization per nimbus-core standards.

#### Scenario: Locale-aware date formatting
- **WHEN** locale is provided via I18nProvider context
- **THEN** date segments SHALL use locale-specific order
- **AND** US locale SHALL use MM/DD/YYYY order
- **AND** European locales SHALL use DD/MM/YYYY order
- **AND** calendar month names SHALL use locale language
- **AND** weekday names SHALL use locale language

#### Scenario: RTL layout support
- **WHEN** locale direction is RTL
- **THEN** date range layout SHALL flip to RTL
- **AND** start input SHALL appear on right
- **AND** end input SHALL appear on left
- **AND** calendar popover SHALL position appropriately
- **AND** SHALL use React Aria's RTL handling

#### Scenario: Localized button labels
- **WHEN** component renders with any locale
- **THEN** calendar button aria-label SHALL be localized
- **AND** clear button aria-label SHALL be localized
- **AND** time input labels SHALL be localized (if time granularity)
- **AND** SHALL use react-intl for message translation

### Requirement: Date Range Selection Use Cases
The component SHALL support common date range selection scenarios per nimbus-core standards.

#### Scenario: Booking date ranges
- **WHEN** used for booking (hotels, rentals, reservations)
- **THEN** SHALL support selecting check-in and check-out dates
- **AND** SHALL support minValue to prevent past dates
- **AND** SHALL support isDateUnavailable for blocked dates
- **AND** SHALL provide clear visual range selection in calendar
- **AND** SHALL support description for usage hints

#### Scenario: Report period selection
- **WHEN** used for report date ranges
- **THEN** SHALL support selecting report start and end dates
- **AND** SHALL support maxValue to prevent future dates
- **AND** SHALL integrate with form validation for required fields
- **AND** SHALL support custom error messages for invalid ranges

#### Scenario: Event scheduling
- **WHEN** used for event date ranges
- **THEN** SHALL support selecting event start and end dates/times
- **AND** SHALL support granularity with time for datetime ranges
- **AND** SHALL support hideTimeZone and hourCycle for time formatting
- **AND** SHALL support info prop for scheduling guidelines

#### Scenario: Date filtering
- **WHEN** used for filtering data by date range
- **THEN** SHALL support optional date range (start with null value)
- **AND** SHALL support clear button to remove filter
- **AND** SHALL integrate with onChange for real-time filtering
- **AND** SHALL support defaultValue for preset ranges

### Requirement: Distinction from DatePickerField
The component SHALL provide date range selection distinct from single date selection per nimbus-core standards.

#### Scenario: Dual date inputs
- **WHEN** compared to DatePickerField
- **THEN** DateRangePickerField SHALL include two date inputs (start and end)
- **AND** SHALL include en dash separator between inputs
- **AND** DatePickerField SHALL include only one date input
- **AND** visual distinction SHALL be clear to users

#### Scenario: Range calendar
- **WHEN** calendar opens
- **THEN** DateRangePickerField SHALL use RangeCalendar component
- **AND** RangeCalendar SHALL highlight selected range between dates
- **AND** DatePickerField SHALL use Calendar component for single date
- **AND** range selection SHALL require two clicks

#### Scenario: Value structure difference
- **WHEN** handling date values
- **THEN** DateRangePickerField value SHALL be DateRange object with start and end
- **AND** DatePickerField value SHALL be single DateValue
- **AND** type safety SHALL enforce correct value structure
- **AND** onChange callbacks SHALL receive appropriate value types

#### Scenario: When to use DateRangePickerField
- **WHEN** use case involves date range (start and end dates)
- **THEN** DateRangePickerField SHALL be used over DatePickerField
- **AND** SHALL be appropriate for bookings, periods, schedules, filters
- **AND** SHALL communicate range selection intent to users

### Requirement: Form Integration
The component SHALL integrate with HTML forms per nimbus-core standards.

#### Scenario: Form submission participation
- **WHEN** DateRangePickerField is inside <form>
- **THEN** date range inputs SHALL be included in form submission
- **AND** SHALL use name attribute as form data key
- **AND** SHALL submit date range in appropriate format

#### Scenario: Form validation support
- **WHEN** form validation is triggered
- **THEN** isRequired state SHALL prevent submission if range is incomplete
- **AND** isInvalid state SHALL visually indicate validation failure
- **AND** error messages SHALL guide user to fix validation issues
- **AND** SHALL support custom validation via renderError

#### Scenario: Form reset
- **WHEN** form is reset
- **THEN** DateRangePicker SHALL clear to defaultValue or null
- **AND** SHALL support HTML form reset behavior
- **AND** controlled components SHALL be managed by parent state

### Requirement: Responsive Design
The component SHALL support responsive design patterns per nimbus-core standards.

#### Scenario: Responsive size
- **WHEN** size prop uses responsive syntax
- **THEN** SHALL support: size={{ base: "sm", md: "md" }}
- **AND** FormField and DateRangePicker SHALL apply appropriate sizes at breakpoints
- **AND** typography and date input styling SHALL adjust responsively

#### Scenario: Responsive direction
- **WHEN** direction prop uses responsive syntax
- **THEN** SHALL support: direction={{ base: "column", md: "row" }}
- **AND** FormField layout SHALL adjust at breakpoints
- **AND** SHALL support stacked mobile layout and horizontal desktop layout

#### Scenario: Responsive style props
- **WHEN** style props use responsive syntax
- **THEN** SHALL support: width={{ base: "100%", md: "400px" }}
- **AND** DateRangePicker SHALL apply responsive styles at breakpoints
- **AND** SHALL use Chakra breakpoint system

### Requirement: Aria-describedby Prop Support
The component SHALL support aria-describedby prop for additional descriptions per nimbus-core standards.

#### Scenario: Custom aria-describedby
- **WHEN** aria-describedby prop is provided
- **THEN** SHALL pass to DateRangePicker
- **AND** DateRangePicker SHALL merge with FormField-generated aria-describedby
- **AND** input group SHALL reference custom description IDs
- **AND** SHALL support external description elements

#### Scenario: Aria-describedby accumulation
- **WHEN** aria-describedby, description, and errors are all present
- **THEN** input group aria-describedby SHALL reference all description IDs
- **AND** SHALL include custom aria-describedby ID
- **AND** SHALL include FormField description ID
- **AND** SHALL include error message ID
- **AND** FormField SHALL handle ID accumulation automatically

### Requirement: No Custom Styling
The component SHALL not define custom styles beyond composition per nimbus-core standards.

#### Scenario: Style inheritance
- **WHEN** DateRangePickerField renders
- **THEN** SHALL inherit all styling from FormField recipe
- **AND** SHALL inherit all styling from DateRangePicker recipe
- **AND** SHALL NOT define own recipe or custom styles

#### Scenario: Style props passthrough
- **WHEN** style props are provided
- **THEN** SHALL pass to DateRangePicker element
- **AND** DateRangePicker SHALL apply its styling system
- **AND** FormField SHALL apply its styling system
- **AND** no additional styling layer SHALL be introduced

### Requirement: JSDoc Documentation
The component SHALL provide comprehensive JSDoc per nimbus-core standards.

#### Scenario: Component documentation
- **WHEN** component is defined
- **THEN** SHALL include JSDoc block with description
- **AND** SHALL describe purpose: pre-composed date range field combining DateRangePicker with FormField
- **AND** SHALL include @example tag with usage code
- **AND** SHALL explain simplified API benefit for date range scenarios

#### Scenario: Props documentation
- **WHEN** DateRangePickerFieldProps is defined
- **THEN** all props SHALL have JSDoc comments
- **AND** SHALL explain label is required for accessibility
- **AND** SHALL document touched state behavior for error display
- **AND** SHALL explain errors format compatibility with UI-Kit
- **AND** SHALL document style props apply to date range input element
- **AND** SHALL explain date range value structure (start and end)
- **AND** SHALL document CalendarDate usage from @internationalized/date
