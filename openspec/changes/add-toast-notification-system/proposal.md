# Change: Add Toast Notification System

## Why

Users need non-intrusive, transient notifications to communicate action outcomes
without interrupting workflow. No toast component exists in Nimbus today.

## What Changes

- **NEW** `toast` imperative API for creating toasts from anywhere
- **NEW** `ToastManager` internal singleton routing toast IDs to placement-specific
  Chakra UI toaster instances
- **NEW** `ToastOutlet` rendered inside `NimbusProvider` for zero-setup
- **NEW** `toast` slot recipe with 3 visual variants (solid, subtle, accent-start)
  registered under the `toast` key to override Chakra's default toast recipe
- **DEFERRED** i18n message: `Nimbus.Toast.dismiss` — close button uses a
  hardcoded `aria-label` until localization infrastructure is wired up
- **MODIFIED** `NimbusProvider` renders `<ToastOutlet />` as child, with a
  context guard (`ToastOutletMountedContext`) to prevent duplicate outlets when
  NimbusProviders are nested

## Impact

- Affected specs: `nimbus-nimbus-provider` (adds ToastOutlet child)
- Affected code:
  - `packages/nimbus/src/components/toast/` (new)
  - `packages/nimbus/src/components/nimbus-provider/nimbus-provider.tsx`
  - `packages/nimbus/src/theme/slot-recipes/index.ts`
