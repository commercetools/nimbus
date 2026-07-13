# Specification: ChatMessage

## Overview

`ChatMessage` renders a **single participant's turn** in a chat conversation. It
is a Tier 3 compound: `ChatMessage.Root` (establishes the styling context and
grid layout) plus `.Avatar`, `.Body`, `.Actions`, and `.Meta`, with an
optional `.Typing` affordance. The `sender` variant (`user | agent`) drives
layout direction and per-sender surface styling; `tone` (`neutral | error`) is
an orthogonal status overlay.

`ChatMessage` renders one message and nothing more: the surrounding transcript
(scroll, list semantics, live region) is `ChatMessageList`'s job, and message
content — including streamed text (via `Markdown`) and tool output — is provided
by the consumer as `children`.

**Component:** `ChatMessage` **Package:** `@commercetools/nimbus`
**Category:** Chat

## ADDED Requirements

### Requirement: Compound message layout

The component SHALL expose a compound API — `ChatMessage.Root`,
`ChatMessage.Avatar`, `ChatMessage.Body`, `ChatMessage.Actions`, and
`ChatMessage.Meta`, plus an optional `ChatMessage.Typing` — that lays out a
single chat message. `ChatMessage.Root` SHALL establish the styling context
(publishing the `sender` value to its parts) and place the avatar beside the
body with the meta row aligned under the body column.

#### Scenario: Render a message with all parts

- **WHEN** a `ChatMessage.Root` contains an `Avatar`, a `Body` (with an
  `Actions` row), and a `Meta` row
- **THEN** SHALL render the avatar beside the body, the actions row inside the
  body, and the meta row below the body aligned to the body column
- **AND** SHALL lay the parts out with CSS Grid (not a single flex row)

#### Scenario: Parts read sender from Root context

- **WHEN** parts are rendered inside a `ChatMessage.Root` of a given `sender`
- **THEN** each part SHALL derive its placement and styling from the `sender`
  published by `Root`, without the consumer prop-drilling `sender` into each
  part

#### Scenario: Body is a content-blind surface

- **WHEN** a consumer places content in `Body`, `Actions`, or `Meta` (text, a
  `Markdown` block, buttons, links, icon buttons, a composed tool-output card)
- **THEN** SHALL render that content without imposing behavior or inspecting its
  type — the slots are presentational containers only

#### Scenario: Long unbreakable content wraps

- **WHEN** the body payload contains a long unbreakable token (a bare URL, a
  hash, a long identifier)
- **THEN** SHALL wrap the content inside the body so it does not overflow the
  card or introduce horizontal scrolling

### Requirement: Sender variants (user and agent)

`ChatMessage.Root` SHALL accept a `sender` variant of `"user"` or `"agent"`
(default `"agent"`) that controls layout direction and per-sender surface
styling. `sender` SHALL denote only which participant sent the message; it SHALL
NOT encode content type (e.g. tool output) or non-message interjections (e.g.
system notices).

#### Scenario: User vs agent direction

- **WHEN** `sender="user"`
- **THEN** SHALL place the body leading and the avatar trailing on the user
  surface token with a bounded max-width
- **AND WHEN** `sender="agent"`
- **THEN** SHALL place the avatar leading and the body trailing on the neutral
  surface token with a bounded max-width

#### Scenario: Tool output is agent content, not a sender

- **WHEN** a turn contains tool/function output
- **THEN** it SHALL be rendered as content inside an `agent` message's `Body`
  (a code block, a `Markdown` custom-component tag, or a composed brick)
- **AND** there SHALL be no `sender="tool"` value

### Requirement: Status tone

`ChatMessage.Root` SHALL accept a `tone` variant of `"neutral"` (default) or
`"error"` that is orthogonal to `sender`.

#### Scenario: Error tone over any sender

- **WHEN** `tone="error"` is set alongside any `sender`
- **THEN** SHALL tint the body with the critical palette (surface and border)
  to flag a failed generation, without changing the sender's layout direction
- **AND** SHALL be paired with visible text describing the failure (tone is a
  visual cue only, per WCAG 1.4.1)

### Requirement: Avatar

`ChatMessage.Avatar` SHALL wrap the Nimbus `Avatar` (default `size="xs"`,
`variant="solid"`), colored automatically per `sender`, with content provided
via `firstName`/`lastName`, `src`, or a custom icon as `children`.

#### Scenario: Per-sender avatar color

- **WHEN** an avatar is rendered for a given `sender`
- **THEN** SHALL apply the sender's avatar palette from the recipe (consumers
  supply only the content)

#### Scenario: Custom icon content

- **WHEN** an icon is passed as `children`
- **THEN** SHALL render the icon in place of initials / image / the Person
  fallback

### Requirement: Streaming affordance delegates rendering to Markdown

`ChatMessage` SHALL support indicating that a reply is still being generated
without owning the incremental rendering of streamed text. Safe incremental
rendering SHALL be performed by the `Markdown` component (`isStreaming`) placed
as body content.

#### Scenario: Busy state

- **WHEN** `isStreaming` is set on `ChatMessage.Root`
- **THEN** SHALL set `aria-busy="true"` on the root so assistive tech knows the
  content is in flux
- **AND** SHALL NOT create its own live region (announcement is owned by the
  transcript container)

#### Scenario: Typing indicator

- **WHEN** `ChatMessage.Typing` is rendered as the body payload (e.g.
  pre-first-token)
- **THEN** SHALL show the animated `ActivityIndicator` dots, plus any visible
  label passed as `children`

#### Scenario: Streamed text rendering

- **WHEN** an agent reply streams token-by-token
- **THEN** the recommended pattern SHALL be to render the text with `<Markdown
  isStreaming>` as body content, so unterminated markdown is completed safely
  and only the final block re-parses per token
- **AND** `ChatMessage` SHALL NOT re-implement streamed-markdown rendering

### Requirement: Accessibility (WCAG 2.1 AA) with consumer-composed feed

The component SHALL be accessible by default while leaving container semantics to
the transcript. The sender SHALL be conveyable to assistive technology by more
than color and position.

#### Scenario: Root is a semantic article by default

- **WHEN** a `ChatMessage.Root` is rendered without an explicit element/role
- **THEN** SHALL render a semantic `<article>` so a message is a discrete node in
  the accessibility tree
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

### Requirement: Component registration and theming

The component SHALL follow Nimbus structure, styling, and export conventions.

#### Scenario: Slot recipe registration

- **WHEN** the theme is assembled
- **THEN** SHALL register the slot recipe as `nimbusChatMessage` with slots
  `root`, `avatar`, `body`, `actions`, `meta`, `typing` and variants `sender`
  (`user`/`agent`) and `tone` (`neutral`/`error`)

#### Scenario: Barrel export

- **WHEN** consumers import from `@commercetools/nimbus`
- **THEN** SHALL export `ChatMessage` and its public types from the package
  barrel

#### Scenario: Figma Code Connect

- **WHEN** the component is mapped in Figma
- **THEN** SHALL provide a Code Connect mapping that maps the Figma `Sender`
  property (`User`/`Agent`, whose `Agent` value maps to `sender="agent"`)
  onto the `sender` variant and forwards children into `ChatMessage.Body`
