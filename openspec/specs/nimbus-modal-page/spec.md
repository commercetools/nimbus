# nimbus-modal-page Specification

## Purpose
TBD - created by archiving change add-modal-page-component. Update Purpose after archive.
## Requirements
### Requirement: Namespace Structure

The component SHALL export as a compound component namespace.

#### Scenario: Component parts

- **WHEN** ModalPage is imported
- **THEN** SHALL provide ModalPage.Root as modal page container
- **AND** SHALL provide ModalPage.TopBar as breadcrumb navigation bar
- **AND** SHALL provide ModalPage.Header as header section
- **AND** SHALL provide ModalPage.Title as page title heading
- **AND** SHALL provide ModalPage.Subtitle as optional subtitle
- **AND** SHALL provide ModalPage.Actions as action button container
- **AND** SHALL provide ModalPage.TabNav as tab navigation container
- **AND** SHALL provide ModalPage.Content as scrollable content area
- **AND** SHALL provide ModalPage.Footer as optional footer section
- **AND** Root SHALL be first property in namespace

#### Scenario: Package export

- **WHEN** ModalPage is imported from @commercetools/nimbus
- **THEN** SHALL export ModalPage namespace object
- **AND** SHALL export all prop types
- **AND** SHALL export underscore-prefixed individual parts

### Requirement: Controlled-Only State

The Root component SHALL require explicit open state management.

#### Scenario: Controlled open state

- **WHEN** ModalPage.Root is rendered
- **THEN** SHALL require `isOpen` boolean prop
- **AND** SHALL require `onClose` callback prop
- **AND** SHALL NOT support uncontrolled or defaultOpen mode

#### Scenario: Opening

- **WHEN** `isOpen` changes from false to true
- **THEN** SHALL display the modal page as a fullscreen overlay

#### Scenario: Closing

- **WHEN** `isOpen` changes from true to false
- **THEN** SHALL hide the modal page with an exit animation
- **AND** SHALL return focus to the element that was focused before opening

### Requirement: Fullscreen Overlay

The Root component SHALL render as a near-fullscreen overlay from the right
edge of the viewport.

#### Scenario: Overlay rendering

- **WHEN** ModalPage is open
- **THEN** SHALL cover nearly the entire viewport width
- **AND** SHALL cover the full viewport height
- **AND** SHALL display a backdrop behind the modal page

#### Scenario: Custom width

- **WHEN** consumer provides a `width` prop on ModalPage.Root
- **THEN** SHALL use the provided width for the modal page panel
- **AND** SHALL override the default near-fullscreen width

#### Scenario: Backdrop click disabled

- **WHEN** user clicks the backdrop area
- **THEN** SHALL NOT close the modal page
- **AND** this prevents accidental data loss on full-page forms

### Requirement: TopBar Navigation

The TopBar SHALL provide breadcrumb navigation with a back button.

#### Scenario: Breadcrumb rendering

- **WHEN** TopBar renders
- **THEN** SHALL display a back button
- **AND** SHALL display the `previousPathLabel` text
- **AND** SHALL display a separator between labels
- **AND** SHALL display the `currentPathLabel` text

#### Scenario: Back button closes modal

- **WHEN** user clicks the back button
- **THEN** SHALL trigger `onClose`

#### Scenario: Back button auto-focus

- **WHEN** ModalPage opens
- **THEN** the back button SHALL receive focus automatically

#### Scenario: Back button accessible name

- **WHEN** back button renders
- **THEN** SHALL have an i18n-translated label referencing the
  `previousPathLabel` (e.g. "Go back to Products")

#### Scenario: Current path accessibility

- **WHEN** current path label renders
- **THEN** SHALL be marked as the current page for assistive technology

#### Scenario: Separator accessibility

- **WHEN** breadcrumb separator renders
- **THEN** SHALL be hidden from assistive technology

#### Scenario: Previous path label accessibility

- **WHEN** previousPathLabel text renders adjacent to the back button
- **THEN** SHALL be hidden from assistive technology
- **AND** SHALL remain visible for sighted users
- **AND** the back button's aria-label already conveys this information

### Requirement: Header Layout

The Header SHALL arrange title, subtitle, actions, and optional tab
navigation.

#### Scenario: Header structure

- **WHEN** Header renders with Title and Actions
- **THEN** Title and Actions SHALL appear on the same row
- **AND** Title SHALL take available horizontal space
- **AND** Actions SHALL be end-aligned
- **AND** Actions SHALL span both the title and subtitle rows

#### Scenario: Subtitle placement

- **WHEN** Subtitle is present
- **THEN** SHALL appear below the Title
- **AND** SHALL span the title column only (not the actions column)

#### Scenario: Visual separation

- **WHEN** Header renders
- **THEN** SHALL display a bottom border separating it from content
- **AND** the border SHALL span the full width of the modal page

#### Scenario: TabNav present

- **WHEN** TabNav is placed inside Header
- **THEN** TabNav SHALL appear below the title row at full width
- **AND** the header bottom padding SHALL be removed so TabNav sits flush
  with the border

### Requirement: Footer Layout

The Footer SHALL provide a container for action buttons with automatic
spacing.

#### Scenario: Footer rendering

- **WHEN** Footer renders with button children
- **THEN** SHALL display buttons in a horizontal row
- **AND** SHALL automatically space buttons apart
- **AND** consumers SHALL NOT need a wrapper to achieve button spacing

#### Scenario: Visual separation

- **WHEN** Footer renders
- **THEN** SHALL display a top border separating it from content
- **AND** the border SHALL span the full width of the modal page

#### Scenario: Footer is optional

- **WHEN** ModalPage renders without Footer
- **THEN** footer space SHALL collapse
- **AND** content SHALL fill the remaining space

### Requirement: Content Area

The Content SHALL provide a scrollable area for page content.

#### Scenario: Content scrolling

- **WHEN** content exceeds the available height
- **THEN** Content SHALL scroll independently
- **AND** TopBar, Header, and Footer SHALL remain pinned

#### Scenario: Content is plain container

- **WHEN** Content receives children
- **THEN** SHALL render children directly without additional layout wrapping
- **AND** consumers MAY compose PageContent inside Content when column
  layouts are needed

### Requirement: Title as Accessible Name

The Title SHALL provide the accessible name for the dialog.

#### Scenario: Dialog labelling

- **WHEN** Title renders inside Header
- **THEN** the dialog SHALL be labelled by the Title text
- **AND** screen readers SHALL announce the Title when the dialog opens

#### Scenario: Heading level

- **WHEN** Title renders
- **THEN** SHALL render as an h2 heading element

### Requirement: Subtitle as Accessible Description

The Subtitle SHALL provide the accessible description for the dialog.

#### Scenario: Dialog description

- **WHEN** Subtitle renders inside Header
- **THEN** the dialog SHALL be described by the Subtitle text via
  `aria-describedby`
- **AND** screen readers SHALL announce the Subtitle as the dialog description

#### Scenario: No subtitle

- **WHEN** Subtitle is not present
- **THEN** the dialog SHALL have no `aria-describedby`

### Requirement: Dismissal Methods

The component SHALL provide multiple ways to close the modal page.

#### Scenario: Back button dismissal

- **WHEN** user clicks the back button in TopBar
- **THEN** SHALL call `onClose`

#### Scenario: Close button dismissal

- **WHEN** any button with `slot="close"` is clicked inside the modal
- **THEN** SHALL call `onClose`

#### Scenario: Escape key dismissal

- **WHEN** user presses Escape while the modal is open
- **THEN** SHALL call `onClose`
- **AND** Escape key dismissal SHALL always be enabled

#### Scenario: Stacked modal Escape

- **WHEN** multiple ModalPages are stacked and user presses Escape
- **THEN** SHALL close only the topmost modal page

### Requirement: Focus Management

The component SHALL manage focus per WCAG 2.1 AA standards.

#### Scenario: Focus on open

- **WHEN** ModalPage opens
- **THEN** focus SHALL move to the back button in TopBar

#### Scenario: Focus trap

- **WHEN** ModalPage is open
- **THEN** Tab and Shift+Tab SHALL cycle within the modal only
- **AND** focus SHALL NOT escape to the page behind

#### Scenario: Focus on close

- **WHEN** ModalPage closes
- **THEN** focus SHALL return to the element that triggered the opening

#### Scenario: Stacked modal focus

- **WHEN** a second ModalPage opens on top of the first
- **THEN** focus SHALL be trapped in the topmost page
- **AND** the parent page SHALL be inert
- **WHEN** the second page closes
- **THEN** focus SHALL return to its trigger inside the first page

### Requirement: Dialog Accessibility

The component SHALL implement the ARIA dialog pattern.

#### Scenario: Dialog role

- **WHEN** ModalPage renders
- **THEN** SHALL have `role="dialog"`
- **AND** SHALL have `aria-modal="true"`

#### Scenario: Accessible name

- **WHEN** ModalPage.Title is present
- **THEN** the dialog SHALL be labelled by the Title content

### Requirement: Internationalization

The component SHALL support i18n for user-facing text.

#### Scenario: Back button label

- **WHEN** TopBar renders
- **THEN** the back button SHALL use a localized label that includes
  the `previousPathLabel`
- **AND** SHALL support multiple locales

### Requirement: Ref Forwarding

The component SHALL forward refs to DOM elements.

#### Scenario: Ref forwarding

- **WHEN** ref prop is provided on any sub-component
- **THEN** SHALL forward ref to the corresponding DOM element

### Requirement: Display Names

The component SHALL provide display names for debugging.

#### Scenario: Display name setting

- **WHEN** ModalPage sub-components are defined
- **THEN** each SHALL set displayName matching `ModalPage.<Part>`

