# Specification: TimeInput Component

## Overview

The TimeInput component provides an accessible time input control with segmented time entry, following ARIA time field pattern. It provides keyboard-based time entry through individual editable segments for hours, minutes, seconds, and AM/PM period.

**Component:** `TimeInput`
**Package:** `@commercetools/nimbus`
**Type:** Multi-slot component
**React Aria:** Uses `TimeField`, `DateInput`, and `DateSegment` from react-aria-components
**i18n:** No messages (purely visual component, ARIA labels provided by consumers)

## Purpose

Provide a keyboard-accessible time entry field using individual editable segments (hour, minute, second, and optionally AM/PM period). This component focuses on keyboard-based time entry without a calendar popup, making it ideal for power users, forms requiring quick keyboard navigation, or contexts where time picker UI is unnecessary.

## Requirements

### Requirement: Time Value Handling
The component SHALL manage time values using Time objects from @internationalized/date.

#### Scenario: Controlled mode
- **WHEN** value and onChange props are provided
- **THEN** value SHALL be TimeValue (Time, ZonedDateTime, or CalendarDateTime)
- **AND** SHALL call onChange with new time object on segment change
- **AND** SHALL not update internal state

#### Scenario: Uncontrolled mode
- **WHEN** defaultValue prop is provided without value
- **THEN** SHALL initialize with default time
- **AND** SHALL manage state internally
- **AND** optional onChange SHALL receive updates

#### Scenario: Empty state
- **WHEN** no value or defaultValue is provided
- **THEN** SHALL render empty segments
- **AND** SHALL allow user to type values
- **AND** SHALL support placeholderValue for initial segment navigation

### Requirement: Segmented Time Display
The component SHALL display time as separate editable segments.

#### Scenario: Time segments rendering
- **WHEN** time input renders
- **THEN** SHALL show separate segments based on granularity and hour cycle
- **AND** each segment SHALL be individually editable
- **AND** segments SHALL use locale-appropriate order
- **AND** segments SHALL be visually separated by literal separators

#### Scenario: Hour and minute segments (default)
- **WHEN** granularity="minute" or not specified
- **THEN** SHALL show hour and minute segments
- **AND** SHALL show AM/PM segment for 12-hour format
- **AND** SHALL NOT show AM/PM segment for 24-hour format

#### Scenario: Hour-only granularity
- **WHEN** granularity="hour" is set
- **THEN** SHALL show only hour segment
- **AND** SHALL show AM/PM segment for 12-hour format
- **AND** SHALL NOT show minute or second segments

#### Scenario: Second granularity
- **WHEN** granularity="second" is set
- **THEN** SHALL show hour, minute, and second segments
- **AND** SHALL show AM/PM segment for 12-hour format
- **AND** SHALL NOT show AM/PM segment for 24-hour format

#### Scenario: Segment focus styling
- **WHEN** segment is focused
- **THEN** SHALL apply primary background color (primary.10)
- **AND** SHALL apply contrast text color (primary.contrast)
- **AND** SHALL show clear visual focus indicator

#### Scenario: Placeholder segments
- **WHEN** segment has no value
- **THEN** SHALL display placeholder with reduced opacity (0.5)
- **AND** SHALL allow typing to fill value
- **AND** SHALL show segment type hint based on locale

### Requirement: Keyboard Input in Segments
The component SHALL support keyboard-based time entry within segments.

#### Scenario: Numeric input in segments
- **WHEN** segment is focused
- **THEN** typing numbers SHALL update segment value
- **AND** SHALL validate input against segment constraints
- **AND** SHALL auto-advance to next segment when complete
- **AND** SHALL restrict input to valid ranges (e.g., 0-23 for hour in 24-hour format)

#### Scenario: Arrow key increment/decrement
- **WHEN** segment is focused
- **THEN** ArrowUp SHALL increment segment value
- **AND** ArrowDown SHALL decrement segment value
- **AND** SHALL cycle through valid values
- **AND** SHALL respect minValue and maxValue constraints

#### Scenario: Tab navigation between segments
- **WHEN** Tab key is pressed
- **THEN** SHALL move focus to next segment
- **AND** Shift+Tab SHALL move focus to previous segment
- **AND** SHALL wrap focus within time input boundaries
- **AND** SHALL not tab through literal separator segments

#### Scenario: Arrow Left/Right navigation
- **WHEN** ArrowLeft or ArrowRight is pressed
- **THEN** SHALL move focus between segments
- **AND** ArrowRight SHALL move to next segment
- **AND** ArrowLeft SHALL move to previous segment
- **AND** SHALL skip literal separator segments

#### Scenario: Home/End navigation
- **WHEN** Home or End key is pressed
- **THEN** Home SHALL focus first segment
- **AND** End SHALL focus last segment

#### Scenario: Segment clearing
- **WHEN** Backspace is pressed on focused segment
- **THEN** SHALL clear segment value
- **AND** SHALL show placeholder
- **AND** SHALL allow re-entry of value

### Requirement: Locale-Aware Formatting
The component SHALL format times according to locale conventions per nimbus-core standards.

#### Scenario: Locale-specific segment order
- **WHEN** locale prop is provided via React Aria context
- **THEN** SHALL order segments according to locale
- **AND** SHALL use locale-specific separators (e.g., : for most locales)
- **AND** SHALL maintain correct order for all supported locales

#### Scenario: Hour cycle formatting
- **WHEN** hourCycle prop is provided
- **THEN** hourCycle={12} SHALL use 12-hour format with AM/PM
- **AND** hourCycle={24} SHALL use 24-hour format without AM/PM
- **AND** default behavior SHALL follow locale conventions

#### Scenario: Leading zeros control
- **WHEN** shouldForceLeadingZeros prop is set
- **THEN** shouldForceLeadingZeros={true} SHALL force leading zeros (01, 05)
- **AND** shouldForceLeadingZeros={false} SHALL omit leading zeros (1, 5)
- **AND** default behavior SHALL follow locale conventions

### Requirement: Time Range Validation
The component SHALL enforce time constraints when provided.

#### Scenario: Minimum time constraint
- **WHEN** minValue prop is set
- **THEN** SHALL prevent input of times before minimum
- **AND** SHALL validate on segment change
- **AND** SHALL set aria-invalid="true" on segments when time is below minimum
- **AND** arrow keys SHALL not decrement below minimum

#### Scenario: Maximum time constraint
- **WHEN** maxValue prop is set
- **THEN** SHALL prevent input of times after maximum
- **AND** SHALL validate on segment change
- **AND** SHALL set aria-invalid="true" on segments when time is above maximum
- **AND** arrow keys SHALL not increment above maximum

#### Scenario: Validation boundary inclusion
- **WHEN** minValue or maxValue is set
- **THEN** SHALL allow time exactly equal to minimum
- **AND** SHALL allow time exactly equal to maximum
- **AND** SHALL validate all segments as a complete time value

### Requirement: Time Precision Configuration
The component SHALL support different levels of time precision through granularity control.

#### Scenario: Hour granularity
- **WHEN** granularity="hour" is set
- **THEN** SHALL show only hour segment
- **AND** SHALL show AM/PM for 12-hour format
- **AND** SHALL require TimeValue type
- **AND** minute and second values SHALL be ignored/hidden

#### Scenario: Minute granularity (default)
- **WHEN** granularity="minute" is set or not specified
- **THEN** SHALL show hour and minute segments
- **AND** SHALL show AM/PM for 12-hour format
- **AND** SHALL require TimeValue type
- **AND** second values SHALL be ignored/hidden

#### Scenario: Second granularity
- **WHEN** granularity="second" is set
- **THEN** SHALL show hour, minute, and second segments
- **AND** SHALL show AM/PM for 12-hour format
- **AND** SHALL require TimeValue type

### Requirement: Initial Navigation Context
The component SHALL support placeholder value for empty state navigation.

#### Scenario: Placeholder value usage
- **WHEN** placeholderValue prop is provided
- **THEN** SHALL use as starting point for keyboard navigation when empty
- **AND** SHALL show as placeholder text in segments
- **AND** SHALL not set actual value
- **AND** SHALL allow user to override all segments
- **AND** increment/decrement SHALL start from placeholder values

### Requirement: Timezone Display Configuration
The component SHALL support timezone display control for ZonedDateTime values.

#### Scenario: Timezone visibility for ZonedDateTime
- **WHEN** value is ZonedDateTime and hideTimeZone={false}
- **THEN** SHALL display timezone segment
- **AND** SHALL show timezone abbreviation (e.g., GMT+2, EDT, PST)
- **AND** SHALL not allow editing timezone in segment

#### Scenario: Timezone hidden for ZonedDateTime
- **WHEN** value is ZonedDateTime and hideTimeZone={true}
- **THEN** SHALL not display timezone segment
- **AND** SHALL still maintain timezone in value
- **AND** SHALL format time in specified timezone

#### Scenario: No timezone for Time values
- **WHEN** value is Time (not ZonedDateTime)
- **THEN** SHALL not display timezone segment
- **AND** hideTimeZone prop SHALL have no effect

### Requirement: Custom Element Slots
The component SHALL support leading and trailing element slots per nimbus-core standards.

#### Scenario: Leading element
- **WHEN** leadingElement prop is provided
- **THEN** SHALL render element at start of input
- **AND** SHALL accept any React node (Icon, IconButton, etc.)
- **AND** SHALL apply appropriate spacing

#### Scenario: Trailing element
- **WHEN** trailingElement prop is provided
- **THEN** SHALL render element at end of input
- **AND** SHALL accept any React node
- **AND** SHALL apply appropriate spacing

#### Scenario: Both elements
- **WHEN** both leadingElement and trailingElement are provided
- **THEN** SHALL render leading element first
- **AND** SHALL render trailing element last
- **AND** SHALL render segments between elements

### Requirement: Interactive States
The component SHALL support multiple interaction states per nimbus-core standards.

#### Scenario: Disabled state
- **WHEN** isDisabled={true} is set
- **THEN** SHALL apply disabled styling
- **AND** SHALL disable all segment interactions
- **AND** SHALL prevent keyboard input
- **AND** SHALL set data-disabled="true" attribute
- **AND** SHALL set aria-disabled="true" on root and segments
- **AND** SHALL apply disabled layer style and neutral.3 background

#### Scenario: Read-only state
- **WHEN** isReadOnly={true} is set
- **THEN** SHALL display time segments without edit capability
- **AND** SHALL prevent keyboard input
- **AND** SHALL set data-readonly="true" attribute
- **AND** SHALL set aria-readonly="true" on segments
- **AND** SHALL maintain readable styling

#### Scenario: Invalid state
- **WHEN** isInvalid={true} is set
- **THEN** SHALL apply error border color (critical.7)
- **AND** SHALL apply error text color (critical.11)
- **AND** SHALL set data-invalid="true" attribute
- **AND** SHALL increase border width to sizes.50

#### Scenario: Required state
- **WHEN** isRequired={true} is set
- **THEN** SHALL set aria-required="true" on segments
- **AND** SHALL validate on form submission
- **AND** visual indicator SHALL be provided by FormField component

### Requirement: Size Options
The component SHALL support multiple size variants per nimbus-core standards.

#### Scenario: Size variants
- **WHEN** size prop is set
- **THEN** SHALL support: sm, md
- **AND** sm SHALL have height 800 (32px) with 300 horizontal padding and sm text style
- **AND** md SHALL have height 1000 (40px) with 400 horizontal padding and md text style
- **AND** md SHALL be default size
- **AND** SHALL adjust icon sizes in leading/trailing elements (sm: 400/16px, md: 500/20px)

### Requirement: Visual Style Variants
The component SHALL support multiple visual style variants per nimbus-core standards.

#### Scenario: Solid variant (default)
- **WHEN** variant="solid" is set or not specified
- **THEN** SHALL show border with neutral.7 color and sizes.25 width
- **AND** SHALL have neutral.1 background
- **AND** SHALL apply primary.2 background on hover

#### Scenario: Ghost variant
- **WHEN** variant="ghost" is set
- **THEN** SHALL have no border
- **AND** SHALL have transparent background
- **AND** SHALL apply primary.2 background on hover

### Requirement: Form Validation Support
The component SHALL integrate with form validation systems per nimbus-core standards.

#### Scenario: Required field validation
- **WHEN** isRequired={true} is set
- **THEN** SHALL require time value for form submission
- **AND** SHALL set aria-required="true" on segments
- **AND** SHALL validate via form context

#### Scenario: Custom validation with constraints
- **WHEN** consumer implements validation logic with minValue/maxValue
- **THEN** SHALL provide onChange handler with current value
- **AND** SHALL provide onBlur handler for blur events
- **AND** React Aria SHALL set aria-invalid on segments when time is outside constraints
- **AND** error messages SHALL be provided by FormField component

#### Scenario: FormField integration
- **WHEN** used within FormField component
- **THEN** SHALL receive isInvalid state from FormField
- **AND** SHALL receive isRequired state from FormField
- **AND** FormField.Label SHALL provide label
- **AND** FormField.Description SHALL provide aria-describedby
- **AND** FormField.Error SHALL provide error message

### Requirement: ARIA Time Field Pattern
The component SHALL implement ARIA time field pattern per nimbus-core standards.

#### Scenario: Time field structure
- **WHEN** time input renders
- **THEN** SHALL use role="group" for root container via React Aria
- **AND** each segment SHALL use role="spinbutton"
- **AND** each segment SHALL have appropriate aria-label via React Aria
- **AND** literal separators SHALL not be focusable

#### Scenario: Segment navigation
- **WHEN** user navigates with keyboard
- **THEN** Arrow Left/Right SHALL move between segments
- **AND** Tab/Shift+Tab SHALL move between segments
- **AND** Home SHALL focus first segment
- **AND** End SHALL focus last segment

#### Scenario: Segment value changes
- **WHEN** user changes segment values
- **THEN** ArrowUp/ArrowDown SHALL increment/decrement values
- **AND** typing numbers SHALL update segment values
- **AND** changes SHALL respect segment constraints

#### Scenario: Screen reader support
- **WHEN** screen reader is active
- **THEN** SHALL announce segment type on focus (hour, minute, second, dayPeriod)
- **AND** SHALL announce current value
- **AND** SHALL announce value changes
- **AND** SHALL use React Aria's built-in ARIA announcements

#### Scenario: Label association
- **WHEN** aria-label or aria-labelledby is provided
- **THEN** SHALL associate with time field group
- **AND** FormField component SHALL provide proper labeling
- **AND** aria-describedby SHALL link to helper text

#### Scenario: Focus management
- **WHEN** TimeInput receives focus
- **THEN** SHALL focus first empty segment or first segment
- **AND** SHALL show focus ring around root container via _focusWithin
- **AND** SHALL maintain focus within segments during navigation

### Requirement: Multi-Slot Recipe
The component SHALL use multi-slot recipe per nimbus-core standards.

#### Scenario: Slot styling
- **WHEN** component renders
- **THEN** SHALL apply timeInput slot recipe from theme/slot-recipes/time-input.ts
- **AND** SHALL style: root, leadingElement, trailingElement, segmentGroup, segment slots
- **AND** SHALL support size variants (sm, md)
- **AND** SHALL support style variants (solid, ghost)

#### Scenario: Segment styling
- **WHEN** segments render
- **THEN** focused segment SHALL have primary.10 background and primary.contrast text
- **AND** placeholder segment SHALL have 0.5 opacity
- **AND** literal segment SHALL have special padding adjustment for screen reader characters
- **AND** segments SHALL use tabular-nums font variant
- **AND** segments SHALL have border-radius 50 and padding 50

#### Scenario: Focus styling
- **WHEN** any segment is focused
- **THEN** root container SHALL show focus ring via _focusWithin
- **AND** focus ring SHALL use focusRing layer style
- **AND** SHALL meet WCAG AA contrast requirements

#### Scenario: Literal segment styling
- **WHEN** literal separator segments render
- **THEN** first and last literal segments SHALL have negative margin and zero padding
- **AND** SHALL account for hidden screen reader characters
- **AND** SHALL align text position to match regular segments

### Requirement: Form Compatibility
The component SHALL integrate with HTML forms per nimbus-core standards.

#### Scenario: Form submission
- **WHEN** component is in a form
- **THEN** SHALL include ISO 8601 time string in form data via React Aria
- **AND** SHALL use name prop as field name
- **AND** SHALL validate before submission if isRequired={true}

#### Scenario: FormField integration
- **WHEN** used within FormField component
- **THEN** SHALL receive context from FormField
- **AND** FormField.Label SHALL provide label
- **AND** FormField.Description SHALL provide aria-describedby
- **AND** FormField.Error SHALL provide error message
- **AND** isInvalid state SHALL be controlled by FormField
- **AND** isRequired state SHALL be controlled by FormField

### Requirement: Event Callbacks
The component SHALL provide comprehensive event handling per nimbus-core standards.

#### Scenario: Value change events
- **WHEN** time value changes
- **THEN** SHALL call onChange with new TimeValue or null
- **AND** SHALL fire on any segment change
- **AND** SHALL fire on increment/decrement
- **AND** SHALL fire on direct input

#### Scenario: Blur events
- **WHEN** focus leaves time input
- **THEN** SHALL call onBlur handler
- **AND** SHALL be useful for validation timing
- **AND** SHALL fire after any segment loses focus to external element

#### Scenario: Focus events
- **WHEN** focus enters time input
- **THEN** SHALL call onFocus handler
- **AND** SHALL fire when any segment gains focus from external element

### Requirement: Custom Width Support
The component SHALL support custom width configuration per nimbus-core standards.

#### Scenario: Fixed width
- **WHEN** width prop is provided with pixel value
- **THEN** SHALL apply exact width
- **AND** SHALL maintain internal spacing

#### Scenario: Responsive width
- **WHEN** width prop is provided with token or percentage
- **THEN** SHALL apply responsive width
- **AND** SHALL support Chakra width tokens (full, etc.)

#### Scenario: Default width
- **WHEN** no width prop is provided
- **THEN** SHALL use intrinsic width based on segments
- **AND** SHALL adjust to fit all segments comfortably
