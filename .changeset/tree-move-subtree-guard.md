---
"@commercetools/nimbus": patch
---

`Tree`: `useTree`'s `move`, `moveBefore` and `moveAfter` no longer discard a
node when it is moved into its own subtree. Previously the node and everything
beneath it were removed from the tree without anything being reported — `move`
for any such target, and `moveBefore` / `moveAfter` whenever the moved node was
a top-level node. All three now throw instead, and the error comes from the call
itself so it can be caught where the move is made. Drag-and-drop was never
affected — such a drop is refused before it reaches the tree.
