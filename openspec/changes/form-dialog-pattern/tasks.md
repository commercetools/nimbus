## 1. Scaffold

- [x] 1.1 Create directory `packages/nimbus/src/patterns/dialogs/form-dialog/`
- [x] 1.2 Add `export * from "./form-dialog"` to
      `packages/nimbus/src/patterns/dialogs/index.ts` (alongside the existing
      `info-dialog` and `confirmation-dialog` exports)
- [x] 1.3 Create `form-dialog/index.ts` barrel re-exporting the component and
      types

## 2. i18n

- [x] 2.1 Implement `form-dialog.i18n.ts` exporting a `messages` object with two
      entries (`Nimbus.FormDialog.save` defaulting to `"Save"` and
      `Nimbus.FormDialog.cancel` defaulting to `"Cancel"`)
- [x] 2.2 Run `pnpm extract-intl` from repo root to extract the new messages,
      propagate them into every locale file under `packages/i18n/data/`, compile
      per-locale files at
      `packages/nimbus/src/patterns/dialogs/form-dialog/intl/*.ts`, and generate
      `form-dialog.messages.ts`

## 3. Implementation

- [x] 3.1 Implement `form-dialog.types.ts` with `FormDialogProps`:
      `title: ReactNode`, `children: ReactNode`,
      `onSave: () => void | Promise<void>`, `onCancel: () => void`,
      `isOpen?: boolean`, `defaultOpen?: boolean`,
      `onOpenChange?: (isOpen: boolean) => void`, `saveLabel?: ReactNode`,
      `cancelLabel?: ReactNode`, `isSaveDisabled?: boolean`,
      `isSaveLoading?: boolean`, `"aria-label"?: string`. JSDoc every prop.
- [x] 3.2 Implement `form-dialog.tsx` composing `Dialog.Root` (passing `isOpen`,
      `onOpenChange`, `aria-label`, `scrollBehavior="inside"`, and
      `isDismissable` / `isKeyboardDismissDisabled` derived from
      `isSaveLoading`), `Dialog.Content`, `Dialog.Header` wrapping
      `Dialog.Title` and `Dialog.CloseTrigger` (with
      `isDisabled={isSaveLoading}`), `Dialog.Body`, and `Dialog.Footer`
      containing the cancel `Button` (`variant="outline"`, before save in DOM
      order) and the save `Button` (`variant="solid"`,
      `colorPalette="primary"`).
- [x] 3.3 In `form-dialog.tsx`, internalize open state via
      `useControlledState(isOpen, defaultOpen ?? false, onOpenChange)` from
      `react-stately/useControlledState` to avoid the `slot="close"` race
      where the slot's auto-close and the button's `onPress` both fire
      `onOpenChange`, double-firing the consumer's `onCancel` handler
- [x] 3.4 In `form-dialog.tsx`, resolve default labels via
      `useLocalizedStringFormatter(formDialogMessagesStrings)` from `@/hooks`
- [x] 3.5 In `form-dialog.tsx`, render a `LoadingSpinner` (`size="2xs"`,
      `ml="100"`) inside the save `Button` when `isSaveLoading` is `true`; set
      `isDisabled` on the save button when `isSaveDisabled` OR `isSaveLoading`;
      set `isDisabled` on the cancel button when `isSaveLoading`
- [x] 3.6 In `form-dialog.tsx`, wire the cancel button's `onPress` to invoke
      `onCancel` and then `setOpen(false)` (no-op if `isSaveLoading`)
- [x] 3.7 In `form-dialog.tsx`, wire the save button's `onPress` to invoke
      `onSave` and, if the return value is a `Promise`, `await` it before
      invoking `setOpen(false)` — leave the dialog open on rejection (try/catch
      around the `await`)
- [x] 3.8 In `form-dialog.tsx`, wire `Dialog.Root`'s `onOpenChange` so any
      ambient close path (Escape, overlay, X close button) invokes `onCancel`
      first and then `setOpen(newOpen)` (no-op if `isSaveLoading`)
- [x] 3.9 Set `FormDialog.displayName = "FormDialog"`

## 4. Testing

- [x] 4.1 Write Storybook stories (`form-dialog.stories.tsx`) with play
      functions covering: basic open/close (string title, default labels, simple
      form body), custom `saveLabel` / `cancelLabel`, `isSaveDisabled` true
      (cancel still enabled, save no-op on click), `isSaveLoading` true (spinner
      visible, both buttons disabled, dismiss affordances locked — Escape and
      overlay click are no-ops, X is disabled), long scrollable form body,
      ReactNode title with composed content
- [x] 4.2 Add stories `AsyncSave` and `AsyncSaveRejection` exercising the
      deferred-close path: a save handler returning a Promise that fulfills
      (dialog closes) and one that rejects (dialog stays open)
- [x] 4.3 Add play-function assertions that saving does NOT invoke `onCancel`,
      and that cancelling does NOT invoke `onSave`
- [x] 4.4 Add a play-function assertion that, while `isSaveLoading` is `true`,
      pressing Escape and clicking the overlay are no-ops (neither `onCancel`
      nor `onOpenChange` fires)
- [x] 4.5 Write consumer implementation tests (`form-dialog.docs.spec.tsx`)
      covering basic controlled usage with a form body, suitable for embedding
      into the `.dev.mdx`

## 5. Documentation

- [x] 5.1 Create `form-dialog.dev.mdx` with: import statement, basic usage with
      a form body, save loading example, save disabled example, custom labels
      example, scrollable form example, accessibility section, and "Escape
      hatch" section demonstrating the equivalent manual `Dialog` + `Button`
      composition (for consumers needing custom size, custom dismissability,
      per-button `data-*` attributes, or a separate `onClose`-vs-`onCancel`
      distinction)
- [x] 5.2 In `form-dialog.dev.mdx`, include an "Async save" section that teaches
      the Promise-aware contract and how to keep the dialog open on rejection
- [x] 5.3 In `form-dialog.dev.mdx`, include a "migrating from
      `merchant-center-application-kit`" note that explicitly flags the
      `onClose` + `onCancel` unification onto a single `onCancel`, the dropped
      per-button `data-*` props (use the escape hatch), the dropped `size` prop
      (use the escape hatch), and that the pattern does NOT wrap children in a
      `<form>` (consumers retain submit-semantics control)
- [x] 5.4 Create `form-dialog.mdx` with frontmatter
      `related-components: [Dialog, Button]` and
      `menu: [Patterns, Dialogs, Form dialog]`
- [x] 5.5 Verify the generated PropsTable correctly reflects the flat
      twelve-prop API

## 6. Validation

- [x] 6.1 `pnpm --filter @commercetools/nimbus typecheck` passes
- [x] 6.2 `pnpm --filter @commercetools/nimbus build` succeeds
- [x] 6.3 Storybook stories render with all play functions passing
      (`pnpm test:storybook:dev packages/nimbus/src/patterns/dialogs/form-dialog/form-dialog.stories.tsx`)
- [x] 6.4 Consumer implementation tests pass
      (`pnpm test:dev packages/nimbus/src/patterns/dialogs/form-dialog/form-dialog.docs.spec.tsx`)
- [x] 6.5 `pnpm exec openspec validate form-dialog-pattern --strict` passes
- [x] 6.6 Add a changeset under `.changeset/` describing the new `FormDialog`
      pattern from the consumer perspective (per the changeset conventions)
