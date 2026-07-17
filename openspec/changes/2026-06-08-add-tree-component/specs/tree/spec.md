## ADDED Requirements

### Requirement: Namespace Structure

The component SHALL export as a compound component namespace.

#### Scenario: Component parts

- **WHEN** Tree is imported
- **THEN** SHALL provide `Tree.Root` as the tree container
- **AND** SHALL provide `Tree.Item` for individual tree nodes
- **AND** SHALL provide `Tree.ItemContent` for a node's content row
- **AND** SHALL provide `Tree.Indicator` for the expand/collapse chevron
- **AND** `Root` SHALL be the first property in the namespace

#### Scenario: Static composition

- **WHEN** a consumer nests `<Tree.Item>` elements inside `<Tree.Root>` with
  `<Tree.ItemContent>` (containing `<Tree.Indicator>`) per item
- **THEN** SHALL render the hierarchy with nested items indented by depth

#### Scenario: Dynamic composition

- **WHEN** a consumer passes an `items` array and a recursive render function
  using React Aria's `Collection` for children
- **THEN** SHALL render the full hierarchy from data

### Requirement: Tree Semantics

The component SHALL use proper ARIA tree semantics.

#### Scenario: Roles

- **WHEN** the Tree is rendered
- **THEN** the root SHALL expose `role="treegrid"` (React Aria's accessible,
  screen-reader-tested pattern for interactive trees that support selection and
  per-row actions)
- **AND** each item SHALL expose `role="row"` containing a `role="gridcell"`
- **AND** each row SHALL expose `aria-level` reflecting its depth
- **AND** each expandable row SHALL expose `aria-expanded`
- **AND** selectable rows SHALL expose `aria-selected`

#### Scenario: Accessible name

- **WHEN** the Tree has no visible label
- **THEN** the consumer SHALL provide `aria-label` or `aria-labelledby` on
  `Tree.Root`

### Requirement: Keyboard Navigation

The component SHALL support full keyboard navigation provided by React Aria.

#### Scenario: Arrow navigation

- **WHEN** the Tree has focus
- **THEN** Up/Down arrows SHALL move focus between visible items
- **AND** Right arrow SHALL expand a collapsed item or move into its children
- **AND** Left arrow SHALL collapse an expanded item or move to its parent
- **AND** Home/End SHALL move focus to the first/last visible item

#### Scenario: Type-ahead

- **WHEN** the Tree has focus and the user types characters
- **THEN** focus SHALL move to the next item whose text matches

### Requirement: Expand and Collapse

The component SHALL allow expanding and collapsing items with children.

#### Scenario: Chevron indicator

- **WHEN** an item has child items
- **THEN** `Tree.Indicator` SHALL be visible
- **AND** SHALL rotate to reflect the expanded state
- **WHEN** an item has no child items
- **THEN** `Tree.Indicator` SHALL be hidden

#### Scenario: Toggle

- **WHEN** the user activates the chevron (click) or presses Right/Left on the
  row
- **THEN** the item SHALL expand or collapse
- **AND** `aria-expanded` SHALL update accordingly

#### Scenario: Default expanded keys

- **WHEN** `defaultExpandedKeys` is provided to `Tree.Root`
- **THEN** the listed items SHALL render expanded initially

### Requirement: Selection

The component SHALL support single and multiple selection.

#### Scenario: Single selection

- **WHEN** `Tree.Root` has `selectionMode="single"`
- **THEN** selecting an item SHALL apply the selected visual state
- **AND** SHALL set `aria-selected` on the selected row

#### Scenario: Multiple selection

- **WHEN** `Tree.Root` has `selectionMode="multiple"`
- **THEN** `Tree.ItemContent` SHALL render a selection checkbox per item
- **AND** toggling a checkbox SHALL update the row's selection state

### Requirement: Disabled Items

The component SHALL support disabling individual items.

#### Scenario: Disabled item

- **WHEN** a `Tree.Item` is disabled via `Tree.Root`'s `disabledKeys`
- **THEN** the item SHALL not be selectable or actionable
- **AND** SHALL render with the disabled visual state

### Requirement: Level-based Indentation

The component SHALL indent items according to their depth.

#### Scenario: Indentation

- **WHEN** items are nested
- **THEN** each item's content SHALL be indented proportionally to its level
  using the `--tree-item-level` custom property React Aria sets on each row

### Requirement: Visual Variants

The component SHALL provide a size variant.

#### Scenario: Size

- **WHEN** `Tree.Root` is rendered with `size="sm"` or `size="md"`
- **THEN** SHALL apply the corresponding row height, font size, icon size, and
  indentation step
- **AND** SHALL default to `md` when unspecified

### Requirement: Drag and Drop

The component SHALL support opt-in drag-and-drop via React Aria.

#### Scenario: Opt-in hooks

- **WHEN** `dragAndDropHooks` (from `useDragAndDrop`) is passed to `Tree.Root`
- **THEN** items SHALL be draggable and the tree SHALL accept drops
- **WHEN** `dragAndDropHooks` is omitted
- **THEN** the tree SHALL render without drag-and-drop affordances

#### Scenario: Reordering and re-parenting

- **WHEN** an item is dropped between two items
- **THEN** the `onReorder`/`onMove` handler SHALL receive `before`/`after` drop
  positions
- **WHEN** an item is dropped onto a group
- **THEN** the `onMove` handler SHALL receive an `on` drop position enabling
  re-parenting

#### Scenario: Drop indicators

- **WHEN** a drag is over a valid target
- **THEN** a drop indicator SHALL show the valid position (before, after, or on)
- **AND** the current drop target SHALL render the `[data-drop-target]` style

#### Scenario: Keyboard drag-and-drop

- **WHEN** the user initiates drag-and-drop via keyboard
- **THEN** React Aria's keyboard DnD SHALL move items without a pointer

### Requirement: Style Props and Recipe Registration

The component SHALL integrate with the Nimbus styling system.

#### Scenario: Recipe registration

- **WHEN** the theme is assembled
- **THEN** `treeSlotRecipe` SHALL be registered as `nimbusTree` with slots
  `root`, `item`, `itemContent`, `indicator`

#### Scenario: Style props

- **WHEN** Chakra style props are passed to any Tree part
- **THEN** SHALL forward them to the corresponding slot element
- **AND** SHALL forward functional props to the underlying React Aria component
