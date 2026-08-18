# Tasks: Specify Splitter's before-paint layout timing

## 1. Spec

- [x] 1.1 Add the "Layout is applied before paint" requirement to the
      `nimbus-splitter` delta, with scenarios for the uncontrolled, controlled
      and collapsed-on-mount seeds plus the same-commit controlled reconcile.

## 2. Confirm the implementation already satisfies it

- [x] 2.1 `use-splitter-state.ts` seeds `size` via `useState(initialDisplay)`,
      derived synchronously from `size` / `defaultSize` / `collapsedSize` during
      render rather than in a mount effect.
- [x] 2.2 The controlled-size reconcile runs in a `useLayoutEffect`, so a
      controlled change lands in the same commit.
- [x] 2.3 `splitter.reconcile-timing.spec.tsx` guards the behavior: it asserts
      `30%` immediately after mount, then that a `flushSync` change to `60%` is
      already applied before passive effects flush.

## 3. Validation

- [x] 3.1 `pnpm openspec validate document-splitter-first-paint-timing --type change --strict`
      passes.
- [x] 3.2 `pnpm openspec validate --all --strict` passes.
- [x] 3.3 No code changed, so no changeset is required.
