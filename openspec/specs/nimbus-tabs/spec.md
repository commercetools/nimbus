# Specification: Tabs Component

## Purpose

The Tabs component provides an accessible tabbed interface for organizing content into separate panels, following ARIA tabs pattern. It is a compound component namespace with multi-slot recipe styling that supports horizontal and vertical layouts, keyboard navigation, and multiple visual variants per nimbus-core standards.

**Component:** `Tabs` (compound namespace)
**Package:** `@commercetools/nimbus`
**Type:** Compound component (multi-slot recipe)
**React Aria:** Uses `Tabs`, `TabList`, `Tab`, `TabPanel` from react-aria-components

## Requirements

### Requirement: Namespace Structure
The component SHALL export as compound component namespace.

#### Scenario: Component parts
- **WHEN** Tabs is imported
- **THEN** SHALL provide Tabs.Root as tabs container
- **AND** SHALL provide Tabs.List for tab buttons container
- **AND** SHALL provide Tabs.Tab for individual tab buttons
- **AND** SHALL provide Tabs.Panel for tab content panels
- **AND** Root SHALL be first property in namespace

### Requirement: Single Panel Display
The component SHALL show one panel at a time.

#### Scenario: Controlled mode
- **WHEN** selectedKey and onSelectionChange props are provided to Root
- **THEN** SHALL display panel for selected tab
- **AND** SHALL call onSelectionChange when tab changes
- **AND** SHALL not update internal state

#### Scenario: Uncontrolled mode
- **WHEN** defaultSelectedKey prop is provided without selectedKey
- **THEN** SHALL initialize with default tab selected
- **AND** SHALL manage state internally
- **AND** optional onSelectionChange SHALL receive updates

#### Scenario: Initial selection
- **WHEN** no selection props are provided
- **THEN** SHALL select first enabled tab by default
- **AND** SHALL display its associated panel

### Requirement: Activation Behavior
The component SHALL control when tabs activate.

#### Scenario: Automatic activation
- **WHEN** keyboardActivation="automatic" (default)
- **THEN** focus SHALL immediately activate tab and show panel
- **AND** arrow keys SHALL change both focus and selection

#### Scenario: Manual activation
- **WHEN** keyboardActivation="manual" is set
- **THEN** arrow keys SHALL only move focus
- **AND** Space or Enter SHALL activate focused tab
- **AND** SHALL provide better control for expensive panels

### Requirement: Tab List Navigation
The component SHALL support keyboard navigation per nimbus-core standards.

#### Scenario: Arrow key navigation
- **WHEN** tab list has focus and user presses ArrowRight
- **THEN** SHALL move focus to next tab (wrap to first if at end)
- **WHEN** user presses ArrowLeft
- **THEN** SHALL move focus to previous tab (wrap to last if at beginning)
- **AND** SHALL skip disabled tabs

#### Scenario: Home and End keys
- **WHEN** user presses Home
- **THEN** SHALL focus first enabled tab
- **WHEN** user presses End
- **THEN** SHALL focus last enabled tab

#### Scenario: Tab key
- **WHEN** user presses Tab
- **THEN** SHALL move focus from tab list to panel content
- **OR** to next focusable element outside tabs
- **WHEN** Shift+Tab is pressed
- **THEN** SHALL move focus to previous focusable element

### Requirement: Layout Direction
The component SHALL support horizontal and vertical tab lists.

#### Scenario: Horizontal orientation
- **WHEN** orientation="horizontal" (default)
- **THEN** SHALL arrange tabs horizontally
- **AND** SHALL use ArrowLeft/Right for navigation
- **AND** panels SHALL appear below tab list

#### Scenario: Vertical orientation
- **WHEN** orientation="vertical" is set
- **THEN** SHALL arrange tabs vertically
- **AND** SHALL use ArrowUp/Down for navigation
- **AND** panels SHALL appear to right of tab list
- **AND** SHALL support RTL layout

### Requirement: Tab State Management
The component SHALL support tab state variations.

#### Scenario: Selected state
- **WHEN** tab is selected
- **THEN** SHALL apply selected styling
- **AND** SHALL show visual indicator (underline or highlight)
- **AND** SHALL set aria-selected="true"
- **AND** SHALL set tabindex="0"

#### Scenario: Unselected state
- **WHEN** tab is not selected
- **THEN** SHALL apply inactive styling
- **AND** SHALL set aria-selected="false"
- **AND** SHALL set tabindex="-1"

#### Scenario: Disabled tabs
- **WHEN** Tab has disabled={true}
- **THEN** SHALL apply disabled styling
- **AND** SHALL skip during keyboard navigation
- **AND** SHALL not be selectable
- **AND** SHALL set aria-disabled="true"

### Requirement: Panel Management
The component SHALL manage panel visibility.

#### Scenario: Active panel
- **WHEN** tab is selected
- **THEN** SHALL render and display associated panel
- **AND** SHALL apply visible styling
- **AND** panel content SHALL be in document flow

#### Scenario: Inactive panels
- **WHEN** tab is not selected
- **THEN** panel SHALL be hidden via display:none
- **OR** removed from DOM (if destroyInactiveTabPanel={true})
- **AND** SHALL set aria-hidden="true"

#### Scenario: Panel association
- **WHEN** panels render
- **THEN** each Tab SHALL associate with Panel via ID
- **AND** Tab SHALL use aria-controls to reference panel
- **AND** Panel SHALL use aria-labelledby to reference tab

### Requirement: Visual Variants
The component SHALL support multiple visual styles.

#### Scenario: Line variant
- **WHEN** variant="line" (default)
- **THEN** SHALL show underline indicator for selected tab
- **AND** SHALL position indicator at bottom (horizontal) or side (vertical)

#### Scenario: Enclosed variant
- **WHEN** variant="enclosed" is set
- **THEN** SHALL show tabs as enclosed buttons
- **AND** selected tab SHALL appear connected to panel

### Requirement: Size Options
The component SHALL support multiple size variants per nimbus-core standards.

#### Scenario: Size variants
- **WHEN** size prop is set on Root
- **THEN** SHALL support: sm, md, lg
- **AND** SHALL adjust tab height, padding, and font size
- **AND** md SHALL be default size

### Requirement: Tab Collection Management
The component SHALL support dynamic tab collections.

#### Scenario: Static tabs
- **WHEN** Tab components are children of TabList
- **THEN** SHALL render tabs in order provided

#### Scenario: Dynamic tabs
- **WHEN** items prop is provided to TabList
- **THEN** SHALL render tabs from data array
- **AND** SHALL use render props for tab content
- **AND** SHALL support collection-based rendering

### Requirement: Performance Optimization
The component SHALL support lazy panel rendering.

#### Scenario: Lazy panels
- **WHEN** panel content is expensive to render
- **THEN** SHALL delay rendering until tab is selected
- **AND** destroyInactiveTabPanel SHALL control unmounting
- **AND** SHALL improve initial load performance

### Requirement: ARIA Tabs Pattern
The component SHALL implement ARIA tabs pattern per nimbus-core standards.

#### Scenario: Tab roles
- **WHEN** tabs render
- **THEN** TabList SHALL have role="tablist"
- **AND** each Tab SHALL have role="tab"
- **AND** each Panel SHALL have role="tabpanel"
- **AND** Root SHALL provide context for associations

#### Scenario: Tab attributes
- **WHEN** tab renders
- **THEN** SHALL set aria-selected to reflect state
- **AND** SHALL set aria-controls to reference panel
- **AND** SHALL set aria-disabled for disabled tabs

#### Scenario: Panel attributes
- **WHEN** panel renders
- **THEN** SHALL set aria-labelledby to reference tab
- **AND** SHALL set tabindex="0" for keyboard focus
- **AND** SHALL set aria-hidden when inactive

#### Scenario: Focus management
- **WHEN** tabs are navigated
- **THEN** SHALL use roving tabindex for tab list
- **AND** SHALL maintain logical focus order
- **AND** SHALL provide visible focus indicators

### Requirement: Tab Overflow
The component SHALL handle overflow when tabs exceed container width.

#### Scenario: Horizontal scrolling
- **WHEN** tabs overflow horizontally
- **THEN** SHALL enable horizontal scrolling
- **AND** SHALL show scroll indicators (shadows or buttons)
- **AND** SHALL allow keyboard navigation through scrolled tabs

### Requirement: Multi-Slot Recipe
The component SHALL use multi-slot recipe per nimbus-core standards.

#### Scenario: Slot styling
- **WHEN** tabs render
- **THEN** SHALL apply tabs slot recipe from theme/slot-recipes/tabs.ts
- **AND** SHALL style: root, tabList, tab, indicator, panel slots
- **AND** SHALL support size and variant options
- **AND** SHALL support orientation styles

### Requirement: Panel Animations
The component SHALL optionally animate panel transitions.

#### Scenario: Fade transition
- **WHEN** tab changes
- **THEN** previous panel SHALL fade out
- **AND** new panel SHALL fade in
- **AND** SHALL use duration from design tokens

### Requirement: Tab State Persistence
The component SHALL optionally persist selected tab.

#### Scenario: URL integration
- **WHEN** tab selection should persist across navigations
- **THEN** selected key MAY sync with URL hash
- **AND** SHALL restore selection from URL on mount
