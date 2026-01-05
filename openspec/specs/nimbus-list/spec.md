# Specification: List Component

## Overview

The List component provides styled, accessible list structures for displaying ordered and unordered content with consistent spacing, customizable markers, and optional icons.

**Component:** `List` (compound namespace)
**Package:** `@commercetools/nimbus`
**Type:** Compound component (multi-slot recipe)
**React Aria:** Uses native HTML list elements (`<ul>`, `<ol>`) with Chakra UI styling

## Purpose

The List component provides a flexible, accessible system for rendering ordered and unordered lists with consistent spacing, customizable markers, and optional custom indicators. It supports semantic HTML list structures, nested lists, interactive items, and follows WCAG 2.1 AA accessibility standards through native list element semantics.

## Requirements

### Requirement: Namespace Structure
The component SHALL export as compound component namespace.

#### Scenario: Component parts
- **WHEN** List is imported
- **THEN** SHALL provide List.Root as list container
- **AND** SHALL provide List.Item for individual list items
- **AND** SHALL provide List.Indicator for custom item markers
- **AND** Root SHALL be first property in namespace

### Requirement: List Element Support
The component SHALL support both ordered and unordered lists.

#### Scenario: Unordered list
- **WHEN** List.Root wraps `<ul>` element via asChild
- **THEN** SHALL render semantic unordered list
- **AND** SHALL display bullet markers by default
- **AND** SHALL apply list-style-type from recipe

#### Scenario: Ordered list
- **WHEN** List.Root wraps `<ol>` element via asChild
- **THEN** SHALL render semantic ordered list
- **AND** SHALL display numeric markers by default
- **AND** SHALL apply list-style-type from recipe
- **AND** SHALL support start attribute for custom starting number

#### Scenario: Plain list
- **WHEN** variant="plain" is set
- **THEN** SHALL render without default list markers
- **AND** SHALL use List.Indicator for custom markers
- **AND** SHALL maintain semantic list structure

### Requirement: Item Rendering
The component SHALL provide consistent item structure.

#### Scenario: Basic item
- **WHEN** List.Item renders
- **THEN** SHALL render as semantic `<li>` element
- **AND** SHALL inherit spacing from root configuration
- **AND** SHALL apply item slot styling
- **AND** SHALL support inline and block content

#### Scenario: Item with indicator
- **WHEN** List.Item contains List.Indicator
- **THEN** SHALL position indicator before item content
- **AND** SHALL apply appropriate spacing between indicator and content
- **AND** SHALL align indicator with first line of content
- **AND** SHALL support custom icons, checkmarks, or bullets

### Requirement: Indicator Support
The component SHALL support custom list item markers.

#### Scenario: Icon indicator
- **WHEN** List.Indicator contains icon component
- **THEN** SHALL render icon before item text
- **AND** SHALL apply indicator slot styling
- **AND** SHALL align icon with text baseline
- **AND** SHALL support any icon from nimbus-icons

#### Scenario: Custom content indicator
- **WHEN** List.Indicator contains custom content
- **THEN** SHALL render custom content as marker
- **AND** SHALL maintain consistent positioning
- **AND** SHALL support text, symbols, or images

#### Scenario: Indicator sizing
- **WHEN** indicator renders
- **THEN** SHALL match text line height
- **AND** SHALL prevent shrinking with flex layout
- **AND** SHALL maintain vertical alignment

### Requirement: Item Spacing Options
The component SHALL support multiple spacing configurations.

#### Scenario: Gap control
- **WHEN** List.Root sets gap via CSS variable
- **THEN** SHALL apply consistent spacing between items
- **AND** SHALL use design token values
- **AND** SHALL support responsive spacing via Chakra style props

#### Scenario: Nested list spacing
- **WHEN** list contains nested lists
- **THEN** SHALL apply top margin to nested `<ul>` or `<ol>`
- **AND** SHALL use same gap value as parent
- **AND** SHALL maintain visual hierarchy

### Requirement: Styling Variants
The component SHALL support multiple visual styles.

#### Scenario: Marker variant
- **WHEN** variant="marker" is set (default)
- **THEN** SHALL display default list markers (bullets or numbers)
- **AND** SHALL position markers inside content flow
- **AND** SHALL apply subtle color to markers
- **AND** SHALL use listStylePosition: inside

#### Scenario: Plain variant
- **WHEN** variant="plain" is set
- **THEN** SHALL hide default markers
- **AND** SHALL require List.Indicator for custom markers
- **AND** SHALL render items as inline-flex containers
- **AND** SHALL support custom alignment

### Requirement: Item Alignment
The component SHALL support vertical alignment within items.

#### Scenario: Start alignment
- **WHEN** align="start" is set
- **THEN** SHALL align item content to flex-start
- **AND** SHALL position indicators at top of multi-line content

#### Scenario: Center alignment
- **WHEN** align="center" is set
- **THEN** SHALL align item content to center
- **AND** SHALL vertically center indicators with content

#### Scenario: End alignment
- **WHEN** align="end" is set
- **THEN** SHALL align item content to flex-end
- **AND** SHALL position indicators at bottom of multi-line content

### Requirement: List Nesting Support
The component SHALL support nested list structures.

#### Scenario: Nested unordered lists
- **WHEN** List.Item contains nested List.Root with `<ul>`
- **THEN** SHALL render nested list with visual indentation
- **AND** SHALL apply top margin to nested list
- **AND** SHALL change marker style (disc → circle → square pattern)
- **AND** SHALL maintain independent styling

#### Scenario: Nested ordered lists
- **WHEN** List.Item contains nested List.Root with `<ol>`
- **THEN** SHALL render nested list with indentation
- **AND** SHALL apply independent numbering
- **AND** SHALL support different number formats per level
- **AND** SHALL maintain proper semantic hierarchy

#### Scenario: Mixed nesting
- **WHEN** ordered and unordered lists are nested
- **THEN** SHALL maintain proper semantic structure
- **AND** SHALL apply appropriate markers for each type
- **AND** SHALL preserve spacing and indentation

### Requirement: Ordered List Options
The component SHALL support ordered list customization.

#### Scenario: Number format
- **WHEN** `<ol>` has type attribute
- **THEN** SHALL support: "1" (decimal), "a" (lowercase alpha), "A" (uppercase alpha), "i" (lowercase roman), "I" (uppercase roman)
- **AND** SHALL render appropriate number format
- **AND** SHALL maintain consistent formatting throughout list

#### Scenario: Start value
- **WHEN** `<ol>` has start attribute
- **THEN** SHALL begin numbering from specified value
- **AND** SHALL continue sequential numbering
- **AND** SHALL support negative and zero values

#### Scenario: Reversed numbering
- **WHEN** `<ol>` has reversed attribute
- **THEN** SHALL number items in descending order
- **AND** SHALL start from total count or specified start value
- **AND** SHALL decrement for each item

### Requirement: Interactive Item Support
The component SHALL support interactive list items.

#### Scenario: Clickable items
- **WHEN** List.Item contains clickable elements
- **THEN** SHALL support button or link children
- **AND** SHALL maintain proper semantic structure
- **AND** SHALL provide hover and focus states
- **AND** SHALL maintain WCAG touch target sizes

#### Scenario: Keyboard navigation
- **WHEN** list contains interactive items
- **THEN** SHALL support Tab key navigation
- **AND** SHALL maintain logical focus order
- **AND** SHALL provide visible focus indicators
- **AND** SHALL not interfere with child element keyboard handling

### Requirement: Marker Customization
The component SHALL support marker appearance customization.

#### Scenario: Marker color
- **WHEN** variant="marker" is set
- **THEN** SHALL apply fg.subtle color to markers
- **AND** SHALL use _marker pseudo-element selector
- **AND** SHALL support design token colors

#### Scenario: Marker position
- **WHEN** markers render
- **THEN** SHALL position inside content flow by default
- **AND** listStylePosition: inside SHALL be applied
- **AND** SHALL support outside positioning via style props

### Requirement: Empty State Handling
The component SHALL handle empty list states appropriately.

#### Scenario: No items
- **WHEN** List.Root contains no List.Item children
- **THEN** SHALL render empty list structure
- **AND** SHALL maintain semantic markup
- **AND** SHALL not display any markers or spacing

### Requirement: ARIA List Pattern
The component SHALL implement semantic HTML list pattern per nimbus-core standards.

#### Scenario: List roles
- **WHEN** list renders with semantic elements
- **THEN** `<ul>` or `<ol>` SHALL have implicit role="list"
- **AND** `<li>` elements SHALL have implicit role="listitem"
- **AND** SHALL not require explicit ARIA roles
- **AND** SHALL maintain semantic structure for screen readers

#### Scenario: List announcements
- **WHEN** screen reader encounters list
- **THEN** SHALL announce list type (ordered/unordered)
- **AND** SHALL announce item count
- **AND** SHALL announce current item position
- **AND** SHALL announce nested list depth

#### Scenario: Interactive item accessibility
- **WHEN** list items are interactive
- **THEN** SHALL maintain proper focus order
- **AND** SHALL provide accessible names for interactive elements
- **AND** SHALL announce item state changes
- **AND** SHALL support keyboard interaction

### Requirement: Multi-Slot Recipe
The component SHALL use multi-slot recipe per nimbus-core standards.

#### Scenario: Slot styling
- **WHEN** list renders
- **THEN** SHALL apply list slot recipe from theme/slot-recipes/list.ts
- **AND** SHALL style: root, item, indicator slots
- **AND** SHALL support variant options (marker, plain)
- **AND** SHALL support align options (start, center, end)

#### Scenario: CSS variables
- **WHEN** list renders
- **THEN** SHALL use --list-gap variable for spacing
- **AND** SHALL cascade to nested lists
- **AND** SHALL support override via style props

#### Scenario: Responsive styling
- **WHEN** list uses Chakra style props
- **THEN** SHALL support responsive arrays and objects
- **AND** SHALL apply breakpoint-specific styles
- **AND** SHALL use design token breakpoints

### Requirement: Chakra Style Props
The component SHALL support Chakra UI style props.

#### Scenario: Style props on Root
- **WHEN** List.Root receives style props
- **THEN** SHALL support spacing props (margin, padding, gap)
- **AND** SHALL support layout props (display, flexDirection)
- **AND** SHALL support color props (color, backgroundColor)
- **AND** SHALL merge with recipe styles

#### Scenario: Style props on Item
- **WHEN** List.Item receives style props
- **THEN** SHALL support all Chakra style props
- **AND** SHALL merge with slot styles
- **AND** SHALL support responsive values

#### Scenario: Style props on Indicator
- **WHEN** List.Indicator receives style props
- **THEN** SHALL support spacing and sizing props
- **AND** SHALL support color props
- **AND** SHALL maintain alignment behavior

### Requirement: Ref Support
The component SHALL support ref forwarding to underlying elements.

#### Scenario: Root ref
- **WHEN** ref is passed to List.Root
- **THEN** SHALL forward ref to underlying list element (`<ul>` or `<ol>`)
- **AND** SHALL provide access to DOM element
- **AND** SHALL support useRef and createRef

#### Scenario: Item ref
- **WHEN** ref is passed to List.Item
- **THEN** SHALL forward ref to `<li>` element
- **AND** SHALL provide access to list item element

### Requirement: Optimized Rendering
The component SHALL optimize for performance.

#### Scenario: Large lists
- **WHEN** list contains many items (100+)
- **THEN** SHALL render efficiently without virtualization
- **AND** SHALL use native list elements for browser optimization
- **AND** SHALL support virtualization via external libraries if needed

#### Scenario: Nested list rendering
- **WHEN** list contains deeply nested structures
- **THEN** SHALL render without performance degradation
- **AND** SHALL cascade styles efficiently
- **AND** SHALL minimize layout recalculations

### Requirement: Type Definitions
The component SHALL provide comprehensive TypeScript types.

#### Scenario: Component props types
- **WHEN** component is used in TypeScript
- **THEN** SHALL export ListRootProps interface
- **AND** SHALL export ListItemProps interface
- **AND** SHALL export ListIndicatorProps interface
- **AND** SHALL include JSDoc comments for all props

#### Scenario: Recipe types
- **WHEN** component uses recipes
- **THEN** SHALL export ListSlotRecipeProps with auto-generated variant types
- **AND** SHALL provide autocomplete for variant values
- **AND** SHALL support type-safe slot props

### Requirement: Chakra AsChild Support
The component SHALL support Chakra's asChild pattern for semantic flexibility.

#### Scenario: AsChild on Root
- **WHEN** List.Root has asChild prop
- **THEN** SHALL merge props with child element
- **AND** SHALL preserve semantic list element (`<ul>` or `<ol>`)
- **AND** SHALL apply recipe styling to child
- **AND** SHALL maintain ref forwarding

#### Scenario: AsChild on Item
- **WHEN** List.Item has asChild prop
- **THEN** SHALL merge props with child element
- **AND** SHALL preserve `<li>` element semantics
- **AND** SHALL apply slot styling

### Requirement: Theme Integration
The component SHALL be registered in Chakra theme.

#### Scenario: Recipe registration
- **WHEN** component is added to nimbus package
- **THEN** SHALL register listSlotRecipe in theme/slot-recipes/index.ts
- **AND** SHALL export recipe with className: "nimbus-list"
- **AND** SHALL define all slots (root, item, indicator)
- **AND** CRITICAL: registration SHALL be manual (no auto-discovery)

### Requirement: Component Identification
The component SHALL set display names for debugging.

#### Scenario: Display names
- **WHEN** component renders in React DevTools
- **THEN** List.Root SHALL have displayName "ListRoot"
- **AND** List.Item SHALL have displayName "ListItem"
- **AND** List.Indicator SHALL have displayName "ListIndicator"
- **AND** namespace SHALL have displayName "List"
