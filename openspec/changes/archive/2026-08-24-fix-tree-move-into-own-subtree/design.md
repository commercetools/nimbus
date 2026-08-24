## Context

See `proposal.md` — Why. The relevant constraint is that the corruption
originates in React Stately, not in Nimbus: `useTreeData`'s `move` performs a
detach-then-reattach with no validation, and its `moveBefore` / `moveAfter`
validate with a loop that cannot reach a root-level ancestor. Nimbus already
wraps this hook in `useTree` and re-exports the mutations as its own controller,
so the wrapper is the only place the behaviour can be corrected without
patching a dependency.

An earlier pass on this branch guarded `move` alone, on the mistaken assumption
that the other two were already safe.

## Goals / Non-Goals

**Goals:**

- One rejection rule, applied identically to all three relocating mutations.
- Rejection raised where the caller can see it.
- No change to the drag-and-drop path, which is independently guarded.

**Non-Goals:**

- Patching or forking React Stately.
- Making rejected mutations recoverable or silently no-op — a caller passing an
  own-subtree destination has a bug, and it should surface.
- Guarding the non-relocating mutations (`insert`, `append`, `prepend`,
  `update`, `remove`); they cannot create a cycle.

## Decisions

**Guard in the `useTree` wrapper, not by working around React Stately.**
The wrapper already exists and already owns the controller's public shape, so a
check there covers every documented entry point. The alternative — pre-flighting
each call by inspecting the tree at the call site — would push the invariant onto
consumers, which is what failed in the first place.

**Check the destination parent, not the target key.** `move` names its
destination directly (`toParentKey`), but `moveBefore` / `moveAfter` insert
*next to* a target, so their destination is the target's parent. Treating the
target itself as the destination would both miss real violations and reject
ordinary sibling reorders. This asymmetry is the reason the earlier pass looked
complete: the three methods do not share a destination argument, so a guard on
one does not generalise to the others by inspection.

**Reuse the existing subtree predicate.** The check added for `move` walks from
the moved node downward and has no depth special-case, so it is already correct
for the cases React Stately misses. Sharing it — and one shared message —
guarantees the three methods agree, rather than reproducing a second guard that
could drift.

**Validate before delegating.** Running the check ahead of React Stately makes
the throw synchronous, which is what lets a caller catch it. React Stately's own
throw happens inside a `setItems` reducer, so it escapes during a later render
where a `try`/`catch` around the call cannot see it. As a side effect the
upstream throw becomes unreachable and the reported message is uniform.

**Leave the drag-and-drop handler delegating to the unwrapped methods.** React
Aria's `getDropOperation` walks the full ancestor chain and cancels a drop
targeting a dragged key or any of its descendants, and it runs ahead of any
consumer-supplied `getDropOperation`, so an invalid target cannot reach the
handler. Routing the drop path through a throwing guard would risk turning an
unreachable case into an exception raised inside an async drop callback.

**Materialise the moved keys once.** The two sibling methods accept an
`Iterable`, so the guard and the delegate would otherwise iterate it twice and
exhaust a generator before React Stately ever saw it.

## Risks / Trade-offs

- **A consumer relying on the old outcome** → Not credible: the old outcome was
  losing the node and its descendants. Every newly-rejected call was already
  destroying data, so there is no working behaviour to preserve. Shipped as a
  patch on that basis.
- **Throwing rather than no-op'ing puts the burden on the caller** → Accepted,
  and deliberate: it matches what `move` already does after the earlier pass,
  and a silent no-op would hide a caller bug the same way the corruption did.
- **A future React Stately release could add its own complete guard** → Harmless.
  The wrapper's check runs first, so the behaviour and message stay stable
  regardless.
- **The guard walks the tree on every relocation** → Bounded by the subtree of
  the moved node and only on an explicit mutation, not per render.
