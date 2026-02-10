# Specification: Steps Component

## Purpose

The Steps component provides an accessible progress indicator with built-in navigation for multi-step processes such as forms, wizards, and onboarding flows. It is a compound component namespace with multi-slot recipe styling that supports horizontal and vertical layouts, conditional indicator content, and three size variants per nimbus-core standards.

**Component:** `Steps` (compound namespace)
**Package:** `@commercetools/nimbus`
**Type:** Compound component (multi-slot recipe)
**Chakra UI:** Wraps `Steps` from @chakra-ui/react (Ark UI based)

## Requirements

### Requirement: Namespace Structure

The component SHALL export as compound component namespace.

#### Scenario: Component parts

- **WHEN** Steps is imported
- **THEN** SHALL provide Steps.Root as container with state management
- **AND** SHALL provide Steps.List as container for step items (role="tablist")
- **AND** SHALL provide Steps.Item for individual step container
- **AND** SHALL provide Steps.Trigger for clickable navigation element (role="tab")
- **AND** SHALL provide Steps.Indicator for visual step marker
- **AND** SHALL provide Steps.Status for conditional content based on step state
- **AND** SHALL provide Steps.Number for displaying step number (1-indexed)
- **AND** SHALL provide Steps.Title for step title text
- **AND** SHALL provide Steps.Description for optional hint text
- **AND** SHALL provide Steps.Separator for connecting line between steps
- **AND** SHALL provide Steps.Content for auto-show/hide content panels (role="tabpanel")
- **AND** SHALL provide Steps.CompletedContent for content when all steps complete
- **AND** SHALL provide Steps.PrevTrigger for navigation to previous step
- **AND** SHALL provide Steps.NextTrigger for navigation to next step
- **AND** Root SHALL be first property in namespace

### Requirement: State Management

The component SHALL support both controlled and uncontrolled state patterns.

#### Scenario: Uncontrolled mode

- **WHEN** Steps.Root has defaultStep={n} and count={total}
- **THEN** SHALL manage step state internally
- **AND** clicking Steps.Trigger SHALL update current step
- **AND** Steps.NextTrigger SHALL advance to next step
- **AND** Steps.PrevTrigger SHALL return to previous step

#### Scenario: Controlled mode

- **WHEN** Steps.Root has step={n} and onStepChange callback
- **THEN** SHALL call onStepChange with step details on navigation
- **AND** SHALL not update internal state
- **AND** parent component SHALL control step value

#### Scenario: State derivation

- **WHEN** Steps.Root has current step value
- **THEN** Steps.Item with index < step SHALL have data-complete attribute
- **AND** Steps.Item with index === step SHALL have data-state="open"
- **AND** Steps.Item with index > step SHALL have data-state="closed" without data-complete
- **AND** Steps.Separator SHALL have data-complete when preceding step is complete

#### Scenario: Linear mode

- **WHEN** Steps.Root has linear={true}
- **THEN** SHALL restrict navigation to sequential progress only
- **AND** users SHALL only navigate forward to next incomplete step
- **AND** users SHALL navigate back to any completed step
- **AND** clicking future incomplete steps SHALL be prevented

### Requirement: Size Variants

The component SHALL support three size variants per nimbus-core standards.

#### Scenario: Extra small size (xs)

- **WHEN** size="xs" is set
- **THEN** indicator SHALL be 24px (sizes.600)
- **AND** indicator font SHALL be 12px (fontSize.300)
- **AND** title font SHALL be 14px (fontSize.350) bold
- **AND** description font SHALL be 12px (fontSize.300)
- **AND** item gap SHALL be 8px (spacing.200)

#### Scenario: Small size (sm - default)

- **WHEN** size="sm" or size is not specified
- **THEN** indicator SHALL be 32px (sizes.800)
- **AND** indicator font SHALL be 14px (fontSize.350)
- **AND** title font SHALL be 16px (fontSize.400) semibold
- **AND** description font SHALL be 14px (fontSize.350)
- **AND** item gap SHALL be 12px (spacing.300)

#### Scenario: Medium size (md)

- **WHEN** size="md" is set
- **THEN** indicator SHALL be 40px (sizes.1000)
- **AND** indicator font SHALL be 16px (fontSize.400)
- **AND** title font SHALL be 18px (fontSize.450) semibold
- **AND** description font SHALL be 14px (fontSize.350)
- **AND** item gap SHALL be 16px (spacing.400)

### Requirement: Orientation Support

The component SHALL support horizontal and vertical layouts with responsive values.

#### Scenario: Horizontal orientation (default)

- **WHEN** orientation="horizontal" or orientation is not specified
- **THEN** Steps.List SHALL use flexDirection: row
- **AND** separator SHALL be horizontal line (2px tall, flex: 1)
- **AND** items SHALL grow to fill available space
- **AND** separator SHALL have minWidth: 40px (spacing.1000)

#### Scenario: Vertical orientation

- **WHEN** orientation="vertical" is set
- **THEN** Steps.List SHALL use flexDirection: column
- **AND** separator SHALL be vertical line (2px wide)
- **AND** separator SHALL be positioned under indicator center
- **AND** separator SHALL have minHeight: 40px (spacing.1000)
- **AND** items SHALL align flex-start

#### Scenario: Responsive orientation

- **WHEN** orientation is responsive object (e.g., { base: "vertical", md: "horizontal" })
- **THEN** SHALL resolve to string value at current breakpoint
- **AND** SHALL pass resolved value to Chakra Steps.Root
- **AND** SHALL not pass object to aria-orientation attribute

### Requirement: Indicator Content

The component SHALL support flexible indicator content via Steps.Status component.

#### Scenario: Steps.Status conditional rendering

- **WHEN** Steps.Status is used within Steps.Indicator
- **THEN** SHALL render `complete` prop content when step is complete
- **AND** SHALL render `incomplete` prop content when step is incomplete or current
- **AND** optionally SHALL render `current` prop content when step is current (defaults to incomplete)

#### Scenario: Numeric indicators with checkmarks

- **WHEN** Steps.Status has complete={<Icon />} and incomplete={<Steps.Number />}
- **THEN** incomplete/current steps SHALL display step number (1-indexed)
- **AND** complete steps SHALL display the provided icon

#### Scenario: Custom icon indicators

- **WHEN** Steps.Status has complete={<CheckIcon />} and incomplete={<CustomIcon />}
- **THEN** incomplete/current steps SHALL display custom icon
- **AND** complete steps SHALL display check icon
- **AND** indicator styling SHALL change based on state

#### Scenario: Indicator state styling

- **WHEN** indicator renders in incomplete state
- **THEN** SHALL use neutral.7 border color
- **AND** SHALL use neutral.12 text color
- **AND** SHALL have transparent background

- **WHEN** indicator renders in current state (data-state="open")
- **THEN** SHALL use colorPalette.9 border color
- **AND** SHALL use colorPalette.9 text color
- **AND** SHALL use colorPalette.2 background

- **WHEN** indicator renders in complete state (data-complete)
- **THEN** SHALL use colorPalette.9 border color
- **AND** SHALL use colorPalette.contrast text color
- **AND** SHALL use colorPalette.9 background

### Requirement: Content Panels

The component SHALL support auto-visibility content panels.

#### Scenario: Steps.Content visibility

- **WHEN** Steps.Content has index={n}
- **THEN** SHALL be visible only when current step equals n
- **AND** SHALL have role="tabpanel"
- **AND** SHALL be associated with corresponding trigger via aria-controls

#### Scenario: Steps.CompletedContent

- **WHEN** all steps are complete (step >= count)
- **THEN** Steps.CompletedContent SHALL be visible
- **AND** all Steps.Content panels SHALL be hidden

### Requirement: Separator Rendering

The component SHALL provide visual connection between steps.

#### Scenario: Separator state

- **WHEN** separator follows a complete step
- **THEN** SHALL have data-complete attribute
- **AND** SHALL use colorPalette.7 background color

- **WHEN** separator follows incomplete/current step
- **THEN** SHALL NOT have data-complete attribute
- **AND** SHALL use neutral.6 background color

### Requirement: Color Palette Support

The component SHALL support colorPalette prop for theming.

#### Scenario: Color palette customization

- **WHEN** Steps.Root has colorPalette prop (e.g., "primary", "positive", "critical")
- **THEN** SHALL apply colorPalette to indicator current/complete states
- **AND** SHALL apply colorPalette to separator complete state
- **AND** default colorPalette SHALL be "primary"

### Requirement: Accessibility Compliance

The component SHALL meet WCAG 2.1 AA standards per nimbus-core requirements.

#### Scenario: ARIA tablist pattern

- **WHEN** Steps renders
- **THEN** Steps.List SHALL have role="tablist"
- **AND** Steps.Trigger SHALL have role="tab"
- **AND** Steps.Content SHALL have role="tabpanel"
- **AND** aria-orientation SHALL reflect current orientation

#### Scenario: Current step indication

- **WHEN** step is current (index === step)
- **THEN** Steps.Trigger SHALL have aria-selected="true"
- **AND** SHALL provide visual distinction via styling

#### Scenario: Panel association

- **WHEN** Steps.Content panels are rendered
- **THEN** triggers SHALL reference panels via aria-controls
- **AND** panels SHALL reference triggers via aria-labelledby

#### Scenario: Keyboard navigation

- **WHEN** user navigates with keyboard
- **THEN** Tab SHALL move focus between triggers
- **AND** Enter/Click SHALL activate trigger (unless linear mode restricts)
- **AND** Arrow keys SHALL navigate between triggers

#### Scenario: Known accessibility limitations

- **WHEN** Steps.Item divs are between tablist and tab elements
- **THEN** aria-required-children rule may flag violation
- **AND** this is an upstream Ark UI architectural limitation
- **AND** aria-owns attribute provides workaround for assistive technology

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
- **AND** SHALL define slots: root, list, item, trigger, indicator, number, title,
  description, separator, content, completedContent, prevTrigger, nextTrigger

### Requirement: TypeScript Types

The component SHALL provide comprehensive type definitions per nimbus-core
standards.

#### Scenario: Type exports

- **WHEN** types are defined in steps.types.ts
- **THEN** SHALL export StepsRootProps, StepsListProps, StepsItemProps
- **AND** SHALL export StepsTriggerProps, StepsIndicatorProps, StepsNumberProps
- **AND** SHALL export StepsTitleProps, StepsDescriptionProps, StepsSeparatorProps
- **AND** SHALL export StepsContentProps, StepsCompletedContentProps
- **AND** SHALL export StepsPrevTriggerProps, StepsNextTriggerProps
- **AND** SHALL export StepsStatusProps, StepsChangeDetails
- **AND** SHALL use OmitInternalProps for main props

### Requirement: Testing Coverage

The component SHALL have comprehensive test coverage per nimbus-core standards.

#### Scenario: Storybook stories with play functions

- **WHEN** component is tested
- **THEN** SHALL test all size variants (xs, sm, md)
- **AND** SHALL test both orientations (horizontal, vertical)
- **AND** SHALL test numeric and icon indicator patterns
- **AND** SHALL test controlled and uncontrolled modes
- **AND** SHALL test linear mode navigation restrictions
- **AND** SHALL test content panel visibility
- **AND** SHALL test navigation triggers (PrevTrigger, NextTrigger)
- **AND** SHALL test colorPalette variants
- **AND** SHALL test responsive orientation

### Requirement: Documentation

The component SHALL provide comprehensive documentation per nimbus-core
standards.

#### Scenario: Developer documentation (.dev.mdx)

- **WHEN** documentation is written
- **THEN** SHALL include component purpose and features
- **AND** SHALL include basic usage example with Steps.Status pattern
- **AND** SHALL document controlled vs uncontrolled modes
- **AND** SHALL document all variants (sizes, orientations)
- **AND** SHALL document indicator content patterns
- **AND** SHALL document content panels and navigation
- **AND** SHALL document linear mode
- **AND** SHALL document accessibility features
- **AND** SHALL include API reference (auto-generated from JSDoc)

#### Scenario: Designer documentation (.mdx)

- **WHEN** designer documentation is written
- **THEN** SHALL document when to use vs not use
- **AND** SHALL provide size selection guidance
- **AND** SHALL provide orientation guidelines
- **AND** SHALL provide indicator content patterns
- **AND** SHALL document colorPalette options
- **AND** SHALL include visual examples

#### Scenario: JSDoc comments

- **WHEN** components are implemented
- **THEN** all props SHALL have JSDoc descriptions
- **AND** all components SHALL have JSDoc summaries
- **AND** SHALL include @example blocks
- **AND** SHALL document default values with @default tags
