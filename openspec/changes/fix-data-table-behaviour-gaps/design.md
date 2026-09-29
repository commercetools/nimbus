## Context

`DataTable` wraps React Aria's `Table`. Row clicks do **not** go through React
Aria. Three native capture-phase listeners on each row (`pointerdown`,
`mouseup`, `dblclick`, set up in `rowCallbackRef` in `data-table.row.tsx`)
handle them. The reason is written in the row component and tracked upstream in
[react-spectrum#7962](https://github.com/adobe/react-spectrum/issues/7962):
React Aria turns a row click into a selection toggle once any row is selected.

This change builds on `fix-data-table-row-identity` (#1996). Every row id comes
from `getRowKey` in context, never from `row.id`.

Versions checked: `react-aria-components@1.21.1`, `react-aria@3.52.1`,
`react-stately@3.50.0`.

## Goals / Non-Goals

**Goals:**

- Every public prop that exists does what its type says.
- One rule decides whether the selection column exists.
- A keyboard user can activate and expand any row a mouse user can (WCAG 2.1.1).
- A clear name for row activation (`onRowAction`), with `onRowClick` kept as a
  deprecated alias.
- No hardcoded user-facing English.
- Every fix is proved by a story whose play function fails before the fix.

**Non-Goals:**

- Performance and recipe cleanup (FEC-1347).
- Building child-row rendering for `nestedKey` (deprecated only).
- Changing the mouse click delay.
- A keyboard shortcut for pinning. The pin button in the cell is already
  reachable with the arrow keys and operable with Enter or Space.

## Decisions

### D1 — Keyboard activation: Enter only; Space stays selection

**Sources:**

- WCAG 2.1.1 requires all functionality to be operable through a keyboard.
- The WAI-ARIA APG grid pattern gives "Shift + Space: Selects the row" and has
  no rule for activating a row.
- React Aria's selection guide: "In the default "toggle" selection behavior,
  when nothing is selected, clicking, tapping, or pressing the Enter key
  triggers the item action. Items may be selected … by pressing the Space key."
  In code, `isActionKey` is `key === 'Enter'` and `isSelectionKey` is
  `key === ' '` (`useSelectableItem.mjs:307–311`).
- Nimbus Tree and Menu use React Aria's `onAction`, so Enter runs the action
  there too.

**Decision:** Enter activates the row. Space keeps React Aria's selection
behaviour.

**Alternative rejected:** Enter and Space (as written in the ticket). Space
would stop selecting on clickable rows, which goes against React Aria and the
rest of Nimbus.

### D2 — Keyboard path: React capture handler, not React Aria's `onAction`

React Aria's `onAction` only runs while the selection is empty in toggle mode
(`hasPrimaryAction`, `useSelectableItem.mjs:116`). Once a row is selected, Enter
toggles the selection instead, which is the #7962 limitation.

**Decision:** handle Enter in a key-down capture handler on the row, before
React Aria sees the event. First choice: a React `onKeyDownCapture` prop on
`RaRow`, if React Aria's `Row` forwards it to the DOM element (it filters with
`filterDOMProps(props, { global: true })`; verify during implementation).
Fallback: a native listener in `rowCallbackRef` next to the existing three. When
the handler activates the row, it calls `preventDefault` and `stopPropagation`.
Otherwise it does nothing and React Aria's default applies.

**Alternative rejected:** `RaTable onRowAction`. Enter would stop activating as
soon as any row is selected, so keyboard and mouse would behave differently.

### D3 — Mouse path stays native; the 300 ms delay stays

React Aria's `Row` accepts `PressEvents`, but `useSelectableItem` merges the
consumer's `onPress` with its own selection press handler. With selection
enabled, one press would run our action _and_ toggle the selection. The press
props are also only attached when the row is selectable or has `onAction`.

No React Aria hook waits for a possible double-click. React Aria handles
double-click only in `"replace"` mode, where it runs the action.

The delay exists so that double-clicking a word to select it does not activate
the row. `handleRowDoubleClick` cancels the pending click before its draggable
check, so this protects every table, not only draggable ones. The story
"Double-clicking text does not trigger onRowClick" tests it on a table that is
not draggable.

**Decision:** no change to the mouse path. The keyboard path is immediate,
because Enter has no double-click.

**Alternative rejected:** remove the delay when the table is not draggable (as
written in the ticket). The first click of a double-click would activate the row
(for example navigate away), and the existing story would fail.

### D4 — `onRowAction(row)` replaces `onRowClick`; disabled rows do nothing

- The name follows React Aria (`Table onRowAction`, `Row onAction`) and means
  "activate, whatever the input". `onRowPress` was rejected: in React Aria,
  "press" (`usePress`) includes Space, which does not activate rows here.
- The current `onRowAction(row, "click" | "select")` only fires on clicks on
  _disabled_ rows, and `"select"` is never emitted. `onRowClick` is used in 55
  consumer files.
- No consumer uses `onRowAction` (usage scan on 2026-09-29). Nimbus is not yet
  offered to customers for Merchant Center Custom Applications, so every
  consumer is a GitHub repository:
  - 16 repositories depend on Nimbus. They were found with GitHub code search
    for `"@commercetools/nimbus"` in `package.json` and with the discovery list
    of `@mcf/nimbus-consumer-registry`. Code search does not index archived
    repositories, forks, or repositories without activity in the last year, so
    the `package.json` files of those 61 repositories (pushed to since
    2025-08-21) were read directly. The only extra consumer found,
    `intake-agent-frontend`, is one of the 16.
  - Each repository's full default branch, every branch with a commit since
    2025-08-21 (when the prop first shipped) and open PRs from forks were
    scanned with `git diff -G onRowAction`: 1,175 branches scanned, 790 skipped
    as older than the prop, 0 hits. A control run found the 6 known `<DataTable`
    files in `commerce-agents`.
  - deps.dev reports 0 npm packages that depend on `@commercetools/nimbus`.
  - The old behaviour had no documented purpose. The first DataTable commit
    (#279) added it with the comment "TODO: Clarify business requirement - why
    allow clicks on disabled rows?". UI Kit's DataTable has no disabled rows.
- Keeping the old `onRowAction` was rejected. An optional second parameter still
  fails to compile for a handler typed `(row, action: "click" | "select")`, and
  old handlers that do compile would silently run for enabled rows. Moving
  activation to `onRowClick` instead was also rejected: Enter is not a click.
- New signature: `onRowAction?: (row) => void`. One internal `activateRow`
  returns early for disabled rows, toggles expansion when
  `allowsExpandColumn={false}`, then calls
  `onRowActionRef.current ?? onRowClickRef.current`.
- `onRowClick` gets `@deprecated Use onRowAction instead.` and keeps working,
  including for Enter.

### D5 — One rule for the selection column

React Aria gives `selectionBehavior: selectionMode === 'none' ? null : …`
(`Table.mjs:328`). Today the header and cells check
`selectionBehavior === "toggle"` from `useTableOptions()`, while the nested row
`colSpan` checks `selectionMode !== "none"`. They agree only because
`selectionBehavior` never reaches React Aria.

**Decision:** Root computes
`showSelectionColumn = selectionMode !== "none" && selectionBehavior === "toggle"`
and puts it in context. Header, cells, the expand column width and `colSpan` all
read it. `selectionBehavior` (default `"toggle"`) is forwarded to `RaTable`.

### D6 — `disabledKeys="all"` normalised before React Aria

React Stately does `new Set(props.disabledKeys)` (`useGridState.mjs:14`), and
`new Set("all")` is `{"a", "l"}`.

**Decision:** `DataTable.Table` passes `new Set(rows.map(getRowKey))` when
`disabledKeys === "all"` and the Set otherwise. `getIsDisabled` checks
`row.isDisabled` before `disabledKeys`, so a row can be disabled by its data
alone.

**Found during implementation:** each row already passes `isDisabled` to React
Aria's `Row`, so the keyboard and the row checkboxes already treated every row
as disabled. The visible defect was the header checkbox. React Aria's select-all
ignores disabled rows: its checkbox is only disabled for an empty table
(`useTableSelectionCheckbox.mjs:41`), and it reports the literal `"all"`. So the
header checkbox is also disabled when `disabledKeys === "all"`.

### D7 — i18n

- New keys: `pinRow`, `unpinRow`, `noData`, and `nestedItemsCount` ("Nested
  items: {count}"). No ICU plural: the i18n pipeline does not support it —
  `normalizeMessages` drops the formatter argument that compiled plural
  functions need, and their parameters are untyped.
- `layoutSettingsAriaLabel` names the layout panel group.
- `hideColumn` names the remove button in the visible-columns list. This needs a
  new optional `removeButtonLabel` on `DraggableList.Item`, defaulting to the
  current localized "remove item".
- Four unused "… section" keys are deleted. The visible labels (`fullText`,
  `textPreviews`, `comfortable`, `compact`) are already translated and are
  better accessible names for toggle buttons.

## Risks / Trade-offs

- [Existing tables with `onRowClick` and selection gain Enter activation. Enter
  no longer toggles selection on those rows.] → Space still toggles it, the
  checkbox still works, and this matches React Aria's convention for rows with
  an action. Documented in the changeset.
- [`onRowAction` changes meaning. A handler written for the old
  disabled-row-only behaviour would now run for enabled rows.] → The usage scan
  in D4 found no consumer that uses it. The changeset calls it out.
- [`RaRow` may not forward `onKeyDownCapture`.] → Fall back to the native
  listener pattern that already exists in the row.
- [The new message keys show English in de, es, fr-FR and pt-BR until the next
  Transifex sync.] → Stated in the PR. This is the normal flow for new keys.
- [Conflict with #2007 in `data-table.header.tsx`.] → #2007 moves its expand
  width to `showSelectionColumn` when it is rebased.

## Migration Plan

Minor release. The one breaking change, to `onRowAction`, ships in a minor on
purpose, because no consumer uses the prop (D4). No other consumer action is
required. `onRowClick` and `nestedKey` keep working with deprecation notices.
Rollback means reverting the PR; no data or storage is involved.

## Open Questions

- ~~Does React Aria's `Row` forward `onKeyDownCapture` to the DOM?~~ No.
  `filterDOMProps(props, { global: true })` forwards pointer, mouse and touch
  events but no keyboard events, so Enter uses a native capture listener next to
  the other three.
- The expand button's rendered size, measured in Chromium by the
  `ExpandButtonTargetSize` story: 72×62 px without a selection column, 24×62 px
  with one. The narrow case meets WCAG 2.2 SC 2.5.8 (24×24) exactly, with no
  margin, so it is not widened. The story fails if a later change (for example
  the `size` prop in #2007) drops it below 24 px.

## Found during the keyboard walkthrough

### D8 — Nested rows exist only while expanded

Every row with expandable content used to render its nested row all the time and
hide it with `display: none` while collapsed. React Aria kept those hidden rows
in the collection, so ArrowDown / ArrowUp first moved React Aria's focus onto a
row the browser cannot focus: one press per collapsed row appeared to do
nothing. The grid also counted the hidden rows. This came from `main`, not from
this change.

**Decision:** render the nested row only while its row is expanded, and delete
the `display: none` rule. Collapsed nested content was already rendered as
`null`, so nothing that was visible or mounted is lost.

### D9 — Closing nested content returns focus to its opener

With the nested row gone after collapse, closing it from inside (the `close`
callback of `renderNestedContent`) removes the focused element. React Stately's
grid state then moves focus to the row now at that position (`useGridState.mjs`,
"Reset focused key if that item is deleted"), so focus jumped to the next row.
Before D8 it fell to the page body.

**Decision:** `close` first sets React Aria's focused key to the control that
opened the panel: the row's expand cell, or the row itself when there is no
expand column. React Aria then moves focus there before the nested row is
removed. This needs `TableStateContext`, which React Aria does not provide to
`DataTable.Row` itself (row components run in its collection-building pass),
only to cell content. So a small `NestedContentPanel` inside the nested cell
owns `close`.

**Alternative rejected:** focusing the expand button from an effect after the
collapse. It races React Aria's own focus correction: it worked in a manual
browser run and failed in the story, depending on which effect ran last.

### D10 — Disabled rows use the shared disabled layer style

DataTable dimmed disabled rows with its own `opacity: 0.8`, in two rules (root
and row slot); `layerStyle: "disabled"` had been commented out in both since the
first DataTable commit, with no stated reason. Tree, ListBox and DraggableList
put the layer style (`opacity: 0.5`, `cursor: not-allowed`) on the whole row.

**Decision:** the row slot uses `layerStyle: "disabled"`, the duplicate root
rule is deleted, and disabled rows get no hover highlight.

**Trade-offs, measured in Chromium:**

- Cell text contrast on white drops from 8.4:1 to 3.19:1. WCAG 1.4.3 does not
  require contrast for inactive user interface components.
- A disabled row's checkbox applies the layer style too, so it renders at 0.25
  instead of 0.4. DraggableList behaves the same way.
- Opacity below 1 already made each disabled row its own stacking context at
  0.8, so sticky columns are unaffected.
