# Change: Add FormDialog Pattern Component

## Why

Consumers migrating from Merchant Center Application Kit need a Nimbus
replacement for the `FormDialog` component — a pre-composed dialog
that hosts a form, with localized "Save" and "Cancel" footer actions
and a loading state for asynchronous saves. It is the canonical way
to surface an editable form inside a modal. Rather than require each
consumer to compose `Dialog.Root`, `Dialog.Content`, `Dialog.Header`,
`Dialog.Title`, `Dialog.Body`, `Dialog.Footer`, `Dialog.CloseTrigger`,
and two `Button` instances every time, Nimbus provides `FormDialog`
as a pre-configured pattern with a flat, opinionated API.

## What Changes

- **NEW** `FormDialog` pattern at
  `packages/nimbus/src/patterns/dialogs/form-dialog/`
- **NEW** Flat props API:
  - `title: ReactNode`
  - `children: ReactNode` — form content rendered inside `Dialog.Body`
  - `onSave: () => void | Promise<void>` — if a Promise is returned,
    the dialog stays open until it fulfills; rejected promises leave
    the dialog open so the consumer can show validation errors
  - `onCancel: () => void`
  - `isOpen?: boolean` (controlled mode)
  - `defaultOpen?: boolean` (uncontrolled mode)
  - `onOpenChange?: (isOpen: boolean) => void`
  - `saveLabel?: ReactNode` (default: localized "Save")
  - `cancelLabel?: ReactNode` (default: localized "Cancel")
  - `isSaveDisabled?: boolean`
  - `isSaveLoading?: boolean`
  - `aria-label?: string` (overrides accessible name derived from
    `title`)
- **NEW** Internally composes `Dialog.Root`, `Dialog.Content`,
  `Dialog.Header`, `Dialog.Title`, `Dialog.Body`, `Dialog.Footer`,
  `Dialog.CloseTrigger`, and two `Button`s for save/cancel
- **NEW** Save button is `variant="solid"` `colorPalette="primary"`;
  cancel is `variant="outline"`
- **NEW** `isSaveLoading` shows a `LoadingSpinner` next to the save
  label, disables both buttons, and disables the dialog's dismiss
  affordances (Escape / overlay / X) for the duration of the
  in-flight action — preventing accidental cancel-during-save and
  inflight-data-loss
- **NEW** Close affordances: save button (invokes `onSave`), cancel
  button (invokes `onCancel`), Escape key (invokes `onCancel`),
  overlay click (invokes `onCancel`), X close button (invokes
  `onCancel`). Every dismiss path also invokes `onOpenChange(false)`.
  A single unified `onCancel` callback fires across all cancel
  routes.
- **NEW** `.i18n.ts` file owning two pattern-level strings
  (`Nimbus.FormDialog.save`, `Nimbus.FormDialog.cancel`) using
  `useLocalizedStringFormatter`
- **NEW** `.dev.mdx` documentation includes an "escape hatch"
  section showing the equivalent manual Dialog composition for
  consumers needing custom size, custom dismissability, or
  per-button `data-*` attributes
- **MODIFIED** `packages/nimbus/src/patterns/dialogs/index.ts`
  re-exports the new pattern

## Capabilities

### New Capabilities

- `nimbus-form-dialog`: a pre-composed save/cancel dialog pattern
  built on the Nimbus `Dialog` primitive, shaped for hosting a form
  in the body, with localized default action labels, loading and
  disabled states for the save action, async-aware save flow, and
  unified cancel semantics across the cancel button and ambient
  dismiss affordances

### Modified Capabilities

None — this proposal introduces a new capability only.

## Impact

- Affected specs: none modified (new capability `nimbus-form-dialog`)
- Affected code:
  - `packages/nimbus/src/patterns/dialogs/form-dialog/` (new)
  - `packages/nimbus/src/patterns/dialogs/index.ts` (export added)
- Affected dependencies: none new — composes existing `Dialog`,
  `Button`, `LoadingSpinner` primitives and reuses
  `useLocalizedStringFormatter` from `@/hooks` and
  `useControlledState` from `react-stately/useControlledState`

## Related

- Jira: FEC-436
- Parent epic: FEC-428 (Application-Components Migration to Nimbus)
- Replaces: `merchant-center-application-kit` `FormDialog` component
