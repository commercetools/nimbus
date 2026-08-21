---
"@commercetools/nimbus": patch
---

`Tree`: `useTree`'s `move` no longer discards a node when it is moved into its
own subtree. Passing the moved node itself, or any of its descendants, as the
target parent previously removed the node and everything beneath it from the
tree without reporting anything; it now throws, matching what `moveBefore` and
`moveAfter` already did for the same case. Drag-and-drop was never affected —
such a drop is refused before it reaches the tree.
