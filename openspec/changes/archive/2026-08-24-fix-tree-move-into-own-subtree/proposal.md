## Why

`useTree`'s imperative controller silently destroyed data. Handed a destination
inside the moved node's own subtree, React Stately detaches the node and
re-attaches it under a parent key that no longer exists, so the node and every
descendant vanish — no throw, no rejection, no diagnostic. A 7-node tree came
back with 3.

React Stately guards this only partly, which is why an earlier pass on this
branch fixed half of it. `move` has no check at all; `moveBefore` / `moveAfter`
walk the destination's ancestors with a loop that exits before testing a
root-level node, so their guard never runs when the moved node is itself
root-level.

The spec separately asserts behaviour the component has never had — that Right
arrow moves into an item's children — and is now the only place still claiming
it.

## What Changes

- `move`, `moveBefore` and `moveAfter` reject a destination that is a moved node
  itself or one of its descendants, leaving the tree untouched.
- The rejection is raised synchronously at the call site. React Stately's partial
  guard throws from inside its `setItems` reducer — during a later render — where
  the caller cannot observe or catch it.
- All three report the same message, so the controller behaves as one surface
  rather than three with different failure modes.
- The Arrow navigation requirement is corrected: Right expands a collapsed item,
  and on an already-expanded item moves focus into that item's own controls.
- Not a breaking change in practice: every newly-rejected call previously
  corrupted the tree, so no caller could have depended on the old outcome.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `tree`: adds a requirement scenario for rejecting a move into the moved node's
  own subtree, under the existing "Hierarchical State via useTree" requirement;
  corrects the Right-arrow clause of the "Keyboard Navigation" requirement.

## Impact

- **Code**: `packages/nimbus/src/components/tree/hooks/use-tree.ts` — the
  `moveBefore` / `moveAfter` wrappers and the shared rejection helper.
- **Tests**: `packages/nimbus/src/components/tree/hooks/use-tree.spec.tsx`.
- **Consumers**: a patch changeset; calls that previously corrupted the tree now
  throw.
- **Drag and drop**: unaffected. React Aria's `getDropOperation` walks the full
  ancestor chain and cancels such a drop, and it runs ahead of any
  consumer-supplied `getDropOperation`, so an invalid target never reaches
  `onMove`.
