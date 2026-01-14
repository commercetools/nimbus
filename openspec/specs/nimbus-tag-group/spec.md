# Specification: TagGroup Component

## Overview

The TagGroup component provides a focusable list of labels, categories, keywords, filters, or other items with support for keyboard navigation, selection, and removal. It uses compound component architecture with TagGroup.Root, TagGroup.TagList, and TagGroup.Tag.

**Component:** `TagGroup` (namespace export)
**Package:** `@commercetools/nimbus`
**Type:** Compound component (multi-slot recipe)
**React Aria:** Uses `TagGroup`, `TagList`, and `Tag` from react-aria-components

## Purpose

The TagGroup capability provides a structured collection of tags for displaying and managing related items such as applied filters, selected categories, or keyword lists. It offers multiple interaction modes including selection (single or multiple), removal, and keyboard navigation. The component follows WCAG 2.1 AA accessibility standards and implements appropriate ARIA patterns for grid-based keyboard navigation.

## Requirements

### Requirement: Namespace Structure
The component SHALL export as compound component namespace.

#### Scenario: Component parts
- **WHEN** TagGroup is imported
- **THEN** SHALL provide TagGroup.Root as group wrapper
- **AND** SHALL provide TagGroup.TagList as tag container
- **AND** SHALL provide TagGroup.Tag for individual tags
- **AND** Root SHALL be first property in namespace

### Requirement: Tag Display
The component SHALL render a collection of tags in a list.

#### Scenario: Tag rendering
- **WHEN** TagList contains Tag children
- **THEN** SHALL render all tags in visual order
- **AND** SHALL display tag text content
- **AND** SHALL apply consistent styling via recipe
- **AND** SHALL wrap tags to multiple lines if needed

#### Scenario: Dynamic tag list
- **WHEN** TagList receives items prop with data array
- **THEN** SHALL render tags from array using render function
- **AND** SHALL support dynamic addition and removal
- **AND** SHALL maintain keyboard navigation state
- **AND** SHALL work with react-stately's useListData hook

#### Scenario: Empty state
- **WHEN** TagList has no tags
- **THEN** SHALL render empty state if renderEmptyState provided
- **AND** SHALL display custom empty content
- **AND** SHALL maintain proper semantic structure

### Requirement: Tag Removal Mode
The component SHALL support removing individual tags when onRemove handler is provided.

#### Scenario: Remove button rendering
- **WHEN** Root has onRemove prop
- **THEN** each Tag SHALL display remove button (IconButton with Close icon)
- **AND** remove button SHALL be 2xs size
- **AND** SHALL have appropriate aria-label for accessibility
- **AND** SHALL use i18n message "Remove tag"

#### Scenario: Mouse removal
- **WHEN** user clicks tag remove button
- **THEN** SHALL call onRemove with Set containing tag id
- **AND** SHALL allow parent to update tag collection
- **AND** SHALL maintain focus on remaining tags

#### Scenario: Keyboard removal
- **WHEN** tag is focused and user presses Backspace or Delete
- **THEN** SHALL call onRemove with Set containing tag id
- **AND** SHALL allow parent to remove tag from collection
- **AND** SHALL move focus to next available tag

#### Scenario: Removal disabled during selection modes
- **WHEN** selectionMode is "single" or "multiple"
- **THEN** SHALL NOT render remove buttons on tags
- **AND** SHALL log console warning about incompatibility
- **AND** SHALL prevent removal via keyboard

### Requirement: Selection Mode - None
The component SHALL support non-selectable tag display mode.

#### Scenario: No selection state
- **WHEN** selectionMode is not specified or set to "none"
- **THEN** SHALL render tags without selection capability
- **AND** SHALL NOT apply selected state styling
- **AND** tags SHALL be keyboard navigable but not selectable
- **AND** SHALL implement ARIA grid pattern with role="grid"

### Requirement: Selection Mode - Single
The component SHALL support single selection mode where only one tag can be selected.

#### Scenario: Single selection state
- **WHEN** selectionMode="single"
- **THEN** SHALL allow only one tag to be selected at a time
- **AND** SHALL deselect previously selected tag when new tag is selected
- **AND** SHALL allow deselecting by clicking selected tag again
- **AND** SHALL implement ARIA grid pattern with role="grid"

#### Scenario: Single selection controlled mode
- **WHEN** selectedKeys prop contains single value (Set with one item)
- **THEN** SHALL render with specified tag selected
- **AND** SHALL call onSelectionChange with new Set containing selected id
- **AND** SHALL NOT update internal state

#### Scenario: Single selection uncontrolled mode
- **WHEN** defaultSelectedKeys prop is provided without selectedKeys
- **THEN** SHALL initialize with default selection
- **AND** SHALL manage state internally via React Aria
- **AND** optional onSelectionChange SHALL receive state updates

#### Scenario: Single selection keyboard interaction
- **WHEN** tag is focused and user presses Enter
- **THEN** SHALL toggle tag selection state
- **AND** SHALL deselect other tags if selecting new tag
- **AND** SHALL call onSelectionChange handler

#### Scenario: Single selection mouse interaction
- **WHEN** user clicks tag in single selection mode
- **THEN** SHALL toggle tag selection state
- **AND** SHALL deselect other tags if selecting new tag
- **AND** SHALL call onSelectionChange handler

### Requirement: Selection Mode - Multiple
The component SHALL support multiple selection mode where multiple tags can be selected.

#### Scenario: Multiple selection state
- **WHEN** selectionMode="multiple"
- **THEN** SHALL allow multiple tags to be selected simultaneously
- **AND** SHALL toggle individual tag selection independently
- **AND** clicking selected tag SHALL deselect it without affecting others
- **AND** SHALL implement ARIA grid pattern with role="grid"

#### Scenario: Multiple selection controlled mode
- **WHEN** selectedKeys prop contains multiple values (Set with multiple items)
- **THEN** SHALL render with specified tags selected
- **AND** SHALL call onSelectionChange with new Set containing all selected ids
- **AND** SHALL NOT update internal state

#### Scenario: Multiple selection uncontrolled mode
- **WHEN** defaultSelectedKeys prop is provided with multiple values
- **THEN** SHALL initialize with multiple selections
- **AND** SHALL manage state internally via React Aria
- **AND** optional onSelectionChange SHALL receive state updates

#### Scenario: Multiple selection keyboard interaction
- **WHEN** tag is focused and user presses Enter
- **THEN** SHALL toggle tag selection independently
- **AND** SHALL NOT affect other tag selections
- **AND** SHALL call onSelectionChange with complete Set of selected ids

#### Scenario: Multiple selection mouse interaction
- **WHEN** user clicks tag in multiple selection mode
- **THEN** SHALL toggle tag selection independently
- **AND** SHALL maintain other tag selections
- **AND** SHALL call onSelectionChange with complete Set of selected ids

### Requirement: Tag Value Tracking
Each TagGroup.Tag SHALL have unique identifier for selection and removal tracking.

#### Scenario: Tag id assignment
- **WHEN** TagGroup.Tag has id prop
- **THEN** SHALL use id as unique value for tracking
- **AND** id SHALL be used in selectedKeys Set
- **AND** id MUST be unique within the group

#### Scenario: Tag textValue for accessibility
- **WHEN** Tag children is string
- **THEN** SHALL extract string as textValue for React Aria
- **AND** SHALL provide accessible text announcement
- **AND** SHALL support screen reader navigation

### Requirement: Keyboard Navigation
The component SHALL support keyboard navigation between tags per nimbus-core standards.

#### Scenario: Arrow key navigation
- **WHEN** tag is focused and user presses ArrowRight
- **THEN** SHALL move focus to next tag
- **AND** SHALL wrap to first tag if at end
- **WHEN** user presses ArrowLeft
- **THEN** SHALL move focus to previous tag
- **AND** SHALL wrap to last tag if at beginning

#### Scenario: Tab navigation
- **WHEN** user presses Tab outside group
- **THEN** SHALL move focus to first tag in group
- **WHEN** Tab is pressed while tag has focus
- **THEN** SHALL move focus to next focusable element outside group
- **WHEN** Shift+Tab is pressed
- **THEN** SHALL move focus to previous focusable element outside group

#### Scenario: Focus management with roving tabindex
- **WHEN** group receives focus
- **THEN** SHALL focus first tag in group
- **AND** only one tag SHALL be in tab order at a time (tabindex="0")
- **AND** other tags SHALL have tabindex="-1"
- **AND** SHALL use roving tabindex pattern for arrow key navigation

### Requirement: Selection State Visual Feedback
The component SHALL provide visual feedback for tag selection state.

#### Scenario: Unselected tag styling
- **WHEN** tag is not selected (data-selected="false")
- **THEN** SHALL render with base background (colorPalette.3)
- **AND** SHALL use default text color from recipe
- **AND** cursor SHALL indicate focusable element

#### Scenario: Selected tag styling
- **WHEN** tag is selected (data-selected="true" or aria-selected="true")
- **THEN** SHALL render with enhanced background (colorPalette.9)
- **AND** SHALL use contrast text color (colorPalette.contrast)
- **AND** cursor SHALL change to "button" to indicate interactivity
- **AND** SHALL provide clear visual distinction from unselected state

### Requirement: Size Options
The component SHALL support size variants that propagate to all tags.

#### Scenario: Small size
- **WHEN** size="sm" is set on Root
- **THEN** SHALL apply sm size to all tags in group
- **AND** tags SHALL render with minHeight 600 (24px)
- **AND** SHALL use fontSize 350 and lineHeight 400
- **AND** SHALL apply paddingX 200 (horizontal padding)

#### Scenario: Medium size
- **WHEN** size="md" is set on Root
- **THEN** SHALL apply md size to all tags in group
- **AND** tags SHALL render with minHeight 800 (32px)
- **AND** SHALL use fontSize 400 and lineHeight 500
- **AND** SHALL apply paddingX 200 and paddingY 100

#### Scenario: Large size (default)
- **WHEN** size="lg" is set or no size specified on Root
- **THEN** SHALL apply lg size to all tags in group
- **AND** tags SHALL render with minHeight 1000 (40px)
- **AND** SHALL use fontSize 400 and lineHeight 500
- **AND** SHALL apply padding 200 on all sides

### Requirement: Semantic Color Palettes
The component SHALL support semantic color palettes that propagate to all tags.

#### Scenario: Color palette application
- **WHEN** colorPalette prop is set on Root or individual Tag
- **THEN** SHALL support all semantic palettes: primary, neutral, info, positive, warning, critical
- **AND** SHALL apply colorPalette to tag background and text
- **AND** SHALL use colorPalette.3 for unselected background
- **AND** SHALL use colorPalette.9 for selected background
- **AND** SHALL use colorPalette.contrast for selected text

#### Scenario: Default color palette
- **WHEN** colorPalette is not specified
- **THEN** SHALL use primary as default palette
- **AND** SHALL maintain consistent appearance

#### Scenario: Color accessibility
- **WHEN** any colorPalette is applied
- **THEN** SHALL maintain WCAG AA contrast ratios
- **AND** SHALL support light and dark modes via semantic tokens

### Requirement: Tag Layout and Spacing
The component SHALL apply consistent layout to tag group and list.

#### Scenario: Root layout
- **WHEN** Root renders
- **THEN** SHALL use flex column layout
- **AND** SHALL apply vertical gap of 50 between children
- **AND** SHALL allow label and other content around TagList

#### Scenario: TagList layout
- **WHEN** TagList renders
- **THEN** SHALL use flex layout with wrap
- **AND** SHALL apply gap of 100 between tags
- **AND** SHALL allow tags to flow to multiple lines

#### Scenario: Tag internal layout
- **WHEN** Tag renders with content
- **THEN** SHALL use flex layout with centered alignment
- **AND** SHALL apply gap of 100 between text and remove button
- **AND** SHALL apply border radius 200 for pill shape

### Requirement: Tag Disabled State
Individual tags SHALL support disabled state.

#### Scenario: Disabled tag
- **WHEN** Tag has data-disabled="true"
- **THEN** SHALL apply disabled layer style
- **AND** SHALL set pointerEvents to "none"
- **AND** SHALL skip during keyboard navigation
- **AND** SHALL not be selectable or removable
- **AND** SHALL maintain visual presence with reduced opacity

### Requirement: ARIA Grid Pattern
The component SHALL implement ARIA grid pattern per nimbus-core standards.

#### Scenario: Grid roles
- **WHEN** TagGroup renders
- **THEN** Root SHALL establish grid container context
- **AND** TagList SHALL have role="grid"
- **AND** each Tag SHALL have role="row"
- **AND** tag content SHALL have role="gridcell"

#### Scenario: Grid labeling
- **WHEN** group renders
- **THEN** SHALL have accessible label via aria-label or aria-labelledby
- **AND** label SHALL describe purpose of tag group
- **AND** SHALL be announced by screen readers

#### Scenario: Selection state announcements
- **WHEN** tag selection changes
- **THEN** SHALL use aria-selected attribute for screen readers
- **AND** SHALL announce new selection state
- **AND** SHALL provide clear indication of selected/unselected

#### Scenario: Grid navigation semantics
- **WHEN** user navigates with keyboard
- **THEN** SHALL follow ARIA grid keyboard patterns
- **AND** SHALL support ArrowLeft/Right for navigation
- **AND** SHALL support Enter for selection/action
- **AND** SHALL support Backspace/Delete for removal

### Requirement: Internationalization
The component SHALL support internationalization for UI text.

#### Scenario: Remove button label
- **WHEN** Tag renders with remove button
- **THEN** SHALL use i18n message for aria-label
- **AND** SHALL use message id "Nimbus.TagGroup.removeTag"
- **AND** SHALL default to "Remove tag"
- **AND** SHALL support all 5 Nimbus locales (en, de, es, fr-FR, pt-BR)

### Requirement: Multi-Slot Recipe
The component SHALL use multi-slot recipe per nimbus-core standards.

#### Scenario: Slot styling
- **WHEN** group renders
- **THEN** SHALL apply tagGroupSlotRecipe from tag-group.recipe.tsx
- **AND** SHALL style: root, tagList, tag slots
- **AND** SHALL support design tokens for spacing, colors, borders, shadows
- **AND** recipe SHALL be registered in theme/slot-recipes/index.ts

#### Scenario: Recipe variants
- **WHEN** recipe applies
- **THEN** SHALL support size variants: sm, md, lg
- **AND** SHALL use defaultVariants: { size: "lg" }
- **AND** SHALL apply variant styles to appropriate slots

#### Scenario: Recipe base styles
- **WHEN** recipe base is applied
- **THEN** root SHALL have flex column with gap
- **AND** tagList SHALL have flex with wrap and gap
- **AND** tag SHALL have flex with center alignment, border radius, background

### Requirement: Recipe Context Propagation
The component SHALL use Chakra's slot recipe context to propagate styling.

#### Scenario: Context provider
- **WHEN** Root renders
- **THEN** SHALL create slot recipe context using createSlotRecipeContext
- **AND** SHALL use withProvider to wrap React Aria TagGroup
- **AND** SHALL pass recipe key "taggroup" to provider
- **AND** SHALL make context available to child components

#### Scenario: Context consumers
- **WHEN** TagList and Tag render
- **THEN** SHALL consume recipe context using withContext
- **AND** TagList SHALL apply "tagList" slot styles
- **AND** Tag SHALL apply "tag" slot styles
- **AND** SHALL merge recipe styles with React Aria functionality

### Requirement: Namespace Export
The component SHALL be properly exported as compound component.

#### Scenario: Compound export
- **WHEN** component is imported
- **THEN** SHALL export TagGroup namespace object
- **AND** SHALL have Root as first property
- **AND** SHALL have TagList as second property
- **AND** SHALL have Tag as third property
- **AND** SHALL be available from @commercetools/nimbus package

#### Scenario: Display names
- **WHEN** components render in dev tools
- **THEN** Root SHALL have displayName "TagGroup.Root"
- **AND** TagList SHALL have displayName "TagGroup.TagList"
- **AND** Tag SHALL have displayName "TagGroup.Tag"
- **AND** SHALL support debugging and error messages

### Requirement: Comprehensive Type Definitions
The component SHALL provide complete TypeScript type definitions.

#### Scenario: Root props type
- **WHEN** TagGroupProps is defined
- **THEN** SHALL combine recipe variant props with React Aria TagGroupProps
- **AND** SHALL include size: "sm" | "md" | "lg"
- **AND** SHALL include colorPalette support via slot props
- **AND** SHALL include selectionMode: "none" | "single" | "multiple"
- **AND** SHALL include selectedKeys, defaultSelectedKeys, onSelectionChange
- **AND** SHALL include onRemove: (keys: Set<Key>) => void
- **AND** SHALL support ref as React.Ref<typeof RaTagGroup>

#### Scenario: TagList props type
- **WHEN** TagGroupTagListProps is defined
- **THEN** SHALL combine slot props with React Aria TagListProps
- **AND** SHALL support generic type parameter T for items
- **AND** SHALL include items prop for dynamic rendering
- **AND** SHALL include renderEmptyState for empty state
- **AND** SHALL support ref as React.Ref<HTMLDivElement>

#### Scenario: Tag props type
- **WHEN** TagGroupTagProps is defined
- **THEN** SHALL combine slot props with React Aria TagProps
- **AND** SHALL include id prop for value tracking
- **AND** SHALL include textValue for accessibility
- **AND** SHALL support ref as React.Ref<typeof RaTag>
- **AND** SHALL inherit all Chakra style props

#### Scenario: JSDoc documentation
- **WHEN** types are exported
- **THEN** SHALL include JSDoc comments for all props
- **AND** SHALL document size with @default "lg"
- **AND** SHALL document selectionMode options
- **AND** SHALL document state management patterns
- **AND** SHALL document ref forwarding

### Requirement: React Aria TagGroup Usage
The component SHALL use React Aria Components for accessibility and behavior.

#### Scenario: TagGroup component usage
- **WHEN** Root renders
- **THEN** SHALL use TagGroup from react-aria-components
- **AND** SHALL wrap with Chakra slot recipe provider
- **AND** SHALL forward all React Aria props (selectionMode, selectedKeys, onRemove)
- **AND** SHALL merge Chakra styling with React Aria functionality

#### Scenario: TagList component usage
- **WHEN** TagList renders
- **THEN** SHALL use TagList from react-aria-components
- **AND** SHALL wrap with Chakra slot recipe consumer
- **AND** SHALL forward all React Aria props (items, renderEmptyState)
- **AND** SHALL support generic type for items array

#### Scenario: Tag component usage
- **WHEN** Tag renders
- **THEN** SHALL use Tag from react-aria-components
- **AND** SHALL wrap with Chakra slot recipe consumer
- **AND** SHALL forward all React Aria props
- **AND** SHALL render children with render prop pattern for remove button

### Requirement: Remove Button Integration
Tag SHALL conditionally render remove button based on context.

#### Scenario: Remove button conditions
- **WHEN** Tag render prop receives context
- **THEN** SHALL check allowsRemoving from context
- **AND** SHALL check selectionMode is not "single" or "multiple"
- **AND** SHALL render IconButton only if both conditions met

#### Scenario: Remove button styling
- **WHEN** remove button renders
- **THEN** SHALL use IconButton component with size="2xs"
- **AND** SHALL use variant="solid" if tag is selected
- **AND** SHALL use variant="ghost" if tag is unselected
- **AND** SHALL use colorPalette="neutral" for ghost variant
- **AND** SHALL use Close icon from @commercetools/nimbus-icons
- **AND** SHALL set slot="remove" for React Aria integration

### Requirement: Visual Feedback for Interaction States
The component SHALL provide visual feedback for all interaction states.

#### Scenario: Default state
- **WHEN** tag renders without interaction
- **THEN** SHALL display base styling from recipe
- **AND** SHALL show current selected/unselected state
- **AND** SHALL be ready for interaction

#### Scenario: Hover state
- **WHEN** user hovers over tag
- **THEN** SHALL apply hover styling via data-hovered attribute
- **AND** SHALL provide visual feedback for interactivity

#### Scenario: Focus state
- **WHEN** tag receives keyboard focus
- **THEN** SHALL display visible focus indicator
- **AND** SHALL meet 3:1 contrast ratio requirement
- **AND** SHALL apply focusVisibleRing style with "outside" positioning
- **AND** SHALL be distinguishable from default and hover states

#### Scenario: Active/pressed state
- **WHEN** user actively presses tag (mouse down or key pressed)
- **THEN** SHALL provide visual feedback
- **AND** SHALL apply active state styling
- **AND** SHALL be distinguishable from hover state

### Requirement: Minimum Touch Target Size
The component SHALL meet minimum touch target requirements per nimbus-core standards.

#### Scenario: Touch target compliance
- **WHEN** tags render in any size
- **THEN** SHALL meet minimum 44x44px touch target through size or padding
- **AND** sm size (minHeight 600/24px) SHALL achieve target through padding
- **AND** md size (minHeight 800/32px) SHALL achieve target through padding
- **AND** lg size (minHeight 1000/40px) SHALL meet target directly
- **AND** SHALL provide adequate spacing between tags (gap 100)

### Requirement: Ref Forwarding
The component SHALL forward refs to underlying elements.

#### Scenario: Root ref forwarding
- **WHEN** ref prop is provided to Root
- **THEN** SHALL forward ref to React Aria TagGroup element
- **AND** SHALL support React.Ref<typeof RaTagGroup> type

#### Scenario: TagList ref forwarding
- **WHEN** ref prop is provided to TagList
- **THEN** SHALL forward ref to underlying div element
- **AND** SHALL support React.Ref<HTMLDivElement> type

#### Scenario: Tag ref forwarding
- **WHEN** ref prop is provided to Tag
- **THEN** SHALL forward ref to React Aria Tag element
- **AND** SHALL support React.Ref<typeof RaTag> type

### Requirement: Style Props Support
The component SHALL accept Chakra style props per nimbus-core standards.

#### Scenario: Style prop override
- **WHEN** style props are provided to any component part
- **THEN** SHALL accept all Chakra style props (margin, padding, width, etc.)
- **AND** SHALL apply responsive style values
- **AND** custom styles SHALL override recipe defaults
- **AND** SHALL maintain recipe base functionality

### Requirement: Testing and Metadata Support
The component SHALL accept data attributes.

#### Scenario: Data attributes
- **WHEN** data-* attributes are provided
- **THEN** SHALL forward all data attributes to root elements
- **AND** SHALL support testing attributes (data-testid)
- **AND** SHALL support custom metadata attributes

### Requirement: Theme Registration
The component recipe SHALL be registered in theme configuration per nimbus-core standards.

#### Scenario: Recipe registration
- **WHEN** component is added to package
- **THEN** recipe SHALL be manually registered in theme/slot-recipes/index.ts
- **AND** SHALL be included in slotRecipes object export
- **AND** SHALL use key "taggroup"
- **AND** CRITICAL: registration SHALL not be automatic (no auto-discovery)
