# Specification: Accordion Component

## Purpose

The Accordion component provides an accessible expandable/collapsible content sections following ARIA accordion pattern. It enables users to organize and navigate through sectioned content in a compact, accessible manner with support for single and multiple expansion modes, keyboard navigation, and full WCAG 2.1 AA compliance.

**Component:** `Accordion` (compound namespace)
**Package:** `@commercetools/nimbus`
**Type:** Compound component (multi-slot recipe)
**React Aria:** Uses `Disclosure` and `DisclosureGroup` from react-aria-components

## Requirements

### Requirement: Namespace Structure
The component SHALL export as compound component namespace.

#### Scenario: Component parts
- **WHEN** Accordion is imported
- **THEN** SHALL provide Accordion.Root as accordion container
- **AND** SHALL provide Accordion.Item for individual sections
- **AND** SHALL provide Accordion.Trigger for expand/collapse button
- **AND** SHALL provide Accordion.Panel for collapsible content
- **AND** Root SHALL be first property in namespace

### Requirement: Expansion Behavior
The component SHALL support single and multiple expansion modes.

#### Scenario: Single expansion mode
- **WHEN** allowMultiple={false} (default)
- **THEN** only one item SHALL be expanded at a time
- **AND** expanding item SHALL collapse currently expanded item
- **AND** SHALL maintain single selection state

#### Scenario: Multiple expansion mode
- **WHEN** allowMultiple={true} is set
- **THEN** multiple items MAY be expanded simultaneously
- **AND** expanding item SHALL not affect other items
- **AND** SHALL maintain multi-selection state

#### Scenario: Toggle mode
- **WHEN** allowToggle={true} is set (single mode)
- **THEN** clicking expanded item SHALL collapse it
- **WHEN** allowToggle={false} (default, single mode)
- **THEN** one item SHALL always remain expanded

### Requirement: Controlled and Uncontrolled Modes
The component SHALL support both state management modes per nimbus-core standards.

#### Scenario: Controlled mode
- **WHEN** expandedKeys and onExpandedChange props are provided
- **THEN** SHALL render with specified expanded state
- **AND** SHALL call onExpandedChange when state changes
- **AND** SHALL not update internal state

#### Scenario: Uncontrolled mode
- **WHEN** defaultExpandedKeys prop is provided
- **THEN** SHALL initialize with default expansion state
- **AND** SHALL manage state internally
- **AND** optional onExpandedChange SHALL receive updates

### Requirement: Trigger Button
The component SHALL provide button to toggle panel visibility.

#### Scenario: Click interaction
- **WHEN** user clicks Accordion.Trigger
- **THEN** SHALL toggle associated panel
- **AND** SHALL update expanded state
- **AND** SHALL call onExpandedChange
- **AND** SHALL animate expansion/collapse

#### Scenario: Keyboard interaction
- **WHEN** trigger is focused and user presses Enter or Space
- **THEN** SHALL toggle associated panel
- **AND** SHALL provide visual feedback

### Requirement: Accordion Navigation
The component SHALL support keyboard navigation per nimbus-core standards.

#### Scenario: Focus navigation
- **WHEN** accordion has focus and user presses ArrowDown
- **THEN** SHALL move focus to next trigger button
- **WHEN** user presses ArrowUp
- **THEN** SHALL move focus to previous trigger button
- **AND** SHALL wrap at edges

#### Scenario: Home and End keys
- **WHEN** user presses Home
- **THEN** SHALL focus first trigger
- **WHEN** user presses End
- **THEN** SHALL focus last trigger

#### Scenario: Tab navigation
- **WHEN** user presses Tab
- **THEN** SHALL move to next focusable element in panel
- **OR** next trigger if panel is collapsed
- **OR** outside accordion if at last element

### Requirement: Content Display
The component SHALL manage panel visibility and content.

#### Scenario: Expanded panel
- **WHEN** item is expanded
- **THEN** SHALL display panel content
- **AND** SHALL animate expansion with smooth height transition
- **AND** trigger icon SHALL rotate to indicate state
- **AND** trigger SHALL set aria-expanded="true"

#### Scenario: Collapsed panel
- **WHEN** item is collapsed
- **THEN** SHALL hide panel content via display:none
- **OR** animate to zero height
- **AND** trigger icon SHALL show collapsed state
- **AND** trigger SHALL set aria-expanded="false"

#### Scenario: Panel association
- **WHEN** panels render
- **THEN** trigger SHALL use aria-controls to reference panel
- **AND** panel SHALL use aria-labelledby to reference trigger

### Requirement: Expansion Indicator
The component SHALL provide visual expansion indicator.

#### Scenario: Icon display
- **WHEN** trigger renders
- **THEN** SHALL show chevron or plus/minus icon
- **AND** SHALL position icon at right side by default
- **AND** SHALL rotate/change icon on state change

#### Scenario: Custom icon
- **WHEN** custom icon is provided
- **THEN** SHALL use custom icon instead of default
- **AND** SHALL apply same rotation/transition behavior

### Requirement: Item State Management
The component SHALL support disabled items.

#### Scenario: Disabled item
- **WHEN** Item has disabled={true}
- **THEN** trigger SHALL apply disabled styling
- **AND** SHALL prevent expansion/collapse
- **AND** SHALL skip during keyboard navigation
- **AND** SHALL set aria-disabled="true"

### Requirement: Size Options
The component SHALL support multiple size variants per nimbus-core standards.

#### Scenario: Size variants
- **WHEN** size prop is set on Root
- **THEN** SHALL support: sm, md, lg
- **AND** SHALL adjust trigger height, padding, and font size
- **AND** md SHALL be default size

### Requirement: Visual Variants
The component SHALL support multiple visual styles.

#### Scenario: Default variant
- **WHEN** variant="default"
- **THEN** SHALL render with standard borders
- **AND** SHALL separate items with dividers

#### Scenario: Ghost variant
- **WHEN** variant="ghost" is set
- **THEN** SHALL render without borders
- **AND** SHALL use subtle hover states

### Requirement: ARIA Disclosure Pattern
The component SHALL implement ARIA accordion pattern per nimbus-core standards.

#### Scenario: Accordion structure
- **WHEN** accordion renders
- **THEN** Root SHALL provide grouping context
- **AND** each trigger SHALL have role="button"
- **AND** each panel SHALL have role="region"
- **AND** panel SHALL have aria-labelledby referencing trigger

#### Scenario: Expansion state
- **WHEN** item state changes
- **THEN** trigger SHALL set aria-expanded to reflect state
- **AND** SHALL announce state change to screen readers

#### Scenario: Focus management
- **WHEN** navigating with keyboard
- **THEN** SHALL provide visible focus indicators
- **AND** SHALL maintain logical focus order
- **AND** SHALL support roving tabindex for triggers

### Requirement: Smooth Transitions
The component SHALL animate panel expansion/collapse.

#### Scenario: Expansion animation
- **WHEN** panel expands
- **THEN** SHALL animate height from 0 to full content height
- **AND** SHALL use easing from design tokens
- **AND** SHALL use duration from design tokens

#### Scenario: Collapse animation
- **WHEN** panel collapses
- **THEN** SHALL animate height from full to 0
- **AND** SHALL use same timing as expansion

### Requirement: Nesting Support
The component SHALL support nested accordion structures.

#### Scenario: Nested items
- **WHEN** Accordion.Panel contains another Accordion
- **THEN** SHALL render nested accordion independently
- **AND** SHALL maintain separate state management
- **AND** SHALL apply appropriate indentation

### Requirement: Multi-Slot Recipe
The component SHALL use multi-slot recipe per nimbus-core standards.

#### Scenario: Slot styling
- **WHEN** accordion renders
- **THEN** SHALL apply accordion slot recipe from theme/slot-recipes/accordion.ts
- **AND** SHALL style: root, item, trigger, icon, panel slots
- **AND** SHALL support size and variant options
- **AND** SHALL support expanded/collapsed states

### Requirement: Optimized Rendering
The component SHALL optimize for performance.

#### Scenario: Lazy content rendering
- **WHEN** panel content is expensive
- **THEN** SHALL delay rendering until first expansion
- **AND** SHALL cache rendered content
- **AND** MAY unmount on collapse if configured

### Requirement: Default State
The component SHALL support initial expansion state.

#### Scenario: All collapsed
- **WHEN** no default state is provided
- **THEN** all items SHALL be collapsed initially

#### Scenario: Specified items expanded
- **WHEN** defaultExpandedKeys is provided
- **THEN** SHALL expand specified items on mount
- **AND** SHALL respect allowMultiple setting
