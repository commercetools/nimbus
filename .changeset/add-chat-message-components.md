---
"@commercetools/nimbus": minor
---

`ChatMessage`: new compound component for a single chat turn —
`ChatMessage.Root` with `.Avatar`, `.Body`, `.Actions`, `.Meta`, and `.Typing`.

- `sender` (`"user" | "agent"`) sets layout and styling; `tone="error"` flags a
  failed reply; `isStreaming` marks a turn as still generating.
- Renders a semantic `<article>` and accepts any body content, including a
  `Markdown` block for streamed output.

`ChatMessageList`: new compound component that arranges messages into a
scrollable, accessible transcript — `ChatMessageList.Root` with `.Item`.

- A `role="log"` live region that auto-scrolls to new and streamed replies, with
  a "jump to latest" control and an `emptyState`.
- `Item` holds a `ChatMessage` or any other content, e.g. your own notices.
