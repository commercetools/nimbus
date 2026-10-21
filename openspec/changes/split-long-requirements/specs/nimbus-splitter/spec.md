## MODIFIED Requirements

### Requirement: Collapsible aside

When `collapsible: true` is set on `Splitter.Root`, the aside SHALL support being
collapsed to its `collapsedSize` (default 0). Only the aside collapses. Collapse
state is a boolean: `collapsed` (controlled), `defaultCollapsed` (uncontrolled),
and `onCollapsedChange(collapsed)` (notification). Enter on the focused handle
toggles collapse. Double-click is reserved for restoring the boundary to its
initial position, not for collapsing.

#### Scenario: Enter on focused handle toggles collapse

- **GIVEN** aside size `30` with `collapsible: true`
- **WHEN** the handle has keyboard focus and Enter is pressed
- **THEN** SHALL collapse the aside if it is not collapsed (set its size to
  `collapsedSize`, grow the main pane to absorb the freed space)
- **AND** SHALL fire `onCollapsedChange(true)`
- **OR** SHALL expand the aside (restore the pre-collapse size) if it is
  currently collapsed
- **AND** SHALL fire `onCollapsedChange(false)` for the expand transition

#### Scenario: Controlled `collapsed` from anywhere

- **GIVEN** the consumer renders `<Splitter.Root collapsed={state} …>`
- **WHEN** code outside the splitter subtree sets `state` to `true` (e.g. a
  toolbar button)
- **THEN** SHALL collapse the aside to its `collapsedSize` and grow the main pane
- **WHEN** `state` is set back to `false`
- **THEN** SHALL restore the pre-collapse size

#### Scenario: Enter is a no-op when the aside is not collapsible

- **GIVEN** `collapsible` is not set
- **WHEN** the handle has keyboard focus and Enter is pressed
- **THEN** SHALL NOT change the size and SHALL NOT fire `onCollapsedChange`

#### Scenario: `onCollapsedChange(false)` fires when leaving the collapsed state

- **GIVEN** a collapsed aside (size === `collapsedSize`)
- **WHEN** any operation (Enter toggle, double-click restore, controlled prop)
  increases the aside's size above `collapsedSize`
- **THEN** SHALL fire `onCollapsedChange(false)` exactly once for that transition

#### Scenario: Resizing is disabled while the aside is collapsed

- **GIVEN** a collapsed aside (size === `collapsedSize`)
- **WHEN** the user drags the handle or presses an arrow / Home / End key
- **THEN** SHALL NOT change the size
- **AND** SHALL keep the aside collapsed (no `onCollapsedChange`)

## ADDED Requirements

### Requirement: No resizing while collapsed

While the aside is collapsed, resizing the boundary (drag and the arrow / Home /
End keys) SHALL be disabled. A collapsed aside sits at its `collapsedSize`, below
its `minSize`, so a resize could only snap straight to `minSize`. It is instead
reopened via Enter (toggle), double-click (restore defaults), or the controlled
`collapsed` prop.

#### Scenario: Ways to reopen a collapsed aside

- **GIVEN** a collapsed aside (size === `collapsedSize`) with `collapsible: true`
- **WHEN** the user presses Enter on the focused handle, double-clicks the
  handle, or the consumer sets the controlled `collapsed` prop to `false`
- **THEN** SHALL reopen the aside above its `collapsedSize`
