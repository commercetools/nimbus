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
  _disabled_ rows, and `"select"` is never emitted. No consumer in the 13
  mirrored repositories uses it. `onRowClick` is used in 55 consumer files.
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

- New keys: `pinRow`, `unpinRow`, `noData`, and `nestedItemsCount` ("Nested items: {count}"). No ICU plural: the i18n pipeline does not support it — `normalizeMessages` drops the formatter argument that compiled plural functions need, and their parameters are untyped.
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
  disabled-row-only behaviour would now run for enabled rows.] → No known
  consumer uses it. The changeset calls it out.
- [`RaRow` may not forward `onKeyDownCapture`.] → Fall back to the native
  listener pattern that already exists in the row.
- [The new message keys show English in de, es, fr-FR and pt-BR until the next
  Transifex sync.] → Stated in the PR. This is the normal flow for new keys.
- [Conflict with #2007 in `data-table.header.tsx`.] → #2007 moves its expand
  width to `showSelectionColumn` when it is rebased.

## Migration Plan

Minor release, no required consumer action. `onRowClick` and `nestedKey` keep
working with deprecation notices. Rollback means reverting the PR; no data or
storage is involved.

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

## Found during the keyboard walkthrough (not fixed here)

Every row with expandable content always renders its nested row, hidden with
`display: none` while collapsed (`data-table.recipe.ts`,
`&[data-nested-row-expanded='false']`). React Aria keeps those rows in the
collection, so ArrowDown / ArrowUp first moves React Aria's focus onto the
hidden row, which the browser cannot focus. For the user, one arrow press
per collapsed row appears to do nothing. This exists on the base branch and
this change does not touch it; it needs its own fix (for example, not rendering
the nested row while collapsed).

