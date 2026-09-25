## MODIFIED Requirements

### Requirement: Visual Variant Styles

The component SHALL support three visual emphasis variants — `flat`,
`outlined` and `accent-start` — selected with the `variant` prop on
`Alert.Root`.

Every variant SHALL apply the same padding. The variant SHALL otherwise
control color and the outline only. The box — the grid, the padding and the
corner radius — SHALL be identical across every variant, so switching variant
never reflows the alert nor shifts the content inside it. No variant SHALL
use a CSS border; outlines and bars are inset shadows, which take no layout
space.

#### Scenario: No variant

- **WHEN** no `variant` is set on Root
- **THEN** SHALL apply no variant styles: no padding, no background and no
  outline
- **AND** SHALL therefore sit flush with its container, as before this change

#### Scenario: Flat variant

- **WHEN** `variant="flat"` is set on Root
- **THEN** SHALL render no visible outline and no background
- **AND** SHALL rely on the icon and the text color for distinction
- **AND** SHALL apply the shared padding

#### Scenario: Outlined variant

- **WHEN** `variant="outlined"` is set on Root
- **THEN** SHALL render a 1px outline in `colorPalette.5`, drawn as an inset
  shadow
- **AND** SHALL use `colorPalette.2` for the background color

#### Scenario: Accent-start variant

- **WHEN** `variant="accent-start"` is set on Root
- **THEN** SHALL use `neutral.2` for the background color
- **AND** SHALL render a 1px outline in `neutral.5`, drawn as an inset shadow
- **AND** SHALL render a 4px bar in `colorPalette.9` on the inline-start edge,
  drawn as an inset shadow above the outline so it sits flush with the edge

#### Scenario: Accent-start keeps the reading surface neutral

- **WHEN** `variant="accent-start"` is set on Root
- **THEN** the title SHALL use `neutral.12` and the description `neutral.11`
- **AND** the dismiss-button slot SHALL resolve its `colorPalette` to
  `neutral`, being chrome rather than an action
- **AND** two alerts differing only in `colorPalette` SHALL render identical
  surface and text colors

#### Scenario: Accent-start keeps the status color on the controls

- **WHEN** `variant="accent-start"` is set on Root and `Alert.Actions` holds a
  button
- **THEN** the actions slot SHALL keep the alert's `colorPalette`
- **AND** the button SHALL therefore carry the status color, so that the bar,
  the icon and the action agree
- **AND** two alerts differing only in `colorPalette` SHALL render different
  action colors

#### Scenario: Accent-start follows the reading direction

- **WHEN** `variant="accent-start"` renders inside a `dir="rtl"` subtree
- **THEN** the accent bar SHALL render on the right edge

#### Scenario: Variant does not affect the box

- **WHEN** the same content is rendered under each supported `variant`
- **THEN** padding and corner radius SHALL be identical in all of them
- **AND** none of them SHALL have a border width
- **AND** the content SHALL start at the same inline offset in all of them

### Requirement: Semantic Color Palettes

The component SHALL accept every Nimbus color palette. The four severities
and `primary` carry their own automatic icon; every other palette carries the
`neutral` icon.

#### Scenario: Critical palette

- **WHEN** colorPalette="critical" is set on Root
- **THEN** SHALL apply critical semantic colors
- **AND** SHALL use colorPalette.11 for text and icon
- **AND** SHALL convey error or destructive states
- **AND** SHALL display ErrorOutline icon automatically

#### Scenario: Info palette

- **WHEN** colorPalette="info" is set on Root
- **THEN** SHALL apply info semantic colors
- **AND** SHALL convey informational messages
- **AND** SHALL display Info icon automatically

#### Scenario: Warning palette

- **WHEN** colorPalette="warning" is set on Root
- **THEN** SHALL apply warning semantic colors
- **AND** SHALL convey cautionary messages
- **AND** SHALL display WarningAmber icon automatically

#### Scenario: Positive palette

- **WHEN** colorPalette="positive" is set on Root
- **THEN** SHALL apply positive semantic colors
- **AND** SHALL convey success or confirmation states
- **AND** SHALL display CheckCircleOutline icon automatically

#### Scenario: Non-severity palettes

- **WHEN** colorPalette="primary", "neutral" or any other non-severity palette
  (brand or system) is set on Root
- **THEN** SHALL apply that palette's colors
- **AND** primary SHALL display the Campaign icon, for announcements
- **AND** neutral and every other palette SHALL display the Article icon
- **AND** those icons SHALL be decorative rather than a redundancy affordance,
  since neither palette expresses a severity for the icon to reinforce

#### Scenario: Color palette restrictions

- **WHEN** colorPalette prop is set
- **THEN** SHALL accept every Nimbus palette: semantic, brand and system
- **AND** SHALL type as `ConditionalValue<NimbusColorPalette>`

#### Scenario: Responsive color palette

- **WHEN** colorPalette is a responsive object or array
- **THEN** the automatic icon and the default `role` SHALL come from its base
  value (the `base` key, or the first array entry)

### Requirement: Automatic Icon Display

The component SHALL display a status icon derived from `colorPalette`, SHALL
allow that icon to be replaced, and SHALL allow it to be suppressed.

#### Scenario: Icon selection by palette

- **WHEN** Alert.Root renders with a `colorPalette`
- **THEN** critical SHALL display ErrorOutline
- **AND** info SHALL display Info
- **AND** warning SHALL display WarningAmber
- **AND** positive SHALL display CheckCircleOutline
- **AND** primary SHALL display Campaign
- **AND** neutral and every other palette SHALL display Article

#### Scenario: Custom icon

- **WHEN** an `Alert.Icon` child is provided as a direct child of Root
  (fragments, conditionals and arrays allowed)
- **THEN** it SHALL replace the automatic status icon
- **AND** SHALL occupy the same slot and box as the automatic icon

#### Scenario: Icon suppression

- **WHEN** `hideIcon` is set on Root, or no `colorPalette` is supplied
- **THEN** no icon SHALL render, automatic or custom
- **AND** the leading grid column SHALL collapse, leaving no gap before the
  content

#### Scenario: Toggling icon suppression

- **WHEN** `hideIcon` changes while the alert is mounted
- **THEN** the other children SHALL stay mounted, keeping focus and
  uncontrolled state

#### Scenario: Icon box tracks the text

- **WHEN** the icon renders
- **THEN** its slot SHALL be one text line tall, derived from the alert's own
  line height rather than a fixed pixel value
- **AND** the icon SHALL be centred within that box
- **AND** the icon's centre SHALL align with the centre of the first line of
  text, for a title-first alert, a description-only alert, and a description
  long enough to wrap
- **AND** the glyph SHALL be sized relative to the alert's font size, so that
  changing `fontSize` on Root scales the glyph and its box together

#### Scenario: Icon styling

- **WHEN** the icon renders
- **THEN** SHALL position in grid column 1
- **AND** SHALL apply icon slot styles from the recipe
- **AND** SHALL set icon color to `colorPalette.11`, except under
  `accent-start` where the surrounding text is neutral and the icon remains
  the status color by design
- **AND** SHALL size the glyph at `1.25em` — 20px at the default font size —
  rather than a fixed `500` token
- **AND** SHALL centre the glyph in a one-line-tall box rather than aligning it
  to flex-start with a `marginTop` nudge
- **AND** SHALL not shrink (`flexShrink: 0`)

#### Scenario: Icon source

- **WHEN** icons render
- **THEN** SHALL import from `@commercetools/nimbus-icons`
- **AND** SHALL use: ErrorOutline, Info, WarningAmber, CheckCircleOutline
- **AND** SHALL render as SVG elements

### Requirement: Title Section

The component SHALL provide a title component that takes the alert's own type
cascade and whose rendered element is controllable.

#### Scenario: Title rendering

- **WHEN** Alert.Title renders
- **THEN** SHALL render a Heading defaulting to a non-heading element
- **AND** SHALL register with root context via withContext("title")
- **AND** SHALL set displayName="Alert.Title"
- **AND** SHALL NOT take slot props from a React Aria provider above the
  alert unless the consumer passes `slot`

#### Scenario: Title inherits the alert's type

- **WHEN** Alert.Title renders
- **THEN** its font size and line height SHALL equal the alert root's
- **AND** setting `fontSize` on Root SHALL scale the title with it

#### Scenario: Title element control

- **WHEN** `as` is passed to Alert.Title
- **THEN** SHALL render that element instead of the default
- **AND** SHALL NOT default to any heading level, because the component cannot
  know which level keeps the page's document outline sequential

#### Scenario: Title positioning

- **WHEN** Alert.Title is included
- **THEN** SHALL position in grid column 2
- **AND** SHALL apply `order: 1` for vertical sequencing
- **AND** SHALL appear before Description and Actions
- **AND** SHALL apply `color: colorPalette.11`, except under `accent-start`
  where it is `neutral.12`

#### Scenario: Title typography

- **WHEN** Title renders
- **THEN** SHALL apply `fontWeight` 600 (semibold)
- **AND** SHALL take its font size and line height from the alert rather than
  a `Heading` size
- **AND** SHALL support style prop overrides

### Requirement: Description Section

The component SHALL provide a description component for detailed message text
whose rendered element is controllable.

#### Scenario: Description rendering

- **WHEN** Alert.Description renders
- **THEN** SHALL render a Text defaulting to a `div`, so that block content
  such as lists and stacks remains valid markup
- **AND** SHALL register with root context via withContext("description")
- **AND** SHALL set displayName="Alert.Description"
- **AND** SHALL NOT take slot props from a React Aria provider above the
  alert unless the consumer passes `slot`

#### Scenario: Description element control

- **WHEN** `as` is passed to Alert.Description
- **THEN** SHALL render that element instead of the default

#### Scenario: Description positioning

- **WHEN** Alert.Description is included
- **THEN** SHALL position in grid column 2
- **AND** SHALL apply `order: 2` for vertical sequencing
- **AND** SHALL appear after Title, before Actions
- **AND** SHALL apply `color: colorPalette.11`, except under `accent-start`
  where it is `neutral.11`

#### Scenario: Description typography

- **WHEN** Description renders
- **THEN** SHALL use the default font weight (not bold)
- **AND** SHALL inherit text color from the slot recipe
- **AND** SHALL support multi-line and block content

### Requirement: Actions Section

The component SHALL provide an actions area that lays its children out as a
row.

#### Scenario: Actions layout

- **WHEN** Alert.Actions contains more than one control
- **THEN** SHALL lay them out as a wrapping row with a consistent gap
- **AND** SHALL separate the row from the message above it
- **AND** SHALL add the same space below the row, so the buttons keep the
  intended spacing in every variant, including an alert without padding

#### Scenario: Actions rendering

- **WHEN** Alert.Actions renders
- **THEN** SHALL render as a div element
- **AND** SHALL register with root context via withContext("actions")
- **AND** SHALL accept all Chakra style props
- **AND** SHALL set displayName="Alert.Actions"

#### Scenario: Actions positioning

- **WHEN** Alert.Actions is included
- **THEN** SHALL position in grid column 2
- **AND** SHALL apply `order: 3` for vertical sequencing
- **AND** SHALL appear after Title and Description
- **AND** SHALL not apply an intrinsic color, leaving buttons to take the
  alert's `colorPalette` under every variant

#### Scenario: Actions content flexibility

- **WHEN** Actions contains button elements
- **THEN** SHALL support any button components
- **AND** SHALL support single or multiple buttons
- **AND** SHALL supply the row layout and gap itself, so a consumer no longer
  needs to wrap the buttons in a Stack to space them

### Requirement: Dismiss Button Component

The component SHALL provide a composable dismiss button.

#### Scenario: Dismiss box tracks the text

- **WHEN** the dismiss button renders
- **THEN** its slot SHALL be one text line tall, for the same reason as the
  icon slot
- **AND** its centre SHALL align with the centre of the first line of text

#### Scenario: Dismiss button rendering

- **WHEN** Alert.DismissButton renders
- **THEN** SHALL render as a div wrapper containing an IconButton
- **AND** the wrapper SHALL register with root context via
  withContext("dismissButton")
- **AND** the IconButton SHALL render the Clear icon
- **AND** SHALL set displayName="Alert.DismissButton"

#### Scenario: Dismiss button positioning

- **WHEN** Alert.DismissButton is included
- **THEN** SHALL position in grid column 3
- **AND** SHALL apply `gridRow: 1`
- **AND** SHALL appear on the trailing edge of the alert

#### Scenario: Dismiss button styling

- **WHEN** DismissButton renders
- **THEN** the IconButton SHALL default to `variant="ghost"`, which a
  consumer `variant` overrides
- **AND** SHALL default to `size="2xs"`, which a consumer `size` overrides
- **AND** the Clear icon SHALL have `role="img"`
- **AND** SHALL inherit color from the parent context, except under
  `accent-start`, which resolves the slot's `colorPalette` to `neutral` so the
  dismiss control does not compete with the action for the variant's accent

#### Scenario: Dismiss button interaction

- **WHEN** the user activates DismissButton
- **THEN** SHALL call the `onPress` handler
- **AND** SHALL forward all ButtonProps to the IconButton
- **AND** SHALL support keyboard activation (Enter, Space)
- **AND** SHALL be focusable and keyboard accessible

### Requirement: Screen Reader Announcements

The component SHALL announce assertively by default for `critical`, politely
by default for every other palette, and SHALL allow the announcement
semantics to be overridden.

#### Scenario: Alert role announcement

- **WHEN** Alert.Root renders without an explicit `role` and with a
  `colorPalette` other than `critical`, or with none
- **THEN** SHALL apply `role="status"` rather than `role="alert"`
- **AND** SHALL announce politely, waiting for a pause rather than
  interrupting current screen reader activity
- **AND** SHALL not require focus to be announced

#### Scenario: Critical announcement

- **WHEN** Alert.Root renders with `colorPalette="critical"` and without an
  explicit `role`
- **THEN** SHALL apply `role="alert"`
- **AND** SHALL announce assertively, interrupting current screen reader
  activity

#### Scenario: Interrupting announcement

- **WHEN** `role="alert"` is passed to Alert.Root
- **THEN** SHALL apply that role rather than overriding it
- **AND** SHALL announce assertively, interrupting current screen reader
  activity
- **AND** SHALL be the documented choice for important, time-sensitive
  messages on a non-critical palette

#### Scenario: Polite critical announcement

- **WHEN** `role="status"` is passed to Alert.Root with
  `colorPalette="critical"`
- **THEN** SHALL apply that role rather than the critical default

#### Scenario: Suppressed announcement

- **WHEN** `role="group"` is passed to Alert.Root
- **THEN** SHALL contribute no live region
- **AND** SHALL remain a labelled grouping for assistive technology

#### Scenario: Alert content structure

- **WHEN** Alert contains Title and Description
- **THEN** the screen reader SHALL announce both in sequence
- **AND** Title SHALL provide context
- **AND** Description SHALL provide detail
- **AND** the user SHALL understand the message without visual cues

#### Scenario: Dismiss button accessibility

- **WHEN** Alert.DismissButton is present
- **THEN** SHALL provide an accessible name via `aria-label`
- **AND** SHALL be keyboard accessible (Tab, Enter, Space)
- **AND** SHALL announce action and state to screen readers
- **AND** SHALL meet interactive element requirements

### Requirement: Recipe Variant Independence

The component SHALL support all valid combinations of `variant` and
`colorPalette`.

#### Scenario: Variant combinations

- **WHEN** a `variant` and a `colorPalette` are both set
- **THEN** SHALL apply both independently
- **AND** `flat`, `outlined` and `accent-start` SHALL produce distinct visual
  outputs
- **AND** every semantic palette SHALL work with every variant

#### Scenario: Default variant values

- **WHEN** no `variant` prop is provided
- **THEN** SHALL apply no default variant
