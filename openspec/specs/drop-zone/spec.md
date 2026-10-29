# drop-zone Specification

## Purpose

Lets users add files or other data by dragging them onto a marked area of the page.

## Requirements

### Requirement: Drop target for drag-and-drop

DropZone SHALL wrap React Aria's `DropZone` to accept files and data dragged
onto it, forwarding the `onDrop` handler and the `getDropOperation`,
`onDropEnter`, `onDropExit`, `onDropMove`, and `onDropActivate` handlers
faithfully to the underlying primitive.

#### Scenario: Dropping accepted content

- **WHEN** a user drags content whose types are accepted and releases it over
  the drop target
- **THEN** the `onDrop` handler is called with the React Aria `DropEvent`
  containing the dropped items

#### Scenario: Restricting accepted drops

- **WHEN** a `getDropOperation` function is provided and a drag whose types are
  not accepted enters the drop target
- **THEN** the returned operation (e.g. `"cancel"`) is applied and the drop is
  not accepted

#### Scenario: Drag lifecycle handlers are forwarded

- **WHEN** a valid drag enters, moves within, and exits the drop target
- **THEN** the corresponding `onDropEnter`, `onDropMove`, and `onDropExit`
  handlers are invoked with the React Aria event payloads

### Requirement: Click-to-upload via FileTrigger composition

DropZone SHALL NOT re-implement click-to-upload. It SHALL render its `children`
as-is so that consumers can compose the existing Nimbus `FileTrigger` to provide
the click/keyboard upload path. The DropZone stories and documentation SHALL
demonstrate this composition as the recommended non-drag fallback.

#### Scenario: Composed FileTrigger provides the upload path

- **WHEN** a consumer places a `FileTrigger` (wrapping a Nimbus `Button`) among
  DropZone's children
- **THEN** it renders inside the zone and opens the native file picker when
  activated, without DropZone owning any file-selection props

#### Scenario: Drag-only usage

- **WHEN** DropZone is rendered without a composed `FileTrigger`
- **THEN** it acts as a drag-only drop target and does not render any upload
  button of its own

### Requirement: Default state and content

When given no children, DropZone SHALL render a default state — a centered upload
icon and one localized instruction line (`Nimbus.DropZone.defaultLabel`). When
given children, DropZone SHALL render them as-is and the default state SHALL NOT
appear (all-or-nothing; no per-slot overrides).

#### Scenario: Default state when empty

- **WHEN** DropZone is rendered with no children
- **THEN** the default upload icon and localized instruction line are shown, and
  the zone has an accessible name from that label

#### Scenario: Children replace the default

- **WHEN** the consumer passes children (instructions, an icon, a
  `FileTrigger`, or a dropped-file list)
- **THEN** those children render inside the drop zone and the default state is
  not shown

#### Scenario: Filled state via children

- **WHEN** the consumer swaps the children after a drop (e.g. to a list of
  dropped files)
- **THEN** the drop zone reflects that content, letting consumers represent the
  filled state themselves

#### Scenario: Default instruction line is not auto-wired as the name

- **WHEN** the default state is rendered
- **THEN** the visible instruction line uses `slot={null}` (React Aria's
  documented opt-out from the parent's label slot), so it is not auto-wired into
  the accessible name
- **AND** a localized `aria-label` is injected on the underlying RAC element
  instead

### Requirement: Visual states

DropZone SHALL style only the interaction states React Aria's `DropZone` exposes
out of the box, via their data attributes: **idle** (dashed border, neutral
background), **dragOver** (border and background highlight, driven by
`data-drop-target`), **focus** (`data-focus-visible`, a visible focus ring), and
**disabled** (`data-disabled`). It SHALL NOT style plain mouse hover
(`data-hovered`) and SHALL NOT introduce custom error, loading, or invalid
states.

#### Scenario: Idle state

- **WHEN** no drag is over the drop target and it is not focused
- **THEN** it renders with a dashed border and neutral background

#### Scenario: Drag-over highlight

- **WHEN** a valid drag is over the drop target (`data-drop-target` is set)
- **THEN** the border and background change to the highlighted treatment, using
  more than color alone (border weight/outline change)

#### Scenario: Rejected drag does not highlight

- **WHEN** a `getDropOperation` returns `"cancel"` for the dragged types
- **THEN** `data-drop-target` is not set and the zone keeps its idle treatment
  (no separate invalid visual is added)

#### Scenario: Plain mouse hover is not styled

- **WHEN** a pointer hovers the drop target and no drag is in progress
- **THEN** the zone keeps its idle treatment (border and background do not
  change), since the zone is not clickable

### Requirement: Accessibility (WCAG 2.1 AA)

DropZone SHALL meet WCAG 2.1 AA. The drop target SHALL be keyboard focusable
and operable via React Aria's built-in keyboard drag-and-drop by default, and
its focus indication SHALL be visible and meet contrast requirements.

#### Scenario: Keyboard focus and accessible name

- **WHEN** a keyboard user tabs to the drop target and an `aria-label` is
  provided (or the default localized label is injected)
- **THEN** the drop target receives a visible focus ring and exposes that
  accessible name

#### Scenario: Non-drag path for assistive technology

- **WHEN** a user cannot perform a pointer drag (keyboard/screen-reader user) and
  a `FileTrigger` is composed into the DropZone
- **THEN** the FileTrigger button lets them select files without dragging

#### Scenario: Disabled drop target

- **WHEN** `isDisabled` is `true`
- **THEN** the drop target rejects drops and the disabled state is conveyed
  visually and to assistive technology (to disable a composed control, the
  consumer sets `isDisabled` on it too)

#### Scenario: Keyboard drag and drop

- **WHEN** a keyboard user operates the drop target
- **THEN** Enter enters drag mode, Tab moves between targets, Enter drops, and
  Escape cancels

### Requirement: Sizing via style props

DropZone SHALL NOT expose a `size` variant. Sizing is done with Nimbus style
props.

#### Scenario: Consumer sets the size

- **WHEN** a consumer needs a different drop zone size
- **THEN** they set it with style props such as `minH`, `w`, and `p`

### Requirement: Visual state contrast and motion

DropZone state changes SHALL NOT be conveyed by color alone. The dashed border
and highlight SHALL meet WCAG 1.4.11 non-text contrast (≥3:1) and SHALL remain
visible in forced-colors mode; drag-over transitions SHALL respect
`prefers-reduced-motion`.

#### Scenario: Forced-colors mode

- **WHEN** the drop target is rendered in forced-colors mode
- **THEN** the dashed border and the drag-over highlight remain visible

#### Scenario: Reduced motion

- **WHEN** the user prefers reduced motion and a drag enters the drop target
- **THEN** the change to the drag-over treatment is not animated

### Requirement: No text selection or pointer cursor

Text selection SHALL be disabled within the drop target (`user-select: none`) so
that dragging content over the zone does not accidentally select its text. The
zone itself is not a click-to-upload target (that role belongs to a composed
`FileTrigger`), so it SHALL NOT present a pointer cursor; the pointer affordance
belongs to the composed control.

#### Scenario: Text is not selected while dragging

- **WHEN** a user drags content over the drop target
- **THEN** the zone's text is not selected or highlighted (`user-select` is
  disabled on the drop target)

#### Scenario: Cursor reflects a non-clickable zone

- **WHEN** a pointer hovers the drop target outside any composed interactive
  control
- **THEN** the cursor is the default arrow, not a pointer/hand (the zone itself
  does not open the file picker on click)

#### Scenario: Pointer cursor only on the composed control

- **WHEN** a `FileTrigger` button is composed into the DropZone and a pointer
  moves from the zone onto that button
- **THEN** the cursor is the default arrow over the zone and the pointer cursor
  over the button

### Requirement: Default accessible name

When no children are provided and no explicit `aria-label`/`aria-labelledby` is
set, DropZone SHALL inject a localized `aria-label` from
`Nimbus.DropZone.defaultLabel`. An explicit `aria-label`/`aria-labelledby` SHALL
be forwarded to the underlying RAC element and takes precedence over the
injected default.

#### Scenario: Injected default label

- **WHEN** DropZone is rendered with no children and no `aria-label` or
  `aria-labelledby`
- **THEN** the drop target's accessible name is the localized
  `Nimbus.DropZone.defaultLabel` text

#### Scenario: Explicit label takes precedence

- **WHEN** the consumer sets `aria-label` or `aria-labelledby`
- **THEN** it is forwarded to the underlying RAC element and the injected
  default is not used

### Requirement: Documented file-upload alternative

Because keyboard drag-and-drop cannot cover uploads from the OS, the docs SHALL
present a composed `FileTrigger` as the recommended alternative for file
uploads.

#### Scenario: Docs recommend a composed FileTrigger

- **WHEN** a consumer reads the DropZone documentation about file uploads
- **THEN** it recommends composing a `FileTrigger` so that users can select
  files without dragging
