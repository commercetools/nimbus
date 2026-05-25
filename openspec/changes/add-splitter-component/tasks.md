# Tasks: Add Splitter component

## 1. Rename and restructure

- [x] 1.1 Rename directory `packages/nimbus/src/components/window-splitter/` →
      `packages/nimbus/src/components/splitter/`
- [x] 1.2 Rename all files: `window-splitter.*` → `splitter.*`, including
      nested `components/window-splitter.*.tsx`
- [x] 1.3 Rename identifiers throughout: `WindowSplitter` → `Splitter`,
      `WindowSplitterRoot` → `SplitterRoot`, etc.
- [x] 1.4 Rename `Separator` part to `Handle`: file `splitter.separator.tsx`
      → `splitter.handle.tsx`, `SplitterSeparator` → `SplitterHandle`,
      `WindowSplitterSeparatorSlot` → `SplitterHandleSlot`. Leave the
      underlying ARIA role as `separator` per W3C spec.
- [x] 1.5 Update barrel: replace `export * from "./window-splitter"` with
      `export * from "./splitter"` in
      `packages/nimbus/src/components/index.ts`
- [x] 1.6 Update recipe registration: rename `windowSplitterSlotRecipe` →
      `splitterSlotRecipe` and register as `nimbusSplitter` in
      `packages/nimbus/src/theme/slot-recipes/index.ts`

## 2. State model refactor (single value → id-keyed sizes record)

- [x] 2.1 In `splitter.types.ts`, replace `value` / `defaultValue` /
      `onValueChange` on `SplitterRootProps` with:
      - `defaultSizes?: Record<string, number>`
      - `onSizesChange?: (sizes: Record<string, number>) => void`
      - `panes: Record<string, PaneConfig>` where
        `PaneConfig = { defaultSize?: number; minSize?: number; maxSize?: number; disabled?: boolean; collapsible?: boolean; collapsedSize?: number; }`
      - `keyboardStep?: number` (default 5)
      - `disableDoubleClick?: boolean`
      - `onCollapse?: (paneId: string) => void`
      - `onExpand?: (paneId: string) => void`
      Remove `minValue`, `maxValue`, `isDisabled`, `step` from
      `SplitterRootProps`.
- [x] 2.2 In `SplitterPaneProps`, keep only `id: string` and standard
      HTML/style props. Remove `isPrimary` and any per-pane configuration
      props.
- [x] 2.3 In `SplitterHandleProps` (formerly `SplitterSeparatorProps`),
      keep only standard HTML/style props and `aria-label` overrides.
      No `id`, no per-handle config props.
- [x] 2.4 Refactor `SplitterContext`: replace `value` / `setValue` /
      `minValue` / `maxValue` / `step` / `primaryPaneId` with:
      - `sizes: Record<string, number>`
      - `setSizes(sizes): void`
      - Pane registration (`registerPane(id, domId): void`,
        `unregisterPane(id): void`) tracking the two ids in DOM order
      - Handle reads `prevPaneId` / `nextPaneId` from the registered pair
      - Command methods `collapsePane(paneId)`, `expandPane(paneId)`,
        `isCollapsed(paneId): boolean`
      - `paneConfig(id): PaneConfig`, `keyboardStep`, `disableDoubleClick`
- [x] 2.5 In `SplitterRoot`, derive initial `sizes` from `defaultSizes`
      (if provided), otherwise from `panes[id].defaultSize` (with 50/50
      fallback if neither pane has a `defaultSize`). Normalize so sum
      equals 100 within floating-point tolerance.
- [x] 2.6 Add dev-time warnings: missing `id` on a `Pane`, duplicate ids,
      Pane count ≠ 2, Handle count ≠ 1.

## 3. Drag and keyboard with clamping

- [x] 3.1 Implement `clampedResize(sizes, handlePanes, delta, paneConfigs,
      options?)` utility in `splitter/utils/clamped-resize.ts`:
      - `sizes: Record<string, number>` (two entries)
      - `handlePanes: { prev: string; next: string }`
      - `paneConfigs: Record<string, PaneConfig>`
      - Attempts to apply Δ to `sizes[prev]` (grow) and `sizes[next]`
        (shrink), respecting per-pane `minSize` / `maxSize`.
      - Δ is clamped to whatever fits within bounds — no cascade.
      - Optional `commitCollapse: boolean` for the collapsible path
        (Section 4).
      - Returns the new `sizes` record (summing to 100).
- [x] 3.2 Update `SplitterHandle` to read the prev/next pane ids from
      context, call `clampedResize` on `useMove` callbacks and keyboard
      handlers, and write the result via `setSizes`.
- [x] 3.3 Remove `SplitterHandle`'s current Enter handler (hardcoded to
      `setValue(minValue)` / `setValue(50)`). Replace with collapse-toggle
      of the adjacent collapsible pane (Section 4).
- [x] 3.4 Update keyboard arrow handlers to pass Δ = ±keyboardStep
      through `clampedResize` (orientation-aware). Home / End move the
      boundary to the relevant `minSize` / `maxSize`.

## 4. Collapsible feature

- [x] 4.1 In `clampedResize`, support a `commitCollapse: boolean` flag —
      when true and Δ pushes a `collapsible` pane below its `minSize`,
      set its size to `collapsedSize` (default 0) and fire
      `onCollapse(paneId)` on Root.
- [x] 4.2 Implement `isCollapsed(paneId): boolean` in the context
      (returns `sizes[paneId] <= paneConfig(paneId).collapsedSize` for
      collapsible panes).
- [x] 4.3 Add double-click handler on `SplitterHandle`: toggles collapse
      of the adjacent collapsible pane (when both are collapsible,
      prefer the smaller; ties → left/top). Gated by Root-level
      `disableDoubleClick?: boolean`.
- [x] 4.4 Add Enter key handler on `SplitterHandle`: same behaviour as
      double-click.
- [x] 4.5 Fire `onExpand(paneId)` on Root when a collapsed pane returns
      to a size strictly greater than `collapsedSize`.

## 5. `useSplitterLayout` hook

- [x] 5.1 Create
      `packages/nimbus/src/components/splitter/hooks/use-splitter-layout.ts`
      with the signature:
      ```ts
      function useSplitterLayout(options: {
        initialSizes: Record<string, number>;
        id?: string;
        storage?: {
          load(): Record<string, number> | undefined;
          save(sizes: Record<string, number>): void;
        };
        debounceMs?: number;
      }): {
        defaultSizes: Record<string, number>;
        onSizesChange: (sizes: Record<string, number>) => void;
        collapse: (paneId: string) => void;
        expand: (paneId: string) => void;
        setSizes: (sizes: Record<string, number>) => void;
        getSizes: () => Record<string, number>;
        isCollapsed: (paneId: string) => boolean;
      };
      ```
- [x] 5.2 Implement synchronous initial read: if `storage` is provided,
      call `storage.load()`; else if `id` is provided and
      `typeof window !== "undefined"`, read from `localStorage.getItem(id)`
      and `JSON.parse`. Fall back to `initialSizes` on any error or
      invalid value.
- [x] 5.3 Reconcile stored value against `initialSizes`:
      - Drop ids not in `initialSizes`.
      - For ids missing from storage, fall back to `initialSizes[id]`.
      - Every value must be a number; sum must be ≈ 100 (allow
        normalization within ±1%). Fail open to `initialSizes` on any
        mismatch.
      - Log a development-only warning when reconciliation occurs.
- [x] 5.4 Implement debounced save (default 200ms) via `setTimeout`;
      cancel pending save on unmount.
- [x] 5.5 Implement the imperative commands via an internal ref that
      `Splitter.Root` populates on mount (`useImperativeHandle` exposing
      `setSizes` / `getSizes` / `collapse` / `expand` / `isCollapsed`).
- [x] 5.6 Export `useSplitterLayout` from `splitter/index.ts`.

## 6. Hook ↔ Root wiring

- [x] 6.1 Add a `__layoutRef?: React.RefObject<SplitterImperativeHandle>`
      prop to `SplitterRoot` (internal, prefixed; not part of the public
      JSDoc'd surface) so `useSplitterLayout` can attach its ref.
- [x] 6.2 In `SplitterRoot`, call `useImperativeHandle(__layoutRef, …)`
      to expose the command methods.
- [x] 6.3 The hook returns `{ defaultSizes, onSizesChange, _layoutRef }`
      plus the commands; consumers spread the first three on `Root` (the
      ref is forwarded automatically when spreading).

## 7. Stories

- [x] 7.1 Update existing stories to the new API (`panes` map on Root,
      id-keyed `defaultSizes`, `Handle` instead of `Separator`, Pane
      carries only `id`). Keep coverage of: Default, Vertical, Disabled,
      Keyboard interaction (horizontal and vertical), Constraints, ARIA
      semantics.
- [x] 7.2 Add new stories with play functions:
      - **PerPaneConstraints**: per-pane `minSize` / `maxSize` in the
        `panes` map enforce the right boundaries; drag clamps.
      - **CollapsibleByDoubleClick**: double-click handle toggles
        collapse.
      - **CollapsibleByKeyboard**: Enter on focused handle toggles
        collapse.
      - **CollapseExpandCallbacks**: `onCollapse(id)` / `onExpand(id)`
        fire with the right pane ids.
      - **WithPersistenceHook**: `useSplitterLayout({ id })` persists
        sizes to localStorage and rehydrates on remount (use a custom
        `storage` adapter in the test to avoid touching real
        localStorage).
      - **CrossAppCommands**: a button outside the splitter calls
        `layout.collapse("nav")` and the pane collapses.
      - **NestedSplitters**: a `Splitter` inside a `Pane` rendering
        three regions, two independent handles in the tab order. Covers
        the canonical "more than two panes" pattern and verifies the
        inner splitter is independent of the outer.
      - **GracefulPersistence**: hydrate from stored sizes where one id
        differs from the current panes; verify the unknown id is
        dropped, the missing id falls back to its default, and the rest
        hydrates normally.

## 8. Documentation

- [x] 8.1 Update `splitter.mdx` (overview) for the new component shape
      (`panes` map, id-keyed `defaultSizes`, anonymous `Handle`,
      ScrollArea composition pattern in examples). Document the nesting
      pattern for 3+ regions. Remove WindowSplitter framing.
- [x] 8.2 Create `splitter.dev.mdx` (engineering guide): covers the
      uncontrolled-only design, the persistence hook, cross-app
      commands, and the rationale for 2-pane + nesting over flat
      N-pane.
- [x] 8.3 Create `splitter.a11y.mdx`: ARIA model, keyboard reference,
      focus order through pane content + handle, and what nesting
      means for the AT tree.
- [x] 8.4 Create `splitter.docs.spec.tsx`: consumer-facing examples that
      compile and run (basic 2-pane, nested 3-region, collapsible,
      persistence hook usage).

## 9. i18n

- [x] 9.1 Create `splitter.i18n.ts` with messages for the default
      handle aria-label (`"Resize panes"`) and the collapse / expand
      announcements that fire on collapse/expand state changes (live
      region or `aria-label` updates — decide during implementation).
- [x] 9.2 Run `pnpm extract-intl` and verify the new keys land in
      `packages/i18n/src/Nimbus.json`.

## 10. Tests for utilities

- [x] 10.1 `splitter/utils/clamped-resize.spec.ts` (JSDOM unit tests):
      drag respects `minSize` / `maxSize`, negative Δ, commit-collapse
      path, sum-100 invariant.
- [x] 10.2 `splitter/hooks/use-splitter-layout.spec.ts` (JSDOM unit
      tests): synchronous initial read from custom storage, dropping
      unknown ids, fallback for missing ids, fallback on invalid sum,
      debounced save, command methods proxy through the ref.

## 11. Validation

- [x] 11.1 TypeScript compiles cleanly
      (`pnpm --filter @commercetools/nimbus typecheck`).
- [x] 11.2 Build succeeds
      (`pnpm --filter @commercetools/nimbus build`).
- [ ] 11.3 Storybook tests pass
      (`pnpm test:storybook:dev packages/nimbus/src/components/splitter/splitter.stories.tsx`).
- [x] 11.4 Unit tests pass
      (`pnpm test:unit packages/nimbus/src/components/splitter/`).
- [x] 11.5 Lint passes
      (`pnpm lint -- packages/nimbus/src/components/splitter/`).
- [x] 11.6 Add a changeset
      (`pnpm changeset` — minor bump on `@commercetools/nimbus`, new
      component description).

## 12. Cleanup

- [x] 12.1 Delete any remaining `window-splitter` references in the
      codebase (search across stories, docs, theme registration).
- [x] 12.2 Confirm `git grep -i WindowSplitter` returns nothing.
