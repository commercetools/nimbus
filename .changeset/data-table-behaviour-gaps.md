---
"@commercetools/nimbus": minor
---

`DataTable` rows can now be activated with the keyboard, and several props that
were accepted but ignored now work.

### `DataTable`

- **New:** `onRowAction(row)` is called when a user clicks a row or presses
  <kbd>Enter</kbd> on it. <kbd>Space</kbd> still selects the row. Enter also
  expands the row when `allowsExpandColumn={false}`.
- **Deprecated:** `onRowClick`. Use `onRowAction` instead. `onRowClick` keeps
  working, now also on Enter, and is ignored when `onRowAction` is passed.
- **Changed:** in a table with selection and `onRowAction` or `onRowClick`,
  Enter now activates the row instead of selecting it. Space and the checkbox
  still select.
- **Changed:** `onRowAction` used to be called only for clicks on disabled rows,
  as `(row, "click")`. Disabled rows are now never activated, and the callback
  receives only the row.
- **Fixed:** `renderEmptyState` is shown when the table has no rows, instead of
  the built-in "No Data".
- **Fixed:** `selectionBehavior="replace"` works. It renders no checkbox column,
  and a click replaces the selection.
- **Fixed:** `disabledKeys="all"` disables every row, including the header
  checkbox.
- **Fixed:** a row with `isDisabled: true` is disabled without `disabledKeys`.
- **Changed:** disabled rows use the same disabled style as other Nimbus
  components, so they look lighter than before. They no longer highlight on
  hover.
- **Fixed:** the pin button, the empty state and the nested-items placeholder
  are translated. They show English in other languages until the translations
  arrive.
- **Fixed:** arrow keys move directly between rows. Before, each collapsed
  expandable row took one extra key press that seemed to do nothing.
- **Fixed:** when nested content is closed from inside, with the `close`
  callback of `renderNestedContent`, focus returns to the row's expand button,
  or to the row when there is no expand column.
- **Deprecated:** `nestedKey`. Use `renderNestedContent`, which receives the
  row: `renderNestedContent={(row) => row.children}`.

### `DraggableList`

- **New:** `DraggableList.Item` accepts `removeButtonLabel` to name the remove
  button, for example "Hide column". The default stays "remove item".
