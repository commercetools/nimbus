# Design: Tree component

## Context

React Aria Components (`react-aria-components@1.17`) provides `Tree`,
`TreeItem`, and `TreeItemContent`, plus `useDragAndDrop` and `useTreeData`
(`react-stately`) for drag-and-drop and hierarchical state. The DOM structure of
one item is:

```
<div role="row" class="react-aria-TreeItem">   ← TreeItem (the focusable row)
  <div role="gridcell">
    … content rendered by TreeItemContent …    ← chevron, checkbox, label
  </div>
  … nested TreeItems / <Collection> …
</div>
```

React Aria sets a `--tree-item-level` CSS custom property on each row reflecting
its 1-based depth, which is how indentation is achieved without manual level
math.

## Goals / Non-Goals

**Goals**

- Compound API exactly as the ticket specifies: `Tree.Root`, `Tree.Item`,
  `Tree.ItemContent`, `Tree.Indicator`.
- Slot recipe with slots `root`, `item`, `itemContent`, `indicator`.
- WCAG 2.1 AA tree semantics, keyboard nav, type-ahead, selection,
  expand/collapse — all delegated to React Aria.
- Opt-in drag-and-drop via `dragAndDropHooks`.

**Non-Goals**

- We do not re-implement collection/selection/DnD logic — React Aria owns it.
- `TreeSection` / `TreeHeader` (alpha) and `TreeLoadMoreItem` are out of scope
  for the first iteration; the four-part API covers the ticket's acceptance
  criteria. They can be added later without breaking the API.
- We do not manage tree data inside `Tree.Root`; DnD state (`useTreeData`) lives
  with the consumer, keeping `Root` flexible (static or dynamic collections).

## Decisions

### Decision: Map the 4 parts onto React Aria primitives

| Nimbus part        | React Aria        | Slot          | Element                  |
| ------------------ | ----------------- | ------------- | ------------------------ |
| `Tree.Root`        | `Tree`            | `root`        | `div[role=treegrid]`     |
| `Tree.Item`        | `TreeItem`        | `item`        | `div[role=row]`          |
| `Tree.ItemContent` | `TreeItemContent` | `itemContent` | `div` (flex content row) |
| `Tree.Indicator`   | `Button slot=…`   | `indicator`   | `button[slot=chevron]`   |

`Tree.Root` uses `withProvider` (owns the recipe context); the other three use
`withContext`. Each wraps its React Aria component with `asChild` so Chakra
styles the React Aria element directly — the established Nimbus pattern (see
`Accordion`).

### Decision: Indentation via `--tree-item-level`

The `itemContent` slot applies
`paddingInlineStart: calc((var(--tree-item-level) - 1) * <indent-step>)`. This
satisfies the ticket's "style indentation via CSS custom property based on
`level`" requirement and matches the React Aria reference implementation. The
indent step is a token-based value that scales with the `size` variant.

### Decision: `Tree.ItemContent` auto-renders the selection checkbox

`TreeItemContent` exposes render props (`selectionMode`, `selectionBehavior`,
`hasChildItems`, `isExpanded`, …). When `selectionBehavior === "toggle"` and
`selectionMode === "multiple"`, `Tree.ItemContent` renders a Nimbus `Checkbox`
with `slot="selection"`, which React Aria wires to the row's selection state.
Single selection is expressed through the row's `[data-selected]` styling (no
checkbox), matching React Aria's defaults. This keeps the public API at four
parts while giving correct selection UX for both modes.

### Decision: `Tree.Indicator` defaults to a chevron icon

`Tree.Indicator` renders `<Button slot="chevron">` containing a default
`ChevronRight` icon from `@commercetools/nimbus-icons`; consumers may pass
children to override. Visibility is controlled by the recipe — hidden unless the
row has child items (`&[data-has-child-items]`) — and the icon rotates 90° on
`&[data-expanded]`. React Aria provides the expand/collapse behavior and a
localized accessible name for the button, so no custom i18n is required.

### Decision: `Tree.ItemContent` auto-renders the drag handle

When drag-and-drop is enabled, the drag handle is part of the component, not the
consumer's render function. `TreeItemContent`'s render props expose
`allowsDragging` (from React Aria's `ItemRenderProps`), so `Tree.ItemContent`
renders a `<IconButton slot="drag">` with the `DragIndicator` icon whenever the
row allows dragging — the same render-prop mechanism it already uses for the
selection checkbox, and byte-for-byte the same handle markup as
`DraggableList.Item` (`ghost`/`2xs`/`neutral`). React Aria wires the
`slot="drag"` button and localizes its accessible name (`"Drag <item>"`), so no
new i18n message or per-item `aria-label` is needed. This guarantees every
draggable tree across every team gets an identical, accessible drag affordance
with zero consumer markup. No escape hatch is exposed in this iteration
(matching `DraggableList`); one can be added later without a breaking change.

### Decision: `Tree.SubTree` wraps `Collection`

Dynamic, nested children in React Aria require a `<Collection>` per level.
Rather than leak `react-aria-components` into consumer code, `Tree.SubTree`
wraps `Collection` internally — the same pattern as `ComboBox.Section`,
`Menu.Section`, and `Select.OptionGroup`. It takes `items` + a render function
(dynamic) or plain children (static), and renders nothing for empty/absent
`items` (no `children?.length` guard needed). A spike confirmed React Aria's
collection builder recognizes the wrapped `Collection`.

### Decision: `useTree` owns state + drag-and-drop, spreadable onto `Tree.Root`

`Tree.Root` still forwards `dragAndDropHooks` to React Aria's `Tree`, but
consumers never wire React Aria/React Stately themselves. The `useTree` hook
composes `useTreeData` (hierarchy state) and React Aria's `useDragAndDrop`
(internal — **not** the flat-list Nimbus `useDragAndDrop` wrapper, which can't
re-parent) with default reorder + re-parent handlers. Its return is spreadable
onto `Tree.Root` (`items`, `dragAndDropHooks`, forwarded selection/expansion
config) and also carries the imperative controller. This keeps the consumer
story to one hook + a spread; `react-aria-components`/`react-stately` stay
internal. `Key`/`Selection` types are re-exported for controlled state.

## Risks / Trade-offs

- **No Figma specs** → visual styling is derived from existing list/accordion
  tokens and must pass design review before merge. Mitigation: tokens-only
  styling, easy to retune in the recipe.
- **Checkbox `slot` forwarding** depends on Nimbus `Checkbox` passing `slot`
  through to React Aria. Verified: `Checkbox` spreads functional props onto the
  underlying React Aria `Checkbox`. Covered by a multiple-selection story.

## Migration

None — additive new component.
