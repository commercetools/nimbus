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
| `Tree.Root`        | `Tree`            | `root`        | `div[role=tree]`         |
| `Tree.Item`        | `TreeItem`        | `item`        | `div[role=treeitem]`     |
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

### Decision: Drag-and-drop is opt-in and consumer-owned

`Tree.Root` forwards a `dragAndDropHooks` prop straight to React Aria's `Tree`.
Consumers create the hooks with `useDragAndDrop` and typically manage data with
`useTreeData`, using `onReorder` (between items) and `onMove` (between items and
onto groups, allowing re-parenting). The recipe styles `[data-drop-target]` and
the default `DropIndicator`. This mirrors `DraggableList` but stays unopinionated
about data ownership, which is necessary for arbitrary hierarchies. The pattern
is documented with a complete example in `tree.dev.mdx`.

## Risks / Trade-offs

- **No Figma specs** → visual styling is derived from existing list/accordion
  tokens and must pass design review before merge. Mitigation: tokens-only
  styling, easy to retune in the recipe.
- **Checkbox `slot` forwarding** depends on Nimbus `Checkbox` passing `slot`
  through to React Aria. Verified: `Checkbox` spreads functional props onto the
  underlying React Aria `Checkbox`. Covered by a multiple-selection story.

## Migration

None — additive new component.
