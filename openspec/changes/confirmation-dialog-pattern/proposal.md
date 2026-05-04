# Change: Add ConfirmationDialog Pattern Component

## Why

Consumers migrating from Merchant Center Application Kit need a Nimbus
replacement for the `ConfirmationDialog` component. It is the second most
common dialog pattern in the MC codebase (~145 production usages across
six MC repositories) and the canonical way to ask the user "are you sure?"
before a confirm/cancel action — most often a destructive one. Rather
than require each consumer to compose `Dialog.Root`, `Dialog.Content`,
`Dialog.Header`, `Dialog.Title`, `Dialog.Body`, `Dialog.Footer`,
`Dialog.CloseTrigger`, and two `Button` instances every time, Nimbus
provides `ConfirmationDialog` as a pre-configured pattern with a flat,
opinionated API.

This pattern follows the precedent established by the recently shipped
`InfoDialog` (FEC-437): same `patterns/dialogs/` location, same
flat-props philosophy, same "escape hatch to Dialog primitive" model.
A usage audit of the app-kit component across every MC repository
informs scope decisions: 39% of usages set an explicit `size`, 52%
override the default `Confirm` label, 17% set `isPrimaryButtonDisabled`,
and the `TextTitle` sub-component / `getParentSelector` prop have zero
consumer uptake. The Nimbus pattern adopts an intentional and
opinionated upgrade over the app-kit shape: it adds an `intent`
discriminator (`"default" | "destructive"`), adds an
`isConfirmLoading` state that the app-kit equivalent lacked, and
drops the `size`, `zIndex`, `getParentSelector`, `dataAttributes*`,
and `TextTitle` surface area entirely. Consumers needing a custom
size or per-button `data-*` attributes drop down to the `Dialog`
primitive directly (documented escape hatch).

## What Changes

- **NEW** `ConfirmationDialog` pattern at
  `packages/nimbus/src/patterns/dialogs/confirmation-dialog/` —
  second member of the `dialogs/` sub-category established by
  `InfoDialog`
- **NEW** Flat props API:
  - `title: ReactNode`
  - `children: ReactNode`
  - `onConfirm: () => void`
  - `onCancel: () => void`
  - `isOpen?: boolean` (controlled mode)
  - `defaultOpen?: boolean` (uncontrolled mode)
  - `onOpenChange?: (isOpen: boolean) => void`
  - `confirmLabel?: ReactNode` (default: localized "Confirm")
  - `cancelLabel?: ReactNode` (default: localized "Cancel")
  - `intent?: "default" | "destructive"` (default: `"default"`)
  - `isConfirmDisabled?: boolean`
  - `isConfirmLoading?: boolean`
  - `aria-label?: string` (overrides accessible name derived from `title`)
- **NEW** Internally composes `Dialog.Root`, `Dialog.Content`,
  `Dialog.Header`, `Dialog.Title`, `Dialog.Body`, `Dialog.Footer`,
  `Dialog.CloseTrigger`, and two `Button`s for confirm/cancel
- **NEW** `intent="destructive"` maps the confirm `Button` to
  `variant="solid"` + `colorPalette="critical"`; the default intent
  maps to `variant="solid"` + `colorPalette="primary"` (matching the
  FormActionBar pattern's save-button styling)
- **NEW** `isConfirmLoading` shows a `LoadingSpinner` next to the
  confirm label, disables both buttons, and disables the dialog's
  dismiss affordances (Escape/overlay) for the duration of the
  in-flight action — preventing accidental cancel-during-confirm
- **NEW** Close affordances: confirm button (invokes `onConfirm`),
  cancel button (invokes `onCancel`), Escape key (invokes `onCancel`),
  overlay click (invokes `onCancel`). Every dismiss path also invokes
  `onOpenChange(false)`. The pattern unifies the app-kit
  `onClose` / `onCancel` distinction onto a single `onCancel` because
  ~55% of audited consumers (83/152 files) already bind both to the
  same handler.
- **NEW** `.i18n.ts` file owning two pattern-level strings
  (`Nimbus.ConfirmationDialog.confirm`,
  `Nimbus.ConfirmationDialog.cancel`) using
  `useLocalizedStringFormatter`, mirroring the FormActionBar pattern
- **NEW** `.dev.mdx` documentation includes an "escape hatch" section
  showing the equivalent manual Dialog composition for consumers
  needing custom size, custom dismissability, or per-button
  `data-*` attributes
- **MODIFIED** `packages/nimbus/src/patterns/dialogs/index.ts`
  re-exports the new pattern alongside the existing `InfoDialog` export

## Capabilities

### New Capabilities

- `nimbus-confirmation-dialog`: a pre-composed confirm/cancel dialog
  pattern built on the Nimbus `Dialog` primitive, with localized
  default button labels, a destructive intent variant, loading and
  disabled states for the confirm action, and unified cancel
  semantics across the cancel button and ambient dismiss affordances

### Modified Capabilities

<!-- None. The InfoDialog pattern's spec (`nimbus-info-dialog`) is
     a sibling capability and is not modified by this change. -->

## Impact

- Affected specs: none modified (new capability `nimbus-confirmation-dialog`)
- Affected code:
  - `packages/nimbus/src/patterns/dialogs/confirmation-dialog/` (new)
  - `packages/nimbus/src/patterns/dialogs/index.ts` (export added)
- Affected dependencies: none new — composes existing `Dialog`,
  `Button`, `LoadingSpinner` primitives and reuses
  `useLocalizedStringFormatter` from `@/hooks`

## Related

- Jira: FEC-431
- Parent epic: FEC-428 (Application-Components Migration to Nimbus)
- Sibling pattern (precedent): `info-dialog-pattern` change (FEC-437)
- Replaces: `merchant-center-application-kit` `ConfirmationDialog`
  component
