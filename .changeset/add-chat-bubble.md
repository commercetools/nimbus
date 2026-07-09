---
"@commercetools/nimbus": minor
---

`ChatBubble`: new compound component for a single message in an AI chat feed.
Composes an avatar, a bubble container, and layout-only slots you fill with your
own content: `ChatBubble.Actions` (inside the bubble), `ChatBubble.Footer`
(below it), and `ChatBubble.Typing` (a streaming indicator).

- `sender` (`"user" | "agent" | "system" | "tool"`, default `"agent"`) sets the
  layout direction and the sender-specific bubble and avatar styling — avatar
  leading for `agent`/`tool`, trailing for `user`, and a centered, subdued,
  avatar-less line for `system`.
- `tone` (`"neutral" | "error"`, default `"neutral"`) tints the bubble to flag a
  failed generation, independent of the sender.
- `isStreaming` marks a message as still generating (sets `aria-busy`); render
  `ChatBubble.Typing` as the bubble payload for the animated "typing…" dots
  (with an optional visible label) while it streams.
- `ChatBubble.Avatar` wraps the Nimbus `Avatar` at `size="2xs"` and is colored
  automatically per sender; provide the content via `firstName`/`lastName`,
  `src`, or a custom icon as `children`. It is decorative by default and opts
  into the accessibility tree with a real name when you pass `firstName`/
  `lastName` or an `aria-label`.
- `ChatBubble.Bubble` is the rounded card that holds the payload — plain text, a
  `Markdown` block, or any generated content (long, unbreakable content wraps
  inside it). Place `ChatBubble.Actions` as its last child to pin action buttons
  to the bottom.
- `ChatBubble.Footer` renders a `space-between` row beneath the bubble for a
  timestamp, reaction icons, links, or trust affordances.
- Accessibility: `ChatBubble.Root` renders a semantic `<article>` by default
  (override with `as`); name each message with `aria-label`/`aria-labelledby`
  and compose the transcript yourself — a `role="log" aria-live="polite"`
  container is recommended so streamed replies are announced. See the
  component's accessibility documentation.
