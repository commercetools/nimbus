## Why

An audit of `DataTable` (FEC-1346) found public props that type-check but do
nothing, a row interaction that only works with a mouse, and user-facing text
that is not translated. These are observable defects, so they have to be fixed
before FEC-1347 refactors the component for performance. That refactor must not
change behaviour, and refactoring against buggy behaviour would lock the bugs
in.

The defects, verified against `react-aria-components@1.21.1`,
`react-aria@3.52.1` and `react-stately@3.50.0`:

| Area                 | What consumers see today                                                                                                                                                                                                                          |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `renderEmptyState`   | Ignored. Every empty table shows the built-in "No Data". The prop is spread onto the root DOM element instead.                                                                                                                                    |
| `selectionBehavior`  | Ignored since the first release. It never reaches React Aria, so `"replace"` behaves like `"toggle"`. No requirement asks for replace mode and no consumer passes the prop (design.md, D5).                                                       |
| `disabledKeys="all"` | Rows look disabled, but React Aria receives the string `"all"`. `new Set("all")` is `{"a", "l"}` (`useGridState.mjs:14`), so rows stay selectable and focusable.                                                                                  |
| `row.isDisabled`     | Ignored unless `disabledKeys` is also passed.                                                                                                                                                                                                     |
| Selection column     | Two rules decide whether it exists: `selectionMode !== "none"` (nested row `colSpan`) and `selectionBehavior === "toggle"` (cell and header). Wiring `selectionBehavior` alone would make the nested row one column too wide in `"replace"` mode. |
| Row activation       | `onRowClick` listens to pointer events only. A keyboard user can focus a row but cannot activate or expand it. This fails WCAG 2.1.1 Keyboard (Level A).                                                                                          |
| Translation          | The pin button name ("Pin row" / "Unpin row"), the empty state ("No Data") and the nested row placeholder ("N nested items") are hardcoded English. Six translated message keys are never used.                                                   |
| `onRowAction`        | Fires only when a user clicks a _disabled_ row, with `(row, "click")`. `"select"` is never emitted. The name suggests React Aria's row action, which is a different thing.                                                                        |
| `nestedKey`          | A half-finished port of an idea that UIKit never shipped. The real need is already met by `renderNestedContent`.                                                                                                                                  |

`selectionBehavior="replace"` was never tested: the only two stories that set
the prop pass `"toggle"`, which is the default.

Three claims from the ticket did not hold and are **not** part of this change:

- The 300 ms click delay is not only for draggable rows. `handleRowDoubleClick`
  cancels the pending click before its draggable check, so on every table a
  double-click to select a word does not activate the row. The story
  "Double-clicking text does not trigger onRowClick" tests this on a table that
  is not draggable. The mouse delay stays. Enter has no double-click, so it
  activates immediately.
- Re-selecting the active layout option does not emit anything
  (ToggleButtonGroup returns an empty selection, which the handler ignores), so
  only a test is added.
- The expand button size is measured before anything is changed.

## What Changes

- `renderEmptyState` is rendered when the table has no rows.
- **BREAKING (type):** `selectionBehavior` is removed from `DataTableProps`. It
  never had an effect, so nothing changes at runtime. Code that passes it no
  longer compiles; delete the prop. Selection always uses React Aria's
  `"toggle"` behavior. See design.md, D5, for why the prop is removed instead of
  fixed.
- One rule decides whether the selection column exists:
  `selectionMode !== "none"`. Header, cells and nested row `colSpan` all use it.
- `disabledKeys="all"` disables every row for React Aria as well (selection,
  focus order), not only visually.
- `row.isDisabled: true` disables a row without `disabledKeys`.
- **New:** `onRowAction(row)` fires when a user clicks a row **or presses
  Enter** on it. Space keeps selecting the row, as in React Aria. Enter
  activates the row even when other rows are selected, the same as a click. When
  `allowsExpandColumn={false}`, Enter also expands the row.
- **BREAKING (behaviour):** clicking a disabled row no longer calls
  `onRowAction`. Disabled rows do nothing. The old signature
  `(row, action: "click" | "select")` becomes `(row)`. No consumer uses
  `onRowAction`: a scan on 2026-09-29 of all 16 repositories that depend on
  Nimbus found 0 uses. It covered the default branch and every branch with a
  commit since the prop first shipped (1,175 branches). See design.md, D4.
- `onRowClick` is **deprecated** in favour of `onRowAction`. It keeps working,
  including for Enter.
- Enter activates the row immediately. A mouse click keeps its 300 ms wait, so
  double-clicking a word to select it never activates the row.
- `nestedKey` is **deprecated** in favour of `renderNestedContent`. No runtime
  change.
- New message keys: `pinRow`, `unpinRow`, `noData`, `nestedItemsCount`. The
  layout settings panel gets its region name from `layoutSettingsAriaLabel`. The
  remove button in the visible-columns list is named "Hide column"
  (`hideColumn`). Four unused keys are deleted (`comfortableAriaLabel`,
  `compactAriaLabel`, `fullTextAriaLabel`, `textPreviewsAriaLabel`).
- `DraggableList.Item` gets an optional `removeButtonLabel` prop, so DataTable
  can pass "Hide column" instead of the generic "remove item".
- `onVisibilityChange` is removed from the internal context type (never
  provided, never read).
- The expand column header no longer shows an arrow icon. Internal feedback
  (#2019) says users can mistake it for a control they can click, but the
  header does nothing. The header keeps its hidden name "Expand rows" for
  screen readers.
- Released as **minor** (new behaviour: keyboard activation, working props,
  deprecations). The `onRowAction` change and the removal of `selectionBehavior`
  would normally need a major release (`docs/changeset-conventions.md`). They
  ship as a minor on purpose, because the usage checks found no consumer to
  break (design.md, D4 and D5).

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `nimbus-data-table`: adds "Row Activation" (click and Enter, deprecated
  `onRowClick`, disabled rows, mouse delay vs. immediate Enter) and "Disabled
  Rows" (`disabledKeys="all"`, `row.isDisabled`); modifies "Row Selection" (no
  `selectionBehavior` prop, single selection-column rule), "No Data Display"
  (`renderEmptyState`, localized default); adds "Nested Content API"
  (`nestedKey` deprecated) and "Localized Row and Panel Labels" (pin, nested
  placeholder, layout panel, hide column); modifies "Row Click Cursor Feedback"
  and "Text Selection in Clickable Rows" (now keyed on `onRowAction`), and "Row
  Expansion" (no icon in the expand column header).
- `nimbus-draggable-list`: adds an optional `removeButtonLabel` on items.

## Impact

- **Code** (`packages/nimbus/src/components/data-table/`):
  `components/data-table.root.tsx`, `data-table.table.tsx`,
  `data-table.header.tsx`, `data-table.row.tsx`, `data-table.body.tsx`,
  `data-table.layout-settings-panel.tsx`,
  `data-table.visible-columns-panel.tsx`, `data-table.types.ts`,
  `data-table.i18n.ts`; `draggable-list/components/draggable-list.item.tsx` and
  its types.
- **Tests**: new stories with play functions in `data-table.stories.tsx`, each
  failing before its fix; `draggable-list.stories.tsx`;
  `data-table.docs.spec.tsx` moves to `onRowAction`.
- **Docs**: `data-table.dev.mdx`, `data-table.mdx`, `data-table.a11y.mdx`
  (keyboard table), `draggable-list.dev.mdx`; minor changeset.
- **Translations**: the new keys show English in de, es, fr-FR and pt-BR until
  the next Transifex sync delivers them.
- **Depends on**: `fix-data-table-row-identity` (#1996). Row ids come from its
  `getRowKey`, and its "Row Selection" delta is the base for this one.
- **Follow-up**: #2007 (`size` prop) computes the expand column width from
  `selectionBehavior === "toggle"`; it must switch to `showSelectionColumn` from
  context.
- **Not in scope**: performance and recipe cleanup (FEC-1347).
