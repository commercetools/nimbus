# Tasks: Add Region primitive

> **Primitive note:** `Region` is headless — no Chakra recipe, slots, design
> tokens, or i18n. It follows the Nimbus file-type layout, component-with-statics
> export shape, strict typing, JSDoc, and Storybook play-function testing.

## 1. Scaffolding and registration

- [x] 1.1 Create `packages/nimbus/src/components/region/` following the Nimbus
      file-type layout, with an `index.ts` barrel.
- [x] 1.2 Export the primitive from `packages/nimbus/src/components/index.ts`
      (`export * from "./region"`).
- [x] 1.3 Confirm **no** slot-recipe registration is needed (headless — nothing
      to theme).

## 2. Types

- [x] 2.1 In `region.types.ts`, define `RegionRecord<T>` (`{ node, value }`),
      `RegionRegistry` (`get` / `setNode` / `setValue` / `subscribe`),
      `RegionPortal`, `RegionProps` (`name`, optional `value`, `ref`, Chakra style
      props via `HTMLChakraProps<"div">`), `RegionProviderProps`, and
      `UseRegionResult<T>` (`{ Region, value }`). Strict typing; `value` is opaque
      (`unknown`) with a generic on the consumer hook.

## 3. Registry (pure, unit-tested)

- [x] 3.1 `region.registry.ts` `createRegionRegistry()`: an external store of
      per-name `{ node, value }` records — `setNode` / `setValue` replace the
      record by identity only on real change, reference-equal writes are no-ops,
      records drop when both halves are empty, and per-name `subscribe`.
- [x] 3.2 `RegionRegistryContext` (nullable) exported for provider/consumer use.

## 4. Components and hook

- [x] 4.1 `region.provider.tsx` `Region.Provider`: reuse-or-create the registry
      (reuse an ancestor's; otherwise host a new one); renders no DOM of its own.
- [x] 4.2 `region.target.tsx` `<Region name>` target: stable merged ref that
      registers/clears the node under `name`; publishes the optional `value` via
      effect; renders a `chakra.div` with `display: contents` (layout-transparent,
      overridable) forwarding style props/ref.
- [x] 4.3 `region.portal.tsx` `createRegionPortal(name)`: a stable portal
      component reading the registry from context via `useSyncExternalStore`
      (with `getServerSnapshot` → `null`) and `createPortal` into the node.
- [x] 4.4 `use-region.ts` `useRegion<T>(name?)`: returns `{ Region, value }`;
      caches one stable portal per name; `null`-safe before mount / without a
      provider.
- [x] 4.5 `region.tsx`: assemble `Region` as the target component with a
      `Region.Provider` static (component-with-statics) plus underscore re-exports
      for docgen.

## 5. Ambient provider in NimbusProvider

- [x] 5.1 Mount a `Region.Provider` ambiently inside `NimbusProvider` (alongside
      the i18n provider / toast outlet) so `useRegion` / `<Region>` work app-wide
      without an explicit provider; reuse-or-create keeps nested providers sharing
      one registry.

## 6. Stories

- [x] 6.1 Stories with play functions: `ProjectIntoNamedRegion` (content paints at
      a named target) and `NullBeforeTargetMounts` (`null`-safe resolution, then
      resolves once the target mounts). They rely on the ambient provider supplied
      by Storybook's `NimbusProvider` decorator.
- [x] 6.2 `ShellOwnedSidePanel` composition story (Splitter + Region): a consumer
      that owns no splitter markup fills the aside and opens it via the published
      collapse callbacks; asserts projection target and expand-on-mount.

## 7. Unit tests

- [x] 7.1 `region.registry.spec.ts`: node + value records, stable snapshot
      identity, per-name notification isolation, reference-equal no-ops, cleanup
      when emptied, value-survives-node-clear, unsubscribe.
- [x] 7.2 `nimbus-provider.spec.tsx`: `useRegion` / `<Region>` resolve under a
      bare `NimbusProvider` (ambient scope).

## 8. Documentation

- [x] 8.1 `region.mdx` (overview) and `region.dev.mdx` (engineering guide): the
      target / `useRegion` / ambient-provider model, the `display: contents`
      layout-transparency technique, publishing a value, the shell-owned-side-panel
      composition with `Splitter`, and the performance/memoization contract
      (external store + stable `children` + stable callbacks + consumer effect deps).

## 9. Validation

- [x] 9.1 TypeScript compiles cleanly
      (`pnpm --filter @commercetools/nimbus typecheck`).
- [x] 9.2 Storybook tests pass
      (`pnpm test:storybook:dev packages/nimbus/src/components/region/region.stories.tsx`).
- [x] 9.3 Unit tests pass (`pnpm test:unit packages/nimbus/src/components/region/`
      and `.../nimbus-provider/`).
- [x] 9.4 Lint passes (`pnpm exec eslint packages/nimbus/src/components/region`).
- [x] 9.5 Add a changeset (minor bump on `@commercetools/nimbus`).
- [x] 9.6 `openspec validate add-region-primitive --strict` passes.
