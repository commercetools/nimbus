# Design: ChatMessageList

## Context

`ChatMessageList` is the second primitive in the `Chat*` family (see
`add-chat-message` for the family's two-tier model and relationship-kind →
syntax rationale). It is a Layer 1–2 primitive: it owns presentation and
self-contained UI behavior (scroll, autoscroll, live region) and stops at the
line — it does not own the message array, data fetching, or AI-runtime
orchestration.

## Why the list is a compound (Root + Item)

A list's defining relationship is **list ↔ item**. Modeling the transcript as "a
scroll container that takes arbitrary children" would hide that relationship and
leave list-membership concerns homeless. So `ChatMessageList` is a compound:

- **`ChatMessageList.Root`** publishes list context and owns the container-level
  behavior.
- **`ChatMessageList.Item`** is the member — the socket that owns
  list-membership concerns.

`Item` and `ChatMessage.Root` are **two responsibilities meeting at a seam**, not
redundant wrappers:

- `Item` is the **socket**: "you are the Nth member of this list — here are your
  list semantics, spacing, and entry presentation." A *list* concern.
- `ChatMessage.Root` is the **plug**: "I am an assistant turn with an avatar and
  a body." A *message* concern.

Because the socket does not care what plugs into it, the same `Item` holds a
`ChatMessage` or a `ChatNotice`. That child-agnosticism is exactly what makes
system-notice-as-peer honest (rather than a message variant).

## Responsibilities & seams

### `ChatMessageList.Root`

- **Owns:** the scroll viewport (wraps `ScrollArea`); autoscroll /
  stick-to-bottom; the scroll-to-bottom affordance; the single persistent
  `aria-live` region; inter-item layout container; the empty state.
- **Refuses to own:** what an item contains; message data; scrolling *policy*
  beyond stick-to-bottom (no data-driven scroll).
- **Seam upward (app):** takes `children` (the items). Optionally an
  `autoScroll` toggle and an imperative handle/`ref` for programmatic
  scroll-to-bottom.
- **Seam downward (items):** containment + observing the last item for
  autoscroll; it never reaches into an item's internals.

### `ChatMessageList.Item`

- **Owns:** list-membership semantics, inter-item spacing, keying, and the entry
  presentation of a newly appended item.
- **Seam:** holds exactly one member (`ChatMessage` / `ChatNotice`); it is
  content-agnostic.

## Scroll behavior

- **Stick-to-bottom:** when the viewport is at (or within a small threshold of)
  the bottom, new content keeps the view pinned to the newest item — including
  while an assistant reply streams and grows. Implemented against `ScrollArea`'s
  viewport node (its `viewportRef`), observing size/scroll changes.
- **Release on scroll-up:** once the user scrolls up beyond the threshold,
  pinning stops so reading history is not interrupted by incoming content.
- **Scroll-to-bottom control:** appears while released; returning to the bottom
  re-engages stick-to-bottom.
- **Reduced motion:** smooth-scroll respects `prefers-reduced-motion`.

## Accessibility: `log` over `feed`

The transcript's primary a11y job is **announcing new and streamed content**, so
`ChatMessageList.Root` is a `role="log"` `aria-live="polite"` region on the
scroll viewport:

- `log` has **no `aria-required-children` constraint**, so a mixed transcript of
  message `article`s, notices, and dividers is valid — unlike `role="feed"`,
  which requires every child to be an `article` and would forbid `ChatNotice`.
- The region is **always mounted** and persists across messages, so appended and
  streamed content is announced reliably (a live region created at the same time
  as its content is not). This is the counterpart to `ChatMessage`'s
  `isStreaming` → `aria-busy`: the message flags busy; the list announces.
- `Item` provides DOM order and structural hooks but does not assert
  `role="listitem"` (which would conflict with the `log` container). If a
  consumer needs article-to-article keyboard navigation, they may compose a
  `role="feed"` themselves using message `article`s only.

## No double announcement

Streaming has one announcer. `Markdown` (as body content) coalesces its *own*
completion announcement for the streamed block; the list's `log` region
announces message-level appends. The message never creates a live region. The
design keeps these from double-announcing by scoping `Markdown`'s announcement
to completion only and relying on the `log` region for append-level updates —
verified in stories.

## Testing

Storybook stories with play functions: renders a mixed transcript
(messages + notice); autoscroll pins to newest on append; scrolling up releases
the pin and reveals the scroll-to-bottom control; the control re-engages
stick-to-bottom; the container exposes `role="log"` `aria-live="polite"`; empty
state renders.
