## Context

Nimbus has no generic collection of rich items in a list or grid. Neighbours
and what they do not cover:

- `ListBox` picks options. Single axis, text options, `leading` / `trailing`
  props (`list-box/components/list-box.item.tsx`).
- `Tree` shows a hierarchy.
- `Table` / `DataTable` show columns.
- `DraggableList` wraps React Aria `GridList` but is purpose-built: it owns the
  list state (`useListData`, `items` / `onUpdateItems`) and its item always
  renders a drag handle, a checkbox and a remove button
  (`draggable-list/components/draggable-list.item.tsx`). It is not the model for
  this component.
- `SimpleGrid` is a uniform responsive grid (Chakra `SimpleGrid`, re-exported;
  `SimpleGrid.Item` wraps Chakra `GridItem`).

React Aria `GridList` facts used here (https://react-aria.adobe.com/GridList,
https://react-aria.adobe.com/Virtualizer):

- `layout` and `orientation` "affect keyboard navigation and drag and drop
  behavior". React Aria sets no column CSS; the visible columns come from CSS.
- React Aria does not render the drag handle or the selection checkbox. The
  consumer renders `<Button slot="drag">` and `<Checkbox slot="selection">`.
- `GridList`, `GridListItem` and `GridListSection` have a `render` prop:
  "Overrides the default DOM element with a custom render function."
- `keyboardNavigationBehavior="tab"` is for rows with text fields.
- Inside `Virtualizer`, "CSS layout properties such as flexbox and grid do not
  apply"; `GridLayout` sets the columns and `GridList` needs `layout="grid"`.

The shared hook `@/hooks/use-drag-and-drop` already returns `dragAndDropHooks`
for any React Aria collection; `ListBox` and `Tree` use it.

## Goals / Non-Goals

**Goals:**

- A generic, accessible, keyboard-navigable collection of free-content items
  in a list or a uniform responsive grid.
- Single and multiple selection; drag-and-drop reordering through
  `dragAndDropHooks`.
- Opt-in built-in selection checkbox and drag handle, consistent and accessible,
  with a clear Root / Item override rule.
- Responsive `columns`, `minChildWidth` and `gap` that work like `SimpleGrid`.

**Non-Goals:**

- Spanning items (column or row spans). Keyboard behavior for non-uniform cells
  is not verified. `GridItem` span props are not exposed.
- Built-in list state or an `onReorder` helper. The consumer owns state.
- A Virtualizer wrapper or prop.
- Sections, headers and load-more parts.
- A `variant` or a default item container (border / background) at rest.
- A `controlsPlacement` prop. For other positions, consumers leave the
  `show…` props off and render the slot elements themselves.
- Deprecating `DraggableList` (FEC-1146, Phase 2).

## Decisions

### D1. Thin pass-through Root, consumer owns state

`GridList.Root<T>` takes `RaGridListProps<T>` plus Nimbus props, splits recipe
props and style props, and forwards the rest, as `ListBox.Root` does.
Drag-and-drop is `dragAndDropHooks` from `useDragAndDrop`.

- Alternative: own `useListData` and `items` / `onUpdateItems` like
  `DraggableList`. Rejected: it duplicates `DraggableList`, adds state-sync code
  and limits selection and data flexibility.

### D2. Layout through SimpleGrid with the React Aria `render` prop

`GridList.Root` renders its DOM through `SimpleGrid` with `render`, so Chakra's
responsive object handling (`{ base: 1, md: 3 }`) is reused. `layout="stack"`
resolves to one column. Only Root uses it; items stay plain React Aria items
(they are already the direct children of the grid).

- Alternative: a `columns` prop that sets a CSS variable used by the slot
  recipe. Rejected: a second responsive implementation to write and test.
- Alternative: no layout props. Rejected: every consumer repeats responsive
  column work.

### D3. Uniform cells only (aligned with SimpleGrid, not Grid)

The skeptic review found that the React Aria docs describe `GridLayout` as
"an equal size grid" and say nothing about arrow keys with spanning items. Uniform
cells keep arrow-key movement predictable. Span props are not exposed and the
docs say spans are unsupported.

### D4. Opt-in built-ins with Root default and Item override

`showSelectionCheckbox` and `showDragHandle` are optional on both Root and
Item. Item value wins when set; `undefined` inherits from Root through context.
Both default to off. Rendering depends on real state:

- checkbox only when `selectionMode="multiple"`, as `Tree` does
  (`tree/components/tree.item-content.tsx`);
- handle only when React Aria reports dragging is allowed for the item.

Position is fixed and leading: handle, then checkbox, then children.

- Alternative: children only, consumers render slots. Rejected by the product
  owner: inconsistent handle and checkbox markup across teams.
- Alternative: always-on built-ins and a `variant` like `ListBox.Item`. Rejected:
  conflicts with the generic goal (image tiles, overlay checkbox, inline
  inputs).

### D5. `size` controls spacing and the drag handle; `gap` overrides the gap

`size` (`sm` | `md` | `lg`, default `md`) sets item padding, the default gap and
the size of the built-in drag handle (`IconButton` has several sizes). An
explicit `gap` prop wins over the size default. Consumer content keeps its own
size and typography. The built-in checkbox stays at the `Checkbox` recipe's only
size, `md` (`checkbox.recipe.ts:100-123`), at every GridList size, as `ListBox`
does (`list-box.recipe.ts:156-161`). The alternatives (override the indicator
box per size, or add sizes to `Checkbox`) copy Checkbox internals or change a
shared component. This is an extra axis, so Chromatic cost grows by three
sizes.

### D6. States only, no container

No border or background at rest. The recipe adds a corner radius so the focus
ring and the selected tint have a shape. The selected state must be visible
without a container and meet WCAG 2.1 AA contrast; stories check it.

### D7. Accessibility defaults

- The drag handle's accessible name is the localized default from React Aria
  (for example "Drag 1", "1 ziehen"; spike 1.4). Nimbus adds no label of its own.
  `DraggableList` also sets no label on its handle and relies on the same
  default (`draggable-list.item.tsx:44-54`).
- `textValue` is required in the docs when children are not plain text.
- The docs and stories state: with `selectionMode` set, a press may select
  and not call `onAction`; rows with inputs need
  `keyboardNavigationBehavior="tab"`; items cannot be `<a>` elements.

### D8. Virtualizer: compatible, documented, no wrapper

The recipe's grid rules must not block a consumer-supplied `Virtualizer`.
One docs example and one story show it, with `display: block` on Root, and note
that `columns`, `minChildWidth` and `gap` do not apply there.

**Verified (story `Virtualized`, Chromium):** `GridList.Root` inside
`Virtualizer` with `ListLayout` renders its items.

**Not verified:** `GridLayout`. In the test setup a plain React Aria `GridList`
(no Nimbus code) inside `Virtualizer` with `GridLayout` rendered no items, with
the default options and with explicit `minItemSize`, `maxItemSize` and
`minSpace`. `ListLayout` worked in the same setup. The cause is unknown (library
or test environment). The docs claim only what is verified. A virtualized grid
needs a follow-up investigation before it is documented.

Test setup note: React Aria's virtualizer reads `process.env.NODE_ENV`, which
this browser test runner does not define, so the story defines it.

## Risks / Trade-offs

- [`minChildWidth` makes the column count depend on container width] → Spike 1.3
  showed the arrow keys follow the rendered columns; tests still use fixed
  container widths so they stay deterministic.
- [Item and Root `show…` props add a matrix of states to test and document] →
  One table-driven story and a docs table.
- [`size` adds three times the Chromatic snapshots] → Fold interacting states
  into one `SmokeTest` per size; see the VRT task.
- [Consumer content may break accessibility (missing `textValue`, unnamed
  icon buttons, nested interactive elements)] → Cannot be enforced; covered in
  the a11y docs.
- [Name overlap with `DraggableList`] → The docs state the decision line:
  `ListBox` to pick options, `DraggableList` for a ready-made reorder list,
  `GridList` for rich or 2D items.

## Migration Plan

New component, no migration. `DraggableList` is unchanged. A consumer
migration path from `DraggableList` belongs to FEC-1146.

## Spike results (tasks 1.1-1.4)

Observed in Chromium with Storybook (dev mode, React Aria Components 1.22.1).

- **1.1 `render` pass-through: works.** `GridList` rendered through Nimbus
  `SimpleGrid` via `render` kept `role="grid"`, `data-layout`, the ref (it points
  to the grid element), keyboard focus (ArrowRight moves focus) and selection
  (Space sets `aria-selected`). The computed style is `display: grid` with 3
  columns for `columns={3}`. D2 stands; no fallback needed.
- **1.2 Precedence: `minChildWidth` wins.** At 600 px, `columns={2}` gives 2
  columns, `minChildWidth="150px"` gives 4 columns, and both together give the
  same 4 columns (`columns` is ignored). Decision D9 follows.
- **1.3 2D arrow keys: follow the rendered grid.** 7 items. With 3 columns:
  1 → Right → 2; 1 → Down → 4; 2 → Down → 5; 7 → Up → 4. With `minChildWidth`
  the column count changes with the container width (4 columns at 620 px, 2 at
  320 px) and the keys followed it (at 320 px: 1 → Down → 3; 5 → Down → 7).
  `columns={1}` behaves like a list. Edge cases to document:
  - ArrowDown on an item with no cell below it does nothing (3 columns:
    5 → Down stays on 5; it does not jump to 7).
  - ArrowRight at the end of a row moves to the first item of the next row
    (3 → Right → 4) and ArrowLeft at the start of a row moves back (4 → Left →
    3).
  - ArrowUp on the first row stays on the item.
- **1.4 Drag handle label: React Aria provides one.** `<Button slot="drag">`
  gets `aria-label="Drag 1"` (en-US), `"1 ziehen"` (de-DE) and
  `"Déplacer 1"` (fr-FR). The label includes the item `textValue`. D7 is updated:
  Nimbus adds no drag handle label of its own.

### D9. `columns` and `minChildWidth` are mutually exclusive in the types

Because `minChildWidth` silently overrides `columns` (spike 1.2), the props are
typed as a union: set `columns` or `minChildWidth`, not both. Both accept plain
values or responsive objects. `layout="stack"` ignores both and uses one column.
