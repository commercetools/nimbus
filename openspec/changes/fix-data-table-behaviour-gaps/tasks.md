Each story task follows red/green: write the story with its play function, run
it once and see it fail, then fix. Paths are relative to
`packages/nimbus/src/components/data-table/`.

## 1. Dead props and disabled rows

- [x] 1.1 Stories: `renderEmptyState` renders custom content (not "No Data") and
      is not an attribute on the root element
- [x] 1.2 Stories: `selectionBehavior="replace"` renders no checkbox column and a
      click replaces the selection; nested row `colSpan` equals the rendered cell
      count in `"toggle"` and in `"replace"`
- [x] 1.3 Stories: `disabledKeys="all"` — no row selectable by click, checkbox,
      Space or header checkbox; a row with `isDisabled: true` and no
      `disabledKeys` is disabled
- [x] 1.4 `root.tsx`: destructure `renderEmptyState` and
      `selectionBehavior = "toggle"`, compute `showSelectionColumn`
      (`selectionMode !== "none" && selectionBehavior === "toggle"`), add all to
      `contextValue` and its deps
- [x] 1.5 `table.tsx`: forward `selectionBehavior`; pass
      `new Set(rows.map(getRowKey))` when `disabledKeys === "all"`
- [x] 1.6 `header.tsx` and `row.tsx`: use `showSelectionColumn` for the selection
      column, the selection cell and the expand column width
- [x] 1.7 `row.tsx` `getIsDisabled`: check `row.isDisabled` before `disabledKeys`
- [x] 1.8 `data-table.types.ts`: remove `onVisibilityChange`; add
      `selectionBehavior` and `showSelectionColumn` to the context type; JSDoc on
      `renderEmptyState`, `selectionBehavior`, `disabledKeys`

## 2. Row activation

- [x] 2.1 Stories: Enter on a focused row calls `onRowAction` (also with a row
      selected, and without changing the selection); Enter expands when
      `allowsExpandColumn={false}`; Space toggles selection and does not call
      `onRowAction`; Enter on the pin button pins and does not call
      `onRowAction`; clicking a disabled row calls nothing; `onRowClick` alone
      still fires on click and Enter; with both props only `onRowAction` fires
- [x] 2.2 Check whether `RaRow` forwards `onKeyDownCapture` to the DOM (design
      D2); pick React prop or native listener accordingly
- [x] 2.3 `row.tsx`: extract `activateRow(columnId?)` (early return when
      disabled, expand via row click, `onRowActionRef.current ??
      onRowClickRef.current`); the mouse path calls it inside the existing
      300 ms timeout; remove the disabled → `onRowAction(row, "click")` branch
- [x] 2.4 `row.tsx`: Enter handler — no modifiers, not `repeat`, row clickable,
      target not interactive (`getIsTableRowChildElementInteractive`) →
      `preventDefault`, `stopPropagation`, `activateRow` with the focused cell's
      column id; update the listener comment block
- [x] 2.5 `data-table.types.ts`: `onRowAction?: (row) => void` with JSDoc (click
      or Enter, not Space, never for disabled rows); `@deprecated` on
      `onRowClick`; update context ref types and the `allowsExpandColumn` JSDoc
- [x] 2.6 `root.tsx`: `isRowClickable` true for `onRowAction` or `onRowClick`
- [x] 2.7 Move stories, `data-table.docs.spec.tsx`, `data-table.dev.mdx` and
      `data-table.mdx` to `onRowAction`; keep one story for `onRowClick`
- [x] 2.8 Search the MCP migration data for `onRowClick` and update it
- [x] 2.9 `data-table.a11y.mdx`: keyboard table (arrow keys, Enter activates,
      Space selects, buttons inside cells)

## 3. Localized labels

- [x] 3.1 Stories: pin button named "Pin row" / "Unpin row"; default empty state
      text from messages; layout panel is a group named "Layout settings
      section"; the column remove button is named "Hide column"
- [x] 3.2 `data-table.i18n.ts`: add `pinRow`, `unpinRow`, `noData`,
      `nestedItemsCount` ("Nested items: {count}"); delete `comfortableAriaLabel`,
      `compactAriaLabel`, `fullTextAriaLabel`, `textPreviewsAriaLabel`
- [x] 3.3 `row.tsx`: pin `title` / `aria-label` and nested placeholder from
      messages; `body.tsx`: `DefaultEmptyStateMessage` uses `noData`
- [x] 3.4 `layout-settings-panel.tsx`: group with `layoutSettingsAriaLabel`
- [x] 3.5 `DraggableList.Item`: optional `removeButtonLabel` (types, component,
      JSDoc, story, `draggable-list.dev.mdx`); `visible-columns-panel.tsx`
      passes `msg.format("hideColumn")`
- [x] 3.6 Run `pnpm extract-intl` and commit the generated files

## 4. Deprecate nestedKey

- [x] 4.1 `data-table.types.ts`: `@deprecated Use renderNestedContent instead.`
      on `nestedKey`; fix the `renderNestedContent` JSDoc that recommends
      `nestedKey`
- [x] 4.2 `data-table.dev.mdx` / `data-table.mdx`: deprecation note with a
      migration snippet

## 5. Tests without code change

- [x] 5.1 Story: pressing the active layout option does not call
      `onSettingsChange`; pressing the other option calls it once with the
      matching action
- [x] 5.2 Story: measure the expand button with and without a selection column;
      assert at least 24×24; record the size in FEC-1346 and widen only if it
      fails

## 6. Release and validation

- [x] 6.1 Minor changeset for `@commercetools/nimbus` (consumer view, per
      `docs/changeset-conventions.md`): keyboard activation, `onRowAction` and
      deprecated `onRowClick`, disabled rows no longer call `onRowAction`,
      working `selectionBehavior` / `renderEmptyState` / `disabledKeys="all"`,
      `nestedKey` deprecated, `DraggableList.Item removeButtonLabel`
- [x] 6.2 `pnpm --filter @commercetools/nimbus typecheck:dev` shows no new errors
- [x] 6.3 `pnpm test:dev` for `data-table.stories.tsx`, `data-table.docs.spec.tsx`
      and `draggable-list` green; `pnpm lint` clean
- [x] 6.4 Keyboard-only walkthrough in Storybook
- [x] 6.5 Update FEC-1346: corrections to items 3 and 6, Enter instead of
      "Enter and Space", the `row.isDisabled` finding, the measured target size

## 7. Nested rows and keyboard focus (found in 6.4)

- [x] 7.1 Story `CollapsedRowsDoNotTrapArrowKeys`: no hidden nested rows;
      ArrowDown / ArrowUp move row by row; an expanded row's content is
      reachable
- [x] 7.2 `row.tsx`: render the nested row only while expanded; delete the
      `display: none` rule in `data-table.recipe.ts`
- [x] 7.3 Story `CloseReturnsFocusToOpener`: `close` from inside returns focus to
      the expand button, or to the row without an expand column
- [x] 7.4 `NestedContentPanel` in the nested cell: `close` sets React Aria's
      focused key to the opener before collapsing

