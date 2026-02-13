# Change: Add Toast Notification System

## Why

Users need non-intrusive, transient notifications to communicate action outcomes
without interrupting workflow. No toast component exists in Nimbus today.

## What Changes

- **NEW** `Toast` compound component (root, icon, title, description,
  actionTrigger, closeTrigger)
- **NEW** `toast` imperative API for creating toasts from anywhere
- **NEW** `ToastManager` internal facade managing per-placement toaster instances
- **NEW** `ToastOutlet` rendered inside `NimbusProvider` for zero-setup
- **NEW** `nimbusToast` slot recipe
- **NEW** i18n message: `Nimbus.Toast.dismiss` (5 locales)
- **MODIFIED** `NimbusProvider` renders `<ToastOutlet />` as child

## Impact

- Affected specs: `nimbus-nimbus-provider` (adds ToastOutlet child)
- Affected code:
  - `packages/nimbus/src/components/toast/` (new)
  - `packages/nimbus/src/components/nimbus-provider/nimbus-provider.tsx`
  - `packages/nimbus/src/theme/slot-recipes/index.ts`
  - `packages/nimbus/src/index.ts`
