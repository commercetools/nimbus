# Specification: Dialog Component

## Overview

The Dialog component provides an accessible modal dialog overlay following ARIA dialog pattern with focus management and keyboard interaction.

**Component:** `Dialog` (compound namespace)
**Package:** `@commercetools/nimbus`
**Type:** Compound component (multi-slot recipe)
**React Aria:** Uses `Dialog` and `Modal` from react-aria-components
**i18n:** 1 message (closeDialog)

## Compound Component Architecture

### Requirement: Namespace Structure
The component SHALL export as compound component namespace.

#### Scenario: Component parts
- **WHEN** Dialog is imported
- **THEN** SHALL provide Dialog.Root as modal wrapper
- **AND** SHALL provide Dialog.Trigger for open button
- **AND** SHALL provide Dialog.Content for dialog container
- **AND** SHALL provide Dialog.Header for title section
- **AND** SHALL provide Dialog.Body for main content
- **AND** SHALL provide Dialog.Footer for actions
- **AND** SHALL provide Dialog.CloseButton for dismiss button
- **AND** Root SHALL be first property in namespace

## Dialog Opening

### Requirement: Trigger Control
The component SHALL provide trigger for opening dialog.

#### Scenario: Trigger interaction
- **WHEN** user clicks Dialog.Trigger
- **THEN** SHALL open dialog overlay
- **AND** SHALL trap focus within dialog
- **AND** SHALL prevent body scroll
- **AND** SHALL set aria-expanded="true" on trigger

#### Scenario: Programmatic open
- **WHEN** isOpen prop is set to true
- **THEN** SHALL open dialog
- **AND** SHALL call onOpenChange when opened
- **AND** SHALL support controlled mode

## Focus Management

### Requirement: Focus Trap
The component SHALL manage focus appropriately per nimbus-core standards.

#### Scenario: Opening focus
- **WHEN** dialog opens
- **THEN** SHALL move focus into dialog
- **AND** SHALL focus first focusable element
- **OR** element specified by autoFocus prop
- **AND** SHALL trap Tab key within dialog

#### Scenario: Focus cycling
- **WHEN** user presses Tab at last focusable element
- **THEN** SHALL cycle focus to first element
- **WHEN** user presses Shift+Tab at first element
- **THEN** SHALL cycle focus to last element

#### Scenario: Closing focus
- **WHEN** dialog closes
- **THEN** SHALL return focus to trigger element
- **OR** element that had focus before opening
- **AND** focus SHALL be visible

## Dialog Closure

### Requirement: Close Behavior
The component SHALL provide multiple ways to close dialog.

#### Scenario: Close button
- **WHEN** Dialog.CloseButton is rendered
- **THEN** clicking SHALL close dialog
- **AND** SHALL call onOpenChange(false)
- **AND** SHALL use i18n aria-label "Close dialog"

#### Scenario: Escape key
- **WHEN** dialog is open and user presses Escape
- **THEN** SHALL close dialog by default
- **AND** isDismissable prop SHALL control this behavior
- **AND** SHALL return focus to trigger

#### Scenario: Backdrop click
- **WHEN** user clicks outside dialog
- **THEN** SHALL close dialog if isDismissable={true}
- **OR** SHALL not close if isDismissable={false}

#### Scenario: Controlled closure
- **WHEN** isOpen and onOpenChange props are provided
- **THEN** SHALL call onOpenChange(false) on close attempt
- **AND** SHALL not close until isOpen changes

## Overlay and Backdrop

### Requirement: Modal Backdrop
The component SHALL provide backdrop overlay.

#### Scenario: Backdrop rendering
- **WHEN** dialog opens
- **THEN** SHALL render backdrop behind dialog
- **AND** SHALL dim/blur background content
- **AND** SHALL prevent interaction with background
- **AND** SHALL use design token for backdrop color

#### Scenario: Backdrop animation
- **WHEN** dialog opens/closes
- **THEN** backdrop SHALL fade in/out
- **AND** SHALL use easing from design tokens

## Dialog Positioning

### Requirement: Placement
The component SHALL position dialog appropriately.

#### Scenario: Center positioning
- **WHEN** dialog renders
- **THEN** SHALL center horizontally and vertically by default
- **AND** SHALL maintain centering on window resize

#### Scenario: Responsive sizing
- **WHEN** viewport is small (mobile)
- **THEN** SHALL adapt to available space
- **AND** MAY use full-screen on very small screens

## Size Variants

### Requirement: Size Options
The component SHALL support multiple size variants per nimbus-core standards.

#### Scenario: Size variants
- **WHEN** size prop is set on Dialog.Content
- **THEN** SHALL support: sm, md, lg, xl, full
- **AND** SHALL adjust dialog width
- **AND** md SHALL be default size

## Scrolling Behavior

### Requirement: Content Scrolling
The component SHALL handle overflow content.

#### Scenario: Long content
- **WHEN** content exceeds viewport height
- **THEN** SHALL enable scrolling within dialog body
- **AND** SHALL keep header and footer fixed
- **AND** SHALL show scroll indicators

#### Scenario: Body scroll lock
- **WHEN** dialog is open
- **THEN** SHALL prevent scrolling of background page
- **AND** SHALL restore scroll on close

## Dialog Header

### Requirement: Title Section
The component SHALL provide accessible title.

#### Scenario: Dialog title
- **WHEN** Dialog.Header contains title text
- **THEN** SHALL render as dialog heading
- **AND** SHALL associate with dialog via aria-labelledby
- **AND** SHALL use appropriate heading level

#### Scenario: Close button in header
- **WHEN** Dialog.CloseButton is in header
- **THEN** SHALL position in top-right corner
- **AND** SHALL be easily clickable/tappable

## Dialog Body

### Requirement: Content Area
The component SHALL provide main content container.

#### Scenario: Body content
- **WHEN** Dialog.Body renders
- **THEN** SHALL contain main dialog content
- **AND** SHALL support any content type
- **AND** SHALL handle scrolling if needed

## Dialog Footer

### Requirement: Actions Section
The component SHALL provide action button area.

#### Scenario: Footer actions
- **WHEN** Dialog.Footer contains buttons
- **THEN** SHALL render action buttons
- **AND** SHALL align buttons appropriately (right-aligned by default)
- **AND** SHALL support primary and secondary actions

#### Scenario: Footer layout
- **WHEN** multiple buttons are present
- **THEN** SHALL space buttons appropriately
- **AND** SHALL support responsive stacking on small screens

## Accessibility

### Requirement: ARIA Dialog Pattern
The component SHALL implement ARIA dialog pattern per nimbus-core standards.

#### Scenario: Dialog roles
- **WHEN** dialog renders
- **THEN** Dialog.Content SHALL have role="dialog"
- **OR** role="alertdialog" for important alerts
- **AND** SHALL have aria-modal="true"
- **AND** SHALL be associated with title via aria-labelledby

#### Scenario: Screen reader announcements
- **WHEN** dialog opens
- **THEN** SHALL announce dialog title
- **AND** SHALL indicate modal state
- **AND** SHALL provide context about content

### Requirement: Internationalized Labels
The component SHALL use i18n for screen reader text per nimbus-core standards.

#### Scenario: Close button label
- **WHEN** Dialog.CloseButton renders
- **THEN** SHALL use i18n aria-label from dialog.i18n.ts
- **AND** message "Close dialog" SHALL translate across locales

## Animation

### Requirement: Enter/Exit Animations
The component SHALL provide smooth transitions.

#### Scenario: Dialog appearance
- **WHEN** dialog opens
- **THEN** SHALL animate in with fade and scale
- **AND** backdrop SHALL fade in
- **AND** SHALL use duration from design tokens

#### Scenario: Dialog dismissal
- **WHEN** dialog closes
- **THEN** SHALL animate out with fade and scale
- **AND** backdrop SHALL fade out
- **AND** SHALL remove from DOM after animation

## Styling

### Requirement: Multi-Slot Recipe
The component SHALL use multi-slot recipe per nimbus-core standards.

#### Scenario: Slot styling
- **WHEN** dialog renders
- **THEN** SHALL apply dialog slot recipe from theme/slot-recipes/dialog.ts
- **AND** SHALL style: backdrop, content, header, title, closeButton, body, footer, actions slots
- **AND** SHALL support size variants

## Nested Dialogs

### Requirement: Dialog Stacking
The component SHALL support nested dialogs.

#### Scenario: Multiple dialogs
- **WHEN** dialog opens another dialog
- **THEN** SHALL stack on top with higher z-index
- **AND** Escape SHALL close top-most dialog first
- **AND** focus trap SHALL apply to top dialog
- **AND** backdrop SHALL dim previous dialog

## Alert Dialog Variant

### Requirement: Alert Mode
The component SHALL support alert dialog variant.

#### Scenario: Alert role
- **WHEN** role="alertdialog" is set
- **THEN** SHALL use assertive ARIA live region
- **AND** SHALL require user action to dismiss
- **AND** isDismissable SHALL default to false
