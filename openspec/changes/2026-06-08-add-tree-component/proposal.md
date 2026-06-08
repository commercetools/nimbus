# Change: Add Tree component

## Why

Merchant Center surfaces increasingly need to present hierarchical data — file
trees, nested navigation structures, category hierarchies, and grouped settings.
Nimbus has no primitive for this today: consumers reach for nested `Accordion`s
or hand-rolled lists, neither of which provides tree semantics (`role="tree"`,
`role="treeitem"`, `aria-expanded`, `aria-level`), arrow-key navigation, or
type-ahead.

React Aria Components ships a fully accessible `Tree` that provides keyboard
navigation, expand/collapse, single/multiple selection, type-ahead, and
drag-and-drop. Wrapping it in a Nimbus compound component gives us a WCAG 2.1 AA
tree with token-based styling and the design system's
`withProvider`/`withContext` slot recipe pattern.

This implements [FEC-985](https://commercetools.atlassian.net/browse/FEC-985)
(epic FEC-979 — Nimbus Chat Components).

## What Changes

- **NEW** `Tree` compound component wrapping React Aria's `Tree` / `TreeItem` /
  `TreeItemContent`:
  - `Tree.Root` — wraps `Tree` (React Aria's accessible `treegrid` pattern),
    owns the slot recipe + variants, forwards `dragAndDropHooks` for opt-in
    drag-and-drop.
  - `Tree.Item` — wraps `TreeItem` (`role="row"` with `aria-level`), one node in
    the tree.
  - `Tree.ItemContent` — wraps `TreeItemContent`, the row's content container;
    applies level-based indentation and auto-renders a selection checkbox when
    `selectionMode="multiple"`.
  - `Tree.Indicator` — wraps `<Button slot="chevron">`, the expand/collapse
    chevron; only visible for items with children; rotates on expand.
- **NEW** `treeSlotRecipe` with slots `root`, `item`, `itemContent`, `indicator`
  and a `size` variant (`sm` | `md`, default `md`), registered as `nimbusTree`.
- Visual indentation via the `--tree-item-level` CSS custom property React Aria
  sets on each row (driven by the `level` of each item).
- Keyboard navigation (arrow keys, Home/End, type-ahead), expand/collapse,
  single and multiple selection — all provided by React Aria, styled by Nimbus.
- Opt-in drag-and-drop: `Tree.Root` accepts `dragAndDropHooks` from
  `useDragAndDrop`, supporting reorder within a tree, moving between parents,
  drop indicators (before / after / on a group), and keyboard DnD. Documented in
  `tree.dev.mdx`.

No existing component is duplicated: `Accordion` collapses sibling panels but
has no tree roles, nesting, navigation, selection, or DnD; `DraggableList` is a
flat single-level `GridList`.

## Impact

- Affected specs: `tree` (new capability)
- Affected code:
  - **NEW**: `packages/nimbus/src/components/tree/` (all files)
  - **MODIFIED**: `packages/nimbus/src/components/index.ts` (export added)
  - **MODIFIED**: `packages/nimbus/src/theme/slot-recipes/index.ts` (recipe
    registered as `nimbusTree`)
- Risk: low — additive only; no changes to existing component behavior.
- No Figma specs exist; styling is derived from existing Nimbus list/accordion
  patterns and requires design review before merge (per ticket).
