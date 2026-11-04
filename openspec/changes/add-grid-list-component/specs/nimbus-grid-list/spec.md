## ADDED Requirements

### Requirement: Compound parts

The component SHALL be a compound component with the parts `GridList.Root` and
`GridList.Item`. `GridList.Item` SHALL render the children given by the
consumer as free content.

#### Scenario: Free content

- **WHEN** a `GridList.Item` contains an image and two text elements
- **THEN** all of the content SHALL be rendered inside the item
- **AND** no checkbox or drag handle SHALL be rendered unless enabled

#### Scenario: Item outside Root

- **WHEN** `GridList.Item` is rendered outside `GridList.Root`
- **THEN** the documentation SHALL state that `GridList.Item` must be a child of
  `GridList.Root`
- **AND** the behavior SHALL match React Aria's `GridListItem` outside a
  `GridList`

### Requirement: Collection semantics

`GridList.Root` SHALL render React Aria Components `GridList` and each item
SHALL render a React Aria `GridListItem`. The root SHALL have an accessible name
from `aria-label` or `aria-labelledby`.

#### Scenario: Roles

- **WHEN** a GridList with three items is rendered with `aria-label="Files"`
- **THEN** the root SHALL have role `grid` and the name "Files"
- **AND** the items SHALL have role `row`

#### Scenario: Plain-text name

- **WHEN** an item has non-text children and no `textValue`
- **THEN** the documentation SHALL state that `textValue` is required for the
  item's accessible name

### Requirement: Selection

`GridList.Root` SHALL support `selectionMode` values `none`, `single` and
`multiple`, with `selectedKeys`, `defaultSelectedKeys`, `onSelectionChange` and
`disabledKeys`.

#### Scenario: Single selection

- **WHEN** `selectionMode="single"` and the user presses item B after item A
- **THEN** only item B SHALL be selected
- **AND** `onSelectionChange` SHALL be called with the key of item B

#### Scenario: Multiple selection

- **WHEN** `selectionMode="multiple"` and the user selects items A and C
- **THEN** both items SHALL have `aria-selected="true"`

#### Scenario: Disabled item

- **WHEN** an item key is in `disabledKeys`
- **THEN** the item SHALL NOT be selectable
- **AND** it SHALL expose `aria-disabled="true"`

#### Scenario: Selection versus action

- **WHEN** `selectionMode` is set and `onAction` is provided
- **THEN** the documentation SHALL describe when a press selects and when it
  calls `onAction`

### Requirement: Built-in selection checkbox

`GridList.Root` and `GridList.Item` SHALL accept `showSelectionCheckbox`
(default off). The Item value SHALL override the Root value when it is set; an
unset Item value SHALL inherit the Root value. The checkbox SHALL render only
when `selectionMode="multiple"`.

#### Scenario: Enabled on Root

- **WHEN** Root has `showSelectionCheckbox` and `selectionMode="multiple"`
- **THEN** every item SHALL render a checkbox with `slot="selection"`

#### Scenario: Item override

- **WHEN** Root has `showSelectionCheckbox` and one Item has
  `showSelectionCheckbox={false}`
- **THEN** that item SHALL render no checkbox
- **AND** the other items SHALL render one

#### Scenario: Not in multiple mode

- **WHEN** `showSelectionCheckbox` is set and `selectionMode="single"`
- **THEN** no checkbox SHALL be rendered

### Requirement: Built-in drag handle

`GridList.Root` and `GridList.Item` SHALL accept `showDragHandle` (default off)
with the same override rule as the checkbox. The handle SHALL render only when
dragging is enabled through `dragAndDropHooks`, SHALL use `slot="drag"` and SHALL
have an accessible name (React Aria's localized default). The handle SHALL appear before the checkbox,
and both SHALL appear before the children.

#### Scenario: Handle with drag-and-drop

- **WHEN** `showDragHandle` is set and `dragAndDropHooks` is provided
- **THEN** each item SHALL render a button with an accessible name
- **AND** the handle SHALL be the first focusable control in the item

#### Scenario: No drag-and-drop

- **WHEN** `showDragHandle` is set and no `dragAndDropHooks` is provided
- **THEN** no handle SHALL be rendered

#### Scenario: Order

- **WHEN** both built-ins are enabled
- **THEN** the order inside the item SHALL be handle, checkbox, children

### Requirement: Drag-and-drop reordering

`GridList.Root` SHALL accept `dragAndDropHooks` from `useDragAndDrop` and SHALL
NOT keep list state. The consumer SHALL own the items. Reordering SHALL work by
mouse, touch and keyboard.

#### Scenario: Keyboard reorder

- **WHEN** an item is focused and the user starts a drag with the keyboard,
  moves it past the next item and drops it
- **THEN** `onReorder` SHALL be called with the dragged key and the drop target
- **AND** a screen-reader announcement SHALL describe the move

#### Scenario: Drop target state

- **WHEN** an item is dragged over a valid position
- **THEN** a drop indicator SHALL be visible
- **AND** the dragged item SHALL expose `data-dragging`

### Requirement: Keyboard navigation

The component SHALL support keyboard navigation from React Aria. Arrow keys
SHALL move focus between items. `keyboardNavigationBehavior="tab"` SHALL move
focus into the controls of an item with the Tab key.

#### Scenario: Arrow keys in a list

- **WHEN** `layout="stack"` and the user presses ArrowDown on an item
- **THEN** focus SHALL move to the next item

#### Scenario: Arrow keys in a grid

- **WHEN** `layout="grid"` with 3 columns at a fixed container width and the user
  presses ArrowRight, then ArrowDown
- **THEN** focus SHALL move one cell right, then one row down

#### Scenario: Grid edges

- **WHEN** `layout="grid"` with 3 columns and 7 items, and the user presses
  ArrowDown on item 5 (no cell below it)
- **THEN** focus SHALL stay on item 5
- **WHEN** the user presses ArrowRight on item 3 (end of a row)
- **THEN** focus SHALL move to item 4 (start of the next row)
- **WHEN** the user presses ArrowUp on an item in the first row
- **THEN** focus SHALL stay on that item

#### Scenario: Column count follows the width

- **WHEN** `minChildWidth` is set and the container width changes the number of
  columns
- **THEN** ArrowUp and ArrowDown SHALL move by the rendered number of columns

#### Scenario: Items with inputs

- **WHEN** items contain a text field and
  `keyboardNavigationBehavior="tab"` is set
- **THEN** typing in the field SHALL NOT trigger item navigation or selection

#### Scenario: Focus ring

- **WHEN** an item receives keyboard focus
- **THEN** a visible focus ring SHALL be shown with at least 3:1 contrast

### Requirement: Responsive layout

`GridList.Root` SHALL render through `SimpleGrid` and SHALL accept `columns`,
`minChildWidth` and `gap` as plain values or responsive objects. `columns` and
`minChildWidth` SHALL be mutually exclusive in the types, because `minChildWidth`
overrides `columns`. With `layout="stack"`, the root SHALL use one column. Items SHALL have uniform cells;
span props SHALL NOT be exposed.

#### Scenario: Responsive columns

- **WHEN** `layout="grid"` and `columns={{ base: 1, md: 3 }}`
- **THEN** the root SHALL show one column below the `md` breakpoint
- **AND** three columns from the `md` breakpoint

#### Scenario: Both column props

- **WHEN** a consumer passes both `columns` and `minChildWidth`
- **THEN** TypeScript SHALL report an error

#### Scenario: Stack layout

- **WHEN** `layout="stack"` and `columns` is set
- **THEN** the root SHALL use one column

#### Scenario: Gap override

- **WHEN** `size="lg"` and `gap` is provided
- **THEN** the provided `gap` SHALL be used instead of the size default

#### Scenario: Virtualized list

- **WHEN** GridList is placed inside React Aria `Virtualizer` with `ListLayout`
- **THEN** its items SHALL render
- **AND** the documentation SHALL state that `columns`, `minChildWidth` and
  `gap` do not apply inside a `Virtualizer`

### Requirement: Size

`GridList.Root` SHALL accept `size` with the values `sm`, `md` (default) and
`lg`. `size` SHALL control item padding, the default gap and the size of the
built-in drag handle. The built-in checkbox SHALL keep the `Checkbox` size `md`
at every `size`. `size` SHALL NOT change the size of consumer content.

#### Scenario: Default size

- **WHEN** no `size` is given
- **THEN** the `md` styles SHALL be applied

#### Scenario: Drag handle scales

- **WHEN** `size="sm"` and the built-in drag handle is shown
- **THEN** the handle SHALL use a smaller size than at `size="lg"`

#### Scenario: Checkbox keeps one size

- **WHEN** `size="sm"` or `size="lg"` and the built-in checkbox is shown
- **THEN** the checkbox SHALL have the same size as at `size="md"

### Requirement: Visual states

Items SHALL have no border or background at rest. The recipe SHALL style hover,
focus-visible, pressed, selected, disabled, dragging and drop-target states. The
selected state SHALL be visible without a container and SHALL meet WCAG 2.1 AA
contrast.

#### Scenario: Selected without container

- **WHEN** an item is selected
- **THEN** the item SHALL show a selected style that is distinguishable from the
  unselected state

#### Scenario: Reduced motion

- **WHEN** `prefers-reduced-motion` is set
- **THEN** state transitions SHALL be removed

### Requirement: Empty state

`GridList.Root` SHALL accept `renderEmptyState`. When it is not provided and the
collection is empty, the root SHALL show a localized default message.

#### Scenario: Default empty state

- **WHEN** the collection has no items and no `renderEmptyState` is given
- **THEN** the default localized message SHALL be shown

#### Scenario: Custom empty state

- **WHEN** `renderEmptyState` is provided
- **THEN** its result SHALL be shown instead of the default message

### Requirement: Style props and ref

`GridList.Root` and `GridList.Item` SHALL accept Nimbus style props and a `ref`,
and SHALL set `displayName`.

#### Scenario: Style props

- **WHEN** a style prop such as `width` is passed to `GridList.Root`
- **THEN** it SHALL be applied to the root element

### Requirement: Internationalization

Text produced by the component SHALL be localizable. The default empty state
SHALL come from the `Nimbus.GridList.emptyMessage` message, which is translated
through the standard Nimbus translation process. The drag handle name SHALL come
from React Aria's localized default.

#### Scenario: Localized drag handle label

- **WHEN** the locale is German and the built-in drag handle is shown for the
  item "Mountain"
- **THEN** its accessible name SHALL be "Mountain ziehen"
