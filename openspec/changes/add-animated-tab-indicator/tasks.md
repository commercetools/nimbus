## 1. Shared hook

- [x] 1.1 Create `hooks/use-sliding-indicator/use-sliding-indicator.ts` with
      `useSlidingIndicator({ enabled, indicatorRef, activeSelector,
      watchAttributes, itemSelector?, getGeometry, deps? })`. Derive the
      container from `indicatorRef.current.parentElement`. Measure via
      `getBoundingClientRect` in `useLayoutEffect`; set `opacity`/`width`/
      `height`/`transform` on the indicator; hide (opacity 0) when no active
      item. Re-measure via `MutationObserver` (watchAttributes) +
      `ResizeObserver` (container + matched items). No-op when `!enabled`.
- [x] 1.2 Add `hooks/use-sliding-indicator/index.ts` and export from
      `hooks/index.ts`. JSDoc the options and the geometry contract.

## 2. Tabs recipe

> Note: arbitrary selectors are only accepted by the type system inside
> `variants.*` slot objects (not `base.*` or `compoundVariants[].css`), so the
> animated rules live in the `line` / `pills` variant `tab` objects.

- [x] 2.1 While `[data-animated="true"]`, give the `tab` slot
      `position: relative; zIndex: 1` (added to both the `line` and `pills`
      variants) so labels paint above the indicator.
- [x] 2.2 Suppress the static `line` marker with a single rule in the `line`
      variant: `tab: { '[data-animated="true"] &[data-selected]': { boxShadow:
      "none" } }` (covers all orientations; higher specificity than the
      compoundVariant `_selected` markers).
- [x] 2.3 Suppress the static `pills` marker: in the `pills` variant add
      `tab: { '[data-animated="true"] &[data-selected]': { backgroundColor:
      "transparent" } }`.

## 3. Tabs.Root integration

- [x] 3.1 Add `animated?: boolean` to `TabsProps` (JSDoc; `@default false`).
- [x] 3.2 In `tabs.root.tsx`, destructure `animated` out of `props` (so it never
      reaches the DOM), normalize `variant`/`orientation`/`placement` via
      `sysCtx.normalizeValue`, and compute `showIndicator = animated === true`.
- [x] 3.3 When `showIndicator`, set `position="relative"` + `data-animated="true"`
      on the root slot and render an `aria-hidden` indicator `Box` as the first
      child of `RATabs` (background/borderRadius per `pills` vs `line`, 2px bar
      for `line`), wired to `useSlidingIndicator` with `activeSelector =
      '[role="tab"][aria-selected="true"]'` and a variant/orientation/placement
      `getGeometry`. Transition disabled under reduced motion.

## 4. Stories & docs

- [x] 4.1 Add play-function stories covering animated `line` (horizontal +
      vertical/start + vertical/end) and animated `pills`, asserting the
      indicator exists, is `aria-hidden`, and that its transform changes when the
      selected tab changes.
- [x] 4.2 Document `animated` (incl. orientation behavior + reduced motion) in
      `tabs.dev.mdx` and `tabs.mdx`.

## 5. Verify

- [x] 5.1 `pnpm --filter @commercetools/nimbus build` then
      `pnpm test packages/nimbus/src/components/tabs/tabs.stories.tsx`.
- [x] 5.2 `pnpm --filter @commercetools/nimbus typecheck` and `pnpm lint` on the
      changed files.
