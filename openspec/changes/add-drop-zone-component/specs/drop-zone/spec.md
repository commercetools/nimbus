## ADDED Requirements

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
icon and one localized instruction line (`Nimbus.DropZone.defaultLabel`). The
visible line is rendered with `slot={null}` (React Aria's documented opt-out
from the parent's label slot) so it does not get auto-wired into the accessible
name; instead, a localized `aria-label` is injected on the underlying RAC
element. When given children, DropZone SHALL render them as-is and the
default state SHALL NOT appear (all-or-nothing; no per-slot overrides). DropZone
SHALL NOT expose a `size` variant — sizing is done with Nimbus style props
(`minH`, `w`, `p`, …).

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

### Requirement: Visual states

DropZone SHALL style only the interaction states React Aria's `DropZone` exposes
out of the box, via their data attributes: **idle** (dashed border, neutral
background), **dragOver** (border and background highlight, driven by
`data-drop-target`), **focus** (`data-focus-visible`, a visible focus ring), and
**disabled** (`data-disabled`). It SHALL NOT style plain mouse hover
(`data-hovered`): the zone is not click-to-upload (default cursor, no press
action), so a hover affordance would falsely imply it is clickable. It SHALL NOT
introduce custom error, loading, or invalid states — a drag rejected by
`getDropOperation` does not set `data-drop-target` and therefore does not
highlight. State changes SHALL NOT be conveyed by color alone. The dashed border
and highlight SHALL meet WCAG 1.4.11 non-text contrast (≥3:1) and SHALL remain
visible in forced-colors mode; drag-over transitions SHALL respect
`prefers-reduced-motion`.

Text selection SHALL be disabled within the drop target (`user-select: none`) so
that dragging content over the zone does not accidentally select its text. The
zone itself is not a click-to-upload target (that role belongs to a composed
`FileTrigger`), so it SHALL NOT present a pointer cursor; the pointer affordance
belongs to the composed control.

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

#### Scenario: Text is not selected while dragging

- **WHEN** a user drags content over the drop target
- **THEN** the zone's text is not selected or highlighted (`user-select` is
  disabled on the drop target)

#### Scenario: Cursor reflects a non-clickable zone

- **WHEN** a pointer hovers the drop target outside any composed interactive
  control
- **THEN** the cursor is the default arrow, not a pointer/hand (the zone itself
  does not open the file picker on click)

#### Scenario: Plain mouse hover is not styled

- **WHEN** a pointer hovers the drop target and no drag is in progress
- **THEN** the zone keeps its idle treatment (border and background do not
  change), since the zone is not clickable

### Requirement: Accessibility (WCAG 2.1 AA)

DropZone SHALL meet WCAG 2.1 AA. The drop target is keyboard focusable and
operable via React Aria's built-in keyboard drag-and-drop by default (Enter to
enter drag mode, Tab between targets, Enter to drop, Escape to cancel). When no
children are provided and no explicit `aria-label`/`aria-labelledby` is set,
DropZone SHALL inject a localized `aria-label` from `Nimbus.DropZone.defaultLabel`.
An explicit `aria-label`/`aria-labelledby` SHALL be forwarded to the underlying
RAC element and takes precedence over the injected default. Because
keyboard drag-and-drop cannot cover uploads from the OS, the docs SHALL present a
composed `FileTrigger` as the recommended alternative for file uploads. Focus
indication SHALL be visible and meet contrast requirements.

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
