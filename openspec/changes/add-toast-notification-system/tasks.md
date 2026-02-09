## 1. Scaffold

- [ ] 1.1 Create `packages/nimbus/src/components/toast/` directory with shell
      files: `toast.tsx`, `toast.types.ts`, `toast.recipe.ts`, `toast.slots.tsx`,
      `toast.manager.ts`, `toast.outlet.tsx`, `toast.i18n.ts`, `toast.stories.tsx`,
      `toast.spec.tsx`, `toast.docs.spec.tsx`, `components/index.ts`, `index.ts`
- [ ] 1.2 Register `toastRecipe` in `src/theme/slot-recipes/index.ts` as
      `nimbusToast`
- [ ] 1.3 Export `Toast`, `toast`, `ToastOutlet` from `src/index.ts`

## 2. Failing Tests (TDD)

- [ ] 2.1 Write Storybook stories with play functions covering: all 4 variants,
      auto-dismiss, pause on hover, pause on focus, close button, Escape key,
      action button, promise pattern, stacking/queuing, multi-placement, ARIA
      roles, reduced motion
- [ ] 2.2 Write unit tests for ToastManager: lazy creation, ID routing,
      convenience methods, promise handling, action auto-duration
- [ ] 2.3 Verify all tests fail (TDD red phase)

## 3. Implementation

- [ ] 3.1 Implement types in `toast.types.ts` (ToastOptions, ToastProps, slot
      props, ToastManager types)
- [ ] 3.2 Implement slot recipe in `toast.recipe.ts` (6 slots, colorPalette
      tokens, grid layout mirroring Alert pattern)
- [ ] 3.3 Implement slots in `toast.slots.tsx` (createSlotRecipeContext with key
      `nimbusToast`, withProvider for root, withContext for children)
- [ ] 3.4 Implement sub-components in `components/` (toast.root.tsx,
      toast.title.tsx, toast.description.tsx, toast.action-trigger.tsx,
      toast.close-trigger.tsx with i18n aria-label)
- [ ] 3.5 Implement compound export in `toast.tsx`
- [ ] 3.6 Implement `ToastManager` in `toast.manager.ts` (lazy multi-toaster
      facade, ID-to-placement routing, convenience methods, promise support)
- [ ] 3.7 Implement `ToastOutlet` in `toast.outlet.tsx` (renders Toaster per
      active placement, uses Toast compound component for rendering)
- [ ] 3.8 Implement i18n in `toast.i18n.ts` (Nimbus.Toast.dismiss message)
- [ ] 3.9 Add `<ToastOutlet />` to NimbusProvider

## 4. Documentation

- [ ] 4.1 Create developer documentation (`toast.dev.mdx`) using
      `/writing-developer-documentation`
- [ ] 4.2 Create designer documentation (`toast.mdx`) using
      `/writing-designer-documentation`
- [ ] 4.3 Write consumer implementation tests (`toast.docs.spec.tsx`)

## 5. Validation

- [ ] 5.1 All Storybook story tests pass
- [ ] 5.2 All unit tests pass
- [ ] 5.3 TypeScript compiles without errors (`pnpm --filter @commercetools/nimbus typecheck`)
- [ ] 5.4 Linting passes (`pnpm lint`)
- [ ] 5.5 Build succeeds (`pnpm --filter @commercetools/nimbus build`)
- [ ] 5.6 Full test suite passes (`pnpm test`)
