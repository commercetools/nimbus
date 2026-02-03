# nimbus-steps Specification

## Purpose
TBD - created by archiving change add-steps-component. Update Purpose after archive.
## Requirements
### Requirement: Namespace Structure

The component SHALL export as compound component namespace.

#### Scenario: Component parts

- **WHEN** Steps is imported
- **THEN** SHALL provide Steps.Root as container with context
- **AND** SHALL provide Steps.List as flex wrapper for step items
- **AND** SHALL provide Steps.Item for individual step container
- **AND** SHALL provide Steps.Indicator for step number or icon
- **AND** SHALL provide Steps.Separator for connecting line between steps
- **AND** SHALL provide Steps.Content as wrapper for label and description
- **AND** SHALL provide Steps.Label for step title text
- **AND** SHALL provide Steps.Description for optional hint text
- **AND** Root SHALL be first property in namespace

### Requirement: State Management

The component SHALL automatically derive step states from current step and item
index.

#### Scenario: State derivation

- **WHEN** Steps.Root has step={n} and count={total}
- **THEN** Steps.Item with index < step SHALL have state "complete"
- **AND** Steps.Item with index === step SHALL have state "current"
- **AND** Steps.Item with index > step SHALL have state "incomplete"
- **AND** state SHALL be passed via data-state attribute

#### Scenario: Context propagation

- **WHEN** Steps.Root renders
- **THEN** SHALL create context with step, count, size, orientation
- **AND** SHALL provide context to all child components
- **AND** SHALL throw error if Step.\* used outside Steps.Root

### Requirement: Size Variants

The component SHALL support three size variants per nimbus-core standards.

#### Scenario: Extra small size (xs)

- **WHEN** size="xs" is set
- **THEN** indicator SHALL be 24px (size.numericalSizes.600)
- **AND** indicator font SHALL be 12px (fontSize.300)
- **AND** label font SHALL be 14px (fontSize.350) bold
- **AND** description font SHALL be 12px (fontSize.300)
- **AND** item gap SHALL be 8px (spacing.200)

#### Scenario: Small size (sm - default)

- **WHEN** size="sm" or size is not specified
- **THEN** indicator SHALL be 32px (size.numericalSizes.800)
- **AND** indicator font SHALL be 14px (fontSize.350)
- **AND** label font SHALL be 16px (fontSize.400) semibold
- **AND** description font SHALL be 14px (fontSize.350)
- **AND** item gap SHALL be 12px (spacing.300)

#### Scenario: Medium size (md)

- **WHEN** size="md" is set
- **THEN** indicator SHALL be 40px (size.numericalSizes.1000)
- **AND** indicator font SHALL be 16px (fontSize.400)
- **AND** label font SHALL be 18px (fontSize.450) semibold
- **AND** description font SHALL be 14px (fontSize.350)
- **AND** item gap SHALL be 16px (spacing.400)

### Requirement: Orientation Support

The component SHALL support horizontal and vertical layouts.

#### Scenario: Horizontal orientation (default)

- **WHEN** orientation="horizontal" or orientation is not specified
- **THEN** Steps.List SHALL use flexDirection: row
- **AND** separator SHALL be horizontal line (40px wide × 2px tall)
- **AND** separator SHALL flex: 1 to fill available space
- **AND** items SHALL align center vertically

#### Scenario: Vertical orientation

- **WHEN** orientation="vertical" is set
- **THEN** Steps.List SHALL use flexDirection: column
- **AND** list gap SHALL be 8px (spacing.200)
- **AND** separator SHALL be vertical line (2px wide × 40px tall)
- **AND** separator SHALL flex: 1 to fill available space
- **AND** items SHALL align flex-start

### Requirement: Indicator Types

The component SHALL support numeric and icon indicator types.

#### Scenario: Numeric indicator - incomplete state

- **WHEN** Steps.Indicator has type="numeric" and state="incomplete"
- **THEN** SHALL display step number (index + 1)
- **AND** SHALL use neutral.7 border color (#cdced6)
- **AND** SHALL use neutral.12 text color
- **AND** SHALL have transparent background

#### Scenario: Numeric indicator - current state

- **WHEN** Steps.Indicator has type="numeric" and state="current"
- **THEN** SHALL display step number (index + 1)
- **AND** SHALL use primary.9 border color
- **AND** SHALL use primary.9 text color
- **AND** SHALL use primary.2 background (light blue)

#### Scenario: Numeric indicator - complete state

- **WHEN** Steps.Indicator has type="numeric" and state="complete"
- **AND** showCompleteIcon={true} (default)
- **THEN** SHALL display checkmark icon instead of number
- **AND** SHALL use primary.9 border color
- **AND** SHALL use colorPalette.contrast text color (white)
- **AND** SHALL use primary.9 background (filled blue)

#### Scenario: Numeric indicator - complete without icon

- **WHEN** Steps.Indicator has type="numeric" and state="complete"
- **AND** showCompleteIcon={false}
- **THEN** SHALL display step number (index + 1)
- **AND** SHALL apply complete state styling (filled blue background)

#### Scenario: Icon indicator - all states

- **WHEN** Steps.Indicator has type="icon" and icon prop
- **THEN** SHALL display custom icon in all states
- **AND** incomplete SHALL apply neutral.7 border and neutral.12 color
- **AND** current SHALL apply primary.9 border and primary.9 color with
  primary.2 background
- **AND** complete SHALL apply primary.9 border, colorPalette.contrast color,
  and primary.9 background
- **AND** icon SHALL not change, only styling changes

### Requirement: Content Display

The component SHALL support flexible content with label and optional
description.

#### Scenario: Label only

- **WHEN** Steps.Content contains only Steps.Label
- **THEN** SHALL render label with appropriate typography
- **AND** SHALL not render empty description container

#### Scenario: Label with description

- **WHEN** Steps.Content contains Steps.Label and Steps.Description
- **THEN** SHALL render label with appropriate typography
- **AND** SHALL render description below label
- **AND** content SHALL use flexDirection: column with gap
- **AND** description SHALL use neutral.11 text color

### Requirement: Separator Rendering

The component SHALL provide visual connection between steps.

#### Scenario: Horizontal separator

- **WHEN** orientation="horizontal"
- **THEN** separator SHALL be 2px tall horizontal line
- **AND** SHALL use neutral.6 background color (#d9d9e0)
- **AND** SHALL flex: 1 to fill space between indicators
- **AND** SHALL have max-height: 2px

#### Scenario: Vertical separator

- **WHEN** orientation="vertical"
- **THEN** separator SHALL be 2px wide vertical line
- **AND** SHALL use neutral.6 background color (#d9d9e0)
- **AND** SHALL flex: 1 to fill space between indicators
- **AND** SHALL have max-width: 2px

### Requirement: Accessibility Compliance

The component SHALL meet WCAG 2.1 AA standards per nimbus-core requirements.

#### Scenario: Semantic HTML structure

- **WHEN** Steps renders
- **THEN** Steps.List SHALL use role="list"
- **AND** Steps.Item SHALL use role="listitem"
- **AND** SHALL provide proper heading hierarchy in labels

#### Scenario: Current step indication

- **WHEN** step is current (index === step)
- **THEN** Steps.Item SHALL set aria-current="step"
- **AND** SHALL provide visual distinction via styling

#### Scenario: Screen reader support

- **WHEN** screen reader navigates steps
- **THEN** SHALL announce list with X items
- **AND** SHALL announce current step with aria-current
- **AND** SHALL announce step number and label
- **AND** indicator SHALL set aria-hidden="true" (decorative)

### Requirement: Style Customization

The component SHALL support style prop overrides per nimbus-core standards.

#### Scenario: Chakra style props

- **WHEN** any Steps.\* component receives style props
- **THEN** SHALL apply via extractStyleProps utility
- **AND** SHALL forward to appropriate slot component
- **AND** SHALL not break recipe styling

### Requirement: Recipe Registration

The component SHALL register Chakra UI v3 slot recipe in theme config.

#### Scenario: Theme registration

- **WHEN** nimbus package builds
- **THEN** recipe SHALL be registered in src/theme/slot-recipes/index.ts
- **AND** SHALL export as "nimbusSteps"
- **AND** SHALL define all 8 slots: root, list, item, indicator, separator,
  content, label, description

### Requirement: TypeScript Types

The component SHALL provide comprehensive type definitions per nimbus-core
standards.

#### Scenario: Type architecture

- **WHEN** types are defined in steps.types.ts
- **THEN** SHALL follow four-layer architecture:
  1. Recipe props (size, orientation, state variants)
  2. Slot props (HTMLChakraProps with recipe props)
  3. Main props (public API with JSDoc)
- **AND** SHALL export all prop types
- **AND** SHALL use OmitInternalProps for main props

### Requirement: Error Handling

The component SHALL provide clear error messages for misuse.

#### Scenario: Context usage error

- **WHEN** Steps.\* component used outside Steps.Root
- **THEN** SHALL throw error with message: "Steps.\* components must be used
  within Steps.Root. Wrap your Steps.Item, Steps.Indicator, etc. in a Steps.Root
  component."

#### Scenario: Development warnings

- **WHEN** step prop is out of bounds (step < 0 or step >= count)
- **THEN** SHALL log warning in development mode: "[Steps] step prop (X) is out
  of bounds. Expected value between 0 and Y."
- **WHEN** count < 1
- **THEN** SHALL log warning: "[Steps] count prop (X) must be at least 1."

### Requirement: Testing Coverage

The component SHALL have comprehensive test coverage per nimbus-core standards.

#### Scenario: Storybook stories with play functions

- **WHEN** component is tested
- **THEN** SHALL test all size variants (xs, sm, md)
- **AND** SHALL test both orientations (horizontal, vertical)
- **AND** SHALL test both indicator types (numeric, icon)
- **AND** SHALL test all state transitions (incomplete → current → complete)
- **AND** SHALL test with and without descriptions
- **AND** SHALL test accessibility compliance with axe
- **AND** SHALL test ARIA attributes (role, aria-current)
- **AND** SHALL test state derivation logic
- **AND** SHALL test dynamic step updates

### Requirement: Documentation

The component SHALL provide comprehensive documentation per nimbus-core
standards.

#### Scenario: Developer documentation (.dev.mdx)

- **WHEN** documentation is written
- **THEN** SHALL include component purpose and features
- **AND** SHALL include basic usage example
- **AND** SHALL document all variants (sizes, orientations, types)
- **AND** SHALL include integration examples (form navigation)
- **AND** SHALL document accessibility features
- **AND** SHALL include API reference (auto-generated from JSDoc)

#### Scenario: Designer guidelines (.guidelines.mdx)

- **WHEN** designer documentation is written
- **THEN** SHALL document when to use vs not use
- **AND** SHALL provide size selection guidance
- **AND** SHALL provide orientation guidelines
- **AND** SHALL provide content writing guidelines
- **AND** SHALL document indicator type selection
- **AND** SHALL include visual examples

#### Scenario: JSDoc comments

- **WHEN** components are implemented
- **THEN** all props SHALL have JSDoc descriptions
- **AND** all components SHALL have JSDoc summaries
- **AND** SHALL include @example blocks
- **AND** SHALL document default values with @default tags

