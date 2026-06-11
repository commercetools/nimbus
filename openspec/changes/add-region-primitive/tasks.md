# Tasks: Add Region primitive

> **Primitive note:** `Region` is headless — no Chakra recipe, slots, design
> tokens, or i18n. It follows the Nimbus file-type layout, compound-namespace
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
      `RegionPortal`, `RegionOutletProps` (`name`, optional `value`, `ref`,
      standard div props), `RegionRootProps`, and `UseRegionResult<T>`
      (`{ node, value, Region }`). Strict typing; `value` is opaque (`unknown`)
      with a generic on the consumer hook.

## 3. Registry (pure, unit-tested)

- [x] 3.1 `region.registry.ts` `createRegionRegistry()`: an external store of
      per-name `{ node, value }` records — `setNode` / `setValue` replace the
      record by identity only on real change, reference-equal writes are no-ops,
      records drop when both halves are empty, and per-name `subscribe`.
- [x] 3.2 `RegionRegistryContext` (nullable) exported for provider/consumer use.

## 4. Components and hook

- [x] 4.1 `region.root.tsx` `Region.Root`: reuse-or-create the registry
      (reuse an ancestor's; otherwise host a new one).
- [x] 4.2 `region.outlet.tsx` `Region.Outlet`: stable merged ref that
      registers/clears the node under `name`; publishes the optional `value` via
      effect; renders a fill-parent `div` forwarding props/ref.
- [x] 4.3 `region.portal.tsx` `createRegionPortal(name)`: a stable portal
      component reading the registry from context via `useSyncExternalStore`
      (with `getServerSnapshot` → `null`) and `createPortal` into the node.
- [x] 4.4 `use-region.ts` `useRegion<T>(name?)`: returns `{ node, value, Region }`;
      caches one stable portal per name; `null`-safe before mount / without a
      provider.
- [x] 4.5 `region.tsx`: assemble the compound `Region` namespace
      (`Provider` / `Outlet`) with underscore re-exports for docgen.

## 5. Stories

- [x] 5.1 Standalone stories with play functions: `ProjectIntoNamedOutlet`
      (content paints at a named outlet) and `NullBeforeOutletMounts`
      (`null`-safe resolution, then resolves once the outlet mounts).
- [x] 5.2 `ShellOwnedSidePanel` composition story (Splitter + Region): a consumer
      that owns no splitter markup projects into the aside and opens it via the
      published collapse callbacks; asserts projection target and expand-on-mount.

## 6. Unit tests

- [x] 6.1 `region.registry.spec.ts`: node + value records, stable snapshot
      identity, per-name notification isolation, reference-equal no-ops, cleanup
      when emptied, value-survives-node-clear, unsubscribe.

## 7. Documentation

- [x] 7.1 `region.dev.mdx` (engineering guide): the root/outlet/`useRegion`
      model, node + value, the shell-owned-side-panel composition with `Splitter`,
      and the performance/memoization contract (external store + stable
      `children` + stable callbacks + consumer effect deps).

## 8. Validation

- [x] 8.1 TypeScript compiles cleanly
      (`pnpm --filter @commercetools/nimbus typecheck`).
- [x] 8.2 Storybook tests pass
      (`pnpm test:storybook:dev packages/nimbus/src/components/region/region.stories.tsx`).
- [x] 8.3 Unit tests pass
      (`pnpm test:unit packages/nimbus/src/components/region/`).
- [x] 8.4 Lint passes (`pnpm exec eslint packages/nimbus/src/components/region`).
- [x] 8.5 Add a changeset (minor bump on `@commercetools/nimbus`).
- [x] 8.6 `openspec validate add-region-primitive --strict` passes.
