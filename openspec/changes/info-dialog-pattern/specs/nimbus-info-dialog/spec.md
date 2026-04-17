## ADDED Requirements

### Requirement: Component Export

The InfoDialog pattern SHALL export as a single flat component (not a
compound namespace) from `@commercetools/nimbus`.

#### Scenario: Import surface

- **WHEN** a consumer imports from `@commercetools/nimbus`
- **THEN** SHALL expose an `InfoDialog` component
- **AND** SHALL expose an `InfoDialogProps` type

#### Scenario: Location

- **WHEN** the source is inspected
- **THEN** the component SHALL reside at
  `packages/nimbus/src/patterns/dialogs/info-dialog/`
- **AND** SHALL be re-exported through
  `packages/nimbus/src/patterns/dialogs/index.ts`
- **AND** that file SHALL be re-exported through
  `packages/nimbus/src/patterns/index.ts`

### Requirement: Flat Props API

The InfoDialog component SHALL accept only four props.

#### Scenario: Required props

- **WHEN** InfoDialog is rendered
- **THEN** SHALL require `title` typed as `ReactNode`
- **AND** SHALL require `children` typed as `ReactNode`

#### Scenario: Optional props

- **WHEN** InfoDialog is rendered
- **THEN** MAY accept `isOpen` typed as `boolean`
- **AND** MAY accept `onOpenChange` typed as `(isOpen: boolean) => void`

#### Scenario: No additional configuration props

- **WHEN** the `InfoDialogProps` type is inspected
- **THEN** SHALL NOT declare a `size` prop
- **AND** SHALL NOT declare a `zIndex` prop
- **AND** SHALL NOT declare a `getParentSelector` or other portal prop
- **AND** SHALL NOT declare an `aria-label` prop
- **AND** SHALL NOT expose a `TextTitle` sub-component

### Requirement: Internal Composition

The InfoDialog SHALL be implemented by composing the Nimbus `Dialog`
primitive rather than duplicating its logic.

#### Scenario: Composed parts

- **WHEN** InfoDialog renders
- **THEN** SHALL wrap the output in `Dialog.Root`
- **AND** SHALL use `Dialog.Content` for the dialog surface
- **AND** SHALL use `Dialog.Header` containing `Dialog.Title` for the
  heading area
- **AND** SHALL use `Dialog.CloseTrigger` for the close button in the
  header
- **AND** SHALL use `Dialog.Body` for the content area
- **AND** SHALL NOT render a `Dialog.Footer`

#### Scenario: Prop forwarding

- **WHEN** InfoDialog receives `isOpen` or `onOpenChange`
- **THEN** SHALL forward those values to `Dialog.Root`

### Requirement: Controlled Open State

The InfoDialog SHALL reflect its open state through the underlying Dialog
primitive.

#### Scenario: Controlled open

- **WHEN** `isOpen` is `true`
- **THEN** the dialog SHALL be visible

#### Scenario: Controlled close

- **WHEN** the user triggers any close affordance
- **THEN** SHALL invoke `onOpenChange(false)`

#### Scenario: Opening

- **WHEN** `isOpen` transitions from `false` to `true`
- **THEN** focus SHALL move into the dialog
- **AND** focus SHALL be trapped within the dialog

#### Scenario: Closing

- **WHEN** `isOpen` transitions from `true` to `false`
- **THEN** focus SHALL return to the element that was focused before the
  dialog opened

### Requirement: Close Affordances

Because the InfoDialog has no footer actions, it SHALL close via multiple
user actions.

#### Scenario: Close button

- **WHEN** the user clicks the close button in the header
- **THEN** SHALL invoke `onOpenChange(false)`

#### Scenario: Escape key

- **WHEN** the user presses Escape while the dialog is open
- **THEN** SHALL invoke `onOpenChange(false)`

#### Scenario: Overlay click

- **WHEN** the user clicks outside the dialog content (on the overlay)
- **THEN** SHALL invoke `onOpenChange(false)`

### Requirement: Title Rendering

The InfoDialog SHALL render the `title` prop as the accessible heading
of the dialog.

#### Scenario: String title

- **WHEN** `title` is a string
- **THEN** SHALL render it inside `Dialog.Title`
- **AND** SHALL expose the string as the accessible name of the dialog

#### Scenario: ReactNode title

- **WHEN** `title` is a React element (e.g. composed markup with an icon
  or badge alongside heading text)
- **THEN** SHALL render the element inside `Dialog.Title`

### Requirement: Content Rendering

The InfoDialog SHALL render `children` inside the dialog body with
scrolling handled by the underlying Dialog primitive.

#### Scenario: Short content

- **WHEN** `children` fit within the dialog viewport
- **THEN** SHALL render without a scrollbar

#### Scenario: Long content

- **WHEN** `children` exceed the available viewport height
- **THEN** the body SHALL scroll
- **AND** the header SHALL remain visible at the top of the dialog

### Requirement: Accessibility

By virtue of composing the Nimbus `Dialog` primitive, InfoDialog SHALL
meet WCAG 2.1 AA dialog requirements.

#### Scenario: Dialog role

- **WHEN** the dialog is open
- **THEN** SHALL expose `role="dialog"` to assistive technology

#### Scenario: Accessible name

- **WHEN** `title` is a string
- **THEN** the dialog's accessible name SHALL be that string
- **AND** no additional `aria-label` SHALL be required from the consumer

### Requirement: Developer Documentation

The pattern SHALL ship with developer-facing documentation that covers
both the flat API and an escape hatch for advanced customization.

#### Scenario: Frontmatter

- **WHEN** the `.mdx` file is read
- **THEN** SHALL declare `related-components: [Dialog]`
- **AND** SHALL declare `menu: [Patterns, Dialogs, Info dialog]`

#### Scenario: Escape hatch section

- **WHEN** the `.dev.mdx` file is rendered
- **THEN** SHALL include a section demonstrating the equivalent manual
  `Dialog` composition
- **AND** SHALL guide consumers to drop down to `Dialog` when they need
  a non-default size, a custom dismissability behaviour, or a custom
  accessible label

#### Scenario: API reference

- **WHEN** the `.dev.mdx` renders the PropsTable
- **THEN** SHALL list exactly four props (`title`, `isOpen`,
  `onOpenChange`, `children`) with their types and JSDoc
