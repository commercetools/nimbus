## 1. Failing repro

- [x] 1.1 Add cases to `use-tree.spec.tsx` for the three unguarded sibling
      moves: `moveBefore("project", ["documents"])`,
      `moveAfter("image-1", ["photos"])`,
      `moveBefore("report", ["documents"])`. Each returned without throwing and
      left 3–4 of the fixture's 7 nodes.
- [x] 1.2 Add a case pinning that the nested violation React Stately does catch
      is reported at the call site, not from a later render's reducer.
- [x] 1.3 Add a case pinning that legitimate sibling reorders and cross-parent
      moves keep working, so the guard cannot over-reach.

## 2. Implementation

- [x] 2.1 Extract the rejection message to a module constant so all three
      mutations report identically.
- [x] 2.2 Add a shared rejection helper taking the resolved destination parent
      (`null` = root, always valid) and the moved keys, reusing the existing
      subtree predicate.
- [x] 2.3 Route `move` through the helper.
- [x] 2.4 Wrap `moveBefore` / `moveAfter`, resolving the destination as the
      target's parent and materialising the `Iterable` of moved keys once.
- [x] 2.5 Return the wrapped mutations from `useTree` instead of the unwrapped
      ones; leave the drag-and-drop handler delegating to the unwrapped methods.

## 3. Documentation

- [x] 3.1 Rewrite the changeset — it claimed `moveBefore` / `moveAfter` already
      threw, which would have shipped to consumers in the changelog.
- [x] 3.2 Correct the same claim in the `use-tree.ts` comment and the
      `use-tree.spec.tsx` header.
- [x] 3.3 Correct the `acceptedDragTypes` JSDoc, which still described external
      drag types after the MDX docs were corrected away from that claim; the
      docs site generates its API table from this JSDoc.

## 4. Validation

- [x] 4.1 `pnpm vitest run --config vitest.config.mts packages/nimbus/src/components/tree/hooks/use-tree.spec.tsx`
      — 12 passed (red before task 2, green after).
- [x] 4.2 `pnpm test:storybook:dev packages/nimbus/src/components/tree/tree.stories.tsx`
      — 17 passed, including `DropTargetsExcludeDraggedSubtree`, which pins that
      the drag-and-drop path never offers a target inside the dragged subtree.
- [x] 4.3 `pnpm exec eslint packages/nimbus/src/components/tree` and
      `pnpm --filter @commercetools/nimbus typecheck:dev` — both clean.
- [x] 4.4 `pnpm exec openspec validate fix-tree-move-into-own-subtree --type change --strict`
      passes.
- [x] 4.5 Patch changeset present for `@commercetools/nimbus`.
