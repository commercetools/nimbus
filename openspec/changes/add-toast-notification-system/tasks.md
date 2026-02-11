## 1. Scaffold

- [x] 1.1 Create `packages/nimbus/src/components/toast/` directory with files:
      `toast.types.ts`, `toast.recipe.ts`, `toast.manager.ts`, `toast.toasters.ts`,
      `toast.outlet.tsx`, `toast.i18n.ts`, `toast.messages.ts`, `toast.stories.tsx`,
      `toast.spec.tsx`, `toast.docs.spec.tsx`, `intl/`, `index.ts`
- [x] 1.2 Register `toastRecipe` in `src/theme/slot-recipes/index.ts` as `toast`
      (overrides Chakra's default recipe key)
- [x] 1.3 Export `toast`, `ToastOutlet`, and types from `src/components/toast/index.ts`

## 2. Failing Tests (TDD)

- [x] 2.1 Write Storybook stories with play functions covering: all 4 variants,
      auto-dismiss, pause on hover, pause on focus, close button, Escape key,
      action button, promise pattern, stacking/queuing, multi-placement, ARIA
      roles, reduced motion, closable control, programmatic update, i18n
- [x] 2.2 Write unit tests for ToastManager: singleton pattern, ID routing,
      convenience methods, promise handling, action→duration:0 enforcement,
      `.remove()` vs `.dismiss()`, closable forwarding via meta, edge cases
- [x] 2.3 Write consumer implementation tests (`toast.docs.spec.tsx`)

## 3. Implementation

- [x] 3.1 Implement types in `toast.types.ts` (ToastOptions, ToastPlacement,
      ToastAction, ToastPromiseOptions, IToastManager)
- [x] 3.2 Implement slot recipe in `toast.recipe.ts` (6 slots: root, indicator,
      title, description, actionTrigger, closeTrigger — registered as `toast` key)
- [x] 3.3 Implement pre-created toasters in `toast.toasters.ts` (6 placements,
      per-placement hotkeys, pauseOnPageIdle)
- [x] 3.4 Implement `ToastManager` in `toast.manager.ts` (singleton,
      ID-to-placement routing, convenience methods, promise forwarding,
      action→duration:0 enforcement, closable via meta forwarding)
- [x] 3.5 Implement `ToastOutlet` in `toast.outlet.tsx` (renders `<Toaster>` per
      placement, composes Chakra Toast subcomponents, overrides ARIA role/aria-live
      based on type, i18n close button aria-label)
- [x] 3.6 Implement i18n in `toast.i18n.ts` (Nimbus.Toast.dismiss message)
- [x] 3.7 Pre-compile translations in `intl/` (en, de, es, fr-FR, pt-BR)
- [x] 3.8 Add `<ToastOutlet />` to NimbusProvider

## 4. Documentation

- [x] 4.1 Create developer documentation (`toast.dev.mdx`)
- [x] 4.2 Create designer documentation (`toast.mdx`)

## 5. Validation

- [x] 5.1 All unit tests pass
- [ ] 5.2 All Storybook story tests pass
- [x] 5.3 All consumer implementation tests pass
- [x] 5.4 TypeScript compiles without errors
- [ ] 5.5 Build succeeds
- [ ] 5.6 Full test suite passes
