---
"@commercetools/nimbus": minor
---

`ChatMessage`: new compound component for a single message in an AI chat
conversation. Pairs a sender avatar with a message body and layout-only slots
you fill with your own content.

- `sender` (`"user" | "assistant"`, default `"assistant"`) sets the layout
  direction and per-sender body/avatar styling — avatar leading for `assistant`,
  trailing for `user`.
- `tone` (`"neutral" | "error"`, default `"neutral"`) tints the body to flag a
  failed generation, independent of the sender.
- `isStreaming` marks a message as still generating (sets `aria-busy`); render
  `ChatMessage.Typing` for the animated "generating…" indicator while it
  streams.
- `ChatMessage.Avatar` wraps the Nimbus `Avatar` (`size="xs"`), colored per
  sender; provide content via `firstName`/`lastName`, `src`, or an icon as
  `children`. It is decorative by default; name it to add it to the
  accessibility tree.
- `ChatMessage.Body` holds the payload (text, a `Markdown` block, or any
  content); nest `ChatMessage.Actions` as its last child, and add
  `ChatMessage.Meta` after the body for a timestamp or status row.
- `ChatMessage.Root` renders a semantic `<article>` by default (override with
  `as`); name each message with `aria-label`/`aria-labelledby`.

`ChatMessageList`: new compound component that arranges chat messages into a
scrollable transcript.

- `ChatMessageList.Root` is the scroll container and the transcript's
  `role="log" aria-live="polite"` region, so appended and streamed replies are
  announced. It owns autoscroll / stick-to-bottom and a "jump to latest"
  control.
- `autoScroll` (default `true`) keeps the newest message in view while you are
  at the bottom, `emptyState` renders when there are no items, and the `ref`
  exposes `scrollToBottom()` for imperative control.
- `ChatMessageList.Item` is content-agnostic — it holds a `ChatMessage` or any
  other content, so you can render your own centered system notices or dividers
  as list members.
