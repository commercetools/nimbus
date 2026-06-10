# Tasks: Add Splitter component

> **API note:** the splitter exposes a single-dimension Aside/Main API — a
> distinct `Splitter.Aside` (the configurable, sized pane) and `Splitter.Main`
> (the remainder), a single aside `size` number, flat sizing/collapse config on
> `Root`, and a boolean `collapsed` (only the aside collapses). The tasks below
> reflect that shape.

## 1. Scaffolding and registration

- [x] 1.1 Create the component directory
      `packages/nimbus/src/components/splitter/` following the Nimbus
      file-type layout (`components/`, `hooks/`, `utils/`, `intl/` with
      barrels).
- [x] 1.2 Export the component from
      `packages/nimbus/src/components/index.ts` (`export * from "./splitter"`).
- [x] 1.3 Add `splitter.recipe.ts` (`splitterSlotRecipe`) with slots `root`,
      `pane`, `handle` and an `orientation` (`horizontal` / `vertical`) variant
      (single fixed handle thickness — no `size` variant), and register it as
      `nimbusSplitter` in `packages/nimbus/src/theme/slot-recipes/index.ts`.
- [x] 1.4 Add `splitter.slots.tsx` deriving the slot prop types from the
      recipe.

## 2. Types and context

- [x] 2.1 In `splitter.types.ts`, define:
      - `SplitterRootProps`: `orientation`, `defaultSize`, `size`, `minSize`,
        `maxSize`, `collapsible`, `collapsedSize`, `onSizeChange`,
        `onSizeChangeEnd`, `collapsed`, `defaultCollapsed`, `onCollapsedChange`,
        `keyboardStep` (default 5), `isDoubleClickDisabled`, `isDisabled`,
        `children`, `ref`.
      - `ResolvedAsideConfig`: `{ minSize; maxSize; collapsible; collapsedSize }`
        (defaults applied), and `SplitterPaneRole` = `"aside" | "main"`.
      - `SplitterAsideProps` / `SplitterMainProps`: content + optional `id` +
        `ref` (no required id, no config).
      - `SplitterHandleProps`: standard HTML/style props plus `aria-label` /
        `aria-labelledby` overrides — no `id`-config or per-handle behaviour
        props.
- [x] 2.2 Define `SplitterContextValue` and `splitter.context.ts`: scalar
      `size`, `setSize` / `commitSize`, role-based pane registration
      (`registerPane` / `unregisterPane`, `paneOrder`, `paneDomIds`),
      `asideConfig`, collapse state (`collapsed` / `setCollapsed`),
      `restoreDefaults`, plus `orientation`, `keyboardStep`,
      `isDoubleClickDisabled`, `isDisabled`.

## 3. Sizing utilities (pure, unit-tested)

- [x] 3.1 `utils/derive-initial-sizes.ts` (`deriveInitialSize`): resolve the
      mount-time aside size from `defaultSize` (clamped to `0–100`, float
      precision preserved), falling back to 50 when absent or non-finite.
- [x] 3.2 `utils/normalize-sizes.ts` (`normalizeSize`): clamp a size into
      `0–100`, returning `null` for non-finite input.
- [x] 3.3 `utils/clamped-resize.ts` (`clampedResize`): apply Δ to the aside size
      clamped into `[minSize, maxSize]` (the main pane's floor is the complement
      of `maxSize`); no cascade.
- [x] 3.4 `utils/compute-aria-bounds.ts` + `utils/sizes-equal.ts`: collapse-aware
      ARIA bounds mapped onto the leading pane, and scalar size equality within
      epsilon for the controlled reconcile.

## 4. State hook

- [x] 4.1 `hooks/use-splitter-state.ts` owns the scalar size state machine: lazy
      initial-size derivation once both panes register (by role), the live
      (`setSize` → `onSizeChange`) and settled (`commitSize` → `onSizeChangeEnd`)
      channels, controlled/uncontrolled boolean collapse (aside-only) with size
      reconciliation, and the memoized context value.
- [x] 4.2 `hooks/use-splitter-context.ts`: typed context consumer for the
      pane and handle.

## 5. Components

- [x] 5.1 `components/splitter.root.tsx`: thin root that wires the recipe,
      extracts style props, resolves `asideConfig`, calls `useSplitterState`, and
      provides context. Dev-time warning when the pane count is not exactly 2.
- [x] 5.2 `components/splitter.pane.tsx` (internal base) + `splitter.aside.tsx`
      / `splitter.main.tsx`: each registers its role + DOM id with context and
      applies its size via inline style (aside = `size`%, main = `100 − size`%);
      optional `id`.
- [x] 5.3 `components/splitter.handle.tsx`: the interactive separator —
      resolves leading/trailing panes from sibling DOM order, runs drag
      (`useMove`) and keyboard, and renders the W3C separator ARIA model (value
      tracks the leading pane).
- [x] 5.4 `splitter.tsx`: assemble the compound `Splitter` namespace
      (`Root` / `Aside` / `Main` / `Handle`).

## 6. Interaction behaviour

- [x] 6.1 Drag: convert pointer delta to percentage points, translate to an
      aside Δ by side, and apply via `clampedResize`; live ticks fire
      `onSizeChange`, drag end commits via `onSizeChangeEnd`.
- [x] 6.2 Keyboard: arrow keys move the boundary by `keyboardStep`
      (orientation-aware, prevent default scroll); Home / End jump to the
      aside's bounds; each keypress commits.
- [x] 6.3 Collapse: Enter on the focused handle toggles the aside's collapse;
      the controlled `collapsed` boolean (and `defaultCollapsed` /
      `onCollapsedChange`) drives collapse from anywhere, with size
      reconciliation and pre-collapse restore.
- [x] 6.4 Double-click restores the mount-time size (existence-checked so a
      legitimate `0` initial size restores); gated by `isDoubleClickDisabled`.
- [x] 6.5 `isDisabled` removes the handle from the tab order (`tabIndex={-1}`),
      sets `aria-disabled`, and ignores drag / keyboard / collapse.

## 7. i18n

- [x] 7.1 `splitter.i18n.ts` with the default handle `aria-label`
      (`"Resize panes"`); `intl/*` locale files generated.
- [x] 7.2 Run `pnpm extract-intl` and verify the key lands in the i18n data.

## 8. Stories

- [x] 8.1 Stories with play functions covering: Default, Vertical, aside
      trailing (either-side), Disabled, keyboard interaction, pointer drag,
      size constraints (clamp at `minSize` / `maxSize`), ARIA semantics, collapse
      by keyboard, controlled collapse from an external button, controlled
      collapse + restore, controlled size (in-place change), resize-locked while
      collapsed, double-click restore (including a 0% default), persistence
      hydration via `defaultSize` + `onSizeChangeEnd`, nested splitters, float
      precision, and double-click disabled.

## 9. Documentation

- [x] 9.1 `splitter.mdx` (overview): component shape (Aside/Main), the single
      `defaultSize`, flat `minSize` / `maxSize`, anonymous `Handle`, and the
      nesting pattern for 3+ regions.
- [x] 9.2 `splitter.dev.mdx` (engineering guide): the uncontrolled-size /
      controllable-collapse model, flat aside config, consumer-wired
      single-number persistence, either-side placement, and 2-pane + nesting
      rationale.
- [x] 9.3 `splitter.a11y.mdx`: ARIA model, keyboard reference, focus order,
      and what nesting means for the AT tree.
- [x] 9.4 `splitter.docs.spec.tsx`: consumer-facing examples that compile and
      run (basic, controlled size, controlled collapse, persistence, nested).

## 10. Unit tests

- [x] 10.1 `utils/derive-initial-sizes.spec.ts`: clamp, float precision, 50
      fallback, non-finite input.
- [x] 10.2 `utils/normalize-sizes.spec.ts` + `utils/sizes-equal.spec.ts`: clamp /
      null handling and scalar equality within epsilon.
- [x] 10.3 `utils/clamped-resize.spec.ts` + `utils/compute-aria-bounds.spec.ts`:
      clamp at `minSize` / `maxSize`, collapse-aware bounds, leading/trailing
      mapping, float precision.

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

## 12. Optional controlled `size`

- [x] 12.1 `normalizeSize` + `sizeEqual` in `utils/` (with specs);
      `deriveInitialSize` reuses `normalizeSize`.
- [x] 12.2 Add `size?: number` to `SplitterRootProps` (settle-only JSDoc) and
      thread it through `Splitter.Root`.
- [x] 12.3 In `use-splitter-state.ts`, add settle-only controlled reconciliation:
      controlled init seed, a prop-reconcile effect (after the collapse effect)
      that writes silently at rest, collapse-precedence, and fire-once dev
      warnings.
- [x] 12.4 Add a `ControlledSize` story (asserts in-place change + pane content
      survives) and a `controlled-size` consumer example in
      `splitter.docs.spec.tsx`.
- [x] 12.5 Document controlled size in `splitter.dev.mdx`; update the changeset.
