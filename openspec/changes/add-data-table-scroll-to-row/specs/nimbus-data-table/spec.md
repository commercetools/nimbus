## ADDED Requirements

### Requirement: Imperative Handle

The component SHALL accept `apiRef` on `DataTable` and `DataTable.Root`. It
SHALL fill the ref with an object that has `scrollToRow(key, options)` and
`getScrollContainer()`. The existing `ref` SHALL stay the root element.

#### Scenario: Handle is available after mount

- **WHEN** `DataTable.Root` has mounted
- **THEN** `apiRef.current` SHALL be an object with both methods
- **AND** `apiRef.current` SHALL be `null` before mount and after unmount

#### Scenario: Scroll container is the root element

- **WHEN** a consumer calls `getScrollContainer()`
- **THEN** it SHALL return the same element as the `ref` of the component

#### Scenario: Existing ref is unchanged

- **WHEN** both `ref` and `apiRef` are passed
- **THEN** `ref` SHALL receive the root element, as before

### Requirement: Scroll Alignment

`scrollToRow` SHALL bring a shown row into view with the `align` option:
`"start"`, `"center"`, `"end"` or `"nearest"`. The default SHALL be `"nearest"`.
The header SHALL never cover the row.

#### Scenario: Nearest does not move a visible row

- **WHEN** the row is fully visible below the header and `align` is `"nearest"`
  or not set
- **THEN** the table SHALL NOT scroll
- **AND** the Promise SHALL resolve `true`

#### Scenario: Nearest scrolls the shortest distance

- **WHEN** the row is partly or fully outside the visible area and `align` is
  `"nearest"`
- **THEN** the table SHALL scroll until the row is fully visible, in the
  direction that needs the shorter distance

#### Scenario: Start, center and end

- **WHEN** `align` is `"start"`, `"center"` or `"end"`
- **THEN** the row SHALL end at the top, the middle or the bottom of the visible
  area
- **AND** the visible area SHALL start below the header

#### Scenario: First and last rows stop at the edges

- **WHEN** `align` would scroll beyond the first or the last position
- **THEN** the table SHALL stop at the start or the end of the scroll range

### Requirement: Scroll Behavior

`scrollToRow` SHALL accept `behavior`. The default SHALL be `"auto"`, which
scrolls instantly. `"smooth"` SHALL scroll instantly when the user prefers
reduced motion.

#### Scenario: Default is instant

- **WHEN** `behavior` is not set
- **THEN** the row SHALL be at its final position when the Promise resolves

#### Scenario: Smooth scroll resolves at the end

- **WHEN** `behavior` is `"smooth"` and reduced motion is not requested
- **THEN** the Promise SHALL resolve `true` only after scrolling has stopped

#### Scenario: Reduced motion

- **WHEN** `behavior` is `"smooth"` and the user prefers reduced motion
- **THEN** the table SHALL scroll instantly

### Requirement: Scroll Result

`scrollToRow` SHALL return a Promise that resolves `true` when the row is at its
final position. It SHALL resolve `false` for a key that is not a shown row.

#### Scenario: Unknown key

- **WHEN** the key is not in `rows`
- **THEN** the Promise SHALL resolve `false`
- **AND** the table SHALL NOT scroll and focus SHALL NOT change

#### Scenario: Row hidden by search

- **WHEN** `search` hides the row
- **THEN** the Promise SHALL resolve `false`
- **AND** the table SHALL NOT scroll and focus SHALL NOT change

#### Scenario: Nested child row

- **WHEN** the key belongs to a child row under `nestedKey`
- **THEN** the Promise SHALL resolve `false`

#### Scenario: Root without Table

- **WHEN** `DataTable.Root` is mounted without `DataTable.Table`
- **THEN** the Promise SHALL resolve `false`
- **AND** the component SHALL log a warning in development

#### Scenario: Call after the rows changed

- **WHEN** a consumer calls `scrollToRow` from an effect right after the rows or
  the sort order changed
- **THEN** the Promise SHALL resolve `true` for a row that is now shown

### Requirement: Scroll Cancellation

A pending `scrollToRow` Promise SHALL reject with a `DOMException` named
`"AbortError"` when a newer `scrollToRow` call replaces it, and when the table
unmounts.

#### Scenario: Newer call replaces a pending call

- **WHEN** `scrollToRow` is called while an earlier call is pending
- **THEN** the earlier Promise SHALL reject with an `AbortError`
- **AND** this SHALL hold for any key of the newer call

#### Scenario: Unmount

- **WHEN** the table unmounts while a call is pending
- **THEN** the Promise SHALL reject with an `AbortError`

### Requirement: Scroll Focus

`scrollToRow` SHALL always set React Aria's focused key to the row. It SHALL
move DOM focus to the row only when `focus` is `true`.

#### Scenario: Focused key without DOM focus

- **WHEN** `scrollToRow` is called without `focus: true`
- **THEN** React Aria's focused key SHALL be the row
- **AND** DOM focus SHALL NOT move

#### Scenario: Focus requested

- **WHEN** `scrollToRow` is called with `focus: true`
- **THEN** DOM focus SHALL move to the row after the scroll
- **AND** moving focus SHALL NOT scroll the table again

#### Scenario: Disabled row

- **WHEN** the row is disabled (`disabledKeys` or `isDisabled`)
- **THEN** the table SHALL scroll to the row and the Promise SHALL resolve
  `true`
- **AND** the focused key and DOM focus SHALL NOT change
- **AND** the component SHALL log a warning in development if `focus: true` was
  passed
