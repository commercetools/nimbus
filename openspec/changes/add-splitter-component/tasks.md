# Tasks: Add Splitter component

## 1. Scaffolding and registration

- [x] 1.1 Create the component directory
      `packages/nimbus/src/components/splitter/` following the Nimbus
      file-type layout (`components/`, `hooks/`, `utils/`, `intl/` with
      barrels).
- [x] 1.2 Export the component from
      `packages/nimbus/src/components/index.ts` (`export * from "./splitter"`).
- [x] 1.3 Add `splitter.recipe.ts` (`splitterSlotRecipe`) with slots `root`,
      `pane`, `handle` and variants `orientation` (`horizontal` / `vertical`)
      and `size` (`sm` / `md` / `lg`), and register it as `nimbusSplitter` in
      `packages/nimbus/src/theme/slot-recipes/index.ts`.
- [x] 1.4 Add `splitter.slots.tsx` deriving the slot prop types from the
      recipe.

## 2. Types and context

- [x] 2.1 In `splitter.types.ts`, define:
      - `SplitterRootProps`: `orientation`, `size`, `defaultSizes`,
        `onSizesChange`, `onSizesChangeEnd`, `panes`, `collapsedPane`,
        `defaultCollapsedPane`, `onCollapsedPaneChange`, `keyboardStep`
        (default 5), `isDoubleClickDisabled`, `isDisabled`, `children`, `ref`.
      - `SplitterPaneConfig`: `{ minSize?: number; collapsible?: boolean;
        collapsedSize?: number; }` (static per-pane config).
      - `SplitterPaneProps`: only `id: string`, `children`, `ref`.
      - `SplitterHandleProps`: standard HTML/style props plus `aria-label` /
        `aria-labelledby` overrides — no `id`-config or per-handle behaviour
        props.
- [x] 2.2 Define `SplitterContextValue` and `splitter.context.ts`: id-keyed
      `sizes`, `setSizes` / `commitSizes`, pane registration
      (`registerPane` / `unregisterPane`, `paneOrder`, `paneDomIds`),
      `getPaneConfig`, collapse state (`collapsedPane` / `setCollapsedPane`),
      `restoreDefaults`, plus `orientation`, `keyboardStep`,
      `isDoubleClickDisabled`, `isDisabled`.

## 3. Sizing utilities (pure, unit-tested)

- [x] 3.1 `utils/derive-initial-sizes.ts`: resolve mount-time sizes from
      `defaultSizes` (normalized to sum 100, float precision preserved),
      falling back to a 50/50 split when absent or incomplete.
- [x] 3.2 `utils/clamped-resize.ts`: apply Δ to the prev/next pane while
      clamping at each pane's `minSize` (upper bound derived as
      `100 − partner.minSize`); no cascade; result always sums to 100.
- [x] 3.3 `utils/pick-collapse-target.ts`: choose which collapsible pane Enter
      targets (prefer the smaller; ties → left/top).

## 4. State hook

- [x] 4.1 `hooks/use-splitter-state.ts` owns the sizes state machine: lazy
      initial-size derivation once both panes register, the live (`setSizes`
      → `onSizesChange`) and settled (`commitSizes` → `onSizesChangeEnd`)
      channels, controlled/uncontrolled collapse with size reconciliation,
      and the memoized context value.
- [x] 4.2 `hooks/use-splitter-context.ts`: typed context consumer for the
      Pane and Handle.

## 5. Components

- [x] 5.1 `components/splitter.root.tsx`: thin root that wires the recipe,
      extracts style props, calls `useSplitterState`, and provides context.
      Dev-time warning when the Pane count is not exactly 2.
- [x] 5.2 `components/splitter.pane.tsx`: registers its `id` + DOM id with
      context, applies its size via inline style, warns on missing/duplicate
      `id`.
- [x] 5.3 `components/splitter.handle.tsx`: the interactive separator —
      resolves prev/next panes from sibling DOM order, runs drag (`useMove`)
      and keyboard, and renders the W3C separator ARIA model.
- [x] 5.4 `splitter.tsx`: assemble the compound `Splitter` namespace
      (`Root` / `Pane` / `Handle`).

## 6. Interaction behaviour

- [x] 6.1 Drag: convert pointer delta to percentage points and apply via
      `clampedResize`; live ticks fire `onSizesChange`, drag end commits via
      `onSizesChangeEnd`.
- [x] 6.2 Keyboard: arrow keys move the boundary by `keyboardStep`
      (orientation-aware, prevent default scroll); Home / End jump to the
      bounds; each keypress commits.
- [x] 6.3 Collapse: Enter on the focused handle toggles collapse of the
      adjacent collapsible pane; the controlled `collapsedPane` prop (and
      `defaultCollapsedPane` / `onCollapsedPaneChange`) drives collapse from
      anywhere, with size reconciliation and pre-collapse restore.
- [x] 6.4 Double-click restores the mount-time sizes (existence-checked so a
      legitimate `0` initial size restores); gated by `isDoubleClickDisabled`.
- [x] 6.5 `isDisabled` removes the handle from the tab order (`tabIndex={-1}`),
      sets `aria-disabled`, and ignores drag / keyboard / collapse.

## 7. i18n

- [x] 7.1 `splitter.i18n.ts` with the default handle `aria-label`
      (`"Resize panes"`); `intl/*` locale files generated.
- [x] 7.2 Run `pnpm extract-intl` and verify the key lands in the i18n data.

## 8. Stories

- [x] 8.1 Stories with play functions covering: Default, Vertical, Disabled,
      keyboard interaction (horizontal and vertical), per-pane constraints
      (drag clamps at `minSize` and the derived upper bound), ARIA semantics,
      collapse by keyboard, controlled collapse from an external button,
      `onCollapsedPaneChange`, double-click restore (including a 0% default),
      persistence hydration via `defaultSizes` + `onSizesChangeEnd`, nested
      splitters, and float precision.

## 9. Documentation

- [x] 9.1 `splitter.mdx` (overview): component shape, `panes` map, id-keyed
      `defaultSizes`, anonymous `Handle`, handle `size` variant, and the
      nesting pattern for 3+ regions.
- [x] 9.2 `splitter.dev.mdx` (engineering guide): the uncontrolled-sizes /
      controllable-collapse model, the `defaultSizes`-vs-`panes` lifecycle
      split, consumer-wired persistence, and 2-pane + nesting rationale.
- [x] 9.3 `splitter.a11y.mdx`: ARIA model, keyboard reference, focus order,
      and what nesting means for the AT tree.
- [x] 9.4 `splitter.docs.spec.tsx`: consumer-facing examples that compile and
      run (basic 2-pane, nested 3-region, collapsible, persistence).

## 10. Unit tests

- [x] 10.1 `utils/derive-initial-sizes.spec.ts`: normalization, float
      precision, 50/50 fallback, incomplete/unknown ids.
- [x] 10.2 `utils/clamped-resize.spec.ts`: clamp at `minSize`, derived upper
      bound, negative Δ, sum-100 invariant.
- [x] 10.3 `utils/pick-collapse-target.spec.ts`: smaller-pane preference and
      tie-breaking.

## 11. Validation

- [x] 11.1 TypeScript compiles cleanly
      (`pnpm --filter @commercetools/nimbus typecheck`).
- [x] 11.2 Build succeeds
      (`pnpm --filter @commercetools/nimbus build`).
- [x] 11.3 Storybook tests pass
      (`pnpm test:storybook:dev packages/nimbus/src/components/splitter/splitter.stories.tsx`).
- [x] 11.4 Unit tests pass
      (`pnpm test:unit packages/nimbus/src/components/splitter/`).
- [x] 11.5 Lint passes
      (`pnpm lint -- packages/nimbus/src/components/splitter/`).
- [x] 11.6 Add a changeset (minor bump on `@commercetools/nimbus`).
