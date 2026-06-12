## 1. Scaffold

- [x] 1.1 Create `packages/nimbus/src/components/tree/` directory with files:
      `tree.tsx`, `tree.types.ts`, `tree.recipe.ts`, `tree.slots.tsx`,
      `tree.stories.tsx`, `tree.dev.mdx`, `tree.docs.spec.tsx`, `index.ts`,
      `components/index.ts`, `components/tree.root.tsx`,
      `components/tree.item.tsx`, `components/tree.item-content.tsx`,
      `components/tree.indicator.tsx`
- [x] 1.2 Register `treeSlotRecipe` in `src/theme/slot-recipes/index.ts` as
      `nimbusTree`
- [x] 1.3 Export `Tree` and its prop types from
      `src/components/tree/index.ts`
- [x] 1.4 Add `export * from "./tree"` to `src/components/index.ts`

## 2. Failing Tests (TDD)

- [x] 2.1 Write Storybook stories with play functions covering: static tree,
      dynamic tree (items + recursive render), expand/collapse via chevron and
      keyboard, arrow-key navigation + Home/End, type-ahead, single selection,
      multiple selection (checkboxes), disabled items, ARIA roles
      (`treegrid`/`row`/`gridcell`), level-based indentation, and drag-and-drop
      reorder
- [x] 2.2 Verify tests fail initially (component not yet implemented)

## 3. Implementation

- [x] 3.1 Implement types in `tree.types.ts` (`TreeRecipeProps`, slot props for
      all four slots, `TreeRootProps`, `TreeItemProps`, `TreeItemContentProps`,
      `TreeIndicatorProps`)
- [x] 3.2 Implement slot recipe in `tree.recipe.ts` (slots: root, item,
      itemContent, indicator; `size` variant sm/md; level indentation via
      `--tree-item-level`; chevron rotation on `[data-expanded]`; selected /
      focus-visible / disabled / drop-target states using design tokens)
- [x] 3.3 Implement slot components in `tree.slots.tsx`
      (`createSlotRecipeContext` key `"nimbusTree"`, `withProvider` for Root,
      `withContext` for item / itemContent / indicator)
- [x] 3.4 Implement `components/tree.root.tsx` (split variants, extract style
      props, forward `dragAndDropHooks` + RA props to `Tree`)
- [x] 3.5 Implement `components/tree.item.tsx` (wraps `TreeItem`, derives
      `textValue`)
- [x] 3.6 Implement `components/tree.item-content.tsx` (wraps
      `TreeItemContent`; render-prop renders selection checkbox when
      `selectionBehavior === "toggle"` and `selectionMode === "multiple"`)
- [x] 3.7 Implement `components/tree.indicator.tsx` (wraps
      `<Button slot="chevron">` with default `ChevronRight` icon, override-able)
- [x] 3.8 Implement `tree.tsx` namespace object (`Root` first, then `Item`,
      `ItemContent`, `Indicator`; JSDoc per part; underscore exports)

## 4. Documentation

- [x] 4.1 Create developer documentation (`tree.dev.mdx`) including the DnD
      integration pattern with a worked example
- [x] 4.2 Create consumer implementation tests (`tree.docs.spec.tsx`)

## 5. Validation

- [x] 5.1 TypeScript compiles without errors
      (`pnpm --filter @commercetools/nimbus typecheck`)
- [x] 5.2 Lint passes (`pnpm lint`)
- [x] 5.3 Storybook story tests pass against source
      (`pnpm test:storybook:dev packages/nimbus/src/components/tree/tree.stories.tsx`)
- [x] 5.4 Build succeeds (`pnpm --filter @commercetools/nimbus build`)
- [x] 5.5 Add a changeset (`feat(tree)`)

## 6. Post-development (follow-up, out of scope for this PR)

- [ ] 6.1 Design review (no Figma specs exist yet)
- [ ] 6.2 Use Figma MCP to generate Figma assets
- [ ] 6.3 Create `.figma.tsx` Code Connect file

## 7. Nimbus-owned dynamic composition + drag-and-drop

- [x] 7.1 Add `Tree.SubTree` part wrapping React Aria's `Collection`
      (`components/tree.sub-tree.tsx`, `TreeSubTreeProps`, namespace +
      underscore export)
- [x] 7.2 Add `useTree` hook composing `useTreeData` + React Aria
      `useDragAndDrop` (reorder + re-parent), returning a `Tree.Root`-spreadable
      result plus the imperative controller (`tree/hooks/use-tree.ts`)
- [x] 7.3 Re-export `Key` / `Selection` types from the tree barrel so consumers
      never import from `react-aria-components`
- [x] 7.4 Migrate stories to `Tree.SubTree` + `useTree` (drop direct
      `Collection` / `useTreeData` / `useDragAndDrop` imports)
- [x] 7.5 Rewrite the `tree.dev.mdx` drag-and-drop example to be Nimbus-only;
      verify zero `react-aria-components` / `react-stately` imports in any
      consumer-facing doc
- [x] 7.6 Lift `tree.mdx` `lifecycleState` from Experimental to Beta

## 8. Validation (follow-up changes)

- [ ] 8.1 TypeScript compiles, lint passes, Storybook tests pass against source
- [ ] 8.2 Build succeeds (`Tree.SubTree` / `useTree` exported with types)
- [ ] 8.3 Update the changeset to mention `Tree.SubTree` + `useTree`
