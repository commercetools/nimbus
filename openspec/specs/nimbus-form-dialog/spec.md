# nimbus-form-dialog Specification

## Purpose
TBD - created by archiving change form-dialog-pattern. Update Purpose after archive.
## Requirements
### Requirement: Component Export

The FormDialog pattern SHALL export as a single flat component (not
a compound namespace) from `@commercetools/nimbus`.

#### Scenario: Import surface

- **WHEN** a consumer imports from `@commercetools/nimbus`
- **THEN** SHALL expose a `FormDialog` component
- **AND** SHALL expose a `FormDialogProps` type

#### Scenario: Location

- **WHEN** the source is inspected
- **THEN** the component SHALL reside at
  `packages/nimbus/src/patterns/dialogs/form-dialog/`
- **AND** SHALL be re-exported through
  `packages/nimbus/src/patterns/dialogs/index.ts`
- **AND** that file SHALL be re-exported through
  `packages/nimbus/src/patterns/index.ts`

### Requirement: Flat Props API

The FormDialog component SHALL accept a small, flat set of props
that together cover the common form-in-a-dialog case.

#### Scenario: Required props

- **WHEN** FormDialog is rendered
- **THEN** SHALL require `title` typed as `ReactNode`
- **AND** SHALL require `children` typed as `ReactNode`
- **AND** SHALL require `onSave` typed as
  `() => void | Promise<void>`
- **AND** SHALL require `onCancel` typed as `() => void`

#### Scenario: Optional open-state props

- **WHEN** FormDialog is rendered
- **THEN** MAY accept `isOpen` typed as `boolean` for controlled
  usage
- **AND** MAY accept `defaultOpen` typed as `boolean` for
  uncontrolled usage
- **AND** MAY accept `onOpenChange` typed as
  `(isOpen: boolean) => void`

#### Scenario: Optional label props

- **WHEN** FormDialog is rendered
- **THEN** MAY accept `saveLabel` typed as `ReactNode` to override
  the default localized save label
- **AND** MAY accept `cancelLabel` typed as `ReactNode` to override
  the default localized cancel label

#### Scenario: Optional state and accessibility props

- **WHEN** FormDialog is rendered
- **THEN** MAY accept `isSaveDisabled` typed as `boolean`
- **AND** MAY accept `isSaveLoading` typed as `boolean`
- **AND** MAY accept `aria-label` typed as `string` to override the
  accessible name derived from `title`

### Requirement: Internal Composition

The FormDialog SHALL be implemented by composing the Nimbus `Dialog`
primitive and `Button` primitive rather than duplicating their
logic.

#### Scenario: Composed parts

- **WHEN** FormDialog renders
- **THEN** SHALL wrap the output in `Dialog.Root`
- **AND** SHALL use `Dialog.Content` for the dialog surface
- **AND** SHALL use `Dialog.Header` containing `Dialog.Title` for
  the heading area
- **AND** SHALL use `Dialog.CloseTrigger` for the close button in
  the header
- **AND** SHALL use `Dialog.Body` for the form content area
- **AND** SHALL use `Dialog.Footer` containing the cancel `Button`
  and the save `Button` in that DOM order
- **AND** SHALL render the cancel `Button` with `variant="outline"`
- **AND** SHALL render the save `Button` with `variant="solid"` and
  `colorPalette="primary"`

#### Scenario: Prop forwarding

- **WHEN** FormDialog receives `isOpen`, `defaultOpen`,
  `onOpenChange`, or `aria-label`
- **THEN** SHALL forward those values to `Dialog.Root`

### Requirement: Localized Default Button Labels

The FormDialog SHALL provide localized default labels for the save
and cancel buttons via the Nimbus i18n system.

#### Scenario: Default save label

- **WHEN** `saveLabel` is omitted
- **THEN** the save button SHALL render the localized message with
  id `Nimbus.FormDialog.save` (default: `"Save"`)

#### Scenario: Default cancel label

- **WHEN** `cancelLabel` is omitted
- **THEN** the cancel button SHALL render the localized message
  with id `Nimbus.FormDialog.cancel` (default: `"Cancel"`)

#### Scenario: Override with save label

- **WHEN** `saveLabel` is provided
- **THEN** the save button SHALL render `saveLabel` instead of the
  default localized message

#### Scenario: Override with cancel label

- **WHEN** `cancelLabel` is provided
- **THEN** the cancel button SHALL render `cancelLabel` instead of
  the default localized message

### Requirement: Open State

The FormDialog SHALL reflect its open state through the underlying
Dialog primitive and support both controlled and uncontrolled
usage.

#### Scenario: Controlled open

- **WHEN** `isOpen` is `true`
- **THEN** the dialog SHALL be visible

#### Scenario: Uncontrolled open

- **WHEN** `isOpen` is omitted and `defaultOpen` is `true`
- **THEN** the dialog SHALL be visible on mount
- **AND** SHALL close when the user triggers any close affordance
  without requiring the consumer to manage state

#### Scenario: Opening

- **WHEN** `isOpen` transitions from `false` to `true`
- **THEN** focus SHALL move into the dialog
- **AND** focus SHALL be trapped within the dialog

#### Scenario: Closing

- **WHEN** `isOpen` transitions from `true` to `false`
- **THEN** focus SHALL return to the element that was focused
  before the dialog opened

### Requirement: Save Action

The FormDialog SHALL invoke `onSave` when the user explicitly
saves.

#### Scenario: Save button click with synchronous handler

- **WHEN** the user clicks the save button (and `isSaveDisabled` is
  not `true` and `isSaveLoading` is not `true`)
- **AND** `onSave` returns `void` (does not return a `Promise`)
- **THEN** SHALL invoke `onSave`
- **AND** SHALL invoke `onOpenChange(false)` synchronously

#### Scenario: Save button click with async handler that fulfills

- **WHEN** the user clicks the save button (and `isSaveDisabled` is
  not `true` and `isSaveLoading` is not `true`)
- **AND** `onSave` returns a `Promise` that fulfills
- **THEN** SHALL invoke `onSave`
- **AND** SHALL keep the dialog open while the promise is pending
- **AND** SHALL invoke `onOpenChange(false)` after the promise
  fulfills

#### Scenario: Save button click with async handler that rejects

- **WHEN** the user clicks the save button (and `isSaveDisabled` is
  not `true` and `isSaveLoading` is not `true`)
- **AND** `onSave` returns a `Promise` that rejects
- **THEN** SHALL invoke `onSave`
- **AND** SHALL keep the dialog open while the promise is pending
- **AND** SHALL leave the dialog open after the promise rejects
- **AND** SHALL NOT invoke `onOpenChange(false)`

#### Scenario: Save button disabled

- **WHEN** `isSaveDisabled` is `true`
- **THEN** the save `Button` SHALL be `isDisabled`
- **AND** clicking it SHALL NOT invoke `onSave`

#### Scenario: Save action does not invoke onCancel

- **WHEN** the user clicks the save button
- **THEN** SHALL NOT invoke `onCancel`

### Requirement: Cancel Affordances

The FormDialog SHALL invoke `onCancel` when the user cancels via
any affordance — the cancel button, the close button in the header,
the Escape key, or a click on the overlay.

#### Scenario: Cancel button click

- **WHEN** the user clicks the cancel button (and `isSaveLoading`
  is not `true`)
- **THEN** SHALL invoke `onCancel`
- **AND** SHALL invoke `onOpenChange(false)`

#### Scenario: Close button click

- **WHEN** the user clicks the close button in the header (and
  `isSaveLoading` is not `true`)
- **THEN** SHALL invoke `onCancel`
- **AND** SHALL invoke `onOpenChange(false)`

#### Scenario: Escape key

- **WHEN** the user presses Escape while the dialog is open (and
  `isSaveLoading` is not `true`)
- **THEN** SHALL invoke `onCancel`
- **AND** SHALL invoke `onOpenChange(false)`

#### Scenario: Overlay click

- **WHEN** the user clicks outside the dialog content on the
  overlay (and `isSaveLoading` is not `true`)
- **THEN** SHALL invoke `onCancel`
- **AND** SHALL invoke `onOpenChange(false)`

### Requirement: Loading State Lockout

The FormDialog SHALL lock all interactive affordances while the
save action is in flight to prevent races between save and cancel
and to prevent inflight-data-loss.

#### Scenario: Save button shows spinner

- **WHEN** `isSaveLoading` is `true`
- **THEN** the save `Button` SHALL render a `LoadingSpinner` next
  to its label

#### Scenario: Save button disabled while loading

- **WHEN** `isSaveLoading` is `true`
- **THEN** the save `Button` SHALL be `isDisabled`
- **AND** clicking it SHALL NOT invoke `onSave`

#### Scenario: Cancel button disabled while loading

- **WHEN** `isSaveLoading` is `true`
- **THEN** the cancel `Button` SHALL be `isDisabled`
- **AND** clicking it SHALL NOT invoke `onCancel`

#### Scenario: Dismiss affordances disabled while loading

- **WHEN** `isSaveLoading` is `true`
- **THEN** pressing Escape SHALL NOT invoke `onCancel` or close
  the dialog
- **AND** clicking the overlay SHALL NOT invoke `onCancel` or
  close the dialog
- **AND** clicking the close button in the header SHALL NOT invoke
  `onCancel` or close the dialog

### Requirement: Title Rendering

The FormDialog SHALL render the `title` prop as the accessible
heading of the dialog.

#### Scenario: String title

- **WHEN** `title` is a string
- **THEN** SHALL render it inside `Dialog.Title`
- **AND** SHALL expose the string as the accessible name of the
  dialog

#### Scenario: ReactNode title

- **WHEN** `title` is a React element (e.g. composed markup with an
  icon or badge alongside heading text)
- **THEN** SHALL render the element inside `Dialog.Title`

### Requirement: Content Rendering

The FormDialog SHALL render `children` (the form content) inside the
dialog body with scrolling handled by the underlying Dialog
primitive.

#### Scenario: Short content

- **WHEN** `children` fit within the dialog viewport
- **THEN** SHALL render without a scrollbar

#### Scenario: Long content

- **WHEN** `children` exceed the available viewport height
- **THEN** the body SHALL scroll
- **AND** the header SHALL remain visible at the top of the dialog
- **AND** the footer SHALL remain visible at the bottom of the
  dialog

### Requirement: Accessibility

The FormDialog SHALL meet WCAG 2.1 AA dialog requirements by virtue
of composing the Nimbus `Dialog` primitive.

#### Scenario: Dialog role

- **WHEN** the dialog is open
- **THEN** SHALL expose `role="dialog"` to assistive technology

#### Scenario: Accessible name

- **WHEN** `title` is a string
- **THEN** the dialog's accessible name SHALL be that string
- **AND** no additional `aria-label` SHALL be required from the
  consumer

#### Scenario: Accessible name override

- **WHEN** `aria-label` is provided
- **THEN** it SHALL be forwarded to `Dialog.Root` and SHALL serve
  as the dialog's accessible name, overriding the name derived from
  `title`

#### Scenario: Keyboard navigation

- **WHEN** the dialog is open and `isSaveLoading` is not `true`
- **THEN** the user SHALL be able to reach focusable form
  controls, the cancel button, and the save button via Tab
- **AND** SHALL be able to activate the cancel or save button
  with the Enter or Space key

### Requirement: Developer Documentation

The pattern SHALL ship with developer-facing documentation that
covers both the flat API and an escape hatch for advanced
customization.

#### Scenario: Frontmatter

- **WHEN** the `.mdx` file is read
- **THEN** SHALL declare `related-components: [Dialog, Button]`
- **AND** SHALL declare `menu: [Patterns, Dialogs, Form dialog]`

#### Scenario: Escape hatch section

- **WHEN** the `.dev.mdx` file is rendered
- **THEN** SHALL include a section demonstrating the equivalent
  manual `Dialog` + `Button` composition
- **AND** SHALL guide consumers to drop down to `Dialog` when they
  need a non-default size, custom dismissability behaviour,
  per-button `data-*` attributes, or a non-form body shape

#### Scenario: Migration guidance

- **WHEN** the `.dev.mdx` file is rendered
- **THEN** SHALL include a "migrating from
  `merchant-center-application-kit`" note explaining that
  `onClose` and `onCancel` are unified onto a single `onCancel`
- **AND** SHALL document that the form's submit semantics are
  driven by the consumer's `onSave` callback rather than a native
  `<form onSubmit>` (the pattern does not wrap children in a
  `<form>` element)

#### Scenario: API reference

- **WHEN** the `.dev.mdx` renders the PropsTable
- **THEN** SHALL list the public props (`title`, `children`,
  `onSave`, `onCancel`, `isOpen`, `defaultOpen`, `onOpenChange`,
  `saveLabel`, `cancelLabel`, `isSaveDisabled`, `isSaveLoading`,
  `aria-label`) with their types and JSDoc

