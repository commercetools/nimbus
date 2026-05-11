# Tasks: Add Splitter component

## 1. Rename and restructure

- [ ] 1.1 Rename directory `packages/nimbus/src/components/window-splitter/` →
      `packages/nimbus/src/components/splitter/`
- [ ] 1.2 Rename all files: `window-splitter.*` → `splitter.*`, including
      nested `components/window-splitter.*.tsx`
- [ ] 1.3 Rename identifiers throughout: `WindowSplitter` → `Splitter`,
      `WindowSplitterRoot` → `SplitterRoot`, etc.
- [ ] 1.4 Rename `Separator` part to `Handle`: file `splitter.separator.tsx`
      → `splitter.handle.tsx`, `SplitterSeparator` → `SplitterHandle`,
      `WindowSplitterSeparatorSlot` → `SplitterHandleSlot`. Leave the
      underlying ARIA role as `separator` per W3C spec.
- [ ] 1.5 Update barrel: replace `export * from "./window-splitter"` with
      `export * from "./splitter"` in
      `packages/nimbus/src/components/index.ts`
- [ ] 1.6 Update recipe registration: rename `windowSplitterSlotRecipe` →
      `splitterSlotRecipe` and register as `splitter` in
      `packages/nimbus/src/theme/slot-recipes/index.ts`

## 2. State model refactor (single value → sizes array)

- [ ] 2.1 In `splitter.types.ts`, replace `value` / `defaultValue` /
      `onValueChange` on `SplitterRootProps` with `defaultSizes: number[]`
      and `onSizesChange: (sizes: number[]) => void`. Remove `minValue`,
      `maxValue`, `isDisabled`, `step` from `SplitterRootProps`.
- [ ] 2.2 Add per-pane props to `SplitterPaneProps`: `defaultSize?: number`,
      `minSize?: number` (default 0), `maxSize?: number` (default 100),
      `disabled?: boolean`, `collapsible?: boolean`, `collapsedSize?: number`
      (default 0), `onCollapse?: () => void`, `onExpand?: () => void`.
      Remove `isPrimary`.
- [ ] 2.3 Add `keyboardStep?: number` (default 5) to `SplitterHandleProps`.
- [ ] 2.4 Refactor `SplitterContext`: replace `value` / `setValue` /
      `minValue` / `maxValue` / `step` / `primaryPaneId` with
      `sizes: number[]`, `setSizes(sizes: number[]): void`, pane registration
      (`registerPane(index, config): void`, `unregisterPane(index): void`),
      handle registration (`registerHandle(index): void`), and command
      methods `collapsePane(index)`, `expandPane(index)`, `isCollapsed(index)`.
- [ ] 2.5 In `SplitterRoot`, derive initial `sizes` from `defaultSizes` (if
      provided), otherwise from per-pane `defaultSize` props (with
      equal-distribution fallback for panes without a `defaultSize`).
      Normalize so sum equals 100 within floating-point tolerance.

## 3. Cascading resize algorithm

- [ ] 3.1 Implement `cascadeResize(sizes, handleIndex, delta, paneConfigs)`
      utility in `splitter/utils/cascade-resize.ts`:
      - Attempts to apply Δ to `sizes[handleIndex]` (grow) and
        `sizes[handleIndex + 1]` (shrink), respecting per-pane min/max.
      - When a neighbour hits its limit, cascade remainder to the next pane
        in the same direction.
      - Mirror behaviour for negative Δ.
      - Returns the new `sizes` array (summing to 100) or the input if no
        movement is possible.
- [ ] 3.2 Update `SplitterHandle` to read its index from context (auto-indexed
      by child order in Root), call `cascadeResize` on `useMove` callbacks
      and keyboard handlers, and write the result via `setSizes`.
- [ ] 3.3 Remove `SplitterHandle`'s current Enter handler (hardcoded to
      `setValue(minValue)` / `setValue(50)`). Replace with collapse-toggle of
      the adjacent collapsible pane (Section 5).
- [ ] 3.4 Update keyboard arrow handlers to pass Δ through `cascadeResize`
      (preserving existing orientation-aware behaviour; Home/End now move
      the boundary to its adjacent panes' min/max bounds).

## 4. Multiple Handle support

- [ ] 4.1 In `SplitterRoot`, register handles in child order via context;
      each `SplitterHandle` reads its index from the order it registers.
- [ ] 4.2 Update `splitter.recipe.ts`: handle positioning changes from
      `left: ${value}%` to be index-aware (compute position from `sum(sizes
      [0..i+1])`). Apply via inline style on each handle, since CSS doesn't
      see the array.
- [ ] 4.3 Verify the visual position of each handle matches the boundary
      between its two panes after resize.

## 5. Collapsible feature

- [ ] 5.1 In `cascadeResize`, support a `commitCollapse: boolean` flag — when
      true and Δ pushes a `collapsible` pane below its `minSize`, set its
      size to `collapsedSize` (default 0) and fire `onCollapse`.
- [ ] 5.2 Implement `isCollapsed(paneIndex): boolean` in the context (returns
      `sizes[paneIndex] <= collapsedSize` for collapsible panes).
- [ ] 5.3 Add double-click handler on `SplitterHandle`: toggles collapse of
      the closest collapsible neighbour (prefer the smaller side when both
      are collapsible). Gated by `disableDoubleClick?: boolean` prop on
      `SplitterHandle`.
- [ ] 5.4 Add Enter key handler on `SplitterHandle`: same behaviour as
      double-click.
- [ ] 5.5 Fire `onExpand` when a collapsed pane returns to a size strictly
      greater than `collapsedSize`.

## 6. `useSplitterLayout` hook

- [ ] 6.1 Create `packages/nimbus/src/components/splitter/hooks/use-splitter-layout.ts`
      with the signature:
      ```ts
      function useSplitterLayout(options: {
        initialSizes: number[];
        id?: string;
        storage?: { load(): number[] | undefined; save(sizes: number[]): void };
        debounceMs?: number;
      }): {
        defaultSizes: number[];
        onSizesChange: (sizes: number[]) => void;
        collapse: (paneIndex: number) => void;
        expand: (paneIndex: number) => void;
        setSizes: (sizes: number[]) => void;
        getSizes: () => number[];
        isCollapsed: (paneIndex: number) => boolean;
      };
      ```
- [ ] 6.2 Implement synchronous initial read: if `storage` is provided, call
      `storage.load()`; else if `id` is provided and `typeof window !==
      "undefined"`, read from `localStorage.getItem(id)` and `JSON.parse`.
      Fall back to `initialSizes` on any error or invalid value.
- [ ] 6.3 Validate stored value: length must match `initialSizes.length`,
      every entry must be a number, sum must be ≈ 100 (allow normalization
      within ±1%). Fail open to `initialSizes` on any mismatch.
- [ ] 6.4 Implement debounced save (default 200ms) via `setTimeout`; cancel
      pending save on unmount.
- [ ] 6.5 Implement the imperative commands via an internal ref that the
      `Splitter.Root` populates on mount (`useImperativeHandle` exposing
      `setSizes` / `getSizes` / `collapse` / `expand` / `isCollapsed`).
- [ ] 6.6 Export `useSplitterLayout` from `splitter/index.ts`.

## 7. Hook ↔ Root wiring

- [ ] 7.1 Add a `__layoutRef?: React.RefObject<SplitterImperativeHandle>`
      prop to `SplitterRoot` (internal, prefixed; not part of the public
      JSDoc'd surface) so `useSplitterLayout` can attach its ref.
- [ ] 7.2 In `SplitterRoot`, call `useImperativeHandle(__layoutRef, …)` to
      expose the command methods.
- [ ] 7.3 Have `useSplitterLayout` spread the ref alongside `defaultSizes`
      and `onSizesChange` when consumers pass `layout` as `{...layout}`.
      Actually, since `__layoutRef` is internal, the hook returns
      `{ defaultSizes, onSizesChange, _layoutRef }` plus the commands, and
      consumers spread the first three on `Root` (the ref is forwarded
      automatically when spreading).

## 8. Stories

- [ ] 8.1 Update existing stories to the new API (`defaultSizes` array,
      Handle instead of Separator). Keep coverage of: Default, Vertical,
      Disabled, Keyboard interaction (horizontal and vertical), Constraints,
      ARIA semantics.
- [ ] 8.2 Add new stories with play functions:
      - **ThreePanes**: three panes, two handles, drag middle handle to
        verify it moves only the adjacent pair.
      - **CascadingResize**: drag a handle past a neighbour's `minSize` to
        verify cascade to the next pane.
      - **PerPaneConstraints**: per-pane `minSize` / `maxSize` enforce the
        right boundaries.
      - **CollapsibleByDoubleClick**: double-click handle toggles collapse.
      - **CollapsibleByKeyboard**: Enter on focused handle toggles collapse.
      - **CollapseExpandCallbacks**: `onCollapse` / `onExpand` fire at the
        right boundaries.
      - **WithPersistenceHook**: `useSplitterLayout({ id })` persists sizes
        to localStorage and rehydrates on remount (use a custom `storage`
        adapter in the test to avoid touching real localStorage).
      - **CrossAppCommands**: a button outside the splitter calls
        `layout.collapse(0)` and the pane collapses.
      - **NestedSplitters**: a `Splitter` inside a `Pane` (verifies that
        nesting still works for hierarchical cases).

## 9. Documentation

- [ ] 9.1 Update `splitter.mdx` (overview) for the new component shape and
      remove WindowSplitter framing.
- [ ] 9.2 Create `splitter.dev.mdx` (engineering guide): covers the
      uncontrolled-only design, the persistence hook, cross-app commands,
      cascading resize semantics, and the nested-vs-flat decision.
- [ ] 9.3 Create `splitter.a11y.mdx`: ARIA model for multi-handle splitters,
      keyboard reference, focus order through panes + handles.
- [ ] 9.4 Create `splitter.docs.spec.tsx`: consumer-facing examples that
      compile and run (basic 2-pane, 3-pane, collapsible, persistence hook
      usage).

## 10. i18n

- [ ] 10.1 Create `splitter.i18n.ts` with messages for the default handle
      aria-label (`"Resize panes"`) and the collapse / expand announcements
      that fire on collapse/expand state changes (live region or
      `aria-label` updates — decide during implementation).
- [ ] 10.2 Run `pnpm extract-intl` and verify the new keys land in
      `packages/i18n/src/Nimbus.json`.

## 11. Tests for utilities

- [ ] 11.1 `splitter/utils/cascade-resize.spec.ts` (JSDOM unit tests):
      cascading through 3-pane and 5-pane configurations, hitting
      `minSize` / `maxSize`, negative Δ, commit-collapse path, normalization
      of result to sum 100.
- [ ] 11.2 `splitter/hooks/use-splitter-layout.spec.ts` (JSDOM unit tests):
      synchronous initial read from custom storage, fallback on length
      mismatch, fallback on invalid sum, debounced save, command methods
      proxy through the ref.

## 12. Validation

- [ ] 12.1 TypeScript compiles cleanly
      (`pnpm --filter @commercetools/nimbus typecheck`).
- [ ] 12.2 Build succeeds
      (`pnpm --filter @commercetools/nimbus build`).
- [ ] 12.3 Storybook tests pass
      (`pnpm test:storybook:dev packages/nimbus/src/components/splitter/splitter.stories.tsx`).
- [ ] 12.4 Unit tests pass
      (`pnpm test:unit packages/nimbus/src/components/splitter/`).
- [ ] 12.5 Lint passes
      (`pnpm lint -- packages/nimbus/src/components/splitter/`).
- [ ] 12.6 Add a changeset
      (`pnpm changeset` — minor bump on `@commercetools/nimbus`, new
      component description).

## 13. Cleanup

- [ ] 13.1 Delete any remaining `window-splitter` references in the codebase
      (search across stories, docs, theme registration).
- [ ] 13.2 Confirm `git grep -i WindowSplitter` returns nothing.
