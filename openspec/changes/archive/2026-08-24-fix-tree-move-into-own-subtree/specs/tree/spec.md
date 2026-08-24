## ADDED Requirements

### Requirement: Own-Subtree Move Rejection

Every mutation on the `useTree` controller that relocates a node SHALL refuse a
destination that lies inside the moved node's own subtree, and SHALL leave the
tree unchanged when it refuses. No mutation may drop a node or its descendants
from the tree without reporting it.

#### Scenario: Move into the node itself or a descendant

- **WHEN** `move` is called with a `toParentKey` equal to the moved node, or to
  any descendant of the moved node
- **THEN** the call SHALL throw
- **AND** the tree SHALL retain every node it held before the call

#### Scenario: Sibling move next to a node inside the moved subtree

- **WHEN** `moveBefore` or `moveAfter` is called with a target whose parent is a
  moved node, or a descendant of a moved node
- **THEN** the call SHALL throw
- **AND** the tree SHALL retain every node it held before the call
- **AND** this SHALL hold regardless of the moved node's depth, including when
  the moved node is a root-level node

#### Scenario: Rejection is observable by the caller

- **WHEN** any of these mutations is rejected
- **THEN** the error SHALL be raised synchronously from the call itself, so a
  caller can catch it at the call site rather than during a later render

#### Scenario: Valid relocations remain permitted

- **WHEN** a node is moved to its own parent, to any ancestor, to the root, or
  into an unrelated parent
- **OR WHEN** siblings are reordered among themselves
- **THEN** the move SHALL succeed and the tree SHALL retain every node it held
  before the call

## MODIFIED Requirements

### Requirement: Keyboard Navigation

The component SHALL support full keyboard navigation provided by React Aria.

#### Scenario: Arrow navigation

- **WHEN** the Tree has focus
- **THEN** Up/Down arrows SHALL move focus between visible items
- **AND** Right arrow SHALL expand a collapsed item, and on an already-expanded
  item SHALL move focus into that item's own controls rather than to its first
  child
- **AND** Left arrow SHALL collapse an expanded item or move to its parent
- **AND** Home/End SHALL move focus to the first/last visible item

#### Scenario: Type-ahead

- **WHEN** the Tree has focus and the user types characters
- **THEN** focus SHALL move to the next item whose text matches
