## 1. Scaffold

- [x] 1.1 Create directory
      `packages/nimbus/src/patterns/dialogs/confirmation-dialog/`
- [x] 1.2 Add `export * from "./confirmation-dialog"` to
      `packages/nimbus/src/patterns/dialogs/index.ts`
      (alongside the existing `info-dialog` export)
- [x] 1.3 Create `confirmation-dialog/index.ts` barrel re-exporting
      the component and types

## 2. i18n

- [x] 2.1 Implement `confirmation-dialog.i18n.ts` exporting a
      `messages` object with two entries
      (`Nimbus.ConfirmationDialog.confirm` defaulting to
      `"Confirm"` and `Nimbus.ConfirmationDialog.cancel` defaulting
      to `"Cancel"`), mirroring the
      `packages/nimbus/src/patterns/actions/form-action-bar/form-action-bar.i18n.ts`
      shape

## 3. Implementation

- [x] 3.1 Implement `confirmation-dialog.types.ts` with
      `ConfirmationDialogProps`: `title: ReactNode`,
      `children: ReactNode`, `onConfirm: () => void`,
      `onCancel: () => void`, `isOpen?: boolean`,
      `defaultOpen?: boolean`,
      `onOpenChange?: (isOpen: boolean) => void`,
      `confirmLabel?: ReactNode`, `cancelLabel?: ReactNode`,
      `intent?: "default" | "destructive"`,
      `isConfirmDisabled?: boolean`,
      `isConfirmLoading?: boolean`, `"aria-label"?: string`. JSDoc
      every prop.
- [x] 3.2 Implement `confirmation-dialog.tsx` composing
      `Dialog.Root` (passing `isOpen`, `defaultOpen`,
      `onOpenChange`, `aria-label`, `scrollBehavior="inside"`, and
      `isDismissable` / `isKeyboardDismissDisabled` derived from
      `isConfirmLoading`), `Dialog.Content`, `Dialog.Header`
      wrapping `Dialog.Title` and `Dialog.CloseTrigger`,
      `Dialog.Body`, and `Dialog.Footer` containing the cancel
      `Button` (`variant="outline"`, before confirm in DOM order)
      and the confirm `Button` (`variant="solid"`,
      `colorPalette="primary"` for `intent="default"` or
      `colorPalette="critical"` for `intent="destructive"`).
- [x] 3.3 In `confirmation-dialog.tsx`, resolve default labels via
      `useLocalizedStringFormatter(messages)` from `@/hooks`,
      following the FormActionBar precedent
- [x] 3.4 In `confirmation-dialog.tsx`, render a
      `LoadingSpinner` (`size="2xs"`, `ml="100"`) inside the
      confirm `Button` when `isConfirmLoading` is `true`; set
      `isDisabled` on the confirm button when `isConfirmDisabled`
      OR `isConfirmLoading`; set `isDisabled` on the cancel
      button when `isConfirmLoading`
- [x] 3.5 In `confirmation-dialog.tsx`, wire `onOpenChange` so
      that any close path (cancel button click, X close-button
      click, Escape, overlay click) invokes `onCancel` first and
      then propagates the open-state change to the consumer's
      `onOpenChange` (no-op if `isConfirmLoading`)
- [x] 3.6 In `confirmation-dialog.tsx`, wire the confirm `Button`
      `onPress` to invoke `onConfirm` and then propagate
      `onOpenChange(false)` to the consumer
- [x] 3.7 Set `ConfirmationDialog.displayName = "ConfirmationDialog"`

## 4. Testing

- [x] 4.1 Write Storybook stories
      (`confirmation-dialog.stories.tsx`) with play functions
      covering: default intent (string title, default labels),
      destructive intent, custom `confirmLabel` / `cancelLabel`,
      `isConfirmDisabled` true, `isConfirmLoading` true (spinner
      visible, both buttons disabled, dismiss affordances locked),
      long scrollable body, ReactNode title with composed content,
      close via cancel button, close via X button, close via
      Escape, close via overlay click — each ambient dismiss
      asserts `onCancel` fired exactly once
- [x] 4.2 Add a play-function assertion that confirming does NOT
      invoke `onCancel`, and that cancelling does NOT invoke
      `onConfirm`
- [x] 4.3 Add a play-function assertion that, while
      `isConfirmLoading` is `true`, pressing Escape and clicking
      the overlay are no-ops (neither `onCancel` nor
      `onOpenChange` fires)
- [x] 4.4 Write consumer implementation tests
      (`confirmation-dialog.docs.spec.tsx`) covering basic
      controlled usage (default and destructive intents) suitable
      for embedding into the `.dev.mdx`

## 5. Documentation

- [x] 5.1 Create `confirmation-dialog.dev.mdx` with: import
      statement, basic usage, destructive intent example, loading
      state example, custom labels example, scrollable content
      example, accessibility section, and "Escape hatch" section
      demonstrating the equivalent manual `Dialog` + `Button`
      composition (for consumers needing custom size, custom
      dismissability, per-button `data-*` attributes, or a
      separate `onClose`-vs-`onCancel` distinction)
- [x] 5.2 In `confirmation-dialog.dev.mdx`, include a "migrating
      from `merchant-center-application-kit`" note that explicitly
      flags the `onClose` + `onCancel` unification onto a single
      `onCancel`, the dropped `dataAttributes*` props (use the
      escape hatch), and the dropped `size` prop (use the escape
      hatch)
- [x] 5.3 Create `confirmation-dialog.mdx` with frontmatter
      `related-components: [Dialog, Button]` and
      `menu: [Patterns, Dialogs, Confirmation dialog]`
- [x] 5.4 Verify the generated PropsTable correctly reflects the
      flat thirteen-prop API

## 6. Validation

- [x] 6.1 `pnpm --filter @commercetools/nimbus typecheck` passes
- [x] 6.2 `pnpm --filter @commercetools/nimbus build` succeeds
- [x] 6.3 Storybook stories render with all play functions passing
      (`pnpm test:storybook`)
- [x] 6.4 Consumer implementation tests pass (`pnpm test`)
- [x] 6.5 `openspec validate confirmation-dialog-pattern --strict`
      passes
- [x] 6.6 Add a changeset under `.changeset/` describing the new
      `ConfirmationDialog` pattern from the consumer perspective
      (per the changeset conventions)
