## Why

Nimbus has no generic component for a navigable collection of rich items
arranged in a list or a 2D grid (cards, thumbnails, rows with controls) with
selection and drag-and-drop. `ListBox` is for picking options, `Tree` is for
hierarchies, `Table` is for columns, and `DraggableList` is a pre-styled reorder
list with a fixed anatomy (it always renders a handle, a checkbox and a remove
button). Teams that need a keyboard-navigable grid of their own content must
build it on React Aria directly, and each team repeats the same selection
checkbox, drag handle and focus styling. This is FEC-1140 (Phase 1 of the MC
Usability: Nimbus Updates epic, FEC-1134).

## What Changes

- Add a new compound `GridList` component, built on React Aria Components
  `GridList`: `GridList.Root` and `GridList.Item`. Consumers fill each item with
  their own content.
- `GridList.Root` accepts the React Aria `GridList` props (`layout`,
  `orientation`, `selectionMode`, `selectedKeys`, `onSelectionChange`,
  `onAction`, `keyboardNavigationBehavior`, `dragAndDropHooks`,
  `renderEmptyState`, `aria-label`) and adds:
  - `size` (`sm` | `md` | `lg`): item padding, default gap and the size of the
    built-in drag handle. The built-in checkbox keeps its one size (`md`), as in
    `ListBox`.
  - `columns`, `minChildWidth` and `gap`: responsive objects (for example
    `{ base: 1, md: 3 }`), like `SimpleGrid`. `GridList.Root` renders its DOM
    through `SimpleGrid` using the React Aria `render` prop. Set `columns` or
    `minChildWidth`, not both (the types forbid it, because `minChildWidth`
    overrides `columns`). `layout="stack"` uses one column. Items have uniform
    cells; spanning items are not supported.
  - `showSelectionCheckbox` and `showDragHandle`: defaults for all items.
- `GridList.Item` renders free content. It has the same two props and they
  override the Root setting. The built-in controls appear in a fixed leading
  position (handle, then checkbox). The checkbox shows only when
  `selectionMode="multiple"`; the handle shows only when dragging is enabled and
  uses React Aria's localized default label. Both default to off.
- Drag-and-drop uses the existing `useDragAndDrop` hook through
  `dragAndDropHooks`. The component keeps no list state; the consumer owns the
  items and the selection.
- No container at rest. The recipe styles the states hover, focus-visible,
  pressed, selected, disabled, dragging and drop target.
- Works inside React Aria's `Virtualizer` with `ListLayout` (verified in a
  story). Nimbus adds no Virtualizer API; the docs and one story show it and note
  that `columns`, `minChildWidth` and `gap` do not apply there. `GridLayout` is
  not claimed: it rendered no items in the test setup (see `design.md`, D8).
- Register the `nimbusGridList` slot recipe and export `GridList` from
  `@commercetools/nimbus`.
- No breaking changes. `DraggableList` is not changed (its deprecation is
  FEC-1146, Phase 2).

## Capabilities

### New Capabilities

- `nimbus-grid-list`: Accessible, keyboard-navigable collection of free-content
  items in a list or responsive uniform grid, with single and multiple
  selection, optional built-in selection checkbox and drag handle, drag-and-drop
  through `dragAndDropHooks`, sizes and responsive columns.

### Modified Capabilities

(none)

## Impact

- New directory `packages/nimbus/src/components/grid-list/` (components, types,
  recipe, slots, i18n, stories, docs, docs spec).
- `packages/nimbus/src/theme/slot-recipes/index.ts` — new recipe registration;
  theme typings regenerated.
- `packages/nimbus/src/components/index.ts` — new export.
- New i18n message (`Nimbus.GridList.emptyMessage`): the default empty state.
  The drag handle label comes from React Aria.
- Depends on existing `SimpleGrid`, `Checkbox` and `useDragAndDrop`. No new
  packages.
- Changeset for `@commercetools/nimbus` (minor).
- The four open facts were verified in spikes (results in `design.md`):
  `render` pass-through works, `minChildWidth` overrides `columns`, arrow keys
  follow the rendered grid, and React Aria provides a localized drag handle
  label.
