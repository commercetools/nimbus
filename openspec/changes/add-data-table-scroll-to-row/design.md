## Context

Sources for this design: the Jira ticket FEC-1483, the current DataTable code,
and primary React Aria and web-platform sources. Each fact below names its
source.

**Code today.** The root element scrolls (`overflow: "auto"`,
`data-table.recipe.ts:138`). The header is `position: sticky; top: 0`
(`data-table.recipe.ts:268-272`). `DataTable.Row` renders `RaRow` with
`id={rowKey}` and a `ref` (`components/data-table.row.tsx:701-705`). React Aria
renders `DataTable.Row` itself outside the table's state context; cell content
is rendered inside it, so `TableStateContext` is only available there
(`NestedContentPanel`, `components/data-table.row.tsx:124-164`).
`ChatMessageList` already has an imperative handle with `scrollToBottom` and a
`prefers-reduced-motion` fallback (`chat-message-list.types.ts:31-37`).

**React Aria (react-aria-components 1.22.1, react-aria 3.53.1, react-stately
3.51.0, read in `node_modules`).**

- `TableStateContext` is a public export (`Table.mjs`, export list). It is
  provided by `TableInner` around the collection, with `filteredState`.
- `filteredState` is rebuilt on every render, and `selectionManager` is created
  again with it (`useTableState.mjs:82`). The collection is memoized
  (`useTableState.mjs:78`). `focusedKey` and `isFocused` live in refs, so
  reading them is always current (`useMultipleSelectionState.mjs:27-28`). No
  documentation describes how stable the state object is between renders.
- `selectionManager.setFocusedKey(key)` does nothing when the key is not in that
  manager's collection (`SelectionManager.mjs:65-66`).
- `setFocusedKey` alone does not move DOM focus. The row's effect in
  `useSelectableItem.mjs` focuses the element only when
  `key === manager.focusedKey` and `manager.isFocused` are both true. React
  Aria's own scroll into view runs only when `manager.isFocused` is true, and
  only for keyboard modality (`useSelectableCollection.mjs`, about lines
  402-428).
- React Aria finds a row element with `[data-key="…"]`. That attribute is not
  documented. The ticket names this as the problem with the prototype.

**Web platform.**

- `behavior: "auto"` follows the computed CSS `scroll-behavior` (MDN,
  `Element.scrollTo`). A consumer's `scroll-behavior: smooth` would make
  `"auto"` smooth. `"instant"` is always a single jump.
- `scrollend`: MDN browser-compat-data lists Safari 26.2 (desktop and iOS),
  Chrome 114, Firefox 109. I found no WebKit release note that confirms it, and
  I did not test Safari. No `scrollend` fires when the scroll position does not
  change (MDN).

See `proposal.md` for scope and `specs/nimbus-data-table/spec.md` for behavior.

## Goals / Non-Goals

**Goals:**

- `scrollToRow` works after the rows changed, including a call from an effect
  right after a sort or filter change.
- One small function computes the scroll offset, so FEC-1484 can add sticky
  stacks without rewriting it.

**Non-Goals:**

- Sticky-row code. The only preparation is the `topInset` and `bottomInset`
  inputs of the offset function.
- Virtualized tables (#2062).

## Decisions

**1. Find row elements through a registry filled by the row's ref.** The root
creates one stable object with `useRef` and puts it in the context. Each
`DataTable.Row` adds its element under its key and removes it on unmount,
through a ref callback merged with the existing ref. Writing to it re-renders
nothing.

- _Alternative: `querySelector('[data-key]')`._ Rejected: undocumented React
  Aria internal, and the ticket names it as the problem.
- _Alternative: React state._ Rejected: every registration would re-render the
  table.

**2. Read table state through `TableStateContext` in cell content, and keep the
latest value.** A small internal component in cell content reads the context and
writes it to the registry in an effect on every change. On unmount it clears the
entry only when the stored value is still its own. `scrollToRow` reads the
registry when it runs. Reason: the manager is replaced on every render, and a
stale manager ignores keys added after it was created.

- _Alternative: register once from the first row._ Rejected: that row can be
  removed, and the stored manager would keep an old collection.

**3. One pure function computes the target scroll position.**
`computeTargetScrollTop` takes the row's top and height, the viewport height,
`scrollTop`, `scrollHeight`, `topInset`, `bottomInset` and `align`. It returns
the new `scrollTop`, or `null` when `"nearest"` needs no scroll. The visible
area is `[scrollTop + topInset, scrollTop + viewportHeight - bottomInset]`. The
result is clamped to `[0, scrollHeight - viewportHeight]`. Here `topInset` is
the header height and `bottomInset` is `0`. The function is the only place that
knows about insets.

- _Alternative: `element.scrollIntoView()`._ Rejected: it cannot subtract the
  header, and FEC-1484 needs to subtract more.

**4. Focus.** The focused key is always set after the scroll, with
`selectionManager.setFocusedKey(key)` on the state from the registry. That sets
the roving tab stop and moves no DOM focus. With `focus: true`, call
`element.focus({ preventScroll: true })` on the row element, so the browser does
not undo the chosen alignment. For a disabled row, do neither, and warn in
development if `focus: true` was passed.

**5. `"auto"` means instant.** The ticket says `"auto"` is instant. Because the
platform's `"auto"` follows CSS `scroll-behavior`, Nimbus passes `"instant"` to
`scrollTo` for `"auto"`. `"smooth"` becomes `"instant"` when
`matchMedia("(prefers-reduced-motion: reduce)")` matches.

**6. Settling.**

- Instant: resolve after the next animation frame.
- Smooth: if the computed target equals the current `scrollTop`, resolve at
  once, because no `scrollend` would fire. Otherwise resolve on `scrollend` when
  the browser supports it (`"onscrollend" in window`). When it does not, resolve
  after `scrollTop` has not changed for two animation frames.
- The fallback is chosen by feature detection, not by browser name. I could not
  test Safari; the fallback is covered by a unit test where `scrollend` does not
  exist.

**7. Cancellation.** The handle keeps one pending call. A new call rejects it
with `new DOMException("…", "AbortError")` before it does anything else. An
effect cleanup rejects the pending call on unmount.

**8. Shown rows.** A row is shown when it is a top-level row of the sorted and
searched rows in the interaction context. Any other key resolves `false` before
any scroll or focus change. Without a registered Table, the call resolves
`false` and logs a development warning.

**9. Reading the registry after the rows changed (hypothesis, not yet tested).**
`scrollToRow` waits one animation frame before it checks the shown-row rule and
reads the registry, so a call from an effect right after a sort or filter change
sees the new rows. A story tests this. If one frame is not enough, I stop and
ask the user before I change the approach.

## Risks / Trade-offs

- [Stale selection manager ignores a new key] → Decisions 2 and 9; a story calls
  `scrollToRow` right after the rows change.
- [`scrollend` support in older Safari] → Feature-detected fallback (decision
  6), unit tested. Not tested in Safari.
- [JSDOM has no `scrollTo`] → Hook tests use a fake scroll container, and
  nothing throws when `scrollTo` is missing.
- [Consumer calls before the rows have rendered] → Documented in `dev.mdx`; the
  call resolves `false` for a key that is not shown yet.
- [React Aria internals] → Decisions 2 and 4 rely on the behavior listed in
  Context. A React Aria upgrade must re-check it.
