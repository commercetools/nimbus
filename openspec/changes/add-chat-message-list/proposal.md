# Change: Add ChatMessageList

## Why

A single message is not a conversation. Every mature chat component pairs the
single-message primitive with a **list container** that owns the transcript's
behavior — scroll, autoscroll / stick-to-bottom, the live region that announces
new and streamed replies, and list membership (Ant Design X `Bubble.List`, MUI X
`ChatMessageList`, assistant-ui `Thread`). Nimbus currently ships only the
message and punts the entire transcript to consumers with a documentation note
("wrap it in `role=log`"), which means every consumer re-implements autoscroll
and the live region — differently, and often wrongly (a live region mounted with
its content is not reliably announced).

`ChatMessageList` fills that gap with one focused job: **present a scrollable
sequence of messages and own transcript-level scroll + announcement behavior**,
leveraging the existing `ScrollArea` for the viewport and providing the single
persistent `aria-live` region that `ChatMessage`'s `isStreaming` busy flag
depends on.

Crucially, **a list is defined by its items**: `ChatMessageList` is a compound of
a `Root` and its `Item`s, not a box that happens to contain children. The `Item`
is the list-membership socket; a `ChatMessage` (or any other content) is what plugs
into it.

## What Changes

**Component:** `ChatMessageList` (Tier 3 compound). **Package:**
`@commercetools/nimbus`. **Category:** Feedback / Chat.

```tsx
<ChatMessageList.Root aria-label="Conversation with the assistant">
  <ChatMessageList.Item>
    <ChatMessage.Root sender="user">…</ChatMessage.Root>
  </ChatMessageList.Item>

  <ChatMessageList.Item>
    <ChatMessage.Root sender="assistant">
      <ChatMessage.Body><Markdown isStreaming>{reply}</Markdown></ChatMessage.Body>
    </ChatMessage.Root>
  </ChatMessageList.Item>

  <ChatMessageList.Item>
    <Box mx="auto" textAlign="center" color="neutral.11" textStyle="sm">
      Conversation history was cleared.
    </Box>
  </ChatMessageList.Item>
</ChatMessageList.Root>
```

### 1. `ChatMessageList.Root` — the scrollable transcript

- Wraps the existing `ScrollArea` for the viewport.
- **Autoscroll / stick-to-bottom:** keeps the view pinned to the newest message
  while the user is at the bottom (including during streaming), and *stops*
  pinning once the user scrolls up to read history.
- **Scroll-to-bottom affordance:** shows a "jump to latest" control when the
  user has scrolled away from the bottom.
- **Live region:** is the single, persistent `role="log"` `aria-live="polite"`
  region for the transcript, so appended and streamed messages are announced
  without per-token spam. This is the region `ChatMessage`'s `aria-busy` /
  streaming model relies on.
- **Empty state:** renders consumer-supplied empty content when there are no
  items.

### 2. `ChatMessageList.Item` — one list member

- The list-membership socket: owns inter-item spacing, keying, and the entry
  presentation of a newly appended item.
- **Child-agnostic:** holds a `ChatMessage` (or any other content) — the list
  arranges blocks in a scroll flow and does not reach into them. This is what
  lets system notices be peers of messages rather than a message variant.

## Out of scope

- **`ChatComposer`** and the **`Chat` pattern component** — separate future
  proposals.
- **Virtualization (windowing) of very long transcripts** — deferred to a
  fast-follow. The `Root`/`Item` model is designed not to preclude it, but v1
  renders items directly (documented, with the limit called out — no silent
  cap).
- **Same-author consecutive-message grouping** (e.g. collapsing repeated
  avatars) — deferred; `Item` is where it would live.
- **Date dividers as a dedicated component** — v1 has consumers render their own
  divider content inside an `Item` (the `Item` is content-agnostic); a dedicated
  divider is a future addition if needed.

## Dependencies

- **Depends on `add-chat-message`** — `ChatMessageList.Item` composes
  `ChatMessage`, and the list's live region is the counterpart to
  `ChatMessage`'s streaming busy flag. This change SHOULD land after (or with)
  `add-chat-message`.

## Rejected alternatives

- **List takes arbitrary children (no `Item`)** — rejected: "a list without
  items is not a list." Without a first-class `Item`, list-membership concerns
  (spacing, keying, entry animation, future grouping/virtualization) have no
  home and get scattered onto the messages or the consumer.
- **`role="feed"` for the container** — rejected as the default: `feed` requires
  every child to be an `article`, which forbids notices/dividers and a mixed
  transcript. `role="log"` `aria-live="polite"` has no child-role constraint and
  is the correct live-region model for announcing streamed replies. (A consumer
  building article-to-article keyboard navigation may still opt into `feed`.)

## Impact

- **New capability** `nimbus-chat-message-list`.
- **New component** `packages/nimbus/src/components/chat-message-list/`
  (compound: `Root` + `Item`), leveraging `ScrollArea` internally.
- **Recipe** registered as `nimbusChatMessageList` in theme config.
- **Barrel export** of `ChatMessageList` and its public types.
- No tokens-package changes.
