# Specification: ChatMessageList

## Overview

`ChatMessageList` presents a **scrollable sequence of chat messages** and owns
transcript-level scroll and announcement behavior. It is a Tier 3 compound:
`ChatMessageList.Root` (the scroll container, wrapping `ScrollArea`) and
`ChatMessageList.Item` (one list member). It leverages `ScrollArea` for the
viewport and provides the single persistent `aria-live` region that
`ChatMessage`'s streaming busy flag depends on.

The list is scoped to the transcript: it does not own the message array, data
fetching, or AI-runtime orchestration. Its items hold `ChatMessage` (or any
other content) and it does not inspect them.

**Component:** `ChatMessageList` **Package:** `@commercetools/nimbus`
**Category:** Chat

## ADDED Requirements

### Requirement: Compound list layout with items

The component SHALL expose a compound API — `ChatMessageList.Root` and
`ChatMessageList.Item`. `Root` SHALL establish the scroll container and styling
context; `Item` SHALL represent one member of the list. `Item` SHALL be
content-agnostic, holding a `ChatMessage` or any other content, and SHALL NOT
reach into the member's internals.

#### Scenario: Render a mixed transcript

- **WHEN** a `ChatMessageList.Root` contains `Item`s holding user and agent
  `ChatMessage`s and a consumer-rendered notice
- **THEN** SHALL render them as a vertical, scrollable sequence with consistent
  inter-item spacing
- **AND** SHALL not require the members to know they are inside a list

#### Scenario: Item owns list-membership concerns

- **WHEN** a new `Item` is appended
- **THEN** the `Item` SHALL own its spacing, keying, and entry presentation
  (not the member it contains)

### Requirement: Autoscroll and stick-to-bottom

`ChatMessageList.Root` SHALL keep the viewport pinned to the newest item while
the user is at (or within a small threshold of) the bottom, including while an
agent reply streams and grows, and SHALL release the pin when the user scrolls
up beyond the threshold.

#### Scenario: Pin to newest on append

- **WHEN** the user is at the bottom and a new item is appended (or the last
  item grows during streaming)
- **THEN** SHALL keep the newest content in view
- **AND** SHALL respect `prefers-reduced-motion` when scrolling

#### Scenario: Release on scroll-up

- **WHEN** the user scrolls up beyond the threshold to read history
- **THEN** SHALL stop pinning so incoming content does not interrupt reading

#### Scenario: Autoscroll can be disabled and driven imperatively

- **WHEN** `autoScroll` is set to `false`
- **THEN** SHALL not pin to the bottom automatically
- **AND** SHALL expose an imperative `scrollToBottom()` via `ref`

### Requirement: Scroll-to-bottom affordance

`ChatMessageList.Root` SHALL surface a control to return to the newest item when
the stick-to-bottom pin is released.

#### Scenario: Jump to latest

- **WHEN** the pin is released (the user has scrolled up)
- **THEN** SHALL show a "jump to latest" control with a localized accessible
  label
- **AND WHEN** the control is activated
- **THEN** SHALL scroll to the newest item and re-engage stick-to-bottom

### Requirement: Live region for streamed announcements (WCAG 2.1 AA)

`ChatMessageList.Root` SHALL provide the transcript's single, persistent live
region so appended and streamed messages are announced without per-token spam.

#### Scenario: Log live region by default

- **WHEN** a `ChatMessageList.Root` is rendered without an explicit role
- **THEN** SHALL expose `role="log"` with `aria-live="polite"` on the scroll
  region, with a consumer-overridable `aria-label`
- **AND** the region SHALL be always-mounted so it announces content appended
  after initial render

#### Scenario: Mixed children are valid

- **WHEN** the transcript contains message `article`s alongside notices or
  dividers
- **THEN** the container role SHALL NOT impose an `aria-required-children`
  constraint (i.e. SHALL NOT default to `role="feed"`), so a mixed transcript is
  valid

#### Scenario: Single announcer during streaming

- **WHEN** an agent message streams inside the list (its content rendered by
  `Markdown isStreaming`, its `ChatMessage.Root` marked `aria-busy`)
- **THEN** the list's `log` region SHALL own message-level announcement
- **AND** the message SHALL NOT create its own live region (no double
  announcement)

### Requirement: Empty state

`ChatMessageList.Root` SHALL render consumer-supplied empty content when there
are no items.

#### Scenario: No items

- **WHEN** the list has no `Item` children
- **THEN** SHALL render the empty-state content if provided

### Requirement: Component registration and theming

The component SHALL follow Nimbus structure, styling, and export conventions.

#### Scenario: Slot recipe registration

- **WHEN** the theme is assembled
- **THEN** SHALL register the slot recipe as `nimbusChatMessageList` with slots
  including `root`, `viewport`, `item`, `scrollToBottom`, and `empty`

#### Scenario: Barrel export

- **WHEN** consumers import from `@commercetools/nimbus`
- **THEN** SHALL export `ChatMessageList` and its public types from the package
  barrel
