## 1. Scaffold

- [x] 1.1 Create `packages/nimbus/src/components/tab-nav/` directory with
      files: `tab-nav.tsx`, `tab-nav.types.ts`, `tab-nav.recipe.ts`,
      `tab-nav.slots.tsx`, `tab-nav.stories.tsx`, `index.ts`,
      `components/index.ts`, `components/tab-nav.root.tsx`,
      `components/tab-nav.item.tsx`
- [x] 1.2 Register `tabNavSlotRecipe` in `src/theme/slot-recipes/index.ts` as
      `nimbusTabNav`
- [x] 1.3 Export `TabNav`, `TabNavProps`, `TabNavItemProps` from
      `src/components/tab-nav/index.ts`
- [x] 1.4 Add `export * from "./tab-nav"` to `src/components/index.ts`

## 2. Failing Tests (TDD)

- [x] 2.1 Write Storybook stories with play functions covering: base usage,
      `aria-current="page"` on active item, inactive items lack `aria-current`,
      keyboard navigation (arrow keys do NOT move focus), sequential Tab key
      navigation, nav landmark present

## 3. Implementation

- [x] 3.1 Implement types in `tab-nav.types.ts` (`TabNavRecipeProps`,
      `TabNavRootSlotProps`, `TabNavItemSlotProps`, `TabNavProps`,
      `TabNavItemProps`)
- [x] 3.2 Implement slot recipe in `tab-nav.recipe.ts` (slots: root, item;
      variant: tabs; base styles matching Tabs `line` horizontal variant;
      `&[aria-current="page"]` for active state)
- [x] 3.3 Implement slot components in `tab-nav.slots.tsx`
      (`createSlotRecipeContext` with key `"nimbusTabNav"`, `withProvider` for
      Root as `"nav"`, `withContext` for Item as `"a"`)
- [x] 3.4 Implement `components/tab-nav.root.tsx` (passes props to
      `TabNavRootSlot`)
- [x] 3.5 Implement `components/tab-nav.item.tsx` (sets `aria-current="page"`
      when `isCurrent` is true)
- [x] 3.6 Implement `tab-nav.tsx` namespace object (`Root` first, `Item`
      second, type re-exports, underscore exports)

## 4. Documentation

- [ ] 4.1 Create developer documentation (`tab-nav.dev.mdx`)
- [ ] 4.2 Create consumer implementation tests (`tab-nav.docs.spec.tsx`)

## 5. Validation

- [x] 5.1 TypeScript compiles without errors
      (`pnpm --filter @commercetools/nimbus typecheck`)
- [x] 5.2 Build succeeds (`pnpm --filter @commercetools/nimbus build`)
- [ ] 5.3 Storybook story tests pass
      (`pnpm test packages/nimbus/src/components/tab-nav/tab-nav.stories.tsx`)
- [ ] 5.4 Full test suite passes
