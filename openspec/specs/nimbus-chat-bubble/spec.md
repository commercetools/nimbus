# nimbus-chat-bubble Specification

## Purpose
TBD - created by archiving change add-chat-bubble. Update Purpose after archive.
## Requirements
### Requirement: Compound message layout

The component SHALL expose a compound API — `ChatBubble.Root`,
`ChatBubble.Avatar`, `ChatBubble.Bubble`, `ChatBubble.Actions`,
`ChatBubble.Footer`, and `ChatBubble.Typing` — that lays out a single chat
message. `Root` SHALL establish the styling context and place the avatar beside
the bubble with the footer aligned under the bubble column.

#### Scenario: Render a message with all parts

- **WHEN** a `ChatBubble.Root` contains an `Avatar`, a `Bubble` (with an
  `Actions` row), and a `Footer`
- **THEN** SHALL render the avatar beside the bubble, the actions row inside the
  bubble, and the footer row below the bubble aligned to the bubble column
- **AND** SHALL lay the parts out with CSS Grid (not a single flex row)

#### Scenario: Layout-only slots take arbitrary content

- **WHEN** a consumer places content in `Bubble`, `Actions`, or `Footer` (text,
  a `Markdown` block, buttons, links, icon buttons)
- **THEN** SHALL render that content without imposing behavior — the slots are
  presentational containers only

#### Scenario: Long unbreakable content wraps

- **WHEN** the bubble payload contains a long unbreakable token (a bare URL, a
  hash, a long identifier)
- **THEN** SHALL wrap the content inside the bubble so it does not overflow the
  card or introduce horizontal scrolling

### Requirement: Sender variants

`ChatBubble.Root` SHALL accept a `sender` variant of `"user"`, `"agent"`,
`"system"`, or `"tool"` (default `"agent"`) that controls layout direction and
the per-sender surface styling.

#### Scenario: User vs agent direction

- **WHEN** `sender="user"`
- **THEN** SHALL place the bubble leading and the avatar trailing on an `iris.3`
  surface with a 480px max-width
- **AND WHEN** `sender="agent"`
- **THEN** SHALL place the avatar leading and the bubble trailing on the neutral
  surface token with a 632px max-width

#### Scenario: System notice

- **WHEN** `sender="system"`
- **THEN** SHALL render a centered, subdued, avatar-optional notice that reads
  correctly whether or not an avatar is supplied

#### Scenario: Tool output

- **WHEN** `sender="tool"`
- **THEN** SHALL use the agent-side layout on a subdued neutral surface to
  distinguish machine/function output from the assistant's voice

### Requirement: Status tone

`ChatBubble.Root` SHALL accept a `tone` variant of `"neutral"` (default) or
`"error"` that is orthogonal to `sender`.

#### Scenario: Error tone over any sender

- **WHEN** `tone="error"` is set alongside any `sender`
- **THEN** SHALL tint the bubble with the critical palette (surface and border)
  to flag a failed generation, without changing the sender's layout direction

### Requirement: Avatar

`ChatBubble.Avatar` SHALL wrap the Nimbus `Avatar` at `size="xs"`, colored
automatically per `sender`, with content provided via `firstName`/`lastName`,
`src`, or a custom icon as `children`.

#### Scenario: Per-sender avatar color

- **WHEN** an avatar is rendered for a given `sender`
- **THEN** SHALL apply the sender's avatar background and content color from the
  recipe (consumers supply only the content)

#### Scenario: Custom icon content

- **WHEN** an icon is passed as `children`
- **THEN** SHALL render the icon in place of initials / image / the Person
  fallback

### Requirement: Streaming affordance

The component SHALL support indicating that a reply is still being generated.

#### Scenario: Typing indicator

- **WHEN** `ChatBubble.Typing` is rendered as the bubble payload
- **THEN** SHALL show the animated `ActivityIndicator` dots, plus any visible
  label passed as `children`

#### Scenario: Busy state

- **WHEN** `isStreaming` is set on `ChatBubble.Root`
- **THEN** SHALL set `aria-busy="true"` on the root so assistive tech knows the
  content is in flux
- **AND** SHALL leave the live-region announcement to the consumer's container

### Requirement: Accessibility (WCAG 2.1 AA) with consumer-composed feed

The component SHALL be accessible by default while leaving container semantics
to the consumer. The sender SHALL be conveyable to assistive technology by more
than color and position.

#### Scenario: Root is a semantic article by default

- **WHEN** a `ChatBubble.Root` is rendered without an explicit element/role
- **THEN** SHALL render a semantic `<article>` so a message is a discrete node
  in the accessibility tree
- **AND** SHALL let the consumer override the element via `as` and the role/name
  via `role` / `aria-label` / `aria-labelledby` (the consumer-supplied value
  SHALL win)

#### Scenario: Sender named for assistive tech

- **WHEN** a consumer names a message with `aria-label`/`aria-labelledby`
- **THEN** SHALL expose that accessible name on the message article, so the
  sender is identifiable independent of color and column position

#### Scenario: Decorative avatar is not mislabelled

- **WHEN** an avatar is a sender glyph with no `firstName`/`lastName` and no
  explicit `aria-label`
- **THEN** SHALL treat the avatar as decorative (`aria-hidden`) so it does not
  inject a misleading generic "avatar" label into the accessibility tree
- **AND WHEN** the consumer provides `firstName`/`lastName` or an explicit
  `aria-label`
- **THEN** SHALL expose the avatar with that meaningful name

#### Scenario: Documented accessible transcript composition

- **WHEN** a consumer composes multiple messages into a transcript
- **THEN** the documentation SHALL recommend a `role="log"` `aria-live="polite"`
  container of named message `article`s (or a `role="feed"` whose children are
  only `article`s), so streamed replies are announced without per-token spam

### Requirement: Component registration and theming

The component SHALL follow Nimbus structure, styling, and export conventions.

#### Scenario: Slot recipe registration

- **WHEN** the theme is assembled
- **THEN** SHALL register the slot recipe as `nimbusChatBubble` with slots
  `root`, `avatar`, `bubble`, `actions`, `footer`, `typing` and variants
  `sender` and `tone`

#### Scenario: Barrel export

- **WHEN** consumers import from `@commercetools/nimbus`
- **THEN** SHALL export `ChatBubble` and its public types from the package
  barrel

#### Scenario: Figma Code Connect

- **WHEN** the component is mapped in Figma
- **THEN** SHALL provide a Code Connect mapping for the bubble container that
  maps the Figma `Sender` property onto the `sender` variant

