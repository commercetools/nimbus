## ADDED Requirements

### Requirement: File picker activation via a pressable child

The `FileTrigger` component SHALL wrap a single pressable child and a
visually-hidden file input, opening the operating system file picker when the
child is activated by pointer, keyboard, or assistive technology.

#### Scenario: Pointer activation opens the picker

- **WHEN** a user clicks the pressable child rendered inside `FileTrigger`
- **THEN** the hidden file input receives a programmatic click that opens the
  OS file picker

#### Scenario: Keyboard activation opens the picker

- **WHEN** the pressable child is focused and the user presses Enter or Space
- **THEN** the hidden file input receives a programmatic click that opens the
  OS file picker

### Requirement: File selection forwarded via onSelect

The `FileTrigger` component SHALL invoke the consumer-provided `onSelect`
callback with the native `FileList` when a selection completes, preserving the
React Aria Components signature `(files: FileList | null) => void` without
normalization.

#### Scenario: Single file selected

- **WHEN** the user selects one file from the picker
- **THEN** `onSelect` is called with a `FileList` containing exactly that file

#### Scenario: Multiple files selected

- **WHEN** `allowsMultiple` is set and the user selects more than one file
- **THEN** `onSelect` is called with a `FileList` containing every selected
  file

#### Scenario: Selection dismissed

- **WHEN** the user opens the picker but cancels without choosing a file
- **THEN** `onSelect` is not invoked with new files (the prior selection state
  is unchanged)

### Requirement: Accepted file type restriction

The `FileTrigger` component SHALL forward `acceptedFileTypes` to the hidden
input's `accept` attribute so the picker can restrict selectable files by MIME
type or extension.

#### Scenario: Accept attribute reflects accepted types

- **WHEN** `acceptedFileTypes={["image/png", ".pdf"]}` is provided
- **THEN** the hidden file input renders with `accept="image/png,.pdf"`

### Requirement: Multiple-file selection

The `FileTrigger` component SHALL enable selecting more than one file when
`allowsMultiple` is set, mapping to the hidden input's `multiple` attribute.

#### Scenario: Multiple attribute present when enabled

- **WHEN** `allowsMultiple` is set
- **THEN** the hidden file input renders with the `multiple` attribute

#### Scenario: Multiple attribute absent by default

- **WHEN** `allowsMultiple` is not set
- **THEN** the hidden file input renders without the `multiple` attribute

### Requirement: Directory selection

The `FileTrigger` component SHALL allow selecting a directory when
`acceptDirectory` is set, mapping to the hidden input's directory-selection
attributes.

#### Scenario: Directory attribute present when enabled

- **WHEN** `acceptDirectory` is set
- **THEN** the hidden file input renders with directory-selection attributes
  (e.g. `webkitdirectory`)

### Requirement: Camera capture hint

The `FileTrigger` component SHALL forward `defaultCamera` to the hidden input's
`capture` attribute to hint which camera mobile devices should use; the
attribute is ignored by desktop browsers.

#### Scenario: Capture attribute reflects camera preference

- **WHEN** `defaultCamera="environment"` is provided
- **THEN** the hidden file input renders with `capture="environment"`

### Requirement: Disabling via the pressable child

The `FileTrigger` component SHALL be disabled by disabling its pressable child;
when the child is disabled, activation MUST NOT open the file picker.

#### Scenario: Disabled child suppresses the picker

- **WHEN** the pressable child is disabled and the user attempts to activate it
- **THEN** the file picker does not open and `onSelect` is not invoked

### Requirement: Accessibility and WCAG 2.1 AA compliance

The `FileTrigger` component SHALL meet WCAG 2.1 AA requirements by deferring
interaction semantics to React Aria Components: the visible, focusable pressable
child is the sole interactive element, and the trigger's accessible name is
derived entirely from that child. The underlying file input is hidden
(`display:none`) and is activated programmatically when the child is pressed, so
it does not need to be independently keyboard-reachable.

#### Scenario: Accessible name comes from the child

- **WHEN** `FileTrigger` wraps a child with the accessible label "Upload file"
- **THEN** the trigger is announced to assistive technology as "Upload file"
  and `FileTrigger` contributes no additional conflicting ARIA markup

#### Scenario: Keyboard interaction goes through the child

- **WHEN** the user tabs to the trigger
- **THEN** focus lands on the visible pressable child (a real `button`), which
  is operable via Enter/Space; the hidden file input is not a separate tab stop
