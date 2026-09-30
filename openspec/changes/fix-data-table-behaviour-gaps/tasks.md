Each story task follows red/green: write the story with its play function, run
it once and see it fail, then fix. Paths are relative to
`packages/nimbus/src/components/data-table/`.

## 1. Dead props and disabled rows

- [x] 1.1 Stories: `renderEmptyState` renders custom content (not "No Data") and
      is not an attribute on the root element
- [x] 1.2 Story: nested row `colSpan` equals the rendered cell count, including
      the checkbox column (`NestedRowSpansSelectionColumn`)
- [x] 1.3 Stories: `disabledKeys="all"` — no row selectable by click, checkbox,
      Space or header checkbox; a row with `isDisabled: true` and no
      `disabledKeys` is disabled
- [x] 1.4 `root.tsx`: destructure `renderEmptyState`, compute
      `showSelectionColumn` (`selectionMode !== "none"`), add both to
      `contextValue` and its deps
- [x] 1.5 `table.tsx`: pass `new Set(rows.map(getRowKey))` when
      `disabledKeys === "all"`
- [x] 1.6 `header.tsx` and `row.tsx`: use `showSelectionColumn` for the selection
      column, the selection cell and the expand column width
- [x] 1.7 `row.tsx` `getIsDisabled`: check `row.isDisabled` before `disabledKeys`
- [x] 1.8 `data-table.types.ts`: remove `onVisibilityChange`; add
      `showSelectionColumn` to the context type; JSDoc on `renderEmptyState` and
      `disabledKeys`

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
      removed `selectionBehavior`, working `renderEmptyState` /
      `disabledKeys="all"`,
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

## 8. Disabled row style

- [x] 8.1 Story `DisabledRowStyle`: opacity 0.5 and `not-allowed`; real-pointer
      hover leaves a disabled row's background unchanged and still highlights
      an enabled row
- [x] 8.2 `data-table.recipe.ts`: row slot uses `layerStyle: "disabled"`;
      delete the duplicate root rule; no hover highlight on disabled rows

## 9. Remove selectionBehavior (design.md, D5)

- [x] 9.1 Check whether replace mode is needed: history (#279), specs, UI Kit,
      consumer usage, conflict with row activation
- [x] 9.2 Remove `selectionBehavior` from `DataTableProps`, the context,
      `root.tsx` and `table.tsx`; `showSelectionColumn` becomes
      `selectionMode !== "none"`
- [x] 9.3 Stories: delete `ReplaceSelectionBehavior`; drop
      `selectionBehavior="toggle"` from two stories
- [x] 9.4 Changeset, spec delta and PR description say the prop is removed and
      why

## 10. Focus ring hidden by neighbouring cells

- [x] 10.1 Stories `RowFocusRingAboveFrozenCells`,
      `CellFocusRingAboveFrozenCells` and `HeaderFocusRingAndStickyHeader`: the
      ring is drawn inside the element, above every frozen cell of its row, and
      a body ring stays below the sticky header
- [x] 10.2 `data-table.recipe.ts`: rows, cells and column headers draw the ring
      on a positioned `::after` (z-index 13 in the body, 14 in the header)
      instead of an outline on the element; the sticky header moves from
      z-index 10 to 14, above the frozen body cells

## 11. Pin column after resizing

- [x] 11.1 Story `PinColumnFillsSpaceAfterResize`: after the last data column
      is made narrower, the table still fills its container and the pin column
      is wider than 72px; after it is made wider, the pin column stays at 72px;
      the row pin button stays in line with the header icon
- [x] 11.2 `header.tsx`: the pin column gets `minWidth={72}` and a tiny
      `defaultWidth` (`0.001fr`) instead of a fixed 72px, so it takes free space
      only when no other column can
- [x] 11.3 `row.tsx`: center the pin button in its cell, like the header icon
- [x] 11.4 Story step: while the last data column is dragged wider, its right
      edge stays left of the pin column and the table scrolls
- [x] 11.5 `root.tsx`: a `ResizeObserver` on the table scrolls the container
      while a column is resizing, so the dragged edge never moves under the pin
      column or out of the visible area

## 12. Pinned row outline

- [x] 12.1 Story `PinnedRowOutlineAboveFrozenCells`: pinned rows line up with
      the header, and their outline is drawn above every frozen cell
- [x] 12.2 `data-table.recipe.ts`: the pinned outline moves from the row's
      `box-shadow` to the same `::after` layer as the focus ring (z-index 13);
      the `clip-path` workarounds on frozen cells in pinned rows are removed

## 13. Review follow-ups

- [x] 13.1 Story `RowActionLeavesEnterToCellContent`: Enter on a link in a cell
      opens the link, Enter in a text field adds a line break, and neither calls
      `onRowAction`; Enter on a focused cell still does
- [x] 13.2 `row.tsx`: the Enter handler acts only when the event target is the
      row or one of its cells (replaces the element list check in 2.4)
- [x] 13.3 Story `CloseReturnsFocusWithSharedRowIds`: two tables with the same
      row ids, the same row open in both; closing the second one returns focus
      to its own expand button
- [x] 13.4 `row.tsx`: `NestedContentPanel` gets its nested row from a ref, not
      from `document.getElementById`
- [x] 13.5 `tags: ["vrt"]` on `RowFocusRingAboveFrozenCells` and
      `CellFocusRingAboveFrozenCells`
- [x] 13.6 Story `EnterSelectsRowWithoutChildren`: with `nestedKey`,
      `allowsExpandColumn={false}`, selection and no `onRowAction`, Enter
      selects a row without children, still expands a row with children, and
      only the row with children has `data-clickable`
- [x] 13.7 `row.tsx`: `expandViaRowClick` is true only for a row with something
      to expand, so a row without children is not clickable
