---
"@commercetools/nimbus": minor
---

`ChatMessage`: new compound component for a single turn in an AI chat — compose
`ChatMessage.Root` with `.Avatar`, `.Body`, `.Actions`, and `.Meta`.

- `sender` (`"user" | "agent"`, default `"agent"`) sets the layout direction and
  per-sender styling; `tone="error"` tints the body to flag a failed reply.
- `isStreaming` marks a message as still generating; render `ChatMessage.Typing`
  for the animated "generating…" indicator.
- Renders a semantic `<article>` you name with `aria-label`; the body accepts
  any content, including a `Markdown` block for streamed output.

`ChatMessageList`: new compound component that arranges messages into a
scrollable, accessible transcript — compose `ChatMessageList.Root` with `.Item`.

- A `role="log" aria-live="polite"` region, so appended and streamed replies are
  announced to assistive tech.
- `autoScroll` (default `true`) keeps the newest message in view, `emptyState`
  renders when there are no items, and the `ref` exposes `scrollToBottom()`.
- `ChatMessageList.Item` holds a `ChatMessage` or any other content, so you can
  render your own system notices or dividers.
