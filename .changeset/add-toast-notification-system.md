---
"@commercetools/nimbus": minor
---

Toast: add Toast notification system

Imperative toast API with full Nimbus styling and accessibility support.

- `toast()` function with convenience shorthands (`toast.info()`,
  `toast.success()`, `toast.warning()`, `toast.error()`)
- `toast.promise()` for loading → success/error state transitions
- `toast.update()`, `toast.dismiss()`, `toast.remove()` for programmatic control
- 4 semantic types (info, success, warning, error) with correct ARIA roles
  (`status` / `alert`)
- 3 visual variants: `accent-start` (default), `solid`, `subtle`
- 4 corner placements with independent stacking and Alt+Shift numpad hotkeys
- Localized dismiss button label via `useLocalizedStringFormatter` (en, de, es,
  fr-FR, pt-BR)
- `ToastOutlet` auto-mounted by `NimbusProvider` with nested-provider
  deduplication guard
- SSR-safe lazy toaster initialization
