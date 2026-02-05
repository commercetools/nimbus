## MODIFIED Requirements

### Requirement: Namespace Structure

The component SHALL export as compound component namespace wrapping Chakra UI's
Steps component.

#### Scenario: Component parts

- **WHEN** Steps is imported
- **THEN** SHALL provide Steps.Root as container with context and state
  management
- **AND** SHALL provide Steps.List as wrapper for step items
- **AND** SHALL provide Steps.Item as individual step container (auto-indexed)
- **AND** SHALL provide Steps.Trigger as clickable step indicator with label
- **AND** SHALL provide Steps.Indicator as visual step number/icon within
  Trigger
- **AND** SHALL provide Steps.Separator as connecting line between steps
- **AND** SHALL provide Steps.Content as auto-visibility content container
- **AND** SHALL provide Steps.CompletedContent for completion state content
- **AND** SHALL provide Steps.PrevTrigger for navigating to previous step
- **AND** SHALL provide Steps.NextTrigger for navigating to next step
- **AND** Root SHALL be first property in namespace

### Requirement: State Management

The component SHALL support both controlled and uncontrolled state patterns.

#### Scenario: Uncontrolled mode

- **WHEN** Steps.Root has defaultStep={n} and count={total}
- **THEN** component SHALL manage step state internally
- **AND** navigation via triggers SHALL update internal state
- **AND** Steps.Content SHALL auto-show/hide based on current step

#### Scenario: Controlled mode

- **WHEN** Steps.Root has step={n} and onStepChange callback
- **THEN** component SHALL use external state
- **AND** navigation via triggers SHALL call onStepChange callback
- **AND** parent component SHALL be responsible for state updates

#### Scenario: State derivation for items

- **WHEN** Steps renders with current step
- **THEN** Steps.Item before current SHALL have state "complete"
- **AND** Steps.Item at current index SHALL have state "current"
- **AND** Steps.Item after current SHALL have state "incomplete"
- **AND** state SHALL be passed via data-state attribute

### Requirement: Content Visibility

The component SHALL automatically manage content visibility based on step state.

#### Scenario: Active step content

- **WHEN** step is current
- **THEN** Steps.Content with matching index SHALL be visible
- **AND** Steps.Content with non-matching index SHALL be hidden

#### Scenario: Completed content

- **WHEN** current step equals count (all steps complete)
- **THEN** Steps.CompletedContent SHALL be visible
- **AND** all Steps.Content SHALL be hidden

## ADDED Requirements

### Requirement: Navigation Triggers

The component SHALL provide declarative navigation triggers.

#### Scenario: Previous trigger

- **WHEN** Steps.PrevTrigger is rendered
- **THEN** clicking SHALL navigate to previous step
- **AND** SHALL support asChild pattern for custom button styling
- **AND** SHALL be disabled when on first step

#### Scenario: Next trigger

- **WHEN** Steps.NextTrigger is rendered
- **THEN** clicking SHALL navigate to next step
- **AND** SHALL support asChild pattern for custom button styling
- **AND** SHALL be disabled when on last step (unless linear=false)

#### Scenario: Step trigger

- **WHEN** Steps.Trigger is clicked
- **THEN** SHALL navigate to that step (if linear=false or step is accessible)
- **AND** SHALL provide visual feedback for hover/focus states

### Requirement: Linear Mode

The component SHALL support restricting navigation to sequential progress.

#### Scenario: Linear navigation enabled

- **WHEN** Steps.Root has linear={true}
- **THEN** user SHALL only navigate forward to next incomplete step
- **AND** clicking completed steps SHALL be allowed
- **AND** clicking future incomplete steps SHALL be prevented

#### Scenario: Linear navigation disabled

- **WHEN** Steps.Root has linear={false} (default)
- **THEN** user SHALL navigate to any step via trigger click

## REMOVED Requirements

### Requirement: Manual Index Prop

**Reason**: Chakra Steps auto-indexes items based on render order.

**Migration**: Remove index prop from Steps.Item usage.

### Requirement: Separate Indicator Component

**Reason**: Merged into Steps.Trigger which contains both indicator and label.

**Migration**: Use Steps.Trigger with Steps.Indicator inside for visual
indicator, label text as children.

### Requirement: Separate Label Component

**Reason**: Label content is now placed directly inside Steps.Trigger.

**Migration**: Place label text as children of Steps.Trigger.

### Requirement: Separate Description Component

**Reason**: Description content can be placed inside Steps.Trigger or
Steps.Content.

**Migration**: Place description inside Steps.Trigger or as part of step
content.

### Requirement: Context Usage Error

**Reason**: Chakra provides its own context error handling.

**Migration**: Chakra's error messages will apply.
