## Context

`DataTable.Root` renders the scroll container (`data-table.recipe.ts`), and
#2062 keeps it that way. React Aria renders `DataTable.Row` itself outside the
table's state context; cell content is rendered inside it, so
`TableStateContext` is only available there (`NestedContentPanel` in
`components/data-table.row.tsx` uses this).

Checked in the installed `react-aria-components` 1.22.1 and `react-stately`
3.51.0:

- `TableInner` provides `TableStateContext` with `filteredState` around the
  collection (`Table.mjs`). Cell content can read it.
- `filteredState.selectionManager` is created again on every `TableInner` render
  (`state.selectionManager.withCollection(collection)` in `useTableState.mjs`).
  The old manager keeps the old collection.
- `selectionManager.setFocusedKey(key)` does nothing when the key is not in that
  manager's own collection (`SelectionManager.mjs:65-66`). A stale manager
  silently ignores a row that was added after it was created.

See `proposal.md` for the scope and `specs/nimbus-data-table/spec.md` for the
behavior.

## Goals / Non-Goals

**Goals:**

- `apiRef` works after the rows changed, including a call from an effect right
  after a sort or filter change.
- One small place computes the scroll offset, so FEC-1484 can add sticky stacks
  without rewriting it.

**Non-Goals:**

- Any sticky-row code. FEC-1484 adds it; nothing here is prepared for it except
  the `topInset` and `bottomInset` inputs of the offset function.
- Virtualized tables (#2062).

## Decisions

**1. A registry object in the context, written by row, header and cell.** The
root creates a stable object once with `useRef`:
`rowElements: Map<string, HTMLElement>`, `tableState`, `headerElement`. Writing
to it re-renders nothing. The row adds its element under its key and removes it
on unmount. The header stores its element. A small internal component rendered
in cell content reads `TableStateContext` and stores it.

- *Alternative: query the DOM with `data-key`.* Rejected: `data-key` is a React
  Aria detail that Nimbus does not document, and it cannot find rows that are not
  in the DOM.
- *Alternative: React state for the registry.* Rejected: every registration
  would re-render the table.

**2. The cell registrar writes the latest table state on every render and is
read at call time.** Because the selection manager is replaced on each render
(see Context), the registrar writes in an effect on every change of the context
value, not once. On unmount it clears the field only when the stored value is
still its own, so a newer registrar is not erased by an older one that unmounts
later. `scrollToRow` reads the registry when it runs, never earlier.

- *Alternative: register once from the first row.* Rejected: that row can be
  removed or replaced, and the manager would then hold an old collection.

**3. Wait one animation frame before reading the registry.** The consumer may
call from an effect right after the rows changed. At that moment React Aria may
not have rendered the new collection yet. `scrollToRow` waits one frame, then
checks the shown-row rule and reads the registry. This is verified by a story
(a call from an effect right after a sort change resolves `true`). If the story
shows one frame is not enough, the wait changes and the change goes back to the
user.

**4. One pure function computes the target.** `computeTargetScrollTop` in
`utils/scroll-to-row.utils.ts` takes `rowTop`, `rowHeight`, `viewportHeight`,
`scrollTop`, `scrollHeight`, `topInset`, `bottomInset` and `align`, and returns
a number, or `null` when no scroll is needed. The visible area is
`[scrollTop + topInset, scrollTop + viewportHeight - bottomInset]`. The result is
clamped to `[0, scrollHeight - viewportHeight]`. In this change `topInset` is the
header height and `bottomInset` is `0`. The function is the only place that
knows about insets.

- *Alternative: `element.scrollIntoView()`.* Rejected: it cannot subtract the
  header, and FEC-1484 needs to subtract more.

**5. Settling.** For `"auto"` the table sets `scrollTop` and the Promise
resolves after the next animation frame. For `"smooth"` it resolves on
`scrollend`. Browser support for `scrollend` in Safari is not verified in this
work: MDN lists the event as "Baseline 2025 Newly available. Since December
2025" and gives no Safari version. So the fallback from the design document is
always active: the Promise also resolves when `scrollTop` has not changed for
two animation frames. Whichever happens first wins, and the other is cleaned up.

**6. Cancellation.** The handle keeps one pending call. A new call rejects it
with `new DOMException("Replaced by a newer scrollToRow call", "AbortError")`
before it does anything else. An effect cleanup rejects it on unmount.

**7. Focus.** After the scroll, unless the row is disabled, call
`tableState.selectionManager.setFocusedKey(key)` on the state read from the
registry. With `focus: true`, call `element.focus({ preventScroll: true })`. For a
disabled row, do neither and log a development warning if `focus: true` was
passed. React Aria would accept the key, but its arrow keys skip disabled rows.

**8. Shown rows.** A row is shown when it is a top-level row of the sorted and
searched rows in the interaction context. Anything else resolves `false` before
any scroll.

## Risks / Trade-offs

- [Stale selection manager ignores a new key] → Decision 2 and 3; a story calls
  `scrollToRow` right after the rows change.
- [`scrollend` missing in some Safari versions] → The two-frame fallback is
  always active. No Safari test was possible here; the fallback is covered by a
  unit test with `scrollend` never fired.
- [JSDOM has no `scrollTo`] → The hook tests fake the scroll container, and
  nothing throws when `scrollTo` is missing.
- [A call before the rows have rendered] → Documented: call after the rows have
  rendered.
- [React Aria internals] → The plan relies on the behavior listed in Context. A
  React Aria upgrade must re-check it.
