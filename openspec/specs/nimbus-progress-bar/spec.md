# Specification: ProgressBar Component

## Overview

The ProgressBar component provides an accessible linear visual indicator that displays the loading or completion state of an ongoing process with determinate or indeterminate progress.

**Component:** `ProgressBar`
**Package:** `@commercetools/nimbus`
**Type:** Multi-slot component
**React Aria:** Uses `ProgressBar` and `Label` from react-aria-components

## Purpose

ProgressBar communicates the status of ongoing operations to users, reducing uncertainty and improving perceived performance. It supports both determinate mode (with known progress) and indeterminate mode (unknown duration), providing visual feedback through a filled bar that updates dynamically or displays a loading animation.

## Requirements

### Requirement: Determinate Progress
The component SHALL support determinate mode for tasks with known progress.

#### Scenario: Value-based progress
- **WHEN** value prop is provided (0-100)
- **THEN** SHALL render filled bar at percentage corresponding to value
- **AND** SHALL set aria-valuenow to current value
- **AND** SHALL animate width transition smoothly
- **AND** fill width SHALL be calculated as percentage of total

#### Scenario: Custom value range
- **WHEN** minValue and maxValue props are provided
- **THEN** SHALL calculate percentage from custom range
- **AND** SHALL set aria-valuemin to minValue
- **AND** SHALL set aria-valuemax to maxValue
- **AND** percentage SHALL be: (value - minValue) / (maxValue - minValue) * 100

#### Scenario: Default value range
- **WHEN** minValue and maxValue are not provided
- **THEN** minValue SHALL default to 0
- **AND** maxValue SHALL default to 100
- **AND** value SHALL be interpreted as percentage

### Requirement: Indeterminate Progress
The component SHALL support indeterminate mode for tasks with unknown duration.

#### Scenario: Indeterminate animation
- **WHEN** isIndeterminate={true} is set
- **THEN** SHALL display animated loading indicator
- **AND** fill SHALL be fixed at 40% width
- **AND** SHALL apply progress-indeterminate animation (2s ease-in-out infinite)
- **AND** SHALL not display value text

#### Scenario: ARIA attributes for indeterminate
- **WHEN** indeterminate mode is active
- **THEN** SHALL not set aria-valuenow
- **AND** SHALL not set aria-valuemin or aria-valuemax
- **AND** role="progressbar" SHALL remain set

### Requirement: Value Formatting
The component SHALL support internationalized value formatting per nimbus-core standards.

#### Scenario: Percentage format (default)
- **WHEN** formatOptions is not provided or {style: "percent"}
- **THEN** SHALL display value as percentage (e.g., "75%")
- **AND** SHALL use Intl.NumberFormat for localization
- **AND** SHALL calculate percentage from value/maxValue

#### Scenario: Decimal format
- **WHEN** formatOptions={style: "decimal"} is provided
- **THEN** SHALL display raw value (e.g., "755" for value=755)
- **AND** SHALL respect minimumFractionDigits and maximumFractionDigits
- **AND** SHALL apply locale-specific number formatting

#### Scenario: Unit format
- **WHEN** formatOptions={style: "unit", unit: "..."} is provided
- **THEN** SHALL display value with unit suffix (e.g., "42.55 TB")
- **AND** SHALL support standard Intl units (byte, kilobyte, megabyte, terabyte, etc.)
- **AND** SHALL apply locale-specific unit formatting

#### Scenario: Custom fraction digits
- **WHEN** formatOptions specifies minimumFractionDigits or maximumFractionDigits
- **THEN** SHALL apply decimal precision to formatted value
- **AND** SHALL use Intl.NumberFormat options for formatting

### Requirement: Value Visibility
The component SHALL conditionally display value text based on layout and value props.

#### Scenario: Value display in stacked layout
- **WHEN** layout="stacked" and label and value are provided
- **THEN** SHALL display valueText in top-right position
- **AND** SHALL align label left and value right

#### Scenario: Value display in inline layout
- **WHEN** layout="inline" and value is provided
- **THEN** SHALL display valueText after progress track
- **AND** SHALL apply lineHeight="1" to value

#### Scenario: No value display
- **WHEN** value prop is not provided OR layout="minimal"
- **THEN** SHALL not display value text
- **AND** progress bar SHALL still function with value for ARIA

### Requirement: Accessible Labeling
The component SHALL provide accessible label association per nimbus-core standards.

#### Scenario: Text label in stacked layout
- **WHEN** label prop is provided and layout="stacked"
- **THEN** SHALL render label using React Aria Label component
- **AND** SHALL display label in top-left position
- **AND** label SHALL be associated with progressbar via aria-labelledby

#### Scenario: Text label in inline layout
- **WHEN** label prop is provided and layout="inline"
- **THEN** SHALL render label before progress track
- **AND** SHALL apply lineHeight="1" to label
- **AND** label SHALL be associated with progressbar

#### Scenario: No visible label (minimal layout)
- **WHEN** layout="minimal" is set
- **THEN** label and value SHALL be hidden via CSS
- **AND** aria-label prop SHOULD be provided for accessibility
- **AND** SHALL maintain accessible name for screen readers

#### Scenario: Aria-label fallback
- **WHEN** aria-label is provided without visible label
- **THEN** SHALL use aria-label for screen reader announcement
- **AND** SHALL not render visible label element

### Requirement: Variant Styles
The component SHALL support visual style variants.

#### Scenario: Solid variant (default)
- **WHEN** variant="solid" is set or no variant specified
- **THEN** SHALL render with gradient fill (colorPalette.6 → colorPalette.9 → colorPalette.6)
- **AND** SHALL use neutralAlpha.3 for track background
- **AND** SHALL use neutral.12 for text color
- **AND** fill SHALL have 200% background-size for gradient animation

#### Scenario: Contrast variant
- **WHEN** variant="contrast" is set
- **THEN** SHALL render with monochromatic gradient (colorPalette.contrast/25 → colorPalette.contrast → colorPalette.contrast/25)
- **AND** SHALL use colorPalette.contrast/15 for track background
- **AND** SHALL use colorPalette.contrast for text color
- **AND** SHALL be suitable for dark backgrounds

### Requirement: Layout Configurations
The component SHALL support three layout configurations.

#### Scenario: Stacked layout (default)
- **WHEN** layout="stacked" is set or no layout specified
- **THEN** SHALL render in column direction
- **AND** SHALL display label and value on first row (flex-justified)
- **AND** SHALL display progress track on second row
- **AND** SHALL apply gap="200" between rows

#### Scenario: Inline layout
- **WHEN** layout="inline" is set
- **THEN** SHALL render in row direction
- **AND** SHALL display label, track, and value horizontally
- **AND** SHALL apply gap="400" between elements
- **AND** track SHALL have flex: 1 to fill available space
- **AND** label and value SHALL have lineHeight="1"

#### Scenario: Minimal layout
- **WHEN** layout="minimal" is set
- **THEN** SHALL hide label and value via CSS (display: none)
- **AND** SHALL only display progress track
- **AND** accessible name SHALL still be required via aria-label

### Requirement: Size Options
The component SHALL support two size variants per nimbus-core standards.

#### Scenario: 2xs size
- **WHEN** size="2xs" is set
- **THEN** track height SHALL be token size.300
- **AND** border radius SHALL be token radii.300
- **AND** font size SHALL be token fontSizes.350
- **AND** line height SHALL be token fontSizes.500

#### Scenario: md size (default)
- **WHEN** size="md" is set or no size specified
- **THEN** track height SHALL be token size.600
- **AND** border radius SHALL be token radii.600
- **AND** font size SHALL be token fontSizes.400
- **AND** line height SHALL be token fontSizes.600

### Requirement: Progress Animation Behavior
The component SHALL support dynamic and static progress modes.

#### Scenario: Dynamic progress (default)
- **WHEN** isDynamic={true} is set or no isDynamic specified
- **THEN** fill SHALL apply gradient-shimmer animation (4s ease-in-out infinite)
- **AND** gradient SHALL animate horizontally across fill
- **AND** animation SHALL indicate active, ongoing process
- **AND** SHALL be suitable for file uploads, downloads, real-time operations

#### Scenario: Static progress
- **WHEN** isDynamic={false} is set
- **THEN** fill SHALL NOT apply shimmer animation
- **AND** gradient SHALL remain static
- **AND** SHALL be suitable for step indicators (e.g., "Step 3 of 5")
- **AND** SHALL indicate fixed progress state

#### Scenario: Completion state animation
- **WHEN** isDynamic={true} and percentage >= 100
- **THEN** shimmer animation SHALL stop (data-complete="true")
- **AND** fill SHALL display static gradient at 100%
- **AND** completion SHALL be visually indicated

### Requirement: Semantic Color Palettes
The component SHALL support semantic color palettes per nimbus-core standards.

#### Scenario: Color palette application
- **WHEN** colorPalette prop is set
- **THEN** SHALL support: primary, neutral, info, positive, warning, critical, and system palettes
- **AND** primary SHALL be default
- **AND** SHALL apply palette colors to fill gradient
- **AND** SHALL maintain WCAG AA contrast ratios

#### Scenario: Color palette with contrast variant
- **WHEN** colorPalette and variant="contrast" are set
- **THEN** SHALL use colorPalette.contrast for fill colors
- **AND** SHALL use colorPalette.contrast/15 for track background
- **AND** SHALL ensure visibility on dark backgrounds

### Requirement: Smooth Transitions
The component SHALL provide smooth visual transitions.

#### Scenario: Width transition animation
- **WHEN** value prop changes
- **THEN** fill width SHALL transition smoothly (.3s ease-in-smooth)
- **AND** SHALL use transitionProperty: "width"
- **AND** SHALL provide visual feedback for progress updates

#### Scenario: Indeterminate animation
- **WHEN** isIndeterminate={true} is set
- **THEN** SHALL apply progress-indeterminate keyframe animation
- **AND** animation duration SHALL be 2s ease-in-out infinite
- **AND** fill SHALL slide back and forth horizontally

#### Scenario: Gradient shimmer animation
- **WHEN** isDynamic={true} is set
- **THEN** SHALL apply gradient-shimmer keyframe animation
- **AND** animation duration SHALL be 4s ease-in-out infinite
- **AND** background position SHALL animate from 0% to 100%

### Requirement: Slot-Based Architecture
The component SHALL use multi-slot recipe per nimbus-core standards.

#### Scenario: Slot components
- **WHEN** ProgressBar renders
- **THEN** SHALL define slots: root, track, fill, label, value
- **AND** ProgressBarRootSlot SHALL wrap React Aria ProgressBar
- **AND** ProgressBarTrackSlot SHALL contain ProgressBarFillSlot
- **AND** ProgressBarLabelSlot SHALL wrap React Aria Label
- **AND** ProgressBarValueSlot SHALL display formatted value text

#### Scenario: Recipe registration
- **WHEN** component is imported
- **THEN** progressBarSlotRecipe SHALL be registered in theme/slot-recipes/
- **AND** useSlotRecipe SHALL retrieve recipe with key="progressBar"
- **AND** recipe SHALL provide styling for all slots

### Requirement: ARIA Progressbar Pattern
The component SHALL implement ARIA progressbar pattern per nimbus-core standards.

#### Scenario: Progressbar role and attributes
- **WHEN** ProgressBar renders
- **THEN** SHALL have role="progressbar" (via React Aria)
- **AND** SHALL be announced to screen readers
- **AND** determinate mode SHALL include aria-valuenow, aria-valuemin, aria-valuemax
- **AND** indeterminate mode SHALL omit value attributes

#### Scenario: Accessible name
- **WHEN** label prop is provided
- **THEN** SHALL associate label via aria-labelledby (React Aria)
- **WHEN** aria-label is provided without label
- **THEN** SHALL use aria-label for screen reader announcement
- **AND** minimal layout SHALL require aria-label for accessibility

#### Scenario: State announcements
- **WHEN** value changes
- **THEN** screen readers SHALL announce updated progress
- **AND** React Aria SHALL handle live region announcements
- **AND** formatted value SHALL be announced (e.g., "75%")

### Requirement: Keyboard Navigation
The component SHALL support keyboard accessibility per nimbus-core standards.

#### Scenario: Focusability
- **WHEN** ProgressBar renders
- **THEN** element SHALL NOT be keyboard focusable
- **AND** SHALL be perceivable but not interactive
- **AND** SHALL not participate in tab order

### Requirement: Custom Styling Support
The component SHALL accept Chakra style props per nimbus-core standards.

#### Scenario: Style prop override
- **WHEN** style props are provided (margin, padding, width, etc.)
- **THEN** SHALL accept all Chakra style props via extractStyleProps
- **AND** SHALL apply to root slot
- **AND** custom styles SHALL override recipe defaults
- **AND** SHALL support responsive style values

#### Scenario: CSS variable customization
- **WHEN** recipe applies base styles
- **THEN** SHALL use CSS variables: --progress-bar-radius, --progress-bar-font-size, --progress-bar-height, --progress-bar-line-height, --progress-bar-text-color, --progress-bar-track-bg, --progress-bar-animation
- **AND** variants SHALL override CSS variables
- **AND** SHALL allow external CSS variable overrides

### Requirement: Ref Support
The component SHALL support ref forwarding per nimbus-core standards.

#### Scenario: Ref forwarding to root element
- **WHEN** ref prop is provided
- **THEN** SHALL forward ref to root div element
- **AND** SHALL use useObjectRef from react-aria
- **AND** SHALL merge with internal ref using mergeRefs from Chakra
- **AND** ref SHALL provide access to DOM element

### Requirement: Native Attribute Support
The component SHALL accept native HTML attributes per nimbus-core standards.

#### Scenario: Data attributes
- **WHEN** data-* attributes are provided
- **THEN** SHALL forward to root element
- **AND** SHALL be accessible via DOM queries
- **AND** SHALL support data-testid for testing

#### Scenario: ARIA attributes
- **WHEN** aria-* attributes are provided
- **THEN** SHALL forward to React Aria ProgressBar
- **AND** SHALL supplement or override default ARIA attributes
- **AND** SHALL maintain accessibility compliance

### Requirement: State Data Attributes
The component SHALL expose state via data attributes for styling and testing.

#### Scenario: Indeterminate state attribute
- **WHEN** isIndeterminate={true} is set
- **THEN** fill SHALL have data-indeterminate="true"
- **AND** attribute SHALL be usable for CSS selectors

#### Scenario: Complete state attribute
- **WHEN** percentage >= 100 and not indeterminate
- **THEN** fill SHALL have data-complete="true"
- **AND** attribute SHALL be usable to stop animations
- **AND** completion state SHALL be detectable via CSS

### Requirement: Compound Variant Handling
The component SHALL support compound variant combinations.

#### Scenario: Dynamic and indeterminate together
- **WHEN** isDynamic={true} and isIndeterminate={true} are both set
- **THEN** SHALL apply progress-indeterminate animation (not gradient-shimmer)
- **AND** indeterminate animation SHALL take precedence
- **AND** compound variant SHALL override individual variants

### Requirement: TypeScript Type Definitions
The component SHALL provide comprehensive TypeScript types per nimbus-core standards.

#### Scenario: Exported types
- **WHEN** component is imported
- **THEN** SHALL export ProgressBarProps interface
- **AND** SHALL export ProgressBarRecipeProps, ProgressBarRootSlotProps, ProgressBarTrackSlotProps, ProgressBarFillSlotProps, ProgressBarLabelSlotProps, ProgressBarValueSlotProps
- **AND** types SHALL include JSDoc comments for all props

#### Scenario: Recipe props types
- **WHEN** component uses recipes
- **THEN** size, variant, layout, isDynamic, isIndeterminate SHALL be typed from SlotRecipeProps
- **AND** Chakra CLI SHALL generate autocomplete for variant values
- **AND** colorPalette SHALL support semantic palette names

#### Scenario: React Aria props integration
- **WHEN** component wraps React Aria ProgressBar
- **THEN** SHALL include AriaProgressBarProps in type definition
- **AND** value, minValue, maxValue, formatOptions SHALL be typed from React Aria
- **AND** SHALL support Intl.NumberFormatOptions for formatOptions
