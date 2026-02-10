## 1. Scaffold

- [x] 1.1 Create `packages/nimbus/src/components/toast/` directory with shell
      files: `toast.tsx`, `toast.types.ts`, `toast.recipe.ts`, `toast.slots.tsx`,
      `toast.manager.ts`, `toast.outlet.tsx`, `toast.i18n.ts`, `toast.stories.tsx`,
      `toast.spec.tsx`, `toast.docs.spec.tsx`, `components/index.ts`, `index.ts`
- [x] 1.2 Register `toastRecipe` in `src/theme/slot-recipes/index.ts` as
      `nimbusToast`
- [x] 1.3 Export `Toast`, `toast`, `ToastOutlet` from `src/index.ts`

## 2. Failing Tests (TDD)

- [x] 2.1 Write Storybook stories with play functions covering: all 4 variants,
      auto-dismiss, pause on hover, pause on focus, close button, Escape key,
      action button, promise pattern, stacking/queuing, multi-placement, ARIA
      roles, reduced motion
- [x] 2.2 Write unit tests for ToastManager: lazy creation, ID routing,
      convenience methods, promise handling, action→duration:0 enforcement,
      `.remove()` vs `.dismiss()`, per-placement hotkey mapping, ARIA role
      override for warning/error types
- [x] 2.3 Verify all tests fail (TDD red phase)

## 3. Implementation

- [x] 3.1 Implement types in `toast.types.ts` (ToastOptions, ToastProps, slot
      props, ToastManager types)
- [x] 3.2 Implement slot recipe in `toast.recipe.ts` (6 slots, colorPalette
      tokens, grid layout mirroring Alert pattern)
- [x] 3.3 Implement slots in `toast.slots.tsx` (createSlotRecipeContext with key
      `nimbusToast`, withProvider for root, withContext for children)
- [x] 3.4 Implement sub-components in `components/` (toast.root.tsx,
      toast.title.tsx, toast.description.tsx, toast.action-trigger.tsx,
      toast.close-trigger.tsx with i18n aria-label)
- [x] 3.5 Implement compound export in `toast.tsx`
- [x] 3.6 Implement `ToastManager` in `toast.manager.ts` (lazy multi-toaster
      facade, ID-to-placement routing, convenience methods, promise support,
      action→duration:0 enforcement, `.remove()` and `.dismiss()`,
      per-placement hotkey mapping via `PLACEMENT_HOTKEYS`, subscribe/notify
      pattern for ToastOutlet)
- [x] 3.7 Implement `ToastOutlet` in `toast.outlet.tsx` (subscribes to manager,
      renders `<Toaster toaster={store}>` per active placement with children
      render function composing `Toast.*` compound components)
- [x] 3.7b In `Toast.Root`, override default `role="status"` with correct
      role/aria-live based on type (warning/error → alert/assertive)
- [x] 3.8 Implement i18n in `toast.i18n.ts` (Nimbus.Toast.dismiss message)
- [x] 3.9 Add `<ToastOutlet />` to NimbusProvider

## 4. Documentation

- [x] 4.1 Create developer documentation (`toast.dev.mdx`) using
      `/writing-developer-documentation`
- [x] 4.2 Create designer documentation (`toast.mdx`) using
      `/writing-designer-documentation`
- [x] 4.3 Write consumer implementation tests (`toast.docs.spec.tsx`)

## 5. Validation

- [x] 5.1 All Storybook story tests pass
- [x] 5.2 All unit tests pass
- [x] 5.3 TypeScript compiles without errors (`pnpm --filter @commercetools/nimbus typecheck`)
- [x] 5.4 Linting passes (`pnpm lint`)
- [x] 5.5 Build succeeds (`pnpm --filter @commercetools/nimbus build`)
- [x] 5.6 Full test suite passes (`pnpm test`)
