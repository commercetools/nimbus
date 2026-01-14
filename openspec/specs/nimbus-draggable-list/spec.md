# Specification: DraggableList Component

## Overview

The DraggableList component provides accessible drag-and-drop reordering functionality for list items with keyboard and mouse/touch interactions. Built with React Aria's GridList for WCAG-compliant accessibility patterns.

**Component:** `DraggableList` (compound namespace)
**Package:** `@commercetools/nimbus`
**Type:** Compound component (multi-slot recipe)
**React Aria:** Uses GridList with drag-and-drop hooks for accessibility

## Purpose

The DraggableList component provides an accessible, flexible system for rendering lists with drag-and-drop reordering capabilities. It supports keyboard navigation, mouse/touch interactions, controlled/uncontrolled modes, item removal, and integrates with form libraries through a Field wrapper. The component follows WCAG 2.1 AA accessibility standards through React Aria's GridList and drag-and-drop patterns.

## Requirements

### Requirement: Namespace Structure
The component SHALL export as compound component namespace per nimbus-core standards.

#### Scenario: Component parts
- **WHEN** DraggableList is imported
- **THEN** SHALL provide DraggableList.Root as list container with drag-and-drop functionality
- **AND** SHALL provide DraggableList.Item for individual draggable items
- **AND** SHALL provide DraggableList.Field for form integration
- **AND** Root SHALL be first property in namespace

### Requirement: React Aria GridList Integration
The component SHALL use React Aria's GridList for accessible list structure and drag-and-drop.

#### Scenario: GridList rendering
- **WHEN** DraggableList.Root renders
- **THEN** SHALL render as GridList with implicit role="grid"
- **AND** items SHALL have role="row" with gridcell children
- **AND** SHALL use React Aria's useDragAndDrop hook for drag-and-drop functionality
- **AND** SHALL provide drag-and-drop hooks to GridList

#### Scenario: ARIA attributes
- **WHEN** list renders
- **THEN** SHALL require aria-label or aria-labelledby prop for accessibility
- **AND** SHALL announce list structure to screen readers
- **AND** SHALL provide accessible names for drag handles and remove buttons

### Requirement: Drag-and-Drop Interaction
The component SHALL support mouse, keyboard, and touch drag-and-drop interactions.

#### Scenario: Mouse drag
- **WHEN** user hovers over draggable item
- **THEN** SHALL display grab cursor
- **AND** WHEN user clicks and drags item
- **THEN** SHALL change cursor to grabbing
- **AND** SHALL allow item to be moved to new position
- **AND** SHALL update item order on drop

#### Scenario: Keyboard drag
- **WHEN** user focuses item and presses ArrowLeft
- **THEN** SHALL focus drag handle button
- **AND** WHEN user presses Enter on drag handle
- **THEN** SHALL enter drag mode
- **AND** SHALL allow ArrowUp/ArrowDown navigation to new position
- **AND** WHEN user presses Enter
- **THEN** SHALL drop item at current position and update order

#### Scenario: Touch drag
- **WHEN** user touches draggable item
- **THEN** SHALL support touch-based drag gesture
- **AND** SHALL provide visual feedback during drag
- **AND** SHALL allow item to be moved to new position on touch release

### Requirement: Drag Handle
The component SHALL provide a visual drag handle for initiating drag operations.

#### Scenario: Drag handle rendering
- **WHEN** item allows dragging
- **THEN** SHALL render IconButton with DragIndicator icon in gridcell
- **AND** SHALL have accessible name "Drag {itemLabel}"
- **AND** SHALL be positioned before item content
- **AND** SHALL be focusable via Tab or Arrow key navigation

#### Scenario: Drag handle interaction
- **WHEN** user activates drag handle
- **THEN** SHALL initiate drag mode
- **AND** SHALL allow keyboard navigation with arrow keys
- **AND** SHALL provide ARIA live region feedback during drag

### Requirement: Drop Indicator
The component SHALL provide visual feedback for drop target position.

#### Scenario: Drop indicator display
- **WHEN** item is being dragged
- **THEN** SHALL display DropIndicator component between potential drop positions
- **AND** WHEN drop indicator is valid drop target
- **THEN** SHALL apply data-drop-target attribute
- **AND** SHALL style with outline: "2px solid primary.7" color

### Requirement: Reorder Callback
The component SHALL notify parent of item order changes.

#### Scenario: Order update notification
- **WHEN** items are reordered via drag-and-drop
- **THEN** SHALL call onUpdateItems callback with new items array
- **AND** updated array SHALL reflect new order
- **AND** SHALL preserve all item properties
- **AND** SHALL maintain item keys

#### Scenario: Cross-list drag notification
- **WHEN** item is dragged from one list to another
- **THEN** source list SHALL call onUpdateItems with item removed
- **AND** target list SHALL call onUpdateItems with item added
- **AND** SHALL maintain correct order in both lists

### Requirement: Controlled Mode
The component SHALL support controlled state management.

#### Scenario: Controlled items
- **WHEN** items prop is provided with onUpdateItems callback
- **THEN** SHALL render items from prop
- **AND** WHEN items prop changes externally
- **THEN** SHALL sync internal state with new items
- **AND** SHALL preserve selection state for existing items
- **AND** SHALL update immediately without unnecessary re-renders

#### Scenario: External state updates
- **WHEN** parent updates items prop
- **THEN** SHALL replace internal list with new items
- **AND** SHALL use deep equality check to prevent unnecessary syncs
- **AND** SHALL maintain stable references to avoid infinite loops

### Requirement: Uncontrolled Mode
The component SHALL support uncontrolled state management.

#### Scenario: Initial items
- **WHEN** items prop is provided without onUpdateItems
- **THEN** SHALL initialize internal state with items
- **AND** SHALL manage reordering internally
- **AND** SHALL not sync with external items changes

### Requirement: Item Key Extraction
The component SHALL provide flexible key extraction for items.

#### Scenario: Default key extraction
- **WHEN** getKey prop is not provided
- **THEN** SHALL use item.key or item.id as unique identifier
- **AND** SHALL work with items that have key or id property

#### Scenario: Custom key extraction
- **WHEN** getKey prop is provided
- **THEN** SHALL call getKey function for each item to extract unique key
- **AND** SHALL use returned key for item identification
- **AND** CRITICAL: getKey SHALL be memoized with useCallback to prevent re-sync loops

### Requirement: Default Item Rendering
The component SHALL support automatic item rendering when children not provided.

#### Scenario: Items with key and label
- **WHEN** items have both key and label properties
- **THEN** SHALL render DraggableList.Item with label as content
- **AND** SHALL not require children render function
- **AND** SHALL display drag handle and label only

#### Scenario: Missing key or label
- **WHEN** items lack key or label properties and children not provided
- **THEN** SHALL throw error with message: 'Nimbus DraggableList: when "children" is not provided, items must have both "key" and "label" properties'

### Requirement: Custom Item Rendering
The component SHALL support custom render functions for items.

#### Scenario: Children render function
- **WHEN** children prop is function
- **THEN** SHALL call function with each item
- **AND** SHALL pass item properties and onRemoveItem callback
- **AND** function SHALL return DraggableList.Item or custom element
- **AND** SHALL support complex item structures with metadata

#### Scenario: Custom content structure
- **WHEN** children function returns DraggableList.Item with custom content
- **THEN** SHALL render custom content in item
- **AND** SHALL maintain drag-and-drop functionality
- **AND** SHALL apply item slot styling

### Requirement: Item Removal
The component SHALL support optional item removal functionality.

#### Scenario: Removable items enabled
- **WHEN** removableItems prop is true
- **THEN** SHALL render remove button (IconButton with Close icon) in each item
- **AND** remove button SHALL have aria-label "remove item"
- **AND** SHALL be positioned after item content
- **AND** SHALL pass onRemoveItem callback to items

#### Scenario: Remove button interaction
- **WHEN** user clicks remove button
- **THEN** SHALL call onRemoveItem with item key
- **AND** SHALL remove item from list
- **AND** SHALL call onUpdateItems with updated items array

#### Scenario: Keyboard removal
- **WHEN** user navigates to remove button and presses Enter
- **THEN** SHALL remove item from list
- **AND** SHALL maintain focus management after removal

### Requirement: Disabled Items
The component SHALL support disabling individual items.

#### Scenario: Disabled item rendering
- **WHEN** item has isDisabled property or is in disabledKeys array
- **THEN** SHALL render item with data-disabled attribute
- **AND** SHALL apply disabled layer style
- **AND** SHALL not allow item to be dragged
- **AND** SHALL not allow item to be drop target

#### Scenario: Disabled item interaction
- **WHEN** user attempts to drag disabled item
- **THEN** SHALL not enter drag mode
- **AND** SHALL maintain normal keyboard navigation
- **AND** SHALL not change cursor on hover

### Requirement: Empty State
The component SHALL provide feedback when list contains no items.

#### Scenario: Default empty message
- **WHEN** items array is empty or undefined
- **THEN** SHALL display default message "drop items here"
- **AND** SHALL apply data-empty attribute to grid
- **AND** SHALL render in empty slot with italic text and center alignment

#### Scenario: Custom empty message
- **WHEN** renderEmptyState prop is provided
- **THEN** SHALL display custom empty state content
- **AND** SHALL render in empty slot
- **AND** SHALL support ReactNode (string, element, component)

### Requirement: Cross-List Drag-and-Drop
The component SHALL support dragging items between multiple lists.

#### Scenario: Drag between lists
- **WHEN** multiple DraggableList.Root components are rendered
- **THEN** SHALL support drag from one list to another
- **AND** SHALL remove item from source list
- **AND** SHALL add item to target list at drop position
- **AND** SHALL call onUpdateItems for both lists

#### Scenario: Keyboard cross-list drag
- **WHEN** user drags item with keyboard
- **THEN** SHALL support Tab key to navigate to adjacent list
- **AND** SHALL allow drop in target list with Enter
- **AND** SHALL move item from source to target

### Requirement: Drag Data Format
The component SHALL use custom drag data format for type safety.

#### Scenario: Drag data serialization
- **WHEN** item is dragged
- **THEN** SHALL serialize item as JSON with key "nimbus-draggable-list-item"
- **AND** SHALL accept only "nimbus-draggable-list-item" drag type
- **AND** SHALL ensure getDropOperation returns "move" operation

#### Scenario: Drop data parsing
- **WHEN** item is dropped
- **THEN** SHALL parse JSON data from drag event
- **AND** SHALL reconstruct item object
- **AND** SHALL maintain all item properties

### Requirement: Size Variants
The component SHALL support size variants per nimbus-core styling standards.

#### Scenario: Small size
- **WHEN** size="sm" is set
- **THEN** SHALL apply small size styling to items
- **AND** SHALL use smaller minimum height for items

#### Scenario: Medium size (default)
- **WHEN** size="md" is set or no size specified
- **THEN** SHALL apply medium size styling with minH: "800" (design token)
- **AND** SHALL be default size variant

### Requirement: Multi-Slot Recipe
The component SHALL use multi-slot recipe per nimbus-core standards.

#### Scenario: Slot styling
- **WHEN** list renders
- **THEN** SHALL apply draggableListSlotRecipe from theme/slot-recipes/draggable-list.ts
- **AND** SHALL style: root, empty, item, itemContent slots
- **AND** SHALL support size variant options (sm, md)
- **AND** className SHALL be "nimbus-draggable-list"

#### Scenario: Root slot styling
- **WHEN** root slot renders
- **THEN** SHALL apply colorPalette: "primary"
- **AND** SHALL have default width: "2xs" (design token)
- **AND** SHALL use flexbox layout (column direction)
- **AND** SHALL apply padding: "200", gap: "200", border: "25 solid", borderColor: "colorPalette.3", borderRadius: "200"

#### Scenario: Item slot styling
- **WHEN** item slot renders
- **THEN** SHALL apply background: "colorPalette.3"
- **AND** SHALL apply borderRadius: "200"
- **AND** SHALL display focus ring on focus with layerStyle: "focusRing"
- **AND** WHEN data-allows-dragging="true"
- **THEN** SHALL show grab cursor
- **AND** WHEN data-dragging="true"
- **THEN** SHALL show grabbing cursor

#### Scenario: Empty slot styling
- **WHEN** empty slot renders
- **THEN** SHALL center content with marginBlock: "auto", alignSelf: "center"
- **AND** root SHALL apply italic font style and colorPalette.11 color when data-empty

#### Scenario: Item content slot
- **WHEN** itemContent slot renders
- **THEN** SHALL apply flex: "1 1 auto" to fill available space

### Requirement: Chakra Style Props
The component SHALL support Chakra UI style props per nimbus-core standards.

#### Scenario: Style props on Root
- **WHEN** DraggableList.Root receives style props
- **THEN** SHALL support spacing props (margin, padding, gap, width)
- **AND** SHALL support layout props (display, flexDirection)
- **AND** SHALL support color props (colorPalette)
- **AND** SHALL merge with recipe styles

#### Scenario: Style props on Item
- **WHEN** DraggableList.Item receives style props
- **THEN** SHALL support all Chakra style props
- **AND** SHALL merge with slot styles
- **AND** SHALL support responsive values

### Requirement: Selection Support
The component SHALL support optional multi-select functionality via React Aria.

#### Scenario: Multiple selection mode
- **WHEN** selectionMode="multiple" and selectionBehavior="toggle"
- **THEN** SHALL render Checkbox in each item for selection
- **AND** SHALL position checkbox before item content
- **AND** SHALL support selection state management via React Aria

### Requirement: Field Wrapper
The component SHALL provide form field integration via DraggableList.Field.

#### Scenario: Field component structure
- **WHEN** DraggableList.Field is used
- **THEN** SHALL wrap DraggableList.Root with FormField.Root
- **AND** SHALL render FormField.Label with label prop
- **AND** SHALL render DraggableList.Root in FormField.Input
- **AND** SHALL support description, error, infoBox props

#### Scenario: Field required items
- **WHEN** DraggableList.Field is used
- **THEN** items SHALL have both key and label properties (type: DraggableListFieldItemData)
- **AND** label prop SHALL be required
- **AND** SHALL not accept children prop (configured via props only)

#### Scenario: Field disabled state
- **WHEN** isDisabled is true
- **THEN** SHALL pass all item keys to disabledKeys prop
- **AND** SHALL disable all items in list

#### Scenario: Field validation states
- **WHEN** isInvalid is true
- **THEN** SHALL apply invalid state to FormField
- **AND** SHALL display error message if provided
- **AND** WHEN isRequired is true
- **THEN** SHALL display required indicator on label

### Requirement: Internationalization
The component SHALL support internationalization per nimbus-core standards.

#### Scenario: Message definition
- **WHEN** component renders translatable text
- **THEN** SHALL define messages in draggable-list.i18n.ts
- **AND** SHALL use react-intl's defineMessages API
- **AND** messages SHALL follow naming: "Nimbus.DraggableList.{messageKey}"

#### Scenario: Empty state message
- **WHEN** empty state renders with default message
- **THEN** SHALL use message id "Nimbus.DraggableList.emptyMessage"
- **AND** SHALL have defaultMessage: "drop items here"
- **AND** SHALL format with useIntl hook

#### Scenario: Remove button label
- **WHEN** remove button renders
- **THEN** SHALL use message id "Nimbus.DraggableList.removeButtonLabel"
- **AND** SHALL have defaultMessage: "remove item"
- **AND** SHALL apply as aria-label for accessibility

### Requirement: Ref Support
The component SHALL support ref forwarding per nimbus-core standards.

#### Scenario: Root ref
- **WHEN** ref is passed to DraggableList.Root
- **THEN** SHALL forward ref to underlying GridList element
- **AND** SHALL provide access to DOM element
- **AND** SHALL support useRef and createRef

#### Scenario: Item ref
- **WHEN** ref is passed to DraggableList.Item
- **THEN** SHALL forward ref to GridListItem element
- **AND** SHALL provide access to item DOM element

### Requirement: Type Definitions
The component SHALL provide comprehensive TypeScript types per nimbus-core standards.

#### Scenario: Component props types
- **WHEN** component is used in TypeScript
- **THEN** SHALL export DraggableListRootProps interface with generic type parameter
- **AND** SHALL export DraggableListItemProps interface with generic type parameter
- **AND** SHALL export DraggableListFieldProps interface with generic type parameter
- **AND** SHALL include JSDoc comments for all props

#### Scenario: Recipe types
- **WHEN** component uses recipes
- **THEN** SHALL export DraggableListRecipeProps with auto-generated variant types
- **AND** SHALL provide autocomplete for size variant values (sm, md)
- **AND** SHALL support type-safe slot props

#### Scenario: Item data types
- **WHEN** defining item data shape
- **THEN** SHALL export DraggableListItemData type with optional key and label
- **AND** SHALL export DraggableListFieldItemData type with required key and label
- **AND** SHALL support generic Record<string, unknown> for additional properties

#### Scenario: Slot props types
- **WHEN** slots are typed
- **THEN** SHALL export DraggableListRootSlotProps, DraggableListItemSlotProps, DraggableListItemContentSlotProps, DraggableListEmptySlotProps
- **AND** SHALL combine HTMLChakraProps with component-specific props

### Requirement: Optimized State Management
The component SHALL optimize internal state synchronization to prevent render loops.

#### Scenario: External items sync
- **WHEN** items prop changes
- **THEN** SHALL use shallow equality check for same array reference
- **AND** SHALL use deep equality check (dequal) for array contents
- **AND** SHALL skip sync if items are deeply equal to last notified items
- **AND** SHALL prevent circular updates between parent and component

#### Scenario: Internal update notification
- **WHEN** list state changes internally (drag, remove)
- **THEN** SHALL set sync flag to prevent re-sync of own changes
- **AND** SHALL call onUpdateItems with new items array
- **AND** SHALL update lastNotifiedItemsRef to track last sent state
- **AND** SHALL use queueMicrotask to reset sync flag after state updates complete

#### Scenario: Selection preservation
- **WHEN** items are updated externally
- **THEN** SHALL preserve selectedKeys for items that still exist
- **AND** SHALL filter out keys for removed items
- **AND** SHALL maintain Set of selected keys

### Requirement: Theme Integration
The component SHALL be registered in Chakra theme per nimbus-core standards.

#### Scenario: Recipe registration
- **WHEN** component is added to nimbus package
- **THEN** SHALL register draggableListSlotRecipe in theme/slot-recipes/index.ts
- **AND** SHALL export recipe with className: "nimbus-draggable-list"
- **AND** SHALL define all slots (root, empty, item, itemContent)
- **AND** CRITICAL: registration SHALL be manual (no auto-discovery)

### Requirement: Component Identification
The component SHALL set display names for debugging per nimbus-core standards.

#### Scenario: Display names
- **WHEN** component renders in React DevTools
- **THEN** DraggableList.Root SHALL have displayName "DraggableList.Root"
- **AND** DraggableList.Item SHALL have displayName "DraggableList.Item"
- **AND** DraggableList.Field SHALL have displayName "DraggableList.Field"

### Requirement: Accessibility - Keyboard Navigation
The component SHALL support comprehensive keyboard navigation per nimbus-core accessibility standards.

#### Scenario: Focus management
- **WHEN** user tabs into list
- **THEN** SHALL focus first item or previously focused item
- **AND** SHALL provide visible focus indicator with 3:1 contrast ratio
- **AND** SHALL support Tab/Shift+Tab to navigate between interactive elements

#### Scenario: Arrow key navigation
- **WHEN** item is focused
- **THEN** ArrowUp/ArrowDown SHALL navigate between items
- **AND** ArrowLeft SHALL focus drag handle button
- **AND** ArrowRight SHALL navigate between item cells (checkbox, drag handle, content, remove button)
- **AND** Home/End SHALL navigate to first/last item

#### Scenario: Drag keyboard shortcuts
- **WHEN** drag handle is focused
- **THEN** Enter or Space SHALL activate drag mode
- **AND** WHEN in drag mode
- **THEN** ArrowUp/ArrowDown SHALL move item position
- **AND** Enter SHALL drop item at current position
- **AND** Escape SHALL cancel drag operation

### Requirement: Accessibility - Screen Reader Support
The component SHALL provide comprehensive screen reader support per nimbus-core accessibility standards.

#### Scenario: List structure announcement
- **WHEN** screen reader encounters list
- **THEN** SHALL announce "grid" role with accessible label
- **AND** SHALL announce number of items in list
- **AND** SHALL announce "row" for each item with item content

#### Scenario: Drag operation feedback
- **WHEN** user activates drag handle
- **THEN** SHALL announce drag mode activation
- **AND** WHEN item position changes during drag
- **THEN** SHALL announce new position via ARIA live region
- **AND** WHEN item is dropped
- **THEN** SHALL announce successful drop and final position

#### Scenario: Item state announcements
- **WHEN** item is disabled
- **THEN** SHALL announce disabled state
- **AND** WHEN item is removed
- **THEN** SHALL announce removal and updated item count

### Requirement: Accessibility - Touch Targets
The component SHALL meet touch target size requirements per nimbus-core accessibility standards.

#### Scenario: Interactive element sizing
- **WHEN** interactive elements render (drag handle, remove button)
- **THEN** SHALL meet minimum 44x44px touch target size
- **AND** SHALL provide adequate spacing between adjacent targets
- **AND** SHALL maintain touch targets in all size variants

### Requirement: React Aria Drag-and-Drop Hooks
The component SHALL properly configure React Aria's useDragAndDrop hook.

#### Scenario: Drag data provider
- **WHEN** useDragAndDrop getItems is called
- **THEN** SHALL return array of items with "nimbus-draggable-list-item" data format
- **AND** SHALL serialize each item as JSON string

#### Scenario: Drop acceptance
- **WHEN** useDragAndDrop acceptedDragTypes is configured
- **THEN** SHALL accept only "nimbus-draggable-list-item" type
- **AND** SHALL ensure getDropOperation returns "move"

#### Scenario: Insert operation
- **WHEN** useDragAndDrop onInsert is called
- **THEN** SHALL parse dropped items from text data
- **AND** SHALL insert items before or after target key based on dropPosition
- **AND** SHALL use list.insertBefore or list.insertAfter

#### Scenario: Root drop operation
- **WHEN** useDragAndDrop onRootDrop is called (drop on empty list)
- **THEN** SHALL parse dropped items
- **AND** SHALL append items to list with list.append

#### Scenario: Reorder operation
- **WHEN** useDragAndDrop onReorder is called
- **THEN** SHALL move items before or after target key based on dropPosition
- **AND** SHALL use list.moveBefore or list.moveAfter

#### Scenario: Drag end cleanup
- **WHEN** useDragAndDrop onDragEnd is called
- **THEN** WHEN dropOperation is "move" and not internal drag
- **THEN** SHALL remove dragged items from source list

### Requirement: React Stately List Management
The component SHALL use React Stately's useListData for state management.

#### Scenario: List initialization
- **WHEN** DraggableList.Root mounts
- **THEN** SHALL initialize useListData with items and getKey
- **AND** SHALL manage internal list.items state
- **AND** SHALL provide list operations (append, insert, move, remove)

#### Scenario: List operations
- **WHEN** items are manipulated
- **THEN** SHALL support list.insertBefore(key, ...items)
- **AND** SHALL support list.insertAfter(key, ...items)
- **AND** SHALL support list.moveBefore(targetKey, keys)
- **AND** SHALL support list.moveAfter(targetKey, keys)
- **AND** SHALL support list.remove(...keys)
- **AND** SHALL support list.append(...items)

### Requirement: Performance Optimization
The component SHALL optimize for performance with large lists.

#### Scenario: Full list replacement strategy
- **WHEN** external items change significantly
- **THEN** SHALL use full replacement (remove all + append all) strategy
- **AND** Strategy SHALL be O(n) for both operations
- **AND** SHALL prioritize correctness over incremental updates for typical use cases

#### Scenario: Render optimization
- **WHEN** list renders with many items (100+)
- **THEN** SHALL render efficiently without virtualization by default
- **AND** SHALL support external virtualization libraries if needed
- **AND** SHALL use React Aria's built-in performance optimizations
