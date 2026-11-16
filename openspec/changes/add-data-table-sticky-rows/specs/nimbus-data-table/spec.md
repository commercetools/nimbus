## ADDED Requirements

### Requirement: Sticky Rows

The component SHALL accept `stickyRows?: Set<string>` on `DataTable` and
`DataTable.Root`. It holds row ids. A row in the set SHALL stay visible at the
top or bottom edge of the scroll area when it is scrolled out of view. A row
that is not in the set, and a table without `stickyRows`, SHALL behave as
before.

#### Scenario: Row sticks at the top edge

- **WHEN** a sticky row is scrolled above the visible area
- **THEN** it SHALL stay visible at the top edge, directly below the header

#### Scenario: Row sticks at the bottom edge

- **WHEN** a sticky row lies below the visible area
- **THEN** it SHALL be visible at the bottom edge

#### Scenario: Row returns to its place

- **WHEN** the user scrolls so that a sticky row's own position is inside the
  visible area
- **THEN** the row SHALL be shown at its own position in the row order

#### Scenario: Rows outside the set are unchanged

- **WHEN** `stickyRows` is not set, or empty
- **THEN** no row SHALL be sticky, and the table SHALL render as it did before

#### Scenario: Unknown and nested keys are ignored

- **WHEN** `stickyRows` has an id that is not a top-level row, because it is
  unknown or the id of a nested child row
- **THEN** that id SHALL be ignored, without an error, and it SHALL NOT take
  space in a stack

#### Scenario: A change of the set needs a new Set

- **WHEN** a consumer changes `stickyRows` by passing a new `Set`
- **THEN** the sticky rows SHALL follow the new set
- **AND** the documentation SHALL say that a `Set` changed in place is not
  noticed

### Requirement: Sticky Render Prop

`DataTableRowRenderProps` SHALL have a field `isSticky: boolean`. It SHALL be
`true` for a row that is sticky: its id is in `stickyRows` and the table has
`maxHeight`. It SHALL be `false` for every other row.

#### Scenario: Custom row render function reads isSticky

- **WHEN** a custom row render function receives its props
- **THEN** `isSticky` SHALL be `true` only for rows in `stickyRows`
- **AND** `isSticky` SHALL be `false` for every row when `stickyRows` is not
  set, or when the table has no `maxHeight`

### Requirement: Sticky Stacks

Several sticky rows SHALL stack at the top edge below the header, and at the
bottom edge, in row order, without overlap. The offset of each row SHALL follow
the measured heights of the sticky rows before it (top) and after it (bottom).

#### Scenario: Rows stack at the top

- **WHEN** two or more sticky rows are scrolled above the visible area
- **THEN** they SHALL be shown one below the other in row order, below the
  header
- **AND** no stuck row SHALL cover another

#### Scenario: Rows stack at the bottom

- **WHEN** two or more sticky rows lie below the visible area
- **THEN** they SHALL be shown one above the other in row order at the bottom
  edge
- **AND** no stuck row SHALL cover another

#### Scenario: Stack follows a row height change

- **WHEN** the height of a sticky row changes, for example because its content
  wraps
- **THEN** the offsets of the other sticky rows SHALL update to the new height

#### Scenario: Stack follows a change of the set

- **WHEN** a row is added to or removed from `stickyRows`
- **THEN** the stacks SHALL update to the new set

#### Scenario: Stack follows a change of the row order

- **WHEN** the order of the rows changes without a change of any height, for
  example by sorting, by a drag and drop reorder, or by pinning a row
- **THEN** the stacks SHALL follow the new row order

#### Scenario: Stack follows a header height change

- **WHEN** the header height changes, for example because a header wraps, the
  table size changes, or a column is resized
- **THEN** the top stack SHALL move to stay directly below the header

#### Scenario: No gap and no overlap between stacked rows

- **WHEN** sticky rows have fractional heights, or the page is zoomed
- **THEN** stacked rows SHALL leave no visible gap and SHALL NOT overlap

#### Scenario: No sticky row is shown

- **WHEN** every sticky row is hidden by `search`, or `stickyRows` becomes empty
- **THEN** both stack heights SHALL be 0, and no scroll padding SHALL remain

### Requirement: Sticky Rows Need a Maximum Height

Sticky rows SHALL work only when the table has `maxHeight`, as the sticky header
does. Without `maxHeight`, no row SHALL be sticky. In development, the component
SHALL log a warning when `stickyRows` is not empty and `maxHeight` is not set,
and when a stack is taller than half of the visible height.

#### Scenario: Rows do not stick without maxHeight

- **WHEN** `stickyRows` is not empty and the table has no `maxHeight`, for
  example because its size is set with the `maxH` style prop
- **THEN** no row SHALL be sticky and `isSticky` SHALL be `false` for every row

#### Scenario: Warning without maxHeight

- **WHEN** `stickyRows` is not empty and `maxHeight` is not set
- **THEN** a development warning SHALL be logged

#### Scenario: Warning for a tall stack

- **WHEN** the top stack or the bottom stack is taller than half of the visible
  height
- **THEN** a development warning SHALL be logged

#### Scenario: No warning in production

- **WHEN** the build is a production build
- **THEN** no warning SHALL be logged

### Requirement: Sticky Row Stacking Order

A stuck row SHALL be drawn above the other body rows, their frozen cells, focus
rings and drop indicators. The sticky header SHALL be drawn above stuck rows.

#### Scenario: Stuck row covers rows that scroll under it

- **WHEN** other rows scroll under a stuck row
- **THEN** the stuck row SHALL hide them, including their frozen cells

#### Scenario: Header covers stuck rows

- **WHEN** the header and a stuck row overlap
- **THEN** the header SHALL be drawn above the stuck row

### Requirement: Sticky Row Opacity

A stuck row SHALL hide the rows that scroll under it in every state. A sticky
row that is disabled SHALL have an opaque background with dimmed content, not a
row-level opacity. A consumer background on a sticky row is the consumer's
responsibility, and the documentation SHALL say it must be opaque.

#### Scenario: Disabled sticky row hides rows under it

- **WHEN** a sticky row is disabled and stuck, and other rows scroll under it
- **THEN** those rows SHALL NOT be visible through it
- **AND** its content SHALL look disabled

#### Scenario: Selected and hovered sticky rows hide rows under them

- **WHEN** a sticky row is selected or hovered and stuck
- **THEN** rows that scroll under it SHALL NOT be visible through it

### Requirement: Sticky Row Rendering Cost

Changing `stickyRows` SHALL re-render only the rows whose flag changed. A change
of a stack height SHALL NOT re-render the table or its rows.

#### Scenario: Only changed rows re-render

- **WHEN** one row is added to `stickyRows`
- **THEN** only that row SHALL re-render

#### Scenario: Height change does not re-render

- **WHEN** a sticky row changes its height
- **THEN** the table and its rows SHALL NOT re-render because of it

### Requirement: Sticky Row Highlight

A sticky row SHALL have a built-in highlight: a slight background change, one
step up in the color scale from the row background (`neutral.2`). Frozen cells
SHALL show the same background. Hover and selected backgrounds SHALL stay
stronger and win over the highlight. A consumer background on the row SHALL win.

#### Scenario: Highlight on a sticky row

- **WHEN** a row is in `stickyRows`
- **THEN** its background SHALL differ slightly from a row that is not sticky
- **AND** its frozen cells SHALL show the same background

#### Scenario: Highlight is the same stuck and not stuck

- **WHEN** a sticky row is at its own position, or stuck at an edge
- **THEN** it SHALL show the same highlight

#### Scenario: Hover and selection win

- **WHEN** a sticky row is hovered or selected
- **THEN** the hover or selected background SHALL be shown instead of the
  highlight

### Requirement: Sticky Row Focus and Pointer Input

A stuck row SHALL show its focus ring when it has keyboard focus. After the
table is scrolled sideways, a click on a stuck row's frozen cell SHALL reach
that row.

#### Scenario: Focus ring on a stuck row

- **WHEN** a stuck row has keyboard focus
- **THEN** its focus ring SHALL be fully visible

#### Scenario: Click on a frozen cell of a stuck row

- **WHEN** the table is scrolled sideways, and the user clicks a frozen cell of
  a stuck row
- **THEN** the click SHALL reach that row, and `onRowAction` SHALL be called for
  that row when the row is clickable

### Requirement: Sticky Row Drag

A drag SHALL be able to start from a stuck row, with the pointer and with the
keyboard. Pointer drops over the stuck rows SHALL follow React Aria's default
behavior, and the documentation SHALL say so.

#### Scenario: Pointer drag from a stuck row

- **WHEN** a row is stuck and the user starts a pointer drag on its drag handle
- **THEN** the drag SHALL start for that row

#### Scenario: Keyboard drag from a stuck row

- **WHEN** a row is stuck, its drag handle has focus, and the user starts a
  keyboard drag
- **THEN** the drag SHALL start for that row

#### Scenario: Documented drop behavior

- **WHEN** a consumer reads the sticky rows section of `data-table.dev.mdx`
- **THEN** it SHALL state that pointer drops over the stack follow React Aria's
  default

### Requirement: Sticky Rows With Pinning, Search and Expansion

A sticky row that is also pinned SHALL be first in the top stack. A sticky row
that is hidden by `search` SHALL NOT render. The nested panel of an expanded
sticky row SHALL scroll normally.

#### Scenario: Pinned sticky row is first

- **WHEN** a row is both pinned and sticky
- **THEN** it SHALL be the first row of the top stack

#### Scenario: Sticky row hidden by search

- **WHEN** `search` hides a row that is in `stickyRows`
- **THEN** the row SHALL NOT render, and it SHALL NOT take space in a stack

#### Scenario: Nested panel of a sticky row

- **WHEN** a sticky row is expanded
- **THEN** its nested panel SHALL scroll with the other rows and SHALL NOT stick

### Requirement: Keyboard Focus Clear of Sticky Stacks

When the user moves focus to a row with the keyboard, the row SHALL NOT end
behind a stack. The root SHALL use the measured stack heights as top and bottom
scroll padding.

#### Scenario: Arrow key into the area behind the top stack

- **WHEN** the top stack is present and the user moves focus upward to a row
  that is not stuck
- **THEN** the table SHALL scroll so that the focused row is below the top stack

#### Scenario: Arrow key into the area behind the bottom stack

- **WHEN** the bottom stack is present and the user moves focus downward to a
  row that is not stuck
- **THEN** the table SHALL scroll so that the focused row is above the bottom
  stack

### Requirement: Scroll To Row With Sticky Rows

`apiRef.scrollToRow` SHALL add the heights of the top and bottom sticky stacks
to its insets, so that a row is never left behind a stack. A row that is sticky
and currently stuck SHALL count as in place.

#### Scenario: Target is not left behind the top stack

- **WHEN** `scrollToRow` is called with `align` `"start"` for a row that is not
  sticky, and a top stack is present
- **THEN** the row SHALL end directly below the top stack

#### Scenario: Target is not left behind the bottom stack

- **WHEN** `scrollToRow` is called with `align` `"end"` for a row that is not
  sticky, and a bottom stack is present
- **THEN** the row SHALL end directly above the bottom stack

#### Scenario: Stack heights are current right after a change

- **WHEN** `scrollToRow` is called right after `stickyRows`, the row order or a
  row height changed
- **THEN** the insets SHALL use the stack heights of the new state, not of the
  state before the change

#### Scenario: Stuck target is already in place

- **WHEN** `scrollToRow` is called, with any `align`, for a sticky row that is
  currently stuck at an edge
- **THEN** the table SHALL NOT scroll
- **AND** the Promise SHALL resolve `true`
